# 🎮 游戏中心

欢迎来到游戏中心！这是一个集合了多款经典小游戏的网页应用平台。

## 📋 项目简介

游戏中心是一个现代化的游戏选择界面，采用卡片式设计，让用户可以方便地浏览和选择想要玩的游戏。

## 🎯 包含的游戏

### 1. 🧱 卡通俄罗斯方块
- **类型**: 益智游戏
- **特色**: 
  - 卡通风格的界面设计
  - 多种难度等级（简单/普通/困难）
  - 音乐和音效支持
  - 适合儿童的友好界面
- **路径**: `Eluosi/EluosiGame/src/index.html`

### 2. 🌻 植物大战僵尸
- **类型**: 策略塔防游戏
- **特色**:
  - 多种植物类型可供选择
  - 不同种类的僵尸敌人
  - 关卡系统
  - 图鉴功能
- **路径**: `ZhiwuVSJiangshi/ZhiwuVSJiangshi/index.html`

## 🚀 使用方法

### 启动游戏中心

有以下几种方式可以启动游戏中心：

#### 方式1: 直接在浏览器中打开
1. 找到 `Games` 目录下的 `index.html` 文件
2. 双击文件，或右键选择"用浏览器打开"
3. 在游戏选择界面中点击想玩的游戏卡片

#### 方式2: 使用本地服务器（推荐）
```bash
# 在 Games 目录下运行
cd /Users/jianwang/spec-kit-research/Games

# 使用 Python 启动简单服务器
# Python 3:
python3 -m http.server 8000

# 或者 Python 2:
python -m SimpleHTTPServer 8000

# 然后在浏览器中访问: http://localhost:8000
```

#### 方式3: 使用 Node.js 服务器
```bash
# 安装 http-server (如果还没安装)
npm install -g http-server

# 在 Games 目录下运行
cd /Users/jianwang/spec-kit-research/Games
http-server -p 8000

# 然后在浏览器中访问: http://localhost:8000
```

## ⌨️ 快捷键

游戏中心支持以下键盘快捷键：

- **数字键 1-2**: 快速聚焦到对应的游戏卡片
- **Enter/Space**: 在聚焦状态下启动游戏
- **Tab**: 在不同元素间切换焦点
- **Esc**: 滚动到页面顶部

### 彩蛋
尝试输入经典的科乐美代码（Konami Code）：
`↑ ↑ ↓ ↓ ← → ← → B A`

## 🎨 功能特性

### 视觉设计
- ✨ 现代化的渐变背景
- 🎯 精美的卡片式布局
- 🌈 流畅的动画效果
- 📱 完全响应式设计，支持移动设备

### 用户体验
- 🖱️ 鼠标悬停效果
- ⌨️ 完整的键盘导航支持
- ♿ 无障碍访问支持（ARIA标签）
- 🎭 可选的粒子特效（可在代码中配置）

### 性能优化
- ⚡ 使用 Intersection Observer 优化动画
- 🚀 轻量级代码，快速加载
- 💾 无需外部依赖

## 🛠️ 技术栈

- **HTML5**: 语义化标签，无障碍支持
- **CSS3**: 
  - CSS Grid 布局
  - CSS Variables（CSS 自定义属性）
  - 现代动画和过渡效果
  - 响应式设计
- **JavaScript (ES6+)**:
  - 模块化代码结构
  - 事件处理
  - 键盘导航
  - 性能优化

## 📱 浏览器兼容性

游戏中心支持所有现代浏览器：

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

## 📂 项目结构

```
Games/
├── index.html              # 游戏中心主页
├── styles.css             # 样式文件
├── main.js                # JavaScript 逻辑
├── README.md              # 本文档
├── Eluosi/                # 俄罗斯方块游戏
│   └── EluosiGame/
│       └── src/
│           └── index.html
└── ZhiwuVSJiangshi/       # 植物大战僵尸游戏
    └── ZhiwuVSJiangshi/
        └── index.html
```

## 🎯 自定义配置

可以通过修改 `main.js` 中的配置来自定义游戏中心：

```javascript
const CONFIG = {
    animationDuration: 300,      // 动画持续时间（毫秒）
    particleCount: 20,           // 粒子效果数量
    enableParticles: true,       // 是否启用粒子效果
    enableSoundEffects: false    // 是否启用音效
};
```

## 🔧 添加新游戏

要添加新游戏到游戏中心：

1. 在 `index.html` 中复制现有的游戏卡片结构
2. 修改以下内容：
   - 卡片图标（emoji）
   - 游戏标题
   - 游戏描述
   - 特性标签
   - 游戏链接路径
3. 在 `styles.css` 中添加对应的主题色（可选）
4. 保存并刷新页面

## 📄 许可证

本项目仅供学习和个人使用。

## 🙏 致谢

感谢所有为这些经典游戏贡献代码的开发者们！

## 📞 联系方式

如有问题或建议，欢迎提出反馈。

---

**享受游戏时光！** 🎮🎉

