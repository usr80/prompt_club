# Prompt Atlas · 提示词图谱

把散落在笔记、聊天记录和脑子的提示词，收进一张**可编辑、可多端同步、可只读分享**的图谱。

面向 AI 动画 / 短片创作场景：角色、场景、道具、视频、风格、镜头、特效、负面词，每条自带中英双语提示词、生成参数与关联编号。纯静态单页应用，无构建步骤，可直接托管在任意静态服务器上。

---

## 功能

**组织与检索**

- 8 大分类（角色 / 场景 / 道具 / 视频 / 风格 / 镜头 / 特效 / 负面）+ 项目维度筛选
- 全字段搜索（标题、提示词正文、标签、编号、参数），`/` 一键聚焦
- 收藏（本机记忆）、卡片计数、分类统计

**编辑**

- 抽屉式查看 / 编辑，中英双语提示词、任意增删的参数行、标签、负面词、关联条目
- 新建时按分类自动生成编号（`CH-07`、`SC-04`…），改编号自动联动全库引用
- 重复编号拦截、标题必填、中英至少填一个的校验
- 删除二次确认 + Toast 撤销

**账号与同步**

- WorkBuddy OAuth 登录，数据以云端为准，多设备一致
- 未登录 = 只读浏览（可看、可复制、可收藏、可导出），**编辑需登录**
- 首次登录时云端为空会自动上传本机内容；云端已有数据会先询问再覆盖

**共享**

- 单条生成随机只读链接（`?s=<share_id>`），拿到链接的人可查看与复制，**不能修改**
- 共享的是发布时的**快照**，改完条目可「更新链接内容」；「停止共享」后旧链接立即失效
- 分享页不暴露作者的其他条目

**数据进出**

- 导出当前筛选为 Markdown、备份全库为 JSON、从 JSON 导入（覆盖式）
- **追加导入**：同编号的条目自动跳过、不覆盖现有内容，适合增量更新提示词包（见 `seeds/`）
- 恢复内置示例数据

---

## 目录结构

```
.
├── index.html              # 页面骨架（无框架，纯 DOM）
├── styles.css              # 全部样式（纸感编辑风，含响应式与分享页）
├── app.js                  # 应用逻辑：渲染 / 筛选 / 编辑 / 云同步 / 共享
├── data.js                 # 内置种子数据（47 条示例提示词）
├── seeds/                  # 增量提示词包（配合「追加导入」使用）
├── cloud-config.example.js # 云服务配置模板
└── cloud-config.js         # 你的真实配置（本地生成，已被 .gitignore 忽略）
```

无 npm、无打包、无依赖安装。`app.js` 用 IIFE 包裹，状态集中在一个 `store` 对象里。

---

## 快速开始

```bash
git clone git@github.com:usr80/prompt_club.git
cd prompt_club

# 1. 生成你的云服务配置
cp cloud-config.example.js cloud-config.js
#    然后编辑 cloud-config.js，填入自己的 applicationId / endpoint / publishableKey

# 2. 起一个本地静态服务（不要用 file://，OAuth 回调与剪贴板都需要 http(s) 源）
python -m http.server 5173
# 打开 http://localhost:5173
```

> 只想看界面、不接云端？直接删掉 `cloud-config.js` 也能跑：应用会退化为纯本地模式（只读浏览 + 本机收藏），控制台会提示云服务未就绪。

### endpoint 自适应（重要）

托管站点的域名可能变更（例如 `*.app.workbuddy.host` → `*.app.workbuddy.link`）。如果把 endpoint 写死，域名一换 SDK 就会去连一个不存在的地址，表现为**页面能打开但登录不了**。

因此 `app.js` 里的 `resolveConfig()` 做了自适应：

- 部署在真实站点上（https 且非 localhost / 私网 IP）→ `endpoint` 自动跟随 `location.origin`，配置文件里的值仅作本地调试回退
- 本地调试（`localhost` / `127.0.0.1` / 私网 IP / `file://`）→ 沿用配置里的 `endpoint`
- 特殊场景需要固定地址 → 在 `cloud-config.js` 里加 `endpointPin: true`

排查登录问题：打开 `?diag=1` 看诊断面板，或用「数据 → 连接诊断」。若 endpoint 与站点地址不同源、或授权报网络错误，多半是配置里的地址已过期。

### URL 参数

| 参数 | 作用 |
|---|---|
| `?open=CH-01` | 直接打开某条提示词的详情 |
| `?edit=CH-01` | 直接进入某条的编辑（需登录） |
| `?new=1` | 直接打开新建表单（需登录） |
| `?s=<share_id>` | 打开共享只读页（无需登录） |
| `?sharecode=...` | 平台部署时附带的访问码，共享链接会自动保留它 |
| `?diag=1` | 打开「连接诊断」面板：逐项检查配置 / SDK / endpoint 同源 / 登录授权 / 数据面连通。登录不了时先看它 |

---

## 云服务与数据库

前端通过 `@tencent-ai/workbuddy-cloud-sdk` 的浏览器全局包访问数据（CDN 引入，`WorkBuddyCloud`）。所有配置项都是**前端可公开**的：没有 service key，真正的权限由数据库 RLS 决定。

### 表结构

```sql
-- 私有提示词：每个账号一份，互相不可见
CREATE TABLE prompt_items (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  owner_id    TEXT NOT NULL DEFAULT auth.uid(),
  owner_name  TEXT,
  item_id     TEXT NOT NULL,                 -- 业务编号，如 CH-01
  cat         TEXT NOT NULL,                 -- character / scene / prop / video ...
  project     TEXT,
  title       TEXT,
  summary     TEXT,
  tags        JSONB NOT NULL DEFAULT '[]'::jsonb,
  zh          TEXT,
  en          TEXT,
  meta        JSONB NOT NULL DEFAULT '[]'::jsonb,   -- [["模型","Midjourney v6"], ...]
  negative    TEXT,
  related     JSONB NOT NULL DEFAULT '[]'::jsonb,
  edited      BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (owner_id, item_id)
);

-- 共享快照：谁都能读，只有作者能写和撤回
CREATE TABLE shared_prompts (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  share_id    TEXT NOT NULL UNIQUE,          -- 随机 10 位，出现在链接里
  owner_id    TEXT NOT NULL DEFAULT auth.uid(),
  owner_name  TEXT,
  source_id   TEXT,                          -- 原条目编号
  payload     JSONB NOT NULL,                -- 完整条目快照
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 行级权限（RLS）

两张表都开启 RLS。核心思路：**私有行的归属由 `auth.uid()` 判定，前端永远不传 `owner_id`**；匿名身份（`anon`）只能读共享表，不能写任何表。

```sql
ALTER TABLE prompt_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_prompts ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.prompt_items   TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shared_prompts TO authenticated, anon;

-- 私有表：只认自己的行；写入额外排除匿名身份
CREATE POLICY prompt_items_select_own ON prompt_items FOR SELECT TO authenticated, anon
  USING (owner_id = auth.uid());

CREATE POLICY prompt_items_write_own ON prompt_items FOR ALL TO authenticated, anon
  USING      (owner_id = auth.uid() AND coalesce(auth.uid(),'') NOT IN ('','anon'))
  WITH CHECK (owner_id = auth.uid() AND coalesce(auth.uid(),'') NOT IN ('','anon'));

-- 共享表：所有人可读（这正是"拿到链接就能看"），写只归作者
CREATE POLICY shared_select_all ON shared_prompts FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY shared_write_own ON shared_prompts FOR ALL TO authenticated, anon
  USING      (owner_id = auth.uid() AND coalesce(auth.uid(),'') NOT IN ('','anon'))
  WITH CHECK (owner_id = auth.uid() AND coalesce(auth.uid(),'') NOT IN ('','anon'));
```

> 生产环境建议把 `FOR ALL` 拆成 INSERT / UPDATE / DELETE 三条独立策略，语义更清晰；这里为了可读性做了合并。

---

## 权限模型一览

| 角色 | 浏览内置示例 | 浏览自己的库 | 编辑 / 新建 / 删除 | 生成共享链接 | 打开共享链接 |
|---|---|---|---|---|---|
| 未登录访客 | ✅ | 仅本机缓存 | ❌ 提示登录 | ❌ | ✅ |
| 已登录作者 | ✅ | ✅ 云端为准 | ✅ | ✅ | ✅ |
| 其他登录用户 | ✅ | 自己的库 | 自己的库 | 自己的库 | ✅ 只读 |

私有是默认状态：没点过共享的条目，任何情况下都只有作者本人能读到。

---

## 数据字段（单条提示词）

```jsonc
{
  "id": "CH-01",              // 唯一编号，字母数字与连字符
  "cat": "character",         // 分类 key
  "project": "编灵",          // 项目名，可自由输入
  "title": "主角猫 · 墨点 三视图立绘",
  "summary": "一句话用途说明",
  "tags": ["三视图", "设定稿"],
  "zh": "中文提示词……",      // 即梦 / 可灵 / 通义万相
  "en": "english prompt --ar 16:9",   // Midjourney / Seedance / Veo
  "meta": [["模型", "Midjourney v6"], ["比例", "16:9"]],
  "negative": "负面提示词",
  "related": ["CH-02"],       // 关联条目编号
  "edited": true              // 是否为作者自行编辑过
}
```

---

## 快捷键

| 键 | 作用 |
|---|---|
| `/` | 聚焦搜索 |
| `Esc` | 关闭抽屉 / 清空搜索 |
| `E` | 编辑当前条目（需登录） |
| `Ctrl / Cmd + S` | 保存（编辑态） |
| `←` `→` | 在筛选结果中切换上一条 / 下一条 |

---

## 技术说明与已知限制

- **无构建**：三个 `<script>` 顺序加载，改完刷新即可。SDK 走 CDN（`@dev` 通道），离线时自动降级为纯本地只读。
- **本机缓存**：数据全量写入 `localStorage`（`atlas.store.v2` / `atlas.fav.v2` / `atlas.share.v1`），用于快速首屏与离线浏览；登录后以云端为准。
- **共享是快照**：不跟随条目后续修改，需要手动「更新链接内容」。这样做的好处是链接内容可控、可预期。
- **共享链接是 bearer 形式**：知道链接即可读，没有额外口令。把链接当作可转发的公开内容对待。
- **种子数据只在本机首次打开时写入**，不会自动覆盖你的编辑。

---

## License

MIT
