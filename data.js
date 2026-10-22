/* =========================================================
   提示词种子数据 SEED
   首次打开会写入浏览器本地存储，之后以本地数据为准。
   也可以直接改这里再点「恢复示例数据」重载。
   ========================================================= */
window.SEED = [
/* ---------------- 角色 ---------------- */
{
  id:'CH-01', cat:'character', project:'编灵',
  title:'主角猫 · 墨点 三视图立绘',
  summary:'中华狸花猫，左耳缺角、颈系旧麻绳，正/侧/背三视图并排，2D 动画设定稿质感，保证逐帧一致性。',
  tags:['三视图','设定稿','主角','一致性'],
  zh:`角色三视图设定图，一只中华狸花猫，左耳缺一小角，颈间系一段旧麻绳，毛发干湿分明、带泥点；正面全身、四分之三侧身、背面全身并排站立，纯色米白背景，柔和顶侧光，无硬边投影；2D 动画角色设定稿风格，线稿清晰、平涂上色带轻微水彩晕染，细节克制，便于逐帧复用。`,
  en:`character turnaround sheet, a Chinese tabby cat with a small notch on the left ear and a worn hemp cord around the neck, damp fur with mud specks, front full-body, three-quarter view and back view standing side by side, flat warm-white background, soft top-side lighting, no hard shadows, 2D animation model sheet, clean line art, flat colors with subtle watercolor bleed, restrained detail, production-ready consistency --ar 3:2 --style raw`,
  meta:[['模型','Midjourney v6 / Seedream 4'],['比例','3:2'],['参考','--cref 角色定稿'],['用途','立绘 / 参考图'],['输出','三视图合板']],
  negative:'多余肢体，畸形爪子，拟人化服饰，卡通大眼，毛发碎噪，背景杂物，文字，水印，签名',
  related:['CH-06','VD-03','PR-02']
},
{
  id:'CH-02', cat:'character', project:'编灵',
  title:'篾匠老人 · 陈守拙 半身像',
  summary:'七十岁竹编匠人，指节粗大、指甲嵌竹青，侧逆光从竹帘缝隙进入，35mm 纪实质感。',
  tags:['人像','纪实','侧逆光','老年'],
  zh:`七十岁竹编匠人半身肖像，皮肤黝黑，指节粗大变形，指甲缝里嵌着竹青；穿洗旧的靛蓝对襟褂子，肩头落着竹屑；坐在竹影斑驳的作坊里，侧逆光从右侧竹帘缝隙进入，面部一半在光一半在影；35mm 纪实摄影质感，浅景深，肤色真实有毛孔，不过度磨皮，眼神向下看向手中的活计。`,
  en:`half-body portrait of a 70-year-old bamboo weaving craftsman, weathered dark skin, enlarged knuckles, bamboo-green stains under the nails, faded indigo mandarin-collar jacket dusted with bamboo shavings, sitting in a workshop with dappled bamboo shadows, side-backlight through bamboo blinds from the right, face half lit and half in shadow, 35mm documentary photography look, shallow depth of field, realistic skin with visible pores, no beauty retouching, gaze down toward his work --ar 4:5 --style raw`,
  meta:[['模型','Midjourney v6'],['比例','4:5'],['光位','侧逆光 45° 右上'],['用途','角色定妆 / 海报'],['注意','禁止磨皮']],
  negative:'塑料皮肤，过度磨皮，油光，年轻化，西式服装，失焦眼睛，多余手指，水印，文字',
  related:['VD-02','SC-02','PR-01']
},
{
  id:'CH-03', cat:'character', project:'三分钟，三年',
  title:'老周 · 幸存者特写',
  summary:'五十岁男性胸像，眉骨旧疤、眼底血丝，仅一盏应急灯从下方打亮下颌，冷调胶片颗粒。',
  tags:['胸像','底光','末日','胶片'],
  zh:`五十岁男性幸存者特写胸像，络腮胡茬，右眉骨一道旧疤，眼底血丝，额头有汗与灰；穿磨破的深灰工装外套，领口翻起；冷调环境光，仅一盏应急灯从下方打亮下颌，形成不安的底光；画面颗粒感强，胶片噪点明显，色彩低饱和偏青灰，情绪疲惫但警觉，嘴唇干裂，视线略微偏离镜头。`,
  en:`close-up chest-up portrait of a 50-year-old male survivor, stubble beard, old scar on the right brow bone, bloodshot eyes, sweat and ash on the forehead, torn dark-grey work jacket with a raised collar, cold ambient light, a single emergency lamp lighting the jaw from below for an uneasy under-light, heavy film grain, desaturated teal-grey grade, exhausted but alert, chapped lips, gaze slightly off camera --ar 4:5 --style raw`,
  meta:[['模型','Midjourney v6'],['比例','4:5'],['光位','底光 / 单光源'],['影调','低饱和青灰'],['用途','角色定妆']],
  negative:'干净皮肤，微笑，明亮均匀光，暖色调，美颜，塑料质感，多余光源，水印',
  related:['SC-05','PR-04','VD-05']
},
{
  id:'CH-04', cat:'character', project:'三分钟，三年',
  title:'小鹿 · 少女角色设定',
  summary:'十六岁，湿发贴颊、嘴唇干裂、眼神警惕，大一号冲锋衣，写实动画设定稿，不做美型。',
  tags:['三视图','少女','写实','设定稿'],
  zh:`十六岁少女角色设计，齐肩短发被雨水打湿贴在脸颊，嘴唇干裂，眼神警惕；穿大一号的军绿色冲锋衣、袖口卷起，背一个褪色帆布包；三视图立绘（正 / 四分之三侧 / 背），纯灰背景，柔和均匀光；写实动画电影角色设定稿质感，比例自然，不做美型处理，服装有明显使用痕迹与泥点。`,
  en:`16-year-old girl character design, shoulder-length hair soaked and stuck to her cheek by rain, chapped lips, wary eyes, oversized army-green shell jacket with rolled cuffs, faded canvas backpack, three-view turnaround (front, three-quarter, back) on neutral grey, soft even lighting, realistic animated-feature character sheet, natural proportions, no glamorization, visible wear and mud on the clothing --ar 3:2 --style raw`,
  meta:[['模型','Seedream 4 / MJ v6'],['比例','3:2'],['用途','角色设定 / 三视图'],['风格','写实动画']],
  negative:'网红脸，大眼滤镜，干净崭新的衣服，暴露服装，日系萌系，多余手指，背景道具，文字',
  related:['CH-05','VD-07','ST-02']
},
{
  id:'CH-05', cat:'character', project:'三分钟，三年',
  title:'阿凯 · 青年角色设定',
  summary:'寸头、左臂脏绷带、多口袋马甲，重心前压的放松站姿，硬侧光勾轮廓。',
  tags:['三视图','青年','动作型','硬光'],
  zh:`二十四岁青年男性角色设计，寸头，左前臂缠着脏绷带，右手戴露指手套，T 恤外罩一件多口袋马甲，腰间挂工具袋；站姿放松但重心前压，随时可以启动；三视图立绘，纯灰背景，硬朗侧光勾勒轮廓；写实动画设定稿，肌肉量适中，不夸张，衣服有灰尘与磨损。`,
  en:`24-year-old male character design, buzz cut, dirty bandage wrapped around the left forearm, fingerless glove on the right hand, multi-pocket vest over a t-shirt, tool pouch at the waist, relaxed stance with weight forward, ready to move; three-view turnaround on neutral grey, hard side light carving the silhouette, realistic animation model sheet, moderate build, no exaggeration, dust and abrasion on the clothes --ar 3:2 --style raw`,
  meta:[['模型','Seedream 4 / MJ v6'],['比例','3:2'],['光位','硬侧光 90°'],['用途','角色设定 / 三视图']],
  negative:'肌肉夸张，超级英雄体态，干净服装，笑脸，卡通比例，多余手指，背景杂物，水印',
  related:['CH-04','VD-07','PR-04']
},
{
  id:'CH-06', cat:'character', project:'通用',
  title:'角色表情九宫格',
  summary:'3×3 统一机位表情表，九种情绪靠眼周与嘴角推动，不用夸张眉毛，一次生成后切片。',
  tags:['九宫格','表情','一致性','通用'],
  zh:`同一角色的九宫格表情设定，3×3 排列，正面胸像，九个格子统一机位、统一光位、统一色温；九个表情依次为：平静、警觉、错愕、隐忍的愤怒、克制的笑、疲惫、悲伤、决绝、释然；表情差异靠眼周与嘴角肌肉推动，不靠夸张眉毛；纯灰背景，无配饰遮挡面部，每格留白一致。`,
  en:`3x3 expression sheet of one character, front chest-up, identical camera position, light direction and color temperature across all nine cells; expressions in order: calm, alert, startled, restrained anger, subtle smile, exhaustion, grief, resolve, acceptance; expression driven by periocular and mouth muscles rather than exaggerated brows; neutral grey background, no accessories covering the face, consistent margins per cell --ar 1:1 --style raw`,
  meta:[['模型','Midjourney v6 / 即梦'],['比例','1:1'],['网格','3×3'],['用途','表情库 / 切片复用']],
  negative:'夸张眉毛，卡通表情符号，换脸，服装变化，背景变化，光照不一致，文字标注，水印',
  related:['CH-01','CH-04','SC-06']
},

/* ---------------- 场景 ---------------- */
{
  id:'SC-01', cat:'scene', project:'编灵',
  title:'蜀南竹海 · 晨雾全景',
  summary:'航拍万亩竹林，雾气在谷间流动，远山三重轮廓，上方留三分之一给字幕。',
  tags:['航拍','晨雾','大全景','留白'],
  zh:`航拍视角的蜀南竹海清晨，万亩竹林成海，雾气在山谷间缓慢流动，远山只露三重轮廓；天空为极淡的青白色，光线是日出前十分钟的漫射冷光；画面上方三分之一留空给字幕；摄影级景深，远处雾气自然衰减；不要出现建筑、电线与人物。`,
  en:`aerial view of the Shunan bamboo sea at dawn, ten thousand acres of bamboo forming an ocean, mist drifting slowly between valleys, three receding ridgelines fading into distance, pale cyan-white sky, diffuse cold light ten minutes before sunrise, upper third of the frame left empty for titles, photographic depth falloff, natural atmospheric haze, no buildings, power lines or people --ar 16:9 --style raw`,
  meta:[['模型','Midjourney v6'],['比例','16:9'],['时间','日出前 10 分钟'],['用途','开篇空镜 / 首帧'],['下游','VD-01']],
  negative:'建筑，电线，游客，饱和绿色，正午硬光，锐利边缘，HDR 过度，水印，文字',
  related:['VD-01','ST-03','SC-03']
},
{
  id:'SC-02', cat:'scene', project:'编灵',
  title:'竹编工坊 · 内景',
  summary:'夯土墙、木梁、亮瓦漏下光柱，墙上挂满篾刀与半成品，24mm 低机位纵深。',
  tags:['内景','光柱','作坊','24mm'],
  zh:`老式竹编作坊内景，夯土墙、木梁，屋顶一片亮瓦漏下一道光柱；墙上挂满篾刀、竹尺与半成品竹器；地面堆着剖好的篾条，空气里有细尘；午后斜光从侧门进入，在墙上切出暖色梯形光斑；24mm 广角，略低机位，纵深感强，画面左下角留出人物站立位置。`,
  en:`interior of an old bamboo weaving workshop, rammed-earth walls and timber beams, a single glass roof tile casting a light shaft, walls hung with splitting knives, bamboo rulers and unfinished baskets, split strips piled on the floor, fine dust in the air, afternoon light entering from a side door and cutting a warm trapezoid on the wall, 24mm wide angle, slightly low camera, strong depth, clear standing space in the lower left of the frame --ar 16:9 --style raw`,
  meta:[['模型','Midjourney v6'],['比例','16:9'],['镜头','24mm 广角'],['用途','主场景 / 调度空间'],['下游','VD-02 / VD-03']],
  negative:'现代家具，水泥地，LED 冷光，杂乱电线，人物，过曝，广角畸变过度，文字',
  related:['CH-02','VD-02','PR-02']
},
{
  id:'SC-03', cat:'scene', project:'编灵',
  title:'竹林 · 夜雨',
  summary:'只有一盏手提马灯，雨丝在光锥里可见，80% 画面沉在墨绿与黑里。',
  tags:['夜戏','雨','单光源','高对比'],
  zh:`夜雨中的竹林，竹竿被雨水淋得发亮，只有一盏手提马灯提供暖黄光源，雨丝在光锥中清晰可见；地面是泥与水洼，倒影破碎；画面 80% 为深墨绿与黑色，暖光集中在画面右上方；高对比、湿润质感，不要月光铺满，不要蓝色冷调。`,
  en:`bamboo grove in night rain, glossy wet culms, a single hand-held storm lantern as the only warm light source, rain streaks visible inside the light cone, muddy ground with broken reflections in puddles, eighty percent of the frame in deep ink-green and black, warm light concentrated upper right, high contrast, wet surfaces, no moonlight flooding the scene, no cool blue grade --ar 16:9 --style raw`,
  meta:[['模型','Midjourney v6'],['比例','16:9'],['光源','马灯 / 实用光源'],['影调','深墨绿 + 暖黄'],['用途','情绪段落']],
  negative:'月光铺满，冷蓝色调，干燥地面，均匀照明，多人光源，雾气过重，文字',
  related:['SC-01','VFX-02','CH-01']
},
{
  id:'SC-04', cat:'scene', project:'三分钟，三年',
  title:'废弃地铁站 · 站台',
  summary:'末日后第 900 天，只剩三盏灯在闪，轨道积黑水、车厢歪斜，16mm 对称构图。',
  tags:['末日','废墟','对称','冷青'],
  zh:`末日后第 900 天的地下地铁站，站台灯只剩三盏在闪，广告灯箱碎裂、海报卷边；轨道里积着黑水，停着一列歪斜的车厢，车窗全碎；空气中有可见尘埃，地面散落纸张与一只倒下的行李箱；16mm 广角，正面对称构图，冷青色调，唯一暖色来自应急指示灯。`,
  en:`underground subway station on day 900 after the collapse, only three platform lights still flickering, shattered ad light boxes with curling posters, black water pooled in the track bed, a tilted train car with all windows blown out, visible dust in the air, scattered paper and one fallen suitcase on the floor, 16mm wide angle, frontal symmetrical composition, cold cyan grade, sole warm accent from emergency exit signage --ar 16:9 --style raw`,
  meta:[['模型','Midjourney v6'],['比例','16:9'],['镜头','16mm 对称'],['用途','主场景 / 建立镜头'],['下游','VD-06 / VD-07']],
  negative:'干净整洁，乘客，明亮照明，暖色调，现代广告，霓虹灯，人群，文字水印',
  related:['VD-06','VD-07','ST-02']
},
{
  id:'SC-05', cat:'scene', project:'三分钟，三年',
  title:'防空洞 · 临时居所',
  summary:'渗水混凝土、不稳的灯管、木箱与铺盖，人物不在画面内，只留生活痕迹。',
  tags:['内景','低照度','生活痕迹','浅景深'],
  zh:`狭窄的防空空洞内景，混凝土墙面渗水、有霉斑，顶部一根裸露的灯管发出不稳定白光；靠墙一排旧木箱与铺盖，一张折叠桌上放着半瓶水与摊开的地图；人物不在画面内，只留生活痕迹；低机位，浅景深，前景是被虚化的铁门框，画面压抑但有序。`,
  en:`cramped air-raid shelter interior, seeping concrete walls with mold stains, a bare fluorescent tube overhead emitting unstable white light, a row of old wooden crates and bedrolls along the wall, a folding table with a half-empty water bottle and an open map, no people in frame, only traces of habitation, low angle, shallow depth of field, blurred steel door frame in the foreground, oppressive yet orderly --ar 16:9 --style raw`,
  meta:[['模型','Midjourney v6'],['比例','16:9'],['光源','实用灯管'],['用途','角色戏空间'],['下游','CH-03']],
  negative:'宽敞空间，现代装修，阳光，植物，干净墙面，人物，暖色调，文字',
  related:['CH-03','PR-03','ST-02']
},
{
  id:'SC-06', cat:'scene', project:'通用',
  title:'场景九宫格 · 多机位定妆',
  summary:'同一场景 3×3 九机位，同时间同光位同陈设，作为「多参」里的场景参考图。',
  tags:['九宫格','多机位','参考图','通用'],
  zh:`同一场景的九宫格多机位定妆图，3×3 排列；九个机位分别为：超广角大全景、正面中景、45 度侧中景、低角度仰拍、高角度俯拍、过肩视角、局部特写（材质细节）、背身反向视角、极致远景剪影；九个格子必须保持同一时间、同一光照方向、同一色温、同一美术陈设；每格右下角标注机位编号。`,
  en:`3x3 multi-angle location scout sheet of one scene, nine cameras: ultra-wide establishing, front medium, 45-degree medium, low-angle up, high-angle down, over-the-shoulder, material detail close-up, reverse back view, extreme wide silhouette; identical time of day, light direction, color temperature and set dressing across all cells, camera index printed in each cell's lower right corner --ar 1:1 --style raw`,
  meta:[['模型','Midjourney v6 / Seedream 4'],['比例','1:1'],['网格','3×3'],['用途','场景多参 / 定妆'],['提示','九宫格不是首尾帧']],
  negative:'时间不一致，光照方向变化，陈设改变，人物重复，机位重复，编号缺失，文字错乱',
  related:['SC-02','SC-04','CH-06']
},

/* ---------------- 道具 ---------------- */
{
  id:'PR-01', cat:'prop', project:'编灵',
  title:'篾刀与青篾',
  summary:'用了三十年的篾刀配一束刚剖好的青篾，刀刃有磨痕缺口，篾条薄至透光。',
  tags:['特写','材质','工具','暖调'],
  zh:`道具特写：一把用了三十年的篾刀与一束刚剖好的青篾，放在粗布上；刀刃有细密磨痕与几处缺口，木柄被手汗浸成深褐；篾条薄至透光，边缘带纤维毛刺；顶部柔光加左侧反光板，浅景深，材质优先，白平衡偏暖，背景保持暗调。`,
  en:`prop close-up: a splitting knife used for thirty years and a bundle of freshly split green bamboo strips on coarse linen, fine grinding marks and a few nicks on the blade, handle darkened by years of hand sweat, strips thin enough to transmit light with fibrous burrs along the edges, soft top light with a left bounce card, shallow depth of field, material-first, warm white balance, dark background --ar 4:3 --style raw`,
  meta:[['模型','Midjourney v6'],['比例','4:3'],['光位','顶光 + 左反光板'],['用途','插入特写 / 手部道具'],['下游','VD-02']],
  negative:'崭新刀具，塑料手柄，不锈钢反光过强，干净无痕，多只手，水印，文字',
  related:['CH-02','VD-02','PR-02']
},
{
  id:'PR-02', cat:'prop', project:'编灵',
  title:'编到一半的六角孔竹篮',
  summary:'篮口篾条未收边向外翘起，工作台上散落三根篾条与竹尺，45° 侧光强调交叠。',
  tags:['半成品','编织','侧光','工艺'],
  zh:`一只编到一半的六角孔竹篮，篮口篾条尚未收边、向外翘起；放在木质工作台上，旁边散落三根篾条与一把竹尺；背景是虚化的作坊；45 度侧光，突出编织的交叠层次与竹材由青到黄的渐变；画面有明确的"未完成"感。`,
  en:`half-woven hexagonal bamboo basket with unfinished rim strips fanning outward, on a wooden workbench with three loose strips and a bamboo ruler beside it, workshop blurred behind, 45-degree side light emphasizing the layered weave and the green-to-yellow gradient of the bamboo, a clear sense of work-in-progress --ar 4:3 --style raw`,
  meta:[['模型','Midjourney v6'],['比例','4:3'],['光位','侧光 45°'],['用途','道具主图 / 转场落点'],['下游','VD-04']],
  negative:'成品完整，对称完美，塑料质感，工业制品，干净桌面，人物，文字',
  related:['PR-01','VD-04','SC-02']
},
{
  id:'PR-03', cat:'prop', project:'三分钟，三年',
  title:'老式晶体管收音机',
  summary:'1980 年代国产机型，外壳发黄有裂，旋钮磨白，窗台上落灰、被手指抹出一道痕。',
  tags:['年代感','微距','灰尘','关键道具'],
  zh:`一台 1980 年代国产晶体管收音机，米黄塑料外壳已经发黄、右上角有一道裂痕，旋钮磨损发白，拉杆天线第二节弯折；放在水泥窗台上，表面一层薄灰，刻度盘上有一道被手指抹出的干净痕迹；暖侧光，微距质感，年代感强烈，背景为虚化的窗外。`,
  en:`1980s Chinese transistor radio, yellowed beige plastic shell with a crack at the upper right corner, worn pale knobs, second segment of the telescopic antenna bent, sitting on a concrete windowsill under a thin layer of dust with one clean finger swipe across the dial, warm side light, macro texture, strong period feel, blurred window behind --ar 4:3 --style raw`,
  meta:[['模型','Midjourney v6'],['比例','4:3'],['光位','暖侧光'],['用途','关键道具 / 叙事锚点'],['下游','VD-05']],
  negative:'现代音响，蓝牙音箱，崭新外壳，干净无灰，彩色屏幕，塑料假质感，文字水印',
  related:['VD-05','SC-05','ST-01']
},
{
  id:'PR-04', cat:'prop', project:'三分钟，三年',
  title:'手摇发电手电',
  summary:'墨绿金属壳、橡胶握把老化开裂，手电本身是画面唯一光源，光束里有浮尘。',
  tags:['单光源','暗场','生存装备','质感'],
  zh:`老式手摇发电手电筒，墨绿金属壳、握把橡胶老化开裂，侧面有手摇曲柄；灯头玻璃有划痕，正在发光，光束中浮着尘埃；暗环境，画面唯一光源为手电本身，冷白光，边缘轻微紫边；手持视角，背景完全沉黑。`,
  en:`vintage hand-crank flashlight, dark green metal body, cracked aging rubber grip, side crank handle, scratched lens glass, switched on with dust floating in the beam, dark environment where the flashlight is the only light source, cool white with slight purple fringing, handheld point of view, background falling to pure black --ar 4:3 --style raw`,
  meta:[['模型','Midjourney v6'],['比例','4:3'],['光源','手电本体'],['用途','光源道具 / 紧张段落']],
  negative:'现代 LED 手电，金属崭新，环境光过亮，彩色光，塑料感，多余手，文字',
  related:['CH-03','CH-05','VFX-02']
},
{
  id:'PR-05', cat:'prop', project:'通用',
  title:'产品级道具白底图',
  summary:'单个道具无缝白底、45° 正面、三点布光、柔和接触阴影，做资产卡用。',
  tags:['白底','三点布光','资产卡','通用'],
  zh:`单个道具的产品级白底图，正面 45 度视角，纯白无缝背景，三点布光（主光右上、辅光左侧、轮廓光后方），道具居中占画面 60%，底部接触阴影柔和真实，材质反射准确；不要任何装饰、手部与文字，边缘干净可直接抠图。`,
  en:`product-grade isolated prop shot on seamless white, 45-degree front view, three-point lighting (key upper right, fill left, rim behind), object centered at sixty percent of the frame, soft realistic contact shadow, accurate material reflections, no decoration, hands or text, clean edges ready for masking --ar 1:1 --style raw`,
  meta:[['模型','Midjourney v6 / Seedream 4'],['比例','1:1'],['布光','三点布光'],['用途','资产卡 / 道具库']],
  negative:'彩色背景，投影过硬，装饰道具，手部，文字标签，多物体，反光过曝，边缘发虚',
  related:['PR-01','PR-03','CH-01']
},

/* ---------------- 视频 ---------------- */
{
  id:'VD-01', cat:'video', project:'编灵',
  title:'竹叶穿林 · 前推上摇',
  summary:'12 秒单镜头，人眼高度前推穿林，穿过密竹后豁然开朗，末段减速上摇停在逆光竹梢。',
  tags:['12秒','前推','上摇','空镜'],
  zh:`12 秒单镜头。0-3s：镜头在竹林中以人眼高度平稳前推，竹叶从画面前景快速划过；3-7s：穿过一丛密竹，画面短暂被竹叶遮挡后豁然开朗，露出远处起伏的竹海；7-12s：镜头减速并轻微上摇，停在一片逆光的竹梢上，光斑在镜头里形成柔和眩光。全程无剪辑，速度曲线为慢—快—极慢，无人物，环境音为竹叶摩擦与远处鸟鸣。`,
  en:`single 12-second shot. 0-3s: steady eye-level push forward through bamboo, leaves sweeping past the foreground; 3-7s: pass through a dense cluster, frame briefly occluded then opens onto a rolling bamboo sea; 7-12s: decelerate and tilt up slightly, settling on backlit bamboo tips with soft lens flare. No cuts, speed curve slow-fast-very slow, no characters, ambience of rustling leaves and distant birds`,
  meta:[['时长','12s'],['运镜','前推 + 上摇'],['首帧参考','SC-01'],['节奏','慢—快—极慢'],['平台','Seedance 2.5 / 可灵']],
  negative:'剪辑切换，人物出现，速度突变，镜头抖动，镜头拉远，饱和绿色，画面闪烁',
  related:['SC-01','CM-01','VFX-02']
},
{
  id:'VD-02', cat:'video', project:'编灵',
  title:'手指翻篾 · 微距特写',
  summary:'固定机位微距，手在画面中央编篾，中段焦点从篾条拉到到手背，末段刮边落屑。',
  tags:['12秒','微距','焦点拉动','手部'],
  zh:`12 秒特写镜头，固定机位微距。老人双手在画面中央编织，篾条在指间以固定节奏交错、压紧、翻转；0-4s 只拍手与篾条的局部，4-8s 焦点从前景篾条缓慢拉到手背（焦点拉动，不是变焦），8-12s 一只手拿起篾刀轻刮篾边，竹屑落下。浅景深，背景完全虚化，只有手与竹是实的；不要出现面部，动作连续不中断。`,
  en:`12-second macro close-up on a locked-off camera. Hands weave at frame center, strips crossing, pressing and turning in a steady rhythm; 0-4s hands and strips only; 4-8s rack focus from the foreground strips to the back of the hand (focus pull, not zoom); 8-12s one hand lifts the knife and scrapes a strip edge, shavings falling. Shallow depth of field, background fully blurred, only hands and bamboo sharp, no face, continuous motion without interruption`,
  meta:[['时长','12s'],['运镜','固定 + 焦点拉动'],['景别','大特写'],['参考','PR-01'],['平台','Seedance 2.5']],
  negative:'面部出现，变焦推拉，手部畸形，多余手指，动作跳帧，篾条穿模，背景清晰，镜头移动',
  related:['CH-02','PR-01','VFX-01']
},
{
  id:'VD-03', cat:'video', project:'编灵',
  title:'猫跃过竹匾 · 慢动作落点',
  summary:'12 秒：蹲伏—0.5 倍慢动作起跳—落在竹匾上回弹—回头抖耳舔爪，重力真实。',
  tags:['12秒','慢动作','动物','落点'],
  zh:`12 秒。0-2s：狸花猫蹲在作坊门槛上，尾巴轻摆，视线锁定前方；2-6s：起跳，慢动作 0.5 倍，身体在空中舒展，前爪先落；6-9s：落在铺满篾条的竹匾上，竹匾轻微下陷、篾条弹动；9-12s：猫回头看向镜头，耳朵抖了一下，随即低头舔爪。跟拍加落点固定的双机位感，动作连贯无跳帧，重力与惯性真实，毛发在落地时有轻微延迟。`,
  en:`12 seconds. 0-2s: tabby cat crouched on the workshop threshold, tail flicking, gaze locked ahead; 2-6s: leap in 0.5x slow motion, body extended mid-air, forepaws landing first; 6-9s: lands on a bamboo tray covered with strips, tray flexes and strips spring; 9-12s: cat turns to camera, ear twitch, then grooms a paw. Follow plus fixed landing camera feel, continuous motion without frame jumps, believable gravity and inertia, slight fur lag on impact`,
  meta:[['时长','12s'],['动作','起跳 / 落地'],['速度','0.5× 慢动作'],['参考','CH-01 / PR-02'],['平台','Seedance 2.5']],
  negative:'毛发糊成块，腿部穿插，落地无重量，动作加速跳帧，多出一条尾巴，背景纹理爬行，镜头晃动',
  related:['CH-01','PR-02','NG-02']
},
{
  id:'VD-04', cat:'video', project:'编灵',
  title:'竹篮成形 · 逐层生长',
  summary:'12 秒延时感：篾条逐层长出、末三根收边、镜头上升转俯拍，全程只有一次机位上移。',
  tags:['12秒','延时','生长','俯拍'],
  zh:`12 秒。0-5s：延时摄影感，编到一半的竹篮在固定机位下逐层长出篾条，编织过程以每秒约八层的节奏推进（可用延时拍摄或生成式生长）；5-9s：最后三根篾条收边，手指压紧，篮口收紧；9-12s：镜头缓缓上升到俯拍，竹篮完整呈现，光从上方均匀落下，桌面尘埃在光里浮动。整个过程机位只有一次上移，无剪辑，不要出现第二只手。`,
  en:`12 seconds. 0-5s: time-lapse feel, the half-woven basket grows layer by layer in a locked frame at roughly eight layers per second; 5-9s: the final three strips close the rim, fingers press them tight; 9-12s: camera rises slowly to a top-down view of the finished basket, even light from above, dust drifting in it. Only one camera move, no cuts, never show a second pair of hands`,
  meta:[['时长','12s'],['运镜','固定 + 上升俯拍'],['技法','延时 / 生成式生长'],['参考','PR-02'],['平台','Seedance 2.5']],
  negative:'手部增生，篾条穿模，编织顺序错乱，画面闪烁，光位变化，桌面纹理爬行，镜头二次移动',
  related:['PR-02','SC-02','VFX-01']
},
{
  id:'VD-05', cat:'video', project:'三分钟，三年',
  title:'收音机电流声渐起',
  summary:'12 秒声音先行：黑场只有电流沙沙，刻度盘浮出、指针滑停、杂音被压掉只剩童声哼唱。',
  tags:['12秒','声音先行','特写','悬念'],
  zh:`12 秒。黑场起，0-3s 只有声音：电流的沙沙声由远及近；3-6s 画面从黑中缓慢浮出一台老收音机的调频刻度盘，指针在频段间滑动，暖黄背光；6-9s 指针停住，杂音突然被压掉，只剩一段极微弱的童声哼唱；9-12s 镜头轻推到刻度盘数字上，数字在轻微闪烁。全片低照度，颗粒明显，无人物，镜头只做一次极轻的推近。`,
  en:`12 seconds. Opens on black, 0-3s audio only: static hiss approaching from far; 3-6s the frame slowly emerges on a vintage radio tuning dial, needle sliding across bands under warm amber backlight; 6-9s the needle stops, static cuts out leaving only a faint child's humming; 9-12s slight push-in on the dial numbers as they flicker. Low-key lighting throughout, visible grain, no characters, only one very subtle push`,
  meta:[['时长','12s'],['声音','电流 → 静默 → 哼唱'],['运镜','极轻推近'],['参考','PR-03'],['平台','Seedance 2.5 / Veo']],
  negative:'人脸出现，明亮照明，彩色画面，指针乱跳，刻度文字崩坏，镜头大幅移动，音乐过响',
  related:['PR-03','SC-05','VFX-03']
},
{
  id:'VD-06', cat:'video', project:'三分钟，三年',
  title:'地铁闸机 · 灯闪空镜',
  summary:'12 秒固定机位，只有最左一台闸机闪红；风卷纸张穿过闸机，末段绿灯一闪即灭。',
  tags:['12秒','空镜','固定机位','末日'],
  zh:`12 秒固定机位。废弃地铁站的进站闸机，三台机器中只有最左边一台的指示灯还在间歇闪红；0-4s 空镜，尘埃在光束中浮动；4-8s 一阵风从隧道方向吹来，卷起地面纸张，纸张打着旋穿过闸机；8-12s 闪红的那台机器突然亮起绿灯，又立刻熄灭，画面随之压暗。不要出现人影，画面内唯一运动是纸张、尘埃与灯光。`,
  en:`12-second locked-off shot. Subway fare gates in an abandoned station, only the leftmost unit still blinking red; 0-4s empty frame, dust floating in the light beam; 4-8s wind from the tunnel lifts papers off the floor, spiraling them through the gates; 8-12s the blinking unit flashes green once then dies, frame darkening with it. No human figures, the only motion is paper, dust and light`,
  meta:[['时长','12s'],['运镜','完全固定'],['参考','SC-04'],['节奏','静 → 动 → 骤停'],['平台','Seedance 2.5']],
  negative:'人物出现，镜头漂移，灯光常亮，纸张穿模，站台变干净，色温变化，画面闪烁',
  related:['SC-04','VD-07','ST-02']
},
{
  id:'VD-07', cat:'video', project:'三分钟，三年',
  title:'三人奔跑 · 一镜到底',
  summary:'12 秒低机位后退跟拍，立柱杂物掠过前景，小鹿绊倒被拽住不中断，末段仰拍剪影。',
  tags:['12秒','一镜到底','跟拍','手持'],
  zh:`12 秒一镜到底跟拍。低机位在三人侧前方后退跟拍，镜头与人物保持等距；三人从地铁站台跑向楼梯口，前景不断有立柱与散落杂物掠过形成遮挡；中途小鹿绊了一下被阿凯一把拽住，动作不中断；最后三人冲上楼梯，镜头停在楼梯底部向上仰拍，光从出口倾泻下来，人物变成剪影。手持轻微晃动，有呼吸感，不炫技，无变焦。`,
  en:`12-second oner. Low camera retreating ahead of three runners at constant distance, from platform to stairwell, pillars and debris sweeping the foreground as occlusions; Xiaolu stumbles mid-run, Akai catches her arm without breaking stride; they hit the stairs and the camera stops at the base tilting up, daylight pouring in, figures becoming silhouettes. Slight handheld breathing, no zoom, no showy moves`,
  meta:[['时长','12s'],['运镜','后退跟拍 + 仰拍'],['参考','SC-04 / CH-04 / CH-05'],['平台','Seedance 2.5 / Veo']],
  negative:'人物换脸，服装变化，腿部滑步，关节反向，镜头穿墙，速度突变，多人重影，剪辑切换',
  related:['CH-04','CH-05','SC-04']
},
{
  id:'VD-08', cat:'video', project:'通用',
  title:'一镜到底 · 通用运镜模板',
  summary:'12 秒四段式：贴地前推—90° 侧向弧线—升至肩高跟拍—越肩落在关键物件收尾。',
  tags:['12秒','模板','一镜到底','可替换'],
  zh:`12 秒一镜到底模板：0-3s 低机位贴近地面向前推进，建立空间；3-6s 镜头随主体转向，做一次 90 度侧向弧线绕行；6-9s 升起到主体肩高，转为跟拍；9-12s 越过主体肩膀向前，落在场景的关键物件上收尾。主体与场景可替换，运镜节奏固定，全程无剪辑，速度曲线为匀速—加速—减速。`,
  en:`12-second oner template: 0-3s low ground-level push to establish space; 3-6s camera turns with the subject into a 90-degree lateral arc; 6-9s rises to shoulder height and switches to follow; 9-12s passes over the shoulder and lands on a key object to close. Subject and location swappable, movement rhythm fixed, no cuts, speed curve steady-accelerate-decelerate`,
  meta:[['时长','12s'],['段落','4 段 × 3s'],['可替换','主体 / 场景 / 落点物件'],['用途','批量套用'],['平台','Seedance 2.5 / 可灵']],
  negative:'剪辑切换，镜头抖动，主体出画，落点物件不清，速度忽快忽慢，背景纹理爬行，人物变形',
  related:['CM-01','CM-02','NG-02']
},

/* ---------------- 风格 ---------------- */
{
  id:'ST-01', cat:'style', project:'编灵',
  title:'非遗纪实 · 胶片质感',
  summary:'Portra 400 色彩、暖肤色、暗部偏青、保留颗粒与光晕，把画面从「AI 味」拉回「拍到的」。',
  tags:['胶片','Portra400','颗粒','去AI味'],
  zh:`胶片质感：柯达 Portra 400 色彩倾向，暖调肤色，暗部轻微偏青；画面保留细密颗粒与轻微光晕，高光有柔和溢出；对比中等，不锐利；手持纪实摄影的轻微构图不完美。用于把生成图从"AI 味"压回"被拍下来的"。`,
  en:`film look: Kodak Portra 400 palette, warm skin tones, slightly cyan shadows, fine grain and gentle halation, soft highlight rolloff, medium contrast, not sharp, slightly imperfect handheld documentary framing. Use to pull AI images back toward "photographed" --style raw`,
  meta:[['类型','风格后缀'],['适用','Midjourney / 即梦'],['搭配','SC-02 / CH-02 / PR-03'],['强度','中']],
  negative:'过度锐化，HDR，塑料光泽，饱和失真，完美对称构图，商业棚拍感，AI 塑料皮肤',
  related:['CH-02','SC-02','PR-03']
},
{
  id:'ST-02', cat:'style', project:'三分钟，三年',
  title:'末日 · 冷灰低饱和',
  summary:'去饱和至 40%，水泥灰 + 铁锈红 + 脏黄，黑位抬高、高光压缩，加扫描线与镜头污渍。',
  tags:['末日','低饱和','冷灰','扫描线'],
  zh:`末日色调：整体去饱和至 40%，主色为水泥灰、铁锈红与应急灯的脏黄；黑位抬高（不纯黑），高光压缩；胶片颗粒加轻微横向扫描线；画面有灰尘感与镜头污渍。禁止鲜艳色与高饱和蓝，禁止干净的白色。`,
  en:`post-collapse grade: desaturated to forty percent, palette of concrete grey, rust red and dirty emergency-lamp yellow; lifted blacks, compressed highlights; film grain with faint horizontal scan lines, dusty atmosphere and lens smudges. No vivid colors, no saturated blue, no clean whites`,
  meta:[['类型','调色描述'],['适用','全片统一'],['搭配','SC-04 / SC-05 / CH-03'],['强度','强']],
  negative:'鲜艳色彩，高饱和蓝，纯黑死区，干净白色，暖阳，清澈天空，商业广告感',
  related:['SC-04','SC-05','CH-03']
},
{
  id:'ST-03', cat:'style', project:'编灵',
  title:'东方水墨 · 计白当黑',
  summary:'宣纸底、五层墨阶、湿笔渗化，主体只占三分之一偏右下，一点赭石点睛。',
  tags:['水墨','留白','宣纸','东方'],
  zh:`水墨质感：宣纸底纹，墨色由浓到淡五层过渡，湿笔边缘自然渗化；大量留白，主体只占画面三分之一且偏右下；不加彩色，只用一点极淡的赭石作点睛；构图遵循"计白当黑"，线条有书写性，不要矢量硬边。`,
  en:`ink-wash treatment: xuan paper texture, five tonal steps from dense to pale ink, wet-brush edges bleeding naturally, generous negative space with the subject occupying one third of the frame toward the lower right, monochrome with a single pale ochre accent, composing emptiness as form, calligraphic strokes, no vector-hard edges`,
  meta:[['类型','风格后缀'],['适用','片头 / 概念图'],['搭配','SC-01 / PR-02'],['强度','强']],
  negative:'矢量硬边，彩色渐变，写实照片质感，满构图，厚涂油画，锐利细节，霓虹色',
  related:['SC-01','SC-03','PR-02']
},
{
  id:'ST-04', cat:'style', project:'通用',
  title:'定格动画 · 黏土质感',
  summary:'指纹与手工不规则、哑光黏土与羊毛毡、小功率硬光、逐帧 boil 抖动。',
  tags:['定格','黏土','手工感','boil'],
  zh:`定格动画质感：角色与道具表面有指纹与轻微不规则的手工痕迹，材质为哑光黏土与羊毛毡；灯光为小功率硬光，产生明显但有柔边的影子；每帧有极轻微的位移抖动（boil 效果）；景深很浅，微缩模型感强。`,
  en:`stop-motion look: fingerprints and slight handmade irregularity on characters and props, matte clay and wool felt materials, small hard light sources casting distinct shadows with soft edges, subtle frame-to-frame boil, very shallow depth of field, strong miniature-set feel`,
  meta:[['类型','风格 / 材质'],['适用','短片 / 品牌片'],['搭配','PR-05 / CH-01'],['强度','强']],
  negative:'CG 光滑表面，超写实皮肤，锐利切线，大面积柔光，真实比例场景，金属反射',
  related:['CH-01','PR-05','ST-01']
},

/* ---------------- 镜头 ---------------- */
{
  id:'CM-01', cat:'camera', project:'通用',
  title:'运镜词库 · 可直接拼接',
  summary:'推拉摇移跟升降环绕手持，配速度曲线词，写视频提示词时的基础积木。',
  tags:['词库','运镜','拼接','通用'],
  zh:`常用运镜词（可直接拼接进提示词）：推（dolly in）、拉（dolly out）、摇（pan）、移（truck）、跟（follow）、升降（crane up/down）、环绕（orbit）、手持（handheld）、斯坦尼康（steadicam）、变焦（zoom，慎用）、焦点拉动（rack focus）、甩镜（whip pan）、俯冲（crash zoom）、一镜到底（oner）。配合速度曲线词：匀速 / 缓起缓停 / 加速 / 突然停住。`,
  en:`camera vocabulary: dolly in, dolly out, pan, truck, follow, crane up/down, orbit, handheld, steadicam, zoom (use sparingly), rack focus, whip pan, crash zoom, oner. Pair with speed curves: constant, ease in-out, accelerate, hard stop`,
  meta:[['类型','词库'],['用法','拼接进视频提示词'],['注意','一条只写 1-2 个运镜'],['平台','全平台']],
  negative:'（词库条目，无负面词）同时写多个互相冲突的运镜，例如推近 + 拉远',
  related:['VD-08','CM-02','VD-01']
},
{
  id:'CM-02', cat:'camera', project:'通用',
  title:'焦段与景别对照',
  summary:'14-24 空间压迫、35 纪实、50 对话、85 特写、135 情绪压缩，配景别用词。',
  tags:['焦段','景别','对照表','通用'],
  zh:`焦段与景别对照：14-24mm 大全景 / 空间关系（边缘畸变，适合环境压迫感）；35mm 中景 / 纪实视角（接近人眼）；50mm 中近景 / 人物对话；85mm 特写 / 背景压缩（人像最稳）；135mm 以上 情绪特写 / 强压缩；微距 材质细节。景别词：大远景、远景、全景、中景、中近景、近景、特写、大特写。`,
  en:`focal length vs shot size: 14-24mm extreme wide and spatial relation (edge distortion, environmental pressure); 35mm medium, documentary eye-level; 50mm medium close, dialogue; 85mm close-up with background compression, safest for faces; 135mm+ emotional close-up, strong compression; macro for material detail. Shot sizes: extreme wide, wide, full, medium, medium close, close, close-up, extreme close-up`,
  meta:[['类型','对照表'],['用法','决定景别与空间感'],['常见错误','特写却写广角'],['平台','全平台']],
  negative:'（对照表条目）在特写里要求 16mm 广角，在远景里要求强背景压缩',
  related:['CM-01','CM-03','VD-02']
},
{
  id:'CM-03', cat:'camera', project:'通用',
  title:'光源方位与时间词库',
  summary:'顺光平、45° 侧光塑形、侧逆勾轮廓、底光不安；配五个关键时间点。',
  tags:['光位','时间','词库','通用'],
  zh:`光源方位词库：顺光（平，交代信息）、侧光 45 度（塑形，最常用）、侧逆光（勾轮廓，出体积）、逆光（剪影 / 眩光）、顶光（压迫、眼下阴影）、底光（不安、恐怖）、窗光（自然、有方向）、实用光源（灯、火、屏幕，画面内可见）。时间词：日出前十分钟 / 黄金时刻 / 正午硬光 / 蓝调时刻 / 夜晚单光源。`,
  en:`light direction vocabulary: frontal (flat, informational), 45-degree side (shapes form, most used), side-back (rim and volume), backlight (silhouette and flare), top light (oppressive, under-eye shadows), under light (unease, horror), window light (natural, directional), practicals (lamps, fire, screens visible in frame). Times: ten minutes before sunrise, golden hour, hard noon, blue hour, night single source`,
  meta:[['类型','词库'],['用法','与场景词组合'],['要点','一部片子锁 1 个主光位'],['平台','全平台']],
  negative:'（词库条目）同时要求顺光与逆光，同时要求正午硬光与蓝调时刻',
  related:['CM-02','SC-03','CH-03']
},

/* ---------------- 特效 ---------------- */
{
  id:'VFX-01', cat:'vfx', project:'编灵',
  title:'竹屑与细尘 · 漂浮粒子',
  summary:'近大虚远小实、布朗漂移带上浮，只在光束内可见，密度低不挡脸。',
  tags:['粒子','氛围','光束内','叠加层'],
  zh:`特效层：空气中缓慢飘浮的竹屑与细尘，颗粒大小不均，近处大而虚、远处小而实；运动为布朗式随机漂移加微弱上升气流；只在光束区域内被照亮，光外不可见；密度低，不遮挡主体面部。`,
  en:`VFX layer: bamboo shavings and fine dust drifting slowly in the air, uneven particle sizes, large and soft near camera, small and crisp far away, Brownian random drift with a slight updraft, visible only inside light shafts and invisible outside them, low density, never covering the subject's face`,
  meta:[['类型','叠加特效'],['叠加方式','Screen / 滤色'],['密度','低'],['搭配','SC-02 / VD-02 / VD-04']],
  negative:'粒子过密，糊住画面，均匀分布的假粒子，闪烁噪点，彩色颗粒，粒子穿脸，塑料感',
  related:['SC-02','VD-02','VD-04']
},
{
  id:'VFX-02', cat:'vfx', project:'通用',
  title:'丁达尔光柱 · 体积光',
  summary:'上方斜切、柔边、内部有体积与流动尘埃，落点形成椭圆光斑，色温约 4200K。',
  tags:['体积光','丁达尔','光柱','氛围'],
  zh:`特效层：从画面上方斜切进来的丁达尔光柱，边缘柔和、内部有体积感与缓慢流动的尘埃；光柱与地面或桌面相交处形成椭圆光斑；色温偏暖（约 4200K），强度随高度衰减；不要出现人造的明显分界线。`,
  en:`VFX layer: volumetric god rays slanting in from the top of frame, soft edges, visible internal volume with slowly drifting dust, an elliptical pool where the shaft meets the floor or tabletop, warm temperature around 4200K, intensity falling off with height, no artificial hard boundary lines`,
  meta:[['类型','光照特效'],['色温','4200K'],['叠加','Screen / 加色'],['搭配','SC-02 / SC-03 / PR-04']],
  negative:'硬边光柱，纯白死白，彩虹光斑，光源位置错乱，光柱穿过实体，过于均匀',
  related:['SC-02','SC-03','VFX-01']
},
{
  id:'VFX-03', cat:'vfx', project:'三分钟，三年',
  title:'信号干扰 · 撕裂转场',
  summary:'横向撕裂 12-20 条带、逐帧跳动、模拟噪点与色差，0.5 秒后收成白线再展开。',
  tags:['转场','故障感','色差','扫描线'],
  zh:`转场特效：画面被横向撕裂成 12-20 条带，各条带位移不一、逐帧跳动；叠加模拟信号噪点、色差（红蓝分离）与扫描线；持续 0.4-0.6 秒后收束为一条白线再展开为下一画面；声音配合电流爆音。用于两场之间的硬切替代。`,
  en:`transition effect: frame torn into 12-20 horizontal bands displaced unevenly and jittering frame to frame, overlaid analog noise, chromatic aberration and scan lines, lasting 0.4-0.6 seconds then collapsing into a single white line that opens into the next shot, paired with a burst of electrical static. Replaces hard cuts between scenes`,
  meta:[['类型','转场'],['时长','0.4-0.6s'],['声音','电流爆音'],['搭配','VD-05 / VD-06 / VD-07']],
  negative:'彩色故障，彩虹噪声，转场过长，画面糊成一片，音频不同步，闪烁刺眼',
  related:['VD-05','VD-06','ST-02']
},

/* ---------------- 负面 ---------------- */
{
  id:'NG-01', cat:'negative', project:'通用',
  title:'通用负面提示词 · 图',
  summary:'手部、面部、塑料皮肤、水印、透视、比例问题的通用封堵清单。',
  tags:['负面','手部','去水印','通用'],
  zh:`通用负面提示词：多余手指、畸形手部、肢体融合、面部不对称、双头、多肢、塑料感皮肤、过度磨皮、油腻高光、塑料质感、水印、文字、签名、logo、边框、低分辨率、模糊、噪点过多、过曝、死黑、色彩溢出、透视错误、比例失调、背景杂乱、重复图案、AI 塑料光泽。`,
  en:`generic negative prompt: extra fingers, deformed hands, fused limbs, asymmetric face, two heads, duplicate limbs, plastic skin, over-smoothed skin, greasy highlights, plastic material, watermark, text, signature, logo, border, low resolution, blurry, excessive noise, overexposed, crushed blacks, color clipping, wrong perspective, bad proportions, cluttered background, repeating patterns, AI plastic sheen`,
  meta:[['类型','负面词'],['用法','追加在提示词末尾'],['平台','MJ --no / 即梦'],['强度','通用']],
  negative:'（本条即负面词本身）',
  related:['NG-02','CH-01','PR-05']
},
{
  id:'NG-02', cat:'negative', project:'通用',
  title:'视频运动崩坏 · 修复指令',
  summary:'变形、穿模、纹理爬行、跳帧、滑步逐条封堵，并锁定首帧外观一致性。',
  tags:['负面','视频','修复','一致性'],
  zh:`视频负面 / 修复指令：避免五官在运动中变形、避免肢体穿插与关节反向、避免背景纹理爬行（texture crawl）、避免物体凭空出现或消失、避免速度突变与跳帧、避免镜头无理由抖动、避免人物走路滑步、避免手部与道具粘连。修复时补一句："保持首帧人物外观与服装在整段内完全一致。"`,
  en:`video negative / repair: avoid facial warp during motion, limb interpenetration, reversed joints, background texture crawl, objects popping in or out, abrupt speed changes and frame jumps, unmotivated camera shake, foot sliding, hands merging with props. For repair, append: "keep the character's appearance and wardrobe identical to the first frame for the entire clip"`,
  meta:[['类型','负面 / 修复'],['用法','每次视频生成都带上'],['要点','锁首帧一致性'],['平台','Seedance / 可灵 / Veo']],
  negative:'（本条即负面指令本身）',
  related:['VD-03','VD-07','VD-08']
}
];;
