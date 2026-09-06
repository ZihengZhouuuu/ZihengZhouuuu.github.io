# 项目长期备忘（ZihengZhouuuu.github.io）

## 目录语义（关键，改文件前必读）
- **根目录才是 GitHub Pages 部署真身**；`Staged/` 已整体废弃（用户移入 `Superseded/Overdesign/`）。
- 用户显式引用的路径也可能是废弃副本——对 work-*.html 动手前先确认目标在根目录。

## 站点结构基准
- 首页项目顺序（Index 弹层 / 卡片 / 页尾导航唯一基准）：
  ① 极端环境下的无人建造 work-ucl.html → ② AI 电商素材生成平台 work-ai-commerce.html →
  ③ 自然语言需求转化 work-LLM_to_Construction.html → ④ 商业空间视觉设计 work-interior-ai.html →
  ⑤ AI GLOBAL RELAY会议 work-global-relay-conference.html
- 子页页尾为循环导航链：ucl↔commerce↔LLM↔interior↔relay↔ucl（每页 Previous/Next 指向相邻项目）。
- 子页页尾两种格式：ucl 页 .minimal-link 独立风格（中文+尾↗）；其余页双 span
  `<span>Previous|Next Project</span>项目名`。
- 首屏 hero-intro（h2.hero-role「空间智能与人机协同工作流设计者」+ p.portfolio-thesis）
  与罗盘弧线同拍消隐：转场组 `body.is-morphing/.hero-intro{opacity:0}`，1.3s var(--fade)；
  回场 0.9s var(--cubic)。
- work-LLM_to_Construction.html = 「离散建造 PROMPT TO PRODUCTION」Case Study（2026-09-06 整页重构，
  relay 设计语言，9 章叙事，媒体卡圆角 8px）；页面名/导航/弹层/页尾链不变。
- **横向 banner 图专用 modifier**：`.campaign-feature--flow` 解除 16:9 强制比例 +
  `object-fit: contain`，用于 workflow.png 这类原图比例明显横长的流程图；其它 16:9 风景照
  仍用默认 campaign-feature（16/9 + cover）。
- 带锚点（#id）的子页：锚点区加 scroll-margin-top；JS 定位用 getBoundingClientRect 而非 offsetTop
  （reveal 的 transform 会改变 offsetParent）。

- 子页首屏固定范式（严禁自创，用户明确纠正过）：完全照 relay 的 poster-hero——深蓝海报（含高光渐变+光斑，
  颜色照抄）+ poster-meta 单行 + poster-symbol 12 花瓣反白 logo 居中 + poster-footer 超大标题（boxed 强调词）；
  主句/说明/图片放首屏后 .hero-statement（h1+p+.template-slot 白卡图），图片不进首屏海报。
- 子页首屏**不放跳转按钮**：「查看 xxx」类按钮统一放到首屏下滑后的第一个文字块下方（LLM 在
  .hero-statement 的 h1+p 后；UCL 在 .product-layer-head 的 kicker+h2+说明段后）。样式用
  `.hero-quicknav`（白底胶囊 + 配色锚点 span 序号 + ::after ↗），全局一份。

## 技术陷阱（复现过的坑）
- index.html 响应式区各宽度断点（1400px/1000px）有同名 `--compass-size` 覆盖 :root；
  改 :root 变量必须检查所有断点。max-height 媒体块必须放在所有宽度断点之后才能胜出。
- agent-browser 跨 Bash 工具调用会掉线：open/eval/screenshot 必须合进同一条命令链。
- file:// 协议有 CSS 缓存：验证改动用 ?v=N 查询参数或读 getComputedStyle。
- 测 CSS 过渡曲线时，跨 CLI 调用间隔太大容易采到结束后状态；在单次 eval 内用
  Promise + setTimeout 连续采样。
- 单文件并发 Edit 偶发 EBUSY：grep 确认已落盘部分，隔命令重试即过。
