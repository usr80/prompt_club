/* =========================================================
   PROMPT ATLAS · 可编辑应用
   数据层：浏览器 localStorage，可导入/导出 JSON
   ========================================================= */
(function () {
  'use strict';

  /* ---------------- 常量 ---------------- */
  const CATS = [
    { key: 'character', name: '角色', en: 'Character', abbr: 'CH', color: '#c2542a' },
    { key: 'scene',     name: '场景', en: 'Scene',     abbr: 'SC', color: '#2f6b4f' },
    { key: 'prop',      name: '道具', en: 'Prop',      abbr: 'PR', color: '#8a6a2f' },
    { key: 'video',     name: '视频', en: 'Video',     abbr: 'VD', color: '#2b4f8a' },
    { key: 'style',     name: '风格', en: 'Style',     abbr: 'ST', color: '#7a4a7f' },
    { key: 'camera',    name: '镜头', en: 'Camera',    abbr: 'CM', color: '#3a6b6b' },
    { key: 'vfx',       name: '特效', en: 'VFX',       abbr: 'VFX', color: '#a8622e' },
    { key: 'negative',  name: '负面', en: 'Negative',  abbr: 'NG', color: '#5f5f5a' }
  ];
  const catMap = Object.fromEntries(CATS.map(c => [c.key, c]));
  const PREF_ORDER = ['编灵', '三分钟，三年', '通用'];
  const STORE_KEY = 'atlas.store.v2';
  const FAV_KEY = 'atlas.fav.v2';
  const SHARE_KEY = 'atlas.share.v1';
  const $ = s => document.querySelector(s);

  /* ---------------- 存储 ---------------- */
  let storageOK = true;
  try {
    localStorage.setItem('__atlas_probe', '1');
    localStorage.removeItem('__atlas_probe');
  } catch (e) { storageOK = false; }

  function seedStore() {
    const seed = window.SEED || [];
    return {
      version: 2,
      items: JSON.parse(JSON.stringify(seed)),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  function loadStore() {
    if (!storageOK) return seedStore();
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && Array.isArray(s.items)) return s;
      }
    } catch (e) { /* 损坏则回退到种子 */ }
    const fresh = seedStore();
    try { localStorage.setItem(STORE_KEY, JSON.stringify(fresh)); } catch (e) {}
    return fresh;
  }

  let store = loadStore();
  let DATA = [];
  let byId = {};

  function reindex() {
    DATA = store.items;
    byId = Object.fromEntries(DATA.map(d => [d.id, d]));
  }

  function persist() {
    store.updatedAt = Date.now();
    if (!storageOK) return false;
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(store));
      renderStoreState();
      return true;
    } catch (e) {
      toast('保存失败：浏览器存储已满或被禁用');
      return false;
    }
  }

  /* =========================================================
     云服务 · 初始化 / 会话 / 同步
     ========================================================= */
  const CFG = window.CLOUD_CONFIG || null;
  const TABLE = (CFG && CFG.table) || 'prompt_items';
  const SHARE_TABLE = (CFG && CFG.shareTable) || 'shared_prompts';
  let cloud = null;
  let session = null;
  let cloudMode = false;        // 已登录，数据以云端为准
  let syncState = 'local';      // local | pulling | pushing | ok | error
  let syncMsg = '';
  let shareData = null;         // 共享只读页当前展示的条目

  /* 本条目 → 已发布的共享链接（本机缓存，云端为准） */
  let shareMap = {};
  try { shareMap = JSON.parse(localStorage.getItem(SHARE_KEY) || '{}') || {}; } catch (e) { shareMap = {}; }
  function saveShare() {
    try { localStorage.setItem(SHARE_KEY, JSON.stringify(shareMap)); } catch (e) {}
  }
  const isShared = id => !!(shareMap[id] && shareMap[id].shareId);

  /* 编辑必须登录；浏览、复制、收藏不需要 */
  function requireAuth(msg) {
    if (session) return true;
    toast(msg || '编辑需要登录（浏览和复制不需要）', { label: '去登录', fn: () => signIn() });
    return false;
  }

  function initCloud() {
    if (!CFG || !window.WorkBuddyCloud) return false;
    try {
      cloud = window.WorkBuddyCloud.createWorkBuddyCloud({
        endpoint: CFG.endpoint,
        oauthRelayBaseUrl: CFG.oauthRelayBaseUrl,
        publishableKey: CFG.publishableKey
      });
      return !!cloud;
    } catch (e) {
      cloud = null;
      return false;
    }
  }

  function uid() {
    const u = (session && session.user) || {};
    return u.id || u.email || u.name || 'local';
  }
  const seedFlag = () => 'atlas.cloud_seeded.' + uid();

  function describeErr(err) {
    if (!err) return '未知错误';
    const code = err.code ? err.code + ' ' : '';
    return code + (err.message || String(err));
  }

  function setSyncState(st, msg) {
    syncState = st;
    syncMsg = msg || '';
    renderAccount();
  }

  function renderAccount() {
    const box = $('#account'), txt = $('#accText'), btn = $('#accBtn'), hint = $('#syncHint');
    const chip = $('#accChip');
    if (!box) return;
    box.classList.remove('online', 'busy', 'error');

    let label = '未登录 · 只读浏览';
    let btnLabel = '登录后编辑';
    let btnCls = 'primary';
    let disabled = false;

    if (!CFG || !window.WorkBuddyCloud) {
      label = '云服务未就绪（SDK 未加载）';
      btnLabel = '不可用';
      disabled = true;
    } else if (syncState === 'pulling' || syncState === 'pushing') {
      box.classList.add('busy');
      label = syncState === 'pulling' ? '正在读取云端…' : '正在写入云端…';
      btnLabel = '请稍候';
      disabled = true;
    } else if (session) {
      const name = (session.user && (session.user.name || session.user.email)) || '已登录';
      if (syncState === 'error') {
        box.classList.add('error');
        label = name + ' · 同步失败';
        btnLabel = '重试同步';
        btnCls = '';
      } else {
        box.classList.add('online');
        label = name + ' · 云同步已开启';
        btnLabel = '退出登录';
        btnCls = 'ghost';
      }
    }

    txt.textContent = label;
    txt.title = syncMsg || label;
    btn.textContent = btnLabel;
    btn.className = 'acc-btn ' + btnCls;
    btn.disabled = disabled;
    btn.dataset.mode = session ? 'out' : 'in';

    if (hint) hint.textContent = session ? (syncState === 'error' ? '失败' : '已连接') : '未登录';

    /* 只读态：未登录时去掉编辑入口的「可写」暗示 */
    const ro = !session;
    document.body.classList.toggle('readonly', ro);
    const l1 = $('#newBtnLabel'), l2 = $('#newBtn2Label');
    if (l1) l1.textContent = ro ? '登录后新建' : '新建条目';
    if (l2) l2.textContent = ro ? '登录后新建' : '新建';
    const nb = $('#newBtn');
    if (nb) nb.title = ro ? '编辑需要登录' : '新建一条提示词';

    if (chip) {
      chip.classList.toggle('online', !!session);
      chip.classList.toggle('busy', syncState === 'pulling' || syncState === 'pushing');
      chip.innerHTML = '<i></i>' + (session ? esc((session.user && (session.user.name || session.user.email)) || '已登录') : '登录');
      chip.title = label;
    }
    const hintEl = $('#accHint');
    if (hintEl) hintEl.textContent = session ? '编辑权限已开启，数据存云端' : '编辑需登录；浏览、复制无需登录';
  }

  function itemToRow(it) {
    return {
      item_id: it.id,
      cat: it.cat,
      project: it.project || '通用',
      title: it.title || '',
      summary: it.summary || '',
      tags: it.tags || [],
      zh: it.zh || '',
      en: it.en || '',
      meta: it.meta || [],
      negative: it.negative || '',
      related: it.related || [],
      edited: !!it.edited,
      owner_name: (session && session.user && session.user.name) || null,
      updated_at: new Date().toISOString()
    };
  }

  function rowToItem(r) {
    return {
      id: r.item_id,
      cat: r.cat,
      project: r.project || '通用',
      title: r.title || '',
      summary: r.summary || '',
      tags: r.tags || [],
      zh: r.zh || '',
      en: r.en || '',
      meta: r.meta || [],
      negative: r.negative || '',
      related: r.related || [],
      edited: !!r.edited,
      createdAt: Date.parse(r.created_at) || Date.now(),
      updatedAt: Date.parse(r.updated_at) || Date.now()
    };
  }

  /* 拉取云端全量；云端为空时把本机内容一次性灌进去 */
  async function pullCloud(silent) {
    if (!cloud || !session) return false;
    setSyncState('pulling');
    try {
      const res = await cloud.database.from(TABLE).select('*').order('created_at', { ascending: true });
      if (res.error) throw res.error;
      const rows = res.data || [];

      if (!rows.length) {
        if (!localStorage.getItem(seedFlag()) && store.items.length) {
          const up = await bulkUpload(store.items);
          if (!up.ok) throw up.error;
          try { localStorage.setItem(seedFlag(), '1'); } catch (e) {}
          setSyncState('ok');
          refresh();
          if (!silent) toast('已把本机 ' + store.items.length + ' 条上传到云端');
          return true;
        }
        store.items = [];
      } else {
        // 首次登录且云端已有数据：避免直接覆盖本机未同步的改动
        if (!localStorage.getItem(seedFlag()) && store.items.length) {
          const go = confirm('云端已有 ' + rows.length + ' 条数据，本机有 ' + store.items.length + ' 条。\n\n登录后以云端为准，本机内容会被覆盖。是否继续？');
          if (!go) {
            cloudMode = false;
            setSyncState('local');
            return false;
          }
        }
        store.items = rows.map(rowToItem);
        try { localStorage.setItem(seedFlag(), '1'); } catch (e) {}
      }

      persist();
      refresh();
      setSyncState('ok');
      if (!silent) toast('已从云端同步 ' + store.items.length + ' 条');
      return true;
    } catch (err) {
      setSyncState('error', describeErr(err));
      if (!silent) toast('读取云端失败：' + describeErr(err));
      return false;
    }
  }

  /* 单条写入：prevId 有值 = 更新（含改号），无值 = 新增 */
  async function cloudPush(item, prevId) {
    if (!cloudMode || !cloud) return { ok: true, skipped: true };
    setSyncState('pushing');
    try {
      const row = itemToRow(item);

      if (prevId) {
        const upd = await cloud.database.from(TABLE).update(row).eq('item_id', prevId).select();
        if (upd.error) throw upd.error;
        // 行不存在（例如本机新建但没同步成功）→ 补插入
        if (!Array.isArray(upd.data) || upd.data.length === 0) {
          const ins = await cloud.database.from(TABLE).insert(row).select();
          if (ins.error) throw ins.error;
        }
      } else {
        const ins = await cloud.database.from(TABLE).insert(row).select();
        if (ins.error) throw ins.error;
      }

      setSyncState('ok');
      return { ok: true };
    } catch (err) {
      setSyncState('error', describeErr(err));
      return { ok: false, error: describeErr(err) };
    }
  }

  async function cloudRemove(id) {
    if (!cloudMode || !cloud) return { ok: true, skipped: true };
    setSyncState('pushing');
    try {
      const res = await cloud.database.from(TABLE).delete().eq('item_id', id).select();
      if (res.error) throw res.error;
      setSyncState('ok');
      return { ok: true };
    } catch (err) {
      setSyncState('error', describeErr(err));
      return { ok: false, error: describeErr(err) };
    }
  }

  async function bulkUpload(items, chunk) {
    if (!cloud) return { ok: false, error: new Error('云服务未就绪') };
    const size = chunk || 80;
    for (let i = 0; i < items.length; i += size) {
      const slice = items.slice(i, i + size).map(itemToRow);
      const res = await cloud.database.from(TABLE).insert(slice);
      if (res.error) return { ok: false, error: res.error };
    }
    return { ok: true };
  }

  /* 清空当前账号在云端的全部条目（RLS 只会命中自己的行） */
  async function clearCloud() {
    if (!cloud) return { ok: false, error: new Error('云服务未就绪') };
    const res = await cloud.database.from(TABLE).delete().not('item_id', 'is', null).select();
    if (res.error) return { ok: false, error: res.error };
    return { ok: true };
  }

  /* 用本机当前数据整体覆盖云端 */
  async function pushAll() {
    if (!cloudMode || !cloud) return { ok: false, error: new Error('未登录') };
    setSyncState('pushing');
    try {
      const c = await clearCloud();
      if (!c.ok) throw c.error;
      const u = await bulkUpload(store.items);
      if (!u.ok) throw u.error;
      try { localStorage.setItem(seedFlag(), '1'); } catch (e) {}
      setSyncState('ok');
      return { ok: true };
    } catch (err) {
      setSyncState('error', describeErr(err));
      return { ok: false, error: describeErr(err) };
    }
  }

  /* 一轮写入 / 读取 / 删除，验证数据面真的通了 */
  async function cloudSelfCheck() {
    if (!cloud) { toast('云服务未就绪'); return; }
    if (!session) { toast('请先登录后再自检'); return; }
    const probeId = '__probe__';
    const row = {
      item_id: probeId, cat: 'negative', project: '自检', title: '云同步自检',
      summary: '临时探针，自检结束会删除', tags: ['probe'], zh: 'probe', en: 'probe',
      meta: [], negative: '', related: [], edited: false
    };
    try {
      await cloud.database.from(TABLE).delete().eq('item_id', probeId);
      const ins = await cloud.database.from(TABLE).insert(row).select();
      if (ins.error) throw ins.error;

      const sel = await cloud.database.from(TABLE).select('item_id, title').eq('item_id', probeId).maybeSingle();
      if (sel.error) throw sel.error;
      if (!sel.data) throw new Error('写入后读不回来');

      const del = await cloud.database.from(TABLE).delete().eq('item_id', probeId).select();
      if (del.error) throw del.error;
      if (!del.data || !del.data.length) throw new Error('删除未生效');

      toast('自检通过：写入 / 读取 / 删除均正常');
    } catch (err) {
      toast('自检失败：' + describeErr(err));
    }
  }

  async function signIn() {
    if (!cloud) { toast('云服务未就绪，无法登录'); return; }
    try {
      const back = new URL(location.href);
      back.pathname = '/';
      for (const k of ['code', 'state', 'provider']) back.searchParams.delete(k);
      const res = await cloud.auth.signInWithOAuth({ provider: 'workbuddy', redirectTo: back.toString() });
      if (res.error) { toast('登录失败：' + res.error.message); return; }
      location.assign(res.data.url);
    } catch (e) {
      toast('登录失败：' + (e && e.message ? e.message : e));
    }
  }

  async function signOut() {
    try { await cloud.auth.signOut(); } catch (e) {}
    session = null;
    cloudMode = false;
    setSyncState('local');
    toast('已退出登录，切回本地模式');
  }

  async function restoreAuth() {
    if (!cloud) return;
    const url = new URL(location.href);

    if (url.searchParams.has('code') || url.searchParams.has('error')) {
      const provider = url.searchParams.get('provider');
      if (provider === 'workbuddy' || provider === 'wechat') {
        const handler = provider === 'workbuddy'
          ? cloud.auth.handleWorkBuddyCallback
          : cloud.auth.handleWechatWebCallback;
        if (typeof handler === 'function') {
          try {
            const r = await handler.call(cloud.auth);
            if (r && r.error) {
              toast('登录失败：' + r.error.message);
            } else if (r && r.data) {
              for (const k of ['code', 'state', 'provider']) url.searchParams.delete(k);
              history.replaceState(null, '', url.pathname + (url.search || '') + url.hash);
            }
          } catch (e) {
            toast('登录失败：' + (e && e.message ? e.message : e));
          }
        }
      }
    }

    try {
      const s = await cloud.auth.getSession();
      if (s && s.data) {
        session = s.data;
        cloudMode = true;
      }
    } catch (e) {
      session = null;
    }
  }

  /* =========================================================
     共享 · 只读快照
     私有是默认；共享 = 把当前内容发布成一份只读快照
     ========================================================= */
  let shareTarget = null;

  function newShareId() {
    const A = 'abcdefghjkmnpqrstuvwxyz23456789';
    const buf = new Uint8Array(10);
    try { crypto.getRandomValues(buf); }
    catch (e) { for (let i = 0; i < buf.length; i++) buf[i] = Math.floor(Math.random() * 256); }
    return Array.from(buf, b => A[b % A.length]).join('');
  }

  /* 保留发布域名的 sharecode，只替换 s 参数 */
  function shareUrl(shareId) {
    const u = new URL(location.href);
    const keep = new URLSearchParams();
    u.searchParams.forEach((v, k) => {
      if (k.toLowerCase() === 'sharecode') keep.set(k, v);
    });
    keep.set('s', shareId);
    u.search = '?' + keep.toString();
    u.hash = '';
    return u.toString();
  }

  function sharePayload(d) {
    return {
      id: d.id, cat: d.cat, project: d.project || '通用', title: d.title || '',
      summary: d.summary || '', tags: d.tags || [], zh: d.zh || '', en: d.en || '',
      meta: d.meta || [], negative: d.negative || '', related: d.related || [],
      updatedAt: Date.now()
    };
  }

  async function publishShare(d) {
    if (!requireAuth('共享需要登录')) return null;
    if (!cloud) { toast('云服务未就绪，无法共享'); return null; }
    const meta = shareMap[d.id];
    const shareId = (meta && meta.shareId) || newShareId();
    const row = {
      share_id: shareId,
      source_id: d.id,
      owner_name: (session.user && (session.user.name || session.user.email)) || '未署名创作者',
      payload: sharePayload(d),
      updated_at: new Date().toISOString()
    };
    setSyncState('pushing');
    try {
      if (meta) {
        const up = await cloud.database.from(SHARE_TABLE).update(row).eq('share_id', shareId).select();
        if (up.error) throw up.error;
        if (!Array.isArray(up.data) || up.data.length === 0) {
          const ins = await cloud.database.from(SHARE_TABLE).insert(row).select();
          if (ins.error) throw ins.error;
        }
      } else {
        const ins = await cloud.database.from(SHARE_TABLE).insert(row).select();
        if (ins.error) throw ins.error;
      }
      shareMap[d.id] = { shareId, at: Date.now() };
      saveShare();
      setSyncState('ok');
      return shareId;
    } catch (err) {
      setSyncState('error', describeErr(err));
      toast('共享失败：' + describeErr(err));
      return null;
    }
  }

  async function revokeShare(d) {
    const meta = shareMap[d.id];
    if (!meta) return true;
    if (!cloud) { toast('云服务未就绪'); return false; }
    setSyncState('pushing');
    try {
      const r = await cloud.database.from(SHARE_TABLE).delete().eq('share_id', meta.shareId).select();
      if (r.error) throw r.error;
      delete shareMap[d.id];
      saveShare();
      setSyncState('ok');
      return true;
    } catch (err) {
      setSyncState('error', describeErr(err));
      toast('停止共享失败：' + describeErr(err));
      return false;
    }
  }

  function openShareSheet(id) {
    if (!requireAuth('共享需要登录')) return;
    if (!byId[id]) return;
    shareTarget = id;
    renderShareSheet();
    $('#sheetScrim').classList.add('on');
    $('#shareSheet').classList.add('on');
    $('#shareSheet').setAttribute('aria-hidden', 'false');
  }

  function closeShareSheet() {
    shareTarget = null;
    $('#sheetScrim').classList.remove('on');
    $('#shareSheet').classList.remove('on');
    $('#shareSheet').setAttribute('aria-hidden', 'true');
    $('#shareSheet').innerHTML = '';
  }

  function renderShareSheet() {
    const d = shareTarget ? byId[shareTarget] : null;
    if (!d) { closeShareSheet(); return; }
    const m = shareMap[d.id];
    const link = m ? shareUrl(m.shareId) : '';
    $('#shareSheet').innerHTML = `
      <div class="sh-top">
        <h3>共享「${esc(d.title || d.id)}」</h3>
        <button class="sh-close" data-share="close" aria-label="关闭">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
      <p class="sh-sub">${m ? '已生成只读链接。' : '生成一个只读链接。'}拿到链接的人可以<b>查看和复制</b>，但<b>不能修改</b>；分享的是发布时的快照，改完条目可点「更新链接内容」。</p>
      ${m ? `<span class="sh-label">只读链接</span>
        <div class="share-link">
          <input id="shareUrlInput" readonly value="${esc(link)}" spellcheck="false">
          <button class="btn primary" data-share="copy" style="flex:0 0 auto;height:36px;padding:0 14px;justify-content:center">复制</button>
        </div>` : ''}
      <div class="sheet-actions">
        ${m ? `<button class="btn" data-share="update">更新链接内容</button>
               <button class="btn danger" data-share="revoke">停止共享</button>`
            : `<button class="btn primary" data-share="create" style="flex:0 0 auto;justify-content:center">生成只读链接</button>`}
        <button class="btn ghost" data-share="close">关闭</button>
      </div>
      <p class="share-tip"><b>私有是默认状态</b>：没点过共享的条目永远只有你自己能读到。停止共享后，旧链接立即失效。</p>`;
  }

  async function handleShareAction(a) {
    if (a === 'close') { closeShareSheet(); return; }
    const d = shareTarget ? byId[shareTarget] : null;
    if (!d) { closeShareSheet(); return; }

    if (a === 'create' || a === 'update') {
      const btn = $('#shareSheet [data-share="' + a + '"]');
      if (btn) { btn.disabled = true; btn.textContent = '正在发布…'; }
      const sid = await publishShare(d);
      if (!sid) {
        if (btn) { btn.disabled = false; btn.textContent = a === 'create' ? '生成只读链接' : '更新链接内容'; }
        return;
      }
      renderShareSheet();
      refresh();
      if (state.mode === 'view' && state.current === d.id) renderDrawer();
      copyText(shareUrl(sid), a === 'create' ? '链接已生成并复制，发给对方即可' : '已更新共享内容，链接不变');
      return;
    }

    if (a === 'copy') {
      const m = shareMap[d.id];
      if (!m) { renderShareSheet(); return; }
      const input = $('#shareUrlInput');
      copyText(input && input.value ? input.value : shareUrl(m.shareId));
      return;
    }

    if (a === 'revoke') {
      if (!confirm('停止共享后这条链接立即失效，别人再也打不开。确定？')) return;
      const ok = await revokeShare(d);
      if (!ok) return;
      renderShareSheet();
      refresh();
      if (state.mode === 'view' && state.current === d.id) renderDrawer();
      toast('已停止共享，旧链接已失效');
    }
  }

  /* ---------- 共享只读页 ---------- */
  function openSharePage(shareId) {
    const page = $('#sharePage');
    if (!page) return;
    page.classList.add('on');
    page.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('#sharePageIn').innerHTML = '<div class="sp-loading">正在读取共享内容…</div>';
    loadSharePage(shareId);
  }

  async function loadSharePage(shareId) {
    if (!cloud) { renderShareError('云服务未加载', '暂时读不到共享内容，请稍后重试。'); return; }
    try {
      const r = await cloud.database.from(SHARE_TABLE).select('*').eq('share_id', shareId).maybeSingle();
      if (r.error) throw r.error;
      if (!r.data) { renderShareError('链接已失效', '这条共享可能已被作者停止，或链接不完整。'); return; }
      renderSharePage(r.data);
    } catch (e) {
      renderShareError('读取失败', describeErr(e));
    }
  }

  function shareBar() {
    return `<div class="sp-bar">
        <div class="sp-brand"><span class="mk">A</span><span class="nm">提示词图谱</span></div>
        <span class="sp-pill">只读共享</span>
        <button class="sp-close" data-act="spClose">返回图谱</button>
      </div>`;
  }

  function renderShareError(title, detail) {
    $('#sharePageIn').innerHTML = shareBar() +
      `<div class="sp-err"><b>${esc(title)}</b><span>${esc(detail)}</span></div>`;
  }

  function renderSharePage(row) {
    const d = Object.assign({}, row.payload || {});
    d.id = d.id || row.source_id || 'SHARED';
    if (!catMap[d.cat]) d.cat = 'character';
    shareData = d;

    const c = catOf(d);
    const owner = row.owner_name || '未署名创作者';
    const when = row.created_at ? new Date(row.created_at).toLocaleDateString('zh-CN') : '';
    // 共享页不显示「关联条目」：那些指向作者私有库，读者点了会跳到自己的条目
    const view = Object.assign({}, d, { related: [] });

    $('#sharePageIn').innerHTML = shareBar() + `
      <article class="sp-card">
        <div class="sp-head">
          <div class="row">
            <span class="code">${esc(d.id)}</span>
            <span class="cat" style="background:${c.color}">${c.en}</span>
            <span class="proj">${esc(d.project || '通用')}</span>
          </div>
          <h1>${esc(d.title || '未命名条目')}</h1>
        </div>
        ${bodyView(view)}
        <div class="sp-owner">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          由 <b>${esc(owner)}</b> 共享${when ? ' · ' + esc(when) : ''} · 只读，不能修改
        </div>
        <div class="sp-foot">
          <button class="btn primary" data-act="spCopyAll" style="flex:0 0 auto;justify-content:center;padding:0 16px">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
            复制整条内容
          </button>
          <button class="btn ghost" data-act="spClose">返回图谱</button>
        </div>
      </article>
      <p class="sp-note">Prompt Atlas · 提示词图谱　只读共享页</p>`;
  }

  function closeSharePage() {
    const page = $('#sharePage');
    page.classList.remove('on');
    page.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    shareData = null;
    try {
      const u = new URL(location.href);
      if (u.searchParams.has('s')) {
        u.searchParams.delete('s');
        history.replaceState(null, '', u.pathname + (u.search || '') + u.hash);
      }
    } catch (e) {}
  }

  /* ---------------- 收藏 ---------------- */
  let fav = new Set();
  try { fav = new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]')); } catch (e) { fav = new Set(); }
  function saveFav() {
    try { localStorage.setItem(FAV_KEY, JSON.stringify([...fav])); } catch (e) {}
  }

  /* ---------------- 状态 ---------------- */
  const state = {
    cat: 'all',
    project: 'all',
    q: '',
    favOnly: false,
    mode: 'view',      // view | edit
    current: null
  };
  let dirty = false;

  /* ---------------- 小工具 ---------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
    }[m]));
  }
  const catOf = d => catMap[d.cat] || { name: '其他', en: 'Other', color: '#777' };

  function toast(msg, action) {
    const t = $('#toast');
    t.innerHTML = '<span class="k">✓</span><span>' + esc(msg) + '</span>' +
      (action ? '<button class="undo">' + esc(action.label) + '</button>' : '');
    if (action) {
      const btn = t.querySelector('.undo');
      btn.onclick = () => { t.classList.remove('on'); action.fn(); };
    }
    t.classList.add('on');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('on'), action ? 5000 : 1900);
  }

  async function copyText(text, label) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;top:-9999px;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      toast(label || '已复制到剪贴板');
      return true;
    } catch (e) {
      toast('复制失败，请手动选择文本');
      return false;
    }
  }

  function projects() {
    const set = new Set(DATA.map(d => d.project || '通用'));
    const list = [...set];
    list.sort((a, b) => {
      const ia = PREF_ORDER.indexOf(a), ib = PREF_ORDER.indexOf(b);
      if (ia > -1 && ib > -1) return ia - ib;
      if (ia > -1) return -1;
      if (ib > -1) return 1;
      return a.localeCompare(b, 'zh');
    });
    return list;
  }

  function splitList(s) {
    return String(s || '').split(/[,，、;；\s]+/).map(x => x.trim()).filter(Boolean);
  }

  function nextId(cat) {
    const prefix = (catMap[cat] || { abbr: 'XX' }).abbr;
    let max = 0;
    DATA.filter(d => d.cat === cat).forEach(d => {
      const m = String(d.id).match(/(\d+)\s*$/);
      if (m) max = Math.max(max, parseInt(m[1], 10));
    });
    const n = String(max + 1).padStart(2, '0');
    let id = prefix + '-' + n;
    let guard = 0;
    while (byId[id] && guard++ < 99) id = prefix + '-' + String(max + 1 + guard).padStart(2, '0');
    return id;
  }

  /* ---------------- 侧栏 ---------------- */
  function renderNav() {
    $('#nav').innerHTML =
      `<button class="nav-item ${state.cat === 'all' ? 'on' : ''}" data-cat="all">
         <span class="dot" style="background:#c9c3b2"></span>
         <span class="txt">全部</span><span class="num">${DATA.length}</span>
       </button>` +
      CATS.map(c => {
        const n = DATA.filter(d => d.cat === c.key).length;
        return `<button class="nav-item ${state.cat === c.key ? 'on' : ''}" data-cat="${c.key}">
          <span class="dot" style="background:${c.color}"></span>
          <span class="txt">${c.name}</span><span class="num">${n}</span>
        </button>`;
      }).join('');

    $('#navProj').innerHTML =
      `<button class="nav-item ${state.project === 'all' ? 'on' : ''}" data-proj="all">
         <span class="txt">不限项目</span><span class="num">${DATA.length}</span>
       </button>` +
      projects().map(p => {
        const n = DATA.filter(d => (d.project || '通用') === p).length;
        return `<button class="nav-item ${state.project === p ? 'on' : ''}" data-proj="${esc(p)}">
          <span class="txt">${esc(p)}</span><span class="num">${n}</span>
        </button>`;
      }).join('');

    $('#sTotal').textContent = DATA.length;
    $('#sCat').textContent = CATS.length;
    $('#sFav').textContent = fav.size;
    $('#sEdited').textContent = DATA.filter(d => d.edited).length;
  }

  function renderStoreState() {
    const el = $('#storeState');
    if (!el) return;
    if (!storageOK) {
      el.classList.add('warn');
      el.innerHTML = '<i></i><span>本地存储不可用，改动不会保留</span>';
      return;
    }
    el.classList.remove('warn');
    const t = new Date(store.updatedAt || Date.now());
    const hh = String(t.getHours()).padStart(2, '0');
    const mm = String(t.getMinutes()).padStart(2, '0');
    el.innerHTML = '<i></i><span>' + DATA.length + ' 条 · 已存本机 ' + hh + ':' + mm + '</span>';
  }

  /* ---------------- 筛选 ---------------- */
  function filtered() {
    const q = state.q.trim().toLowerCase();
    return DATA.filter(d => {
      if (state.cat !== 'all' && d.cat !== state.cat) return false;
      if (state.project !== 'all' && (d.project || '通用') !== state.project) return false;
      if (state.favOnly && !fav.has(d.id)) return false;
      if (!q) return true;
      const hay = [d.id, d.title, d.summary, d.zh, d.en, d.project,
        (d.tags || []).join(' '), (d.meta || []).map(m => m.join(' ')).join(' ')]
        .join(' ').toLowerCase();
      return hay.includes(q);
    });
  }

  function renderChips() {
    const base = state.project === 'all' ? DATA : DATA.filter(d => (d.project || '通用') === state.project);
    const list = [{ k: 'all', label: '全部', n: base.length }].concat(
      CATS.map(c => ({ k: c.key, label: c.name, n: base.filter(d => d.cat === c.key).length }))
    );
    $('#chipbar').innerHTML = '<span class="lab">筛选</span>' +
      list.map(x => `<button class="chip ${state.cat === x.k ? 'on' : ''}" data-cat="${x.k}">${x.label}<span class="c">${x.n}</span></button>`).join('');
  }

  /* ---------------- 列表 ---------------- */
  function renderGrid() {
    const rows = filtered();
    $('#grid').innerHTML = rows.map((d, i) => {
      const c = catOf(d);
      const right = d.cat === 'video'
        ? ((d.meta || []).find(m => m[0] === '时长') || ['', '12s'])[1]
        : ((d.meta || [])[0] ? d.meta[0][1] : '');
      return `<article class="card" tabindex="0" role="button" data-id="${esc(d.id)}" style="animation-delay:${Math.min(i * 16, 240)}ms">
        <div class="card-top">
          <span class="code">${esc(d.id)}</span>
          <span class="cat" style="background:${c.color}">${c.name}</span>
          ${d.edited ? '<span class="edited">已编辑</span>' : ''}
          ${isShared(d.id) ? '<span class="shared-flag">共享</span>' : ''}
          <button class="fav ${fav.has(d.id) ? 'on' : ''}" data-fav="${esc(d.id)}" aria-label="收藏">${fav.has(d.id) ? '★' : '☆'}</button>
        </div>
        <div class="card-body">
          <h3>${esc(d.title || '未命名条目')}</h3>
          <p>${esc(d.summary || d.zh || d.en || '—')}</p>
          <div class="tags">${(d.tags || []).slice(0, 4).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
        </div>
        <div class="card-foot">
          <span class="proj"><i></i>${esc(d.project || '通用')}</span>
          <span>${esc(right)}</span>
        </div>
      </article>`;
    }).join('');

    const none = rows.length === 0;
    $('#empty').classList.toggle('on', none);
    if (none) {
      const noData = DATA.length === 0;
      $('#emptyTitle').textContent = noData ? '还没有任何条目' : '没有匹配的条目';
      $('#emptyText').textContent = noData
        ? '从一条角色或场景提示词开始。'
        : '换个关键词，或清空筛选条件再试。';
      $('#emptyNew').style.display = '';
    }

    const catName = state.cat === 'all' ? '全部资产' : catMap[state.cat].name;
    const projName = state.project === 'all' ? '' : ' · ' + state.project;
    const qName = state.q.trim() ? ' · 搜索「' + state.q.trim() + '」' : '';
    $('#eyebrow').textContent = `${catName}${projName}${qName} · 共 ${rows.length} 条`;
  }

  function refresh() {
    reindex();
    renderNav();
    renderChips();
    renderGrid();
    renderStoreState();
  }

  /* =========================================================
     抽屉 · 查看模式
     ========================================================= */
  function headView(d) {
    const c = catOf(d);
    const shared = isShared(d.id);
    return `
      <div class="meta">
        <div class="row">
          <span class="code">${esc(d.id)}</span>
          <span class="cat" style="background:${c.color}">${c.en}</span>
          <span class="proj">${esc(d.project || '通用')}</span>
          ${shared ? '<span class="shared-flag">共享中</span>' : ''}
        </div>
        <h2>${esc(d.title || '未命名条目')}</h2>
      </div>
      <div class="modes">
        <button class="d-ico" data-act="share" title="${shared ? '已共享 · 管理链接' : '共享只读链接'}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.7l6.8-4.1M8.6 13.3l6.8 4.1"/></svg>
        </button>
        <button class="d-ico" data-act="edit" title="编辑（E）">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
        </button>
        <button class="d-ico danger" data-act="delete" title="删除">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5M14 11v5"/></svg>
        </button>
        <button class="d-close" data-act="close" aria-label="关闭">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>`;
  }

  function bodyView(d) {
    const blocks = [
      { k: 'zh', label: '中文提示词 · 即梦 / 可灵 / 通义', cls: '' },
      { k: 'en', label: 'English Prompt · Midjourney / Seedance / Veo', cls: 'en' }
    ].filter(b => (d[b.k] || '').trim());

    const meta = (d.meta || []).filter(m => m[0] || m[1]);
    const rel = (d.related || []).filter(r => byId[r] && r !== d.id);

    return `
      <div class="sec">
        <p style="margin:0 0 14px;font-size:12.5px;line-height:1.8;color:var(--ink-2)">${esc(d.summary || '—')}</p>
        <div class="d-tags">${(d.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
      </div>

      ${blocks.map(b => `
        <div class="sec">
          <div class="sec-h"><span class="t">${b.label}</span><span class="rule"></span></div>
          <div class="blk ${b.cls}"><button class="copy-btn" data-copy="${b.k}">复制</button>${esc(d[b.k])}</div>
        </div>`).join('')}

      ${meta.length ? `
      <div class="sec">
        <div class="sec-h"><span class="t">生成参数 Parameters</span><span class="rule"></span></div>
        <table class="meta">${meta.map(m => `<tr><td>${esc(m[0])}</td><td>${esc(m[1])}</td></tr>`).join('')}</table>
      </div>` : ''}

      ${(d.negative || '').trim() ? `
      <div class="sec">
        <div class="sec-h"><span class="t">负面提示词 Negative</span><span class="rule"></span></div>
        <div class="blk" style="border-color:rgba(194,84,42,.3);background:rgba(194,84,42,.045)">
          <button class="copy-btn" data-copy="negative">复制</button>${esc(d.negative)}
        </div>
      </div>` : ''}

      ${rel.length ? `
      <div class="sec">
        <div class="sec-h"><span class="t">关联条目 Related</span><span class="rule"></span></div>
        <div class="rel">
          ${rel.map(r => {
            const rd = byId[r], rc = catOf(rd);
            return `<button class="rel-item" data-jump="${esc(rd.id)}">
              <span class="dot" style="background:${rc.color}"></span>
              <span class="code">${esc(rd.id)}</span>
              <span>${esc(rd.title)}</span>
              <span class="arr">→</span>
            </button>`;
          }).join('')}
        </div>
      </div>` : ''}

      <p style="margin:26px 0 0;font-size:10.5px;letter-spacing:.14em;color:var(--muted);text-transform:uppercase">
        ${d.updatedAt ? '最后修改 ' + new Date(d.updatedAt).toLocaleString('zh-CN') + ' · ' : ''}Prompt Atlas · ${esc(d.id)}
      </p>`;
  }

  function footView(d) {
    const shared = isShared(d.id);
    return `<button class="btn primary" data-act="copyAll">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
        复制本条目全部内容
      </button>
      <button class="btn ghost" data-act="share" style="flex:0 0 auto" title="${shared ? '已共享 · 管理链接' : '生成只读共享链接'}">
        ${shared ? '共享中' : '共享'}
      </button>
      <button class="btn ${fav.has(d.id) ? 'danger' : ''}" data-act="fav" style="width:44px;justify-content:center;padding:0" title="收藏">
        <span style="font-size:15px;color:${fav.has(d.id) ? 'var(--cinnabar)' : 'inherit'}">${fav.has(d.id) ? '★' : '☆'}</span>
      </button>`;
  }

  /* =========================================================
     抽屉 · 编辑模式
     ========================================================= */
  function blankItem() {
    const cat = state.cat === 'all' ? 'character' : state.cat;
    return {
      id: nextId(cat),
      cat,
      project: state.project === 'all' ? '通用' : state.project,
      title: '', summary: '', tags: [], zh: '', en: '',
      meta: [['模型', ''], ['比例', '16:9'], ['用途', '']],
      negative: '', related: []
    };
  }

  function metaRows(meta) {
    const rows = (meta && meta.length ? meta : [['模型', ''], ['比例', '16:9']]);
    return rows.map(m => `
      <div class="mrow">
        <input class="mk" value="${esc(m[0] || '')}" placeholder="参数名" spellcheck="false">
        <input class="mv" value="${esc(m[1] || '')}" placeholder="值" spellcheck="false">
        <button type="button" class="mx" title="删除此行">×</button>
      </div>`).join('');
  }

  function headEdit(d, isNew) {
    const c = catOf(d);
    return `
      <div class="meta">
        <div class="row">
          <span class="code">${isNew ? 'NEW' : esc(d.id)}</span>
          <span class="cat" style="background:${c.color}">编辑模式</span>
        </div>
        <h2>${isNew ? '新建提示词' : '编辑 · ' + esc(d.title || d.id)}</h2>
      </div>
      <div class="modes">
        <button class="d-close" data-act="cancelEdit" aria-label="取消">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>`;
  }

  function bodyEdit(d) {
    const cats = CATS.map(c => {
      const on = d.cat === c.key;
      return `<button type="button" data-pick="${c.key}" class="${on ? 'on' : ''}" style="${on ? 'background:' + c.color : ''}">
        <span class="d" style="background:${on ? '#fff' : c.color}"></span>${c.name}
      </button>`;
    }).join('');

    const projList = [...new Set(projects().concat([d.project || '通用']))]
      .map(p => `<option value="${esc(p)}"></option>`).join('');

    return `
      <div class="form" id="form" data-cat="${esc(d.cat)}">
        <div class="f-err" id="fErr"></div>

        <div class="f-row2">
          <label class="f">
            <span>编号 ID <em>*</em></span>
            <input type="text" name="id" class="mono" value="${esc(d.id)}" spellcheck="false" placeholder="如 CH-07">
            <span class="hint">同分类建议沿用前缀，用于关联引用</span>
          </label>
          <label class="f">
            <span>项目 Project</span>
            <input type="text" name="project" list="projList" value="${esc(d.project || '通用')}" placeholder="可直接输入新项目名">
            <datalist id="projList">${projList}</datalist>
          </label>
        </div>

        <div class="f">
          <span>分类 Category <em>*</em></span>
          <div class="seg" id="segCat">${cats}</div>
        </div>

        <label class="f">
          <span>标题 Title <em>*</em></span>
          <input type="text" name="title" value="${esc(d.title)}" placeholder="如：主角猫 · 墨点 三视图立绘">
        </label>

        <label class="f">
          <span>摘要 Summary</span>
          <textarea name="summary" rows="2" placeholder="一两句话说明这条提示词的用途与要点（卡片上显示两行）">${esc(d.summary)}</textarea>
        </label>

        <label class="f">
          <span>标签 Tags</span>
          <input type="text" name="tags" value="${esc((d.tags || []).join(', '))}" placeholder="逗号分隔，如：三视图, 设定稿">
        </label>

        <label class="f">
          <span>中文提示词 · 即梦 / 可灵 / 通义</span>
          <textarea name="zh" rows="7" placeholder="可直接粘贴使用的中文提示词，建议按「主体 + 细节 + 光位 + 镜头 + 质感」排列">${esc(d.zh)}</textarea>
        </label>

        <label class="f">
          <span>English Prompt · Midjourney / Seedance / Veo</span>
          <textarea name="en" class="mono" rows="7" placeholder="English prompt with parameters, e.g. ... --ar 16:9 --style raw">${esc(d.en)}</textarea>
        </label>

        <div class="f">
          <span>生成参数 Parameters</span>
          <div id="metaRows">${metaRows(d.meta)}</div>
          <button type="button" class="add-row" id="addMeta">＋ 添加一行</button>
        </div>

        <label class="f">
          <span>负面提示词 Negative</span>
          <textarea name="negative" rows="3" placeholder="逗号分隔的负面词">${esc(d.negative)}</textarea>
        </label>

        <label class="f">
          <span>关联条目 Related</span>
          <input type="text" name="related" class="mono" value="${esc((d.related || []).join(', '))}" placeholder="逗号分隔的编号，如 CH-01, VD-03">
          <span class="hint">编号需已存在，保存后可在详情页互相跳转</span>
        </label>
      </div>`;
  }

  function footEdit(isNew) {
    return `<button class="btn ghost" data-act="cancelEdit">取消</button>
      ${isNew ? '' : '<button class="btn danger" data-act="delete">删除</button>'}
      <button class="btn primary" data-act="save" style="flex:1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>
        保存
      </button>`;
  }

  /* =========================================================
     抽屉控制
     ========================================================= */
  function renderDrawer() {
    const isEdit = state.mode === 'edit';
    if (isEdit) {
      const isNew = !state.current;
      const d = isNew ? blankItem() : byId[state.current];
      if (!d) { closeDrawer(true); return; }
      const work = JSON.parse(JSON.stringify(d));
      $('#dHead').innerHTML = headEdit(work, isNew);
      $('#dBody').innerHTML = bodyEdit(work);
      $('#dFoot').innerHTML = footEdit(isNew);
    } else {
      const d = byId[state.current];
      if (!d) { closeDrawer(true); return; }
      $('#dHead').innerHTML = headView(d);
      $('#dBody').innerHTML = bodyView(d);
      $('#dFoot').innerHTML = footView(d);
    }
    bindForm();
  }

  function openItem(id) {
    state.current = id;
    state.mode = 'view';
    dirty = false;
    renderDrawer();
    $('#scrim').classList.add('on');
    $('#drawer').classList.add('on');
    $('#drawer').setAttribute('aria-hidden', 'false');
    $('#dBody').scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  function openEditor(id) {
    state.mode = 'edit';
    state.current = id || null;
    dirty = false;
    renderDrawer();
    $('#scrim').classList.add('on');
    $('#drawer').classList.add('on');
    $('#drawer').setAttribute('aria-hidden', 'false');
    $('#dBody').scrollTop = 0;
    document.body.style.overflow = 'hidden';
    const first = $('#form [name="title"]');
    if (first && document.activeElement !== first) {
      setTimeout(() => first.focus({ preventScroll: true }), 120);
    }
  }

  function closeDrawer(force) {
    if (!force && state.mode === 'edit' && dirty) {
      if (!confirm('这条还没保存，确定放弃修改？')) return;
    }
    state.mode = 'view';
    state.current = null;
    dirty = false;
    $('#scrim').classList.remove('on');
    $('#drawer').classList.remove('on');
    $('#drawer').setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ---------------- 表单绑定 ---------------- */
  function bindForm() {
    const form = $('#form');
    if (!form) return;

    form.addEventListener('input', () => { dirty = true; });

    form.addEventListener('click', e => {
      const pick = e.target.closest('[data-pick]');
      if (pick) {
        const key = pick.dataset.pick;
        const prev = form.dataset.cat;
        form.dataset.cat = key;
        form.querySelectorAll('[data-pick]').forEach(b => {
          const on = b.dataset.pick === key;
          const c = catMap[b.dataset.pick];
          b.classList.toggle('on', on);
          b.style.background = on ? c.color : '';
          const dot = b.querySelector('.d');
          if (dot) dot.style.background = on ? '#fff' : c.color;
        });
        // 编号若还是自动生成的默认值，同步换前缀
        const idEl = form.querySelector('[name="id"]');
        if (idEl && (!idEl.value.trim() || idEl.value.trim() === nextId(prev))) {
          idEl.value = nextId(key);
        }
        dirty = true;
        return;
      }
      if (e.target.closest('#addMeta')) {
        const rows = $('#metaRows');
        const div = document.createElement('div');
        div.className = 'mrow';
        div.innerHTML = '<input class="mk" placeholder="参数名" spellcheck="false"><input class="mv" placeholder="值" spellcheck="false"><button type="button" class="mx" title="删除此行">×</button>';
        rows.appendChild(div);
        div.querySelector('.mk').focus();
        dirty = true;
        return;
      }
      const mx = e.target.closest('.mx');
      if (mx) {
        const row = mx.closest('.mrow');
        if (row) row.remove();
        dirty = true;
      }
    });
  }

  /* ---------------- 表单读写 ---------------- */
  function collectForm() {
    const f = $('#form');
    const val = n => {
      const el = f.querySelector('[name="' + n + '"]');
      return el ? el.value.trim() : '';
    };
    const meta = [...f.querySelectorAll('#metaRows .mrow')]
      .map(r => [r.querySelector('.mk').value.trim(), r.querySelector('.mv').value.trim()])
      .filter(x => x[0] || x[1]);
    return {
      id: val('id').toUpperCase().replace(/\s+/g, ''),
      cat: f.dataset.cat,
      project: val('project') || '通用',
      title: val('title'),
      summary: val('summary'),
      tags: splitList(val('tags')),
      zh: val('zh'),
      en: val('en'),
      meta,
      negative: val('negative'),
      related: splitList(val('related')).map(s => s.toUpperCase())
    };
  }

  function showErr(msg) {
    const box = $('#fErr');
    if (!box) return;
    box.textContent = msg;
    box.classList.add('on');
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function validate(v) {
    if (!v.title) return '标题不能为空';
    if (!v.id) return '编号不能为空，例如 CH-07';
    if (!/^[A-Z0-9][A-Z0-9\-_]*$/.test(v.id)) return '编号只能用字母、数字和连字符，例如 CH-07';
    const dup = DATA.find(it => it.id === v.id && it.id !== state.current);
    if (dup) return '编号 ' + v.id + ' 已被《' + dup.title + '》占用，请换一个';
    if (!v.zh && !v.en) return '中文或英文提示词至少填一个';
    if (v.related.some(r => !byId[r])) {
      const bad = v.related.filter(r => !byId[r]).join('、');
      return '关联条目不存在：' + bad + '（可先留空，之后再补）';
    }
    return null;
  }

  async function save() {
    if (!requireAuth('保存需要登录')) return;
    const v = collectForm();
    const isNew = !state.current;
    const prevId = isNew ? null : state.current;
    const err = validate(v);
    if (err) { showErr(err); return; }

    if (isNew) {
      v.createdAt = Date.now();
      v.updatedAt = Date.now();
      v.edited = true;
      store.items.push(v);
      state.current = v.id;
    } else {
      const oldId = state.current;
      const idx = store.items.findIndex(i => i.id === oldId);
      const prev = store.items[idx];
      v.createdAt = prev.createdAt || Date.now();
      v.updatedAt = Date.now();
      v.edited = true;
      store.items[idx] = v;
      if (oldId !== v.id) {
        store.items.forEach(it => {
          if (Array.isArray(it.related)) it.related = it.related.map(r => (r === oldId ? v.id : r));
        });
        if (fav.has(oldId)) { fav.delete(oldId); fav.add(v.id); saveFav(); }
        state.current = v.id;
      }
    }

    persist();
    refresh();
    dirty = false;
    state.mode = 'view';

    // 保存后若被当前筛选挡住，自动放宽条件让用户看到结果
    if (!filtered().some(x => x.id === state.current)) {
      state.cat = 'all'; state.project = 'all'; state.q = ''; state.favOnly = false;
      $('#q').value = '';
      $('#favFilter').classList.remove('on');
      refresh();
    }

    renderDrawer();

    // 写云端（未登录则跳过，数据留在本机）
    if (cloudMode) {
      const pushed = await cloudPush(v, prevId);
      if (!pushed.ok) {
        toast('已存本机，云端同步失败：' + pushed.error);
        return;
      }
    }
    toast((isNew ? '已新建 ' : '已保存 ') + v.id);
  }

  async function deleteItem() {
    const id = state.current;
    const idx = store.items.findIndex(i => i.id === id);
    if (idx < 0) return;
    const removed = store.items.splice(idx, 1)[0];
    persist();
    refresh();
    closeDrawer(true);
    if (cloudMode) {
      const r = await cloudRemove(id);
      if (!r.ok) toast('本地已删除，云端同步失败：' + r.error);
    }
    toast('已删除 ' + id, {
      label: '撤销',
      fn: async () => {
        store.items.splice(Math.min(idx, store.items.length), 0, removed);
        persist();
        refresh();
        if (cloudMode) await cloudPush(removed, null);
        toast('已恢复 ' + id);
      }
    });
  }

  /* =========================================================
     导出 / 导入
     ========================================================= */
  function entryText(d) {
    const lines = [
      '## ' + d.id + ' · ' + (d.title || ''),
      '**分类：** ' + catOf(d).name + '　**项目：** ' + (d.project || '通用')
    ];
    if (d.summary) lines.push('', d.summary);
    if ((d.zh || '').trim()) lines.push('', '**中文提示词**', d.zh.trim());
    if ((d.en || '').trim()) lines.push('', '**English Prompt**', d.en.trim());
    const meta = (d.meta || []).filter(m => m[0] || m[1]);
    if (meta.length) lines.push('', '**参数：** ' + meta.map(m => m[0] + ' ' + m[1]).join(' / '));
    if ((d.negative || '').trim()) lines.push('', '**负面：** ' + d.negative.trim());
    if ((d.tags || []).length) lines.push('', '**标签：** ' + d.tags.join(' · '));
    if ((d.related || []).length) lines.push('', '**关联：** ' + d.related.join(', '));
    return lines.join('\n');
  }

  function download(name, text, mime) {
    const blob = new Blob([text], { type: mime || 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 3000);
  }

  function exportMarkdown() {
    const rows = filtered();
    if (!rows.length) { toast('当前筛选为空，无法导出'); return; }
    const head = '# PROMPT ATLAS · 提示词汇总分类\n\n' +
      '导出时间：' + new Date().toLocaleString('zh-CN') + '\n' +
      '筛选：' + (state.cat === 'all' ? '全部' : catMap[state.cat].name) + ' / ' + state.project + '\n' +
      '条目：' + rows.length + ' 条\n\n---\n\n';
    const md = head + rows.map(entryText).join('\n\n---\n\n') + '\n';
    download('prompt-atlas-' + rows.length + '条.md', md, 'text/markdown;charset=utf-8');
    toast('已导出 ' + rows.length + ' 条 Markdown');
  }

  function exportJson() {
    const payload = {
      app: 'prompt-atlas',
      version: 2,
      exportedAt: new Date().toISOString(),
      items: store.items
    };
    const d = new Date();
    const stamp = d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
    download('prompt-atlas-backup-' + stamp + '.json', JSON.stringify(payload, null, 2), 'application/json');
    toast('已备份 ' + store.items.length + ' 条 JSON');
  }

  function importJson(file) {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        let items = Array.isArray(parsed) ? parsed : (parsed && parsed.items);
        if (!Array.isArray(items) || !items.length) throw new Error('文件里没有条目数组');
        items = items.filter(it => it && it.id && it.cat);
        if (!items.length) throw new Error('条目缺少 id / cat 字段');
        if (!confirm('导入将覆盖当前 ' + store.items.length + ' 条数据，共读入 ' + items.length + ' 条。继续？')) return;
        store.items = items;
        store.updatedAt = Date.now();
        persist();
        refresh();
        closeDrawer(true);
        if (cloudMode) {
          const r = await pushAll();
          toast(r.ok ? '已导入 ' + items.length + ' 条并同步到云端' : '已导入本机，云端同步失败：' + r.error);
        } else {
          toast('已导入 ' + items.length + ' 条');
        }
      } catch (err) {
        alert('导入失败：' + err.message);
      }
    };
    reader.readAsText(file, 'utf-8');
  }

  /* =========================================================
     事件
     ========================================================= */
  document.addEventListener('click', e => {
    // 共享面板动作
    const sh = e.target.closest('[data-share]');
    if (sh) { handleShareAction(sh.dataset.share); return; }

    // 共享只读页
    const spAct = e.target.closest('[data-act="spClose"], [data-act="spCopyAll"]');
    if (spAct) {
      if (spAct.dataset.act === 'spClose') closeSharePage();
      else if (shareData) copyText(entryText(shareData), '整条内容已复制');
      return;
    }

    // 顶栏数据菜单
    const menuBtn = e.target.closest('#dataBtn');
    if (menuBtn) {
      $('#dataMenu').classList.toggle('on');
      return;
    }
    const menuItem = e.target.closest('#dataMenu [data-act]');
    if (menuItem) {
      $('#dataMenu').classList.remove('on');
      const act = menuItem.dataset.act;
      if (act === 'exportMd') exportMarkdown();
      else if (act === 'exportJson') exportJson();
      else if (act === 'importJson') { if (requireAuth('导入会改动数据，需要登录')) $('#fileInput').click(); }
      else if (act === 'syncNow') {
        if (!session) { toast('请先登录，再同步云端'); }
        else pullCloud(false);
      }
      else if (act === 'selfCheck') cloudSelfCheck();
      else if (act === 'reset') {
        if (!requireAuth('恢复示例数据会覆盖全库，需要登录')) return;
        if (!confirm('将清空当前所有改动，恢复到内置示例数据。此操作不可撤销，建议先备份 JSON。确定继续？')) return;
        store = seedStore();
        store.items.forEach(it => { it.edited = false; });
        persist();
        fav.clear(); saveFav();
        state.cat = 'all'; state.project = 'all'; state.q = ''; state.favOnly = false;
        $('#q').value = '';
        $('#favFilter').classList.remove('on');
        refresh();
        closeDrawer(true);
        if (cloudMode) {
          pushAll().then(r => {
            toast(r.ok ? '已恢复示例数据并覆盖云端' : '已恢复本机，云端写入失败：' + r.error);
          });
        } else {
          toast('已恢复示例数据');
        }
      }
      return;
    }
    $('#dataMenu').classList.remove('on');

    // 新建（编辑需登录）
    if (e.target.closest('#newBtn') || e.target.closest('#newBtn2') || e.target.closest('#emptyNew')) {
      if (!requireAuth('新建条目需要登录')) return;
      openEditor(null);
      return;
    }

    // 侧栏分类 / 项目
    const nav = e.target.closest('[data-cat]');
    if (nav && !nav.closest('#form')) {
      state.cat = nav.dataset.cat;
      refresh();
      return;
    }
    const proj = e.target.closest('[data-proj]');
    if (proj) {
      state.project = proj.dataset.proj;
      refresh();
      return;
    }

    // 收藏
    const favBtn = e.target.closest('[data-fav]');
    if (favBtn) {
      e.stopPropagation();
      toggleFav(favBtn.dataset.fav);
      return;
    }

    // 卡片
    const card = e.target.closest('.card');
    if (card) { openItem(card.dataset.id); return; }

    // 关联跳转
    const jump = e.target.closest('[data-jump]');
    if (jump) { openItem(jump.dataset.jump); return; }

    // 复制块（共享页读 shareData，抽屉里读当前条目）
    const cp = e.target.closest('[data-copy]');
    if (cp) {
      const inShare = $('#sharePage') && $('#sharePage').classList.contains('on');
      const d = inShare ? shareData : byId[state.current];
      if (!d) return;
      const key = cp.dataset.copy;
      copyText(d[key] || '').then(ok => {
        if (!ok) return;
        cp.classList.add('done');
        cp.textContent = '已复制';
        setTimeout(() => { cp.classList.remove('done'); cp.textContent = '复制'; }, 1400);
      });
      return;
    }

    // 抽屉动作
    const act = e.target.closest('[data-act]');
    if (!act) return;
    const a = act.dataset.act;

    if (a === 'close' || a === 'cancelEdit') {
      if (state.mode === 'edit' && !state.current) {
        if (dirty && !confirm('这条还没保存，确定放弃？')) return;
      }
      closeDrawer();
      return;
    }
    if (a === 'edit') { if (!requireAuth('编辑需要登录')) return; openEditor(state.current); return; }
    if (a === 'share') { openShareSheet(state.current); return; }
    if (a === 'save') { save(); return; }
    if (a === 'fav') { toggleFav(state.current); return; }
    if (a === 'delete') {
      if (!requireAuth('删除需要登录')) return;
      if (state.mode === 'edit') {
        if (confirm('确定删除「' + ((byId[state.current] || {}).title || state.current) + '」？删除后仍可撤销。')) deleteItem();
        return;
      }
      // 查看模式：二次确认
      if (!act.classList.contains('confirming')) {
        act.classList.add('confirming');
        act.dataset.prev = act.innerHTML;
        act.innerHTML = '确认删除';
        act._t = setTimeout(() => {
          if (!act.isConnected) return;
          act.classList.remove('confirming');
          act.innerHTML = act.dataset.prev;
        }, 2800);
        return;
      }
      clearTimeout(act._t);
      deleteItem();
      return;
    }
    if (a === 'copyAll') {
      const d = byId[state.current];
      if (!d) return;
      copyText(entryText(d), '整条内容已复制').then(ok => {
        if (!ok) return;
        act.classList.add('done');
        const old = act.innerHTML;
        act.innerHTML = '✓ 已复制';
        setTimeout(() => { act.classList.remove('done'); act.innerHTML = old; }, 1500);
      });
    }
  });

  function toggleFav(id) {
    if (!id) return;
    if (fav.has(id)) fav.delete(id); else fav.add(id);
    saveFav();
    renderNav();
    renderGrid();
    if (state.current === id && state.mode === 'view') {
      const d = byId[id];
      if (d) { $('#dFoot').innerHTML = footView(d); }
    }
    toast(fav.has(id) ? '已加入收藏' : '已取消收藏');
  }

  /* 搜索 / 收藏筛选 */
  $('#q').addEventListener('input', e => {
    state.q = e.target.value;
    renderGrid();
  });
  $('#favFilter').addEventListener('click', e => {
    state.favOnly = !state.favOnly;
    e.currentTarget.classList.toggle('on', state.favOnly);
    renderGrid();
    if (state.favOnly && filtered().length === 0) toast('还没有收藏，点卡片右上角 ☆');
  });

  $('#scrim').addEventListener('click', () => closeDrawer());
  $('#sheetScrim').addEventListener('click', closeShareSheet);
  $('#fileInput').addEventListener('change', e => {
    const f = e.target.files && e.target.files[0];
    if (f) importJson(f);
    e.target.value = '';
  });

  /* 键盘 */
  document.addEventListener('keydown', e => {
    const el = document.activeElement;
    const typing = el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      if (state.mode === 'edit') { e.preventDefault(); save(); }
      return;
    }
    if (e.key === 'Escape') {
      if ($('#drawer').classList.contains('on')) closeDrawer();
      else if (typing && el.id === 'q') {
        $('#q').value = ''; state.q = ''; renderGrid(); el.blur();
      }
      return;
    }
    if (e.key === '/' && !typing) { e.preventDefault(); $('#q').focus(); return; }
    if (e.key === 'Enter' && el && el.classList.contains('card')) {
      e.preventDefault(); openItem(el.dataset.id); return;
    }
    if (!typing && (e.key === 'ArrowRight' || e.key === 'ArrowLeft') &&
        $('#drawer').classList.contains('on') && state.mode === 'view' && state.current) {
      const arr = filtered();
      const idx = arr.findIndex(d => d.id === state.current);
      if (idx < 0) return;
      const next = arr[(idx + (e.key === 'ArrowRight' ? 1 : arr.length - 1)) % arr.length];
      if (next) openItem(next.id);
      return;
    }
    if (e.key.toLowerCase() === 'e' && !typing && state.mode === 'view' && state.current) {
      if (!requireAuth('编辑需要登录')) return;
      openEditor(state.current);
    }
  });

  /* ---------------- 云账号按钮 ---------------- */
  const accBtn = $('#accBtn');
  if (accBtn) {
    accBtn.addEventListener('click', () => {
      if (session) { signOut(); return; }
      if (syncState === 'error' && cloudMode) { pullCloud(false); return; }
      signIn();
    });
  }
  const accChip = $('#accChip');
  if (accChip) {
    accChip.addEventListener('click', () => {
      if (session) { signOut(); return; }
      signIn();
    });
  }

  /* ---------------- 启动 ---------------- */
  refresh();
  renderAccount();

  async function boot() {
    const ok = initCloud();
    const params = new URLSearchParams(location.search);
    const sharedId = params.get('s');

    if (!ok) {
      renderAccount();
      if (sharedId) openSharePage(sharedId);
      else toast('云服务 SDK 未加载，当前为只读浏览');
      return;
    }
    await restoreAuth();
    if (session) await pullCloud(true);
    else setSyncState('local');
    renderAccount();

    if (sharedId) openSharePage(sharedId);
    else openFromUrl();
  }

  function openFromUrl() {
    try {
      const p = new URLSearchParams(location.search);
      if (p.get('new') === '1') { if (requireAuth('新建条目需要登录')) openEditor(null); }
      else if (p.get('edit') && byId[p.get('edit')]) { if (requireAuth('编辑需要登录')) openEditor(p.get('edit')); }
      else if (p.get('open') && byId[p.get('open')]) openItem(p.get('open'));
    } catch (e) {}
  }

  boot();
})();
