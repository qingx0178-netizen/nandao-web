# PROJECT_CONTEXT.md

## 1. 页面结构

本项目为纯静态 HTML/CSS/JS 站点，无框架、无构建工具、无客户端路由，页面间通过普通 `<a href="...">` 或 `window.location` 跳转。

当前文件结构：

```
D:\南岛语\网页项目\
├── index.html              # 首页 / 入口页
├── transition.html         # 转场动画页（翻书效果进入第一章导读页）
├── chapter1.html           # 第一章：导读页（抵达）
├── chapter2.html           # 第一章：交互探索页（抵达）
├── chapter3.html           # 第二章：导读页（初遇）
├── css/global.css          # 全局样式（仅自定义放大镜光标）
├── assets/
│   ├── fonts/              # 字体文件
│   ├── images/             # 图片资源
│   └── videos/             # 视频资源
└── images/                 # 部分光标/装饰图片
```

### 各页面职责

| 文件 | 类型 | 说明 |
|------|------|------|
| `index.html` | 首页 | 展示项目主标题、副标题、岛屿纹样装饰与“点击开启考古之旅”入口，跳转至 `transition.html` |
| `transition.html` | 转场页 | 播放 `assets/videos/转场动画.mp4`，配合 CSS 3D 翻页动画，结束后进入 `chapter1.html`；预加载时通过 `chapter1.html?preload=1` 隐藏文字动画 |
| `chapter1.html` | 导读页 | 全屏背景图 + 云纹飘动 + 标题逐字浮现 + “开启阅读”按钮，跳转至 `chapter2.html` |
| `chapter2.html` | 交互页 | 日记本、状态面板、雾气擦除小游戏、科考实拍、章节推进纸条等交互模块；完成四项交互后显示“阅读下一章节”，跳转至 `chapter3.html` |
| `chapter3.html` | 导读页 | 第二章导读页，结构与 `chapter1.html` 完全一致，文字为“第二章：初遇”，“开启阅读”按钮预留指向 `chapter4.html` |

---

## 2. Chapter 编号规则

项目采用 **“奇偶成对”** 的章节编号约定：

- **奇数编号页面**（`chapter1.html`、`chapter3.html`、`chapter5.html` …）为**导读页**（Guide/Intro）。
- **偶数编号页面**（`chapter2.html`、`chapter4.html`、`chapter6.html` …）为**交互探索页**（Interactive/Explore）。

### 导航链

```
index.html → transition.html → chapter1.html → chapter2.html → chapter3.html → chapter4.html → chapter5.html → ...
```

### 内部链接约定

| 页面类型 | 触发元素 | 默认目标 | 说明 |
|----------|----------|----------|------|
| 导读页（奇数） | `.start-reading` 按钮 | `chapter{N+1}.html` | 例如 `chapter1.html` → `chapter2.html`，`chapter3.html` → `chapter4.html` |
| 交互页（偶数） | `.next-chapter-btn` 按钮 | `chapter{N+1}.html` | 例如 `chapter2.html` → `chapter3.html`，`chapter4.html` → `chapter5.html` |
| 首页 | `.start-journey` 按钮 | `transition.html` | 进入转场动画 |
| 转场页 | 视频结束/异常兜底 | `chapter1.html` | 当前固定指向第一章导读页 |

> 若后续需要为每一章单独配置转场页，可复制 `transition.html` 并修改其 `targetPage` 与 iframe `src`。

---

## 3. 已有组件功能

### 3.1 首页组件（`index.html`）

| 组件/类名 | 功能 |
|-----------|------|
| `.hero` | 全屏背景容器，使用 `assets/images/首页底图.png` |
| `.title-main` / `.title-sub` | 主标题与副标题，支持逐字浮现动画 |
| `.wave-decoration` | 岛屿纹样装饰，延迟淡入 |
| `.start-journey` | 入口按钮，带四角纹样、淡入、呼吸动画，跳转 `transition.html` |

### 3.2 转场页组件（`transition.html`）

| 组件/类名 | 功能 |
|-----------|------|
| `.stage` | 3D 透视舞台 |
| `.back-page` + `iframe` | 提前加载目标导读页，使用 `?preload=1` 隐藏文字与按钮 |
| `.front-page` + `video` | 当前显示的视频书页 |
| `pageFlip` / `pageShadow` 动画 | 视频页向左翻开，露出背后章节的翻书效果 |

### 3.3 导读页组件（`chapter1.html` / `chapter3.html`）

| 组件/类名 | 功能 |
|-----------|------|
| `.chapter-hero` | 全屏背景容器，使用对应章节导读背景图 |
| `.cloud-layer` | 双层云纹横向无限飘动，营造东方氛围 |
| `.chapter-title-wrap` | 标题容器，居中定位 |
| `.chapter-title` | 章节大标题，使用 `赤壁赋体` |
| `.title-char` | 标题逐字拆分后的动画元素，带错位延迟上浮效果 |
| `.start-reading` | 开启阅读按钮，带四角纹样、淡入、呼吸动画 |
| `.preload` | body 预加载类，用于转场页 iframe 中隐藏文字与按钮 |
| `splitTitle()` | 将标题文字拆分为 `.title-char` 并设置递增动画延迟 |

### 3.4 交互页组件（`chapter2.html`）

| 组件/类名 | 功能 |
|-----------|------|
| `.explore-stage` | 整页舞台容器 |
| `.diary-page` | 日记本内页，使用打字机效果逐段输出日记文字 |
| `.typing-cursor` | 打字光标闪烁 |
| `.close-diary` | 关闭日记按钮 |
| `.status-panel` | 状态图片弹窗 |
| `.status-image` | 状态图片展示 |
| `.task-panel` | 待办任务面板 |
| `.fog-canvas` | 雾气擦除小游戏画布，擦除超过阈值后自动消散 |
| `.fog-hint` | “擦除雾气”提示 |
| `.close-task` | 关闭任务面板按钮 |
| `.field-photo-panel` | 科考实拍展示面板 |
| `.field-photo-image` / `.field-photo-caption` | 实拍图片与说明 |
| `.advance-note` | 章节推进纸条，四项交互完成后弹出 |
| `.advance-note-text` | 纸条文字，带打字机动画 |
| `.next-chapter-btn` | “阅读下一章节”按钮，出现后点击跳转下一章导读页 |
| `.bottom-panel` | 底部四个卷轴入口按钮区 |
| `.scroll-entry` | 卷轴样式按钮（阅读日志 / 查看状态 / 待办任务 / 科考实拍） |

### 3.5 全局共享样式（`css/global.css`）

仅包含自定义放大镜光标：

```css
html, body, * {
    cursor: url('../images/magnifier-cursor.svg') 12 12, auto !important;
}
```

---

## 4. 后续章节开发规则

### 4.1 新增导读页（奇数页）

以 `chapter3.html` 为模板复制生成新的奇数页，例如 `chapter5.html`：

1. 复制 `chapter3.html`。
2. 修改 `<title>` 与 `<h1 class="chapter-title">` 为新章节标题。
3. 如需替换背景图，修改 `.chapter-hero` 的 `background-image`。
4. 修改 `.start-reading` 的 `href` 为 `chapter{N+1}.html`。
5. 保持所有 CSS 动画参数、字体、颜色、四角纹样、按钮样式与 `chapter1.html` / `chapter3.html` 一致。

### 4.2 新增交互页（偶数页）

以 `chapter2.html` 为模板复制生成新的偶数页，例如 `chapter4.html`：

1. 复制 `chapter2.html`。
2. 修改 `<title>`。
3. 替换 `.explore-stage` 背景图为对应章节正文背景。
4. 替换 `paragraphs` 数组中的日记文本。
5. 替换 `.status-image` 的图片路径与说明。
6. 替换 `.task-text` 中的任务文字与 `.task-image` 图片、说明。
7. 替换 `.field-photo-image` 图片与 `.field-photo-caption` 说明。
8. 替换 `.advance-note-text` 中的章节推进文字。
9. 修改 `nextChapterBtn` 点击事件，跳转至 `chapter{N+1}.html`。
10. 保持面板打开/关闭动效、卷轴按钮样式、打字机动效一致。

### 4.3 资源管理

- 字体：统一放 `assets/fonts/`。
- 图片：统一放 `assets/images/`；导读背景图建议命名格式为 `第X章，导读页.png`，正文背景图建议为 `第X章正文背景.png`。
- 视频：统一放 `assets/videos/`。
- 光标/全局装饰：可放 `images/`。

### 4.4 转场页扩展（可选）

当前 `transition.html` 固定进入 `chapter1.html`。如需为后续章节配置独立转场：

1. 复制 `transition.html`，命名为 `transition-chapter{N}.html`。
2. 修改 `targetPage` 为目标导读页。
3. 修改 iframe 的 `src` 为 `chapter{N}.html?preload=1`。
4. 在上一交互页中将“阅读下一章节”指向该转场页，而非直接指向导读页。

### 4.5 一致性约束

- 不引入新的构建工具或框架，保持纯静态 HTML/CSS/JS。
- 字体优先使用 `赤壁赋体`；标题类字体回退栈保持一致。
- 主色调沿用 `#75685B`（标题/边框）、`#5C5348`（正文强调）、`#3D352C`（正文）、`#F5F0E3` / `#F7F4EC`（纸张色）。
- 按钮、四角纹样、卷轴入口等视觉元素直接复用现有 CSS。
- 导读页动画参数（`splitTitle` 延迟、云纹飘动速度、按钮呼吸节奏）尽量不变，确保跨章节体验统一。
