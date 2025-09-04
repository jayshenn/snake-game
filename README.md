# 🐍 经典贪吃蛇游戏 / Classic Snake Game

![Snake Game](https://img.shields.io/badge/Game-Snake-green) ![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)

一个使用 HTML5 Canvas 和 JavaScript 实现的经典贪吃蛇游戏，采用精美的图片素材和音效，提供流畅的游戏体验。

A classic Snake game implemented with HTML5 Canvas and JavaScript, featuring beautiful sprites and sound effects for a smooth gaming experience.

## ✨ 游戏特色 / Game Features

- 🎨 **精美视觉效果**：专业的蛇头、蛇身、蛇尾图片素材，告别简陋方块
- 🔊 **丰富音效**：移动音效、吃食物音效、游戏结束音效
- 🎮 **流畅操作**：支持方向键控制，防止反向移动
- 📊 **实时计分**：动态显示当前得分和最高分记录
- 💾 **数据持久化**：最高分自动保存到本地存储
- ⏸️ **游戏控制**：支持暂停、恢复、重新开始功能
- 🎯 **现代化UI**：精美的渐变设计和响应式布局
- 📱 **移动适配**：支持移动设备，自适应屏幕大小
- 🌿 **草地背景**：沉浸式游戏环境

## 🎮 游戏操作 / Controls

### 键盘控制 / Keyboard Controls
| 按键 / Key | 功能 / Action |
|------------|---------------|
| ↑ (Up)     | 向上移动 / Move Up |
| ↓ (Down)   | 向下移动 / Move Down |
| ← (Left)   | 向左移动 / Move Left |
| → (Right)  | 向右移动 / Move Right |

### 游戏按钮 / Game Controls
| 按钮 / Button | 功能 / Action |
|---------------|---------------|
| Restart | 重新开始游戏 / Restart Game |
| Pause | 暂停游戏 / Pause Game |
| Resume | 恢复游戏 / Resume Game |

## 🚀 运行游戏 / How to Play

1. **克隆项目 / Clone the repository**
   ```bash
   git clone <repository-url>
   cd snake-game
   ```

2. **运行游戏 / Run the game**
   ```bash
   # 直接在浏览器中打开 index.html
   # Simply open index.html in your browser
   open index.html
   ```
   或者使用本地服务器 / Or use a local server:
   ```bash
   # 使用 Python 3
   python -m http.server 8000
   
   # 使用 Node.js (需要安装 http-server)
   npx http-server
   ```

3. **开始游戏 / Start playing**
   - 使用方向键控制蛇的移动
   - 吃红苹果来增加得分和蛇的长度
   - 避免撞到墙壁或自己的身体
   - 使用暂停按钮暂停游戏，恢复按钮继续游戏
   - 最高分将自动保存到浏览器本地存储

## 🏗️ 技术栈 / Tech Stack

- **HTML5**: 游戏页面结构和语义化标签
- **CSS3**: 现代化UI设计和响应式布局  
- **Canvas API**: 游戏渲染引擎
- **JavaScript ES6**: 游戏逻辑实现
- **LocalStorage API**: 本地数据持久化
- **音频 API**: 游戏音效播放
- **图像资源**: PNG 格式精灵图

## 📁 项目结构 / Project Structure

```
snake-game/
├── index.html          # 游戏主页面 / Main game page
├── snake.js           # 游戏主逻辑 (详细中文注释) / Main game logic (with detailed Chinese comments)
├── styles.css         # 现代化UI样式 / Modern UI styles
├── img/               # 图片资源目录 / Image assets directory
│   ├── ground.png     # 草地背景 (608x608) / Ground background
│   ├── food.png       # 食物图片 (苹果) / Food sprite (apple)
│   ├── head_*.png     # 蛇头图片 (4个方向) / Snake head sprites (4 directions)
│   ├── body_*.png     # 蛇身图片 (6种类型) / Snake body sprites (6 types)
│   └── tail_*.png     # 蛇尾图片 (4个方向) / Snake tail sprites (4 directions)
├── audio/             # 音效文件目录 / Audio files directory
│   ├── dead.mp3       # 游戏结束音效 / Game over sound
│   ├── eat.mp3        # 吃食物音效 / Eating sound
│   ├── up.mp3         # 向上移动音效 / Move up sound
│   ├── down.mp3       # 向下移动音效 / Move down sound
│   ├── left.mp3       # 向左移动音效 / Move left sound
│   └── right.mp3      # 向右移动音效 / Move right sound
├── LICENSE            # MIT开源许可证 / MIT License
├── CLAUDE.md          # Claude Code 开发文档 / Development guide for Claude Code
└── README.md          # 项目说明文件 / Project documentation
```

## 🎨 图片素材说明 / Sprite Assets

### 蛇头图片 / Snake Head Sprites (32x32px)
- `head_up.png` - 向上的蛇头
- `head_down.png` - 向下的蛇头  
- `head_left.png` - 向左的蛇头
- `head_right.png` - 向右的蛇头

### 蛇身图片 / Snake Body Sprites (32x32px)
- `body_horizontal.png` - 水平直线身体
- `body_vertical.png` - 垂直直线身体
- `body_topleft.png` - 上-左转弯身体
- `body_topright.png` - 上-右转弯身体
- `body_bottomleft.png` - 下-左转弯身体
- `body_bottomright.png` - 下-右转弯身体

### 蛇尾图片 / Snake Tail Sprites (32x32px)
- `tail_up.png` - 向上的蛇尾
- `tail_down.png` - 向下的蛇尾
- `tail_left.png` - 向左的蛇尾  
- `tail_right.png` - 向右的蛇尾

## ⚙️ 游戏参数 / Game Parameters

- **画布尺寸 / Canvas Size**: 608×608 像素
- **游戏网格 / Game Grid**: 19×19 单元格
- **单元格大小 / Cell Size**: 32×32 像素
- **游戏速度 / Game Speed**: 300ms/帧 (每秒约3.33次移动)
- **游戏区域 / Play Area**: 避开顶部96像素的计分区域

## 🔧 开发说明 / Development Notes

- 代码采用详细的中文注释，便于学习和维护
- 使用纯 JavaScript 实现，无需任何框架或构建工具
- 采用 Canvas 2D API 进行高效渲染
- 音效和图像资源路径硬编码，修改资源需更新对应路径
- 使用 `keyCode` 进行键盘输入检测

## 📝 许可证 / License

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

🎯 **享受游戏！/ Enjoy the game!** 🎯