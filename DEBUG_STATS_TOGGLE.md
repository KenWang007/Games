# 🔧 统计面板切换功能调试指南

## 📊 功能说明
植物大战僵尸右上角应该有一个 📊 按钮，点击可以显示/隐藏右侧统计面板。

---

## ✅ 检查步骤

### 1. 清除浏览器缓存（非常重要！）

**Chrome/Edge:**
```
1. 按 Ctrl+Shift+Delete (Windows) 或 Cmd+Shift+Delete (Mac)
2. 选择"缓存的图片和文件"
3. 点击"清除数据"
```

**Safari:**
```
1. Safari → 偏好设置 → 高级
2. 勾选"在菜单栏中显示开发菜单"
3. 开发 → 清空缓存
```

**Firefox:**
```
1. 按 Ctrl+Shift+Delete
2. 选择"缓存"
3. 点击"立即清除"
```

### 2. 强制刷新页面

- **Windows**: `Ctrl + F5` 或 `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`
- **通用**: 长按刷新按钮选择"硬性重新加载"

### 3. 检查按钮是否显示

进入植物大战僵尸游戏后，查看**右上角**控制按钮区域：

```
应该看到这些按钮：
📖 (图鉴)  ⏸️ (暂停)  🔊 (音效)  📊 (统计面板切换) ← 新按钮
```

### 4. 打开浏览器控制台检查

**打开控制台:**
- Windows: `F12` 或 `Ctrl+Shift+I`
- Mac: `Cmd+Option+I`

**在 Console 标签中查找:**
```
✅ "统计面板切换按钮已绑定" - 表示按钮正常
❌ "未找到统计面板切换按钮" - 表示按钮未加载
```

**点击按钮后应该看到:**
```
"统计面板切换按钮被点击"
"统计面板已显示 📊" 或 "统计面板已隐藏 📋"
```

---

## 🐛 常见问题

### Q: 清除缓存后还是看不到按钮？

**检查 Elements (元素) 标签:**
1. 按 F12 打开开发者工具
2. 点击 Elements 标签
3. 按 Ctrl+F 搜索 `btn-toggle-stats`
4. 如果找到说明按钮存在，如果没找到说明HTML没有更新

### Q: 按钮存在但点击没反应？

**检查 Console 错误:**
1. 看是否有红色错误信息
2. 如果有 JavaScript 错误，记录错误信息

### Q: 点击按钮有反应但面板没有隐藏？

**检查元素样式:**
1. 右键点击右侧统计面板
2. 选择"检查元素"
3. 查看 `#game-stats-sidebar` 的 CSS 类
4. 应该有或没有 `visible` 类

---

## 🔍 手动测试命令

在浏览器控制台中运行以下命令测试功能：

### 检查按钮是否存在:
```javascript
document.getElementById('btn-toggle-stats')
```
如果返回 `null` 说明按钮不存在

### 检查统计面板:
```javascript
document.getElementById('game-stats-sidebar')
```

### 手动切换面板:
```javascript
const sidebar = document.getElementById('game-stats-sidebar');
if (sidebar) {
    sidebar.classList.toggle('visible');
    console.log('已切换，当前状态:', sidebar.classList.contains('visible') ? '显示' : '隐藏');
}
```

### 检查localStorage设置:
```javascript
localStorage.getItem('pvz_stats_visible')
```

---

## 🚀 临时解决方案

如果按钮还没有加载，可以在控制台运行以下代码手动隐藏面板：

```javascript
// 隐藏统计面板
const sidebar = document.getElementById('game-stats-sidebar');
if (sidebar) {
    sidebar.classList.remove('visible');
    sidebar.style.display = 'none';
    console.log('✅ 统计面板已隐藏');
}
```

```javascript
// 显示统计面板
const sidebar = document.getElementById('game-stats-sidebar');
if (sidebar) {
    sidebar.classList.add('visible');
    sidebar.style.display = '';
    console.log('✅ 统计面板已显示');
}
```

---

## 📝 报告问题

如果以上步骤都尝试后仍然无法使用，请提供以下信息：

1. **浏览器和版本**: (例如 Chrome 120)
2. **操作系统**: (例如 Windows 11 / macOS 14)
3. **控制台错误信息**: (截图或复制文字)
4. **按钮是否存在**: (在 Elements 中搜索结果)
5. **页面URL**: (确认访问的是最新版本)

---

## ⏱️ 等待部署

刚刚推送的修复需要 2-5 分钟部署到 GitHub Pages。

**检查部署状态:**
```bash
# 在电脑终端运行
gh api repos/KenWang007/Games/pages/builds/latest --jq '.status'
```

**状态说明:**
- `building` - 正在构建，请等待
- `built` - 构建完成，可以访问
- `errored` - 构建失败

---

## 🌐 访问地址

确保访问的是正确的URL：
```
https://kenwang007.github.io/Games/
```

**不要使用:**
- 本地文件 (file:///)
- 旧的缓存页面

---

最后更新: 2025-12-26
版本: v2.1 - 修复按钮绑定问题

