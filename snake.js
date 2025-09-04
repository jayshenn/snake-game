/*
 * 经典贪吃蛇游戏 - JavaScript实现
 * 使用 HTML5 Canvas 和精美的图像素材
 * 功能：蛇的移动、吃食物、碰撞检测、分数统计、音效播放
 */

// 获取Canvas元素和2D绘图上下文
const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");
// 关闭插值，避免缩放时出现发丝缝/模糊
ctx.imageSmoothingEnabled = false;
// 兼容旧实现（无影响）
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;

// 避免 CSS 子像素导致的发丝缝：将画布显示尺寸固定为整数像素
function applyCrispCanvasSize(){
    const max = 608; // 设计稿尺寸
    const target = Math.min(window.innerWidth * 0.9, max);
    const size = Math.max(1, Math.floor(target)); // 向下取整为整数 CSS 像素
    cvs.style.width = size + "px";
    cvs.style.height = size + "px";
}
window.addEventListener("resize", applyCrispCanvasSize);
applyCrispCanvasSize();

// 定义游戏基本单位：每个格子的像素大小（32x32像素）
const box = 32;

// ==================== 图像资源加载区域 ====================
// 加载游戏背景和食物图片

// 草地背景图片（608x608像素，覆盖整个游戏区域）
const ground = new Image();
ground.src = "img/ground.png";

// 食物图片（红苹果，32x32像素）
const foodImg = new Image();
foodImg.src = "img/food.png";

// 加载蛇头图片（4个方向，32x32像素）
// 蛇头会根据当前移动方向自动选择对应的图片
const headUp = new Image();        // 向上的蛇头
headUp.src = "img/head_up.png";
const headDown = new Image();      // 向下的蛇头
headDown.src = "img/head_down.png";
const headLeft = new Image();      // 向左的蛇头
headLeft.src = "img/head_left.png";
const headRight = new Image();     // 向右的蛇头
headRight.src = "img/head_right.png";

// 加载蛇身图片（6种类型，用于不同的连接情况，32x32像素）
// 直线身体（用于蛇身前后方向相同的情况）
const bodyHorizontal = new Image();   // 水平直线身体（左右连接）
bodyHorizontal.src = "img/body_horizontal.png";
const bodyVertical = new Image();     // 垂直直线身体（上下连接）
bodyVertical.src = "img/body_vertical.png";

// 转弯身体（用于蛇身改变方向的转折点）
const bodyTopLeft = new Image();      // 上-左转弯身体
bodyTopLeft.src = "img/body_topleft.png";
const bodyTopRight = new Image();     // 上-右转弯身体
bodyTopRight.src = "img/body_topright.png";
const bodyBottomLeft = new Image();   // 下-左转弯身体
bodyBottomLeft.src = "img/body_bottomleft.png";
const bodyBottomRight = new Image();  // 下-右转弯身体
bodyBottomRight.src = "img/body_bottomright.png";

// 加载蛇尾图片（4个方向，32x32像素）
// 蛇尾方向与前一节身体的方向相反
const tailUp = new Image();        // 向上的蛇尾（前一节向下时使用）
tailUp.src = "img/tail_up.png";
const tailDown = new Image();      // 向下的蛇尾（前一节向上时使用）
tailDown.src = "img/tail_down.png";
const tailLeft = new Image();      // 向左的蛇尾（前一节向右时使用）
tailLeft.src = "img/tail_left.png";
const tailRight = new Image();     // 向右的蛇尾（前一节向左时使用）
tailRight.src = "img/tail_right.png";

// ==================== 音效文件加载区域 ====================
// 加载游戏中的各种音效，提升游戏体验

let dead = new Audio();    // 游戏结束音效（撞墙或撞到自己时播放）
let eat = new Audio();     // 吃食物音效（蛇吃到苹果时播放）
let up = new Audio();      // 向上移动音效
let right = new Audio();   // 向右移动音效
let left = new Audio();    // 向左移动音效
let down = new Audio();    // 向下移动音效

// 设置音效文件路径
dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
up.src = "audio/up.mp3";
right.src = "audio/right.mp3";
left.src = "audio/left.mp3";
down.src = "audio/down.mp3";

// 预加载音效
const sounds = [dead, eat, up, right, left, down];
sounds.forEach(sound => {
    sound.preload = 'auto';
    sound.load();
});

// ==================== 游戏数据初始化区域 ====================
// 创建蛇的数据结构
// 蛇是一个数组，每个元素包含位置坐标(x,y)和方向信息
let snake = [];

// 初始化蛇头位置和方向
// 位置：第9列，第10行（相对于32像素的网格）
// 方向：初始向右移动
snake[0] = {
    x : 9 * box,           // x坐标 = 9 * 32 = 288像素
    y : 10 * box,          // y坐标 = 10 * 32 = 320像素
    direction : "RIGHT"    // 蛇头初始方向向右
};

// 创建食物对象
// 食物随机出现在游戏区域内（避开顶部分数显示区域）
let food = {
    x : Math.floor(Math.random()*17+1) * box,  // x: 1-17列随机（32-544像素）
    y : Math.floor(Math.random()*15+3) * box   // y: 3-17行随机（96-544像素，避开顶部）
}

// 初始化游戏分数
// 每吃一个食物分数+1
let score = 0;
// 当前游戏等级
let level = 1;
// 连击计数器
let comboCount = 0;
// 运行速度（毫秒/步）与定时器句柄
let gameSpeed = 200; // 初始速度
let baseSpeed = 200; // 基础速度
let game;            // 逻辑步进的计时器（setInterval）
let rafId = null;    // requestAnimationFrame 句柄（渲染）
let lastTickAt = 0;  // 上一次逻辑步开始的时间戳（ms）
let lastScoreTime = 0; // 上次得分时间（用于连击计算）

// 为了实现平滑渲染，我们在每个逻辑步保存一份“上一次”的蛇身位置
let prevSnake = [];

// 蛇的移动方向控制变量
// 存储当前的移动方向："LEFT"、"UP"、"RIGHT"、"DOWN"
let d;

// 设置输入管理器回调
inputManager.setDirectionCallback(changeDirection);

/**
 * 统一的方向改变函数
 * 处理来自键盘、触控、虚拟按钮的方向输入
 * 
 * @param {string} newDirection - 新的移动方向
 */
function changeDirection(newDirection) {
    // 防止反向移动逻辑
    if (newDirection === "LEFT" && d !== "RIGHT") {
        d = "LEFT";
        playDirectionSound("LEFT");
    } else if (newDirection === "UP" && d !== "DOWN") {
        d = "UP";
        playDirectionSound("UP");
    } else if (newDirection === "RIGHT" && d !== "LEFT") {
        d = "RIGHT";
        playDirectionSound("RIGHT");
    } else if (newDirection === "DOWN" && d !== "UP") {
        d = "DOWN";
        playDirectionSound("DOWN");
    }
}

/**
 * 播放方向音效
 */
function playDirectionSound(direction) {
    if (!gameStorage.getSettings().sound) return;
    
    const volume = gameStorage.getSettings().volume / 100;
    
    switch(direction) {
        case "LEFT":
            left.volume = volume;
            left.play();
            break;
        case "UP":
            up.volume = volume;
            up.play();
            break;
        case "RIGHT":
            right.volume = volume;
            right.play();
            break;
        case "DOWN":
            down.volume = volume;
            down.play();
            break;
    }
}

// ==================== 辅助函数区域 ====================

/**
 * 碰撞检测函数
 * 检测蛇头是否与蛇身其他部分发生碰撞
 * 
 * @param {Object} head - 蛇头对象，包含x、y坐标
 * @param {Array} array - 蛇身数组，包含所有蛇节
 * @returns {boolean} - 如果碰撞返回true，否则返回false
 * 
 * 原理：遍历蛇身数组，检查蛇头的坐标是否与任一蛇节重合
 */
function collision(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;  // 发现碰撞，返回true
        }
    }
    return false;  // 没有碰撞，返回false
}

/**
 * 由两个相邻格的坐标，推导从 a 指向 b 的离散方向
 */
function directionBetween(a, b){
    if (!a || !b) return null;
    if (a.x === b.x){
        return (b.y < a.y) ? "UP" : "DOWN";
    }
    if (a.y === b.y){
        return (b.x < a.x) ? "LEFT" : "RIGHT";
    }
    return null;
}

/**
 * 获取蛇头对应的图片
 * 根据蛇头的移动方向返回对应的蛇头图片
 * 
 * @param {string} direction - 蛇头移动方向："UP"、"DOWN"、"LEFT"、"RIGHT"
 * @returns {Image} - 返回对应方向的蛇头图片对象
 */
function getHeadImage(direction) {
    switch(direction) {
        case "UP": return headUp;       // 向上的蛇头
        case "DOWN": return headDown;   // 向下的蛇头
        case "LEFT": return headLeft;   // 向左的蛇头
        case "RIGHT": return headRight; // 向右的蛇头
        default: return headRight;      // 默认向右（初始状态）
    }
}

/**
 * 获取蛇尾对应的图片
 * 根据蛇尾前一节身体的方向，返回相反方向的蛇尾图片
 * 
 * @param {string} prevDirection - 蛇尾前一节身体的方向
 * @returns {Image} - 返回对应方向的蛇尾图片对象
 * 
 * 逻辑：蛇尾的朝向与前一节身体的方向相反
 * 例如：前一节向上，则蛇尾朝下
 */
function getTailImage(prevDirection) {
    switch(prevDirection) {
        case "UP": return tailDown;     // 前一节向上 → 蛇尾朝下
        case "DOWN": return tailUp;     // 前一节向下 → 蛇尾朝上
        case "LEFT": return tailRight;  // 前一节向左 → 蛇尾朝右
        case "RIGHT": return tailLeft;  // 前一节向右 → 蛇尾朝左
        default: return tailLeft;       // 默认情况
    }
}

/**
 * 获取蛇身对应的图片
 * 根据蛇身前后两节的方向关系，返回对应的身体图片
 * 
 * @param {string} prevDirection - 前一节身体的方向
 * @param {string} currentDirection - 后一节身体的方向
 * @returns {Image} - 返回对应的蛇身图片对象
 * 
 * 图片选择逻辑：
 * 1. 直线身体：前后方向相同时使用
 *    - 上下方向 → 垂直身体
 *    - 左右方向 → 水平身体
 * 2. 转弯身体：前后方向不同时使用，有四种转弯类型
 */
function getBodyImage(prevDirection, currentDirection) {
    // 规范化：顺序无关，按直线/拐角的两端方向来判断
    if (prevDirection === currentDirection) {
        return (prevDirection === "UP" || prevDirection === "DOWN")
            ? bodyVertical
            : bodyHorizontal;
    }

    const a = prevDirection, b = currentDirection;
    // 角块：两方向的集合匹配
    if ((a === "UP" && b === "LEFT") || (a === "LEFT" && b === "UP")) return bodyTopLeft;
    if ((a === "UP" && b === "RIGHT") || (a === "RIGHT" && b === "UP")) return bodyTopRight;
    if ((a === "DOWN" && b === "LEFT") || (a === "LEFT" && b === "DOWN")) return bodyBottomLeft;
    if ((a === "DOWN" && b === "RIGHT") || (a === "RIGHT" && b === "DOWN")) return bodyBottomRight;

    return bodyHorizontal; // 容错
}

/**
 * 更新HUD显示
 * 同步当前分数、最高分和等级到页面UI
 */
function updateHUD() {
    GameUI.updateHUD(score, gameStorage.data.bestScore, level);
}

/**
 * 计算当前等级
 */
function calculateLevel() {
    return Math.floor(score / 5) + 1;
}

/**
 * 更新游戏速度
 */
function updateGameSpeed() {
    const newLevel = calculateLevel();
    if (newLevel !== level) {
        level = newLevel;
        gameSpeed = Math.max(80, baseSpeed - (level - 1) * 15);
        
        // 显示等级提升提示
        showLevelUpNotification();
        
        // 重新设置定时器
        if (game) {
            clearInterval(game);
            game = setInterval(tick, gameSpeed);
        }
    }
}

/**
 * 显示等级提升通知
 */
function showLevelUpNotification() {
    // 可以在这里添加等级提升的视觉效果
    console.log(`Level Up! 等级 ${level}`);
}

/**
 * 计算连击得分
 */
function calculateComboScore() {
    const now = Date.now();
    if (now - lastScoreTime < 1000) { // 1秒内连击
        comboCount++;
        lastScoreTime = now;
        return 1 + Math.floor(comboCount / 3); // 每3连击额外加1分
    } else {
        comboCount = 0;
        lastScoreTime = now;
        return 1;
    }
}

// ==================== 核心游戏循环函数 ====================

/**
 * 游戏主绘制函数
 * 负责绘制整个游戏界面并处理游戏逻辑
 * 每300ms调用一次，实现游戏动画和状态更新
 * 
 * 主要步骤：
 * 1. 清空并绘制背景
 * 2. 绘制蛇（头、身、尾各不相同）
 * 3. 绘制食物
 * 4. 计算蛇的下一个位置
 * 5. 检测是否吃到食物
 * 6. 检测是否游戏结束
 * 7. 更新蛇的位置
 * 8. 绘制分数
 */
function render(alpha){
    
    // 步骤1：绘制游戏背景（草地纹理）
    // 先用接近草地的纯色填充，避免底图透明像素或缩放取整导致露白
    ctx.fillStyle = "#a7d948";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    // 将底图按画布尺寸绘制，确保完全覆盖；
    // 同时裁掉源图底部1px，避免素材自身的发丝边被放大
    const gw = ground.naturalWidth || 608;
    const gh = ground.naturalHeight || 608;
    const cropBottom = 1;
    ctx.drawImage(ground, 0, 0, gw, Math.max(1, gh - cropBottom), 0, 0, cvs.width, cvs.height);
    
    // 步骤2：绘制蛇（根据邻居相对位置计算朝向，并做位移插值）
    for (let i = 0; i < snake.length; i++){
        const curr = snake[i];
        const prev = prevSnake[i] || curr; // 新增长度时，缺失的 prev 用当前兜底

        // 线性插值，呈现 60fps 平滑位移
        const x = prev.x + (curr.x - prev.x) * alpha;
        const y = prev.y + (curr.y - prev.y) * alpha;

        if (i === 0){
            // 蛇头方向：优先使用当前移动方向 d，否则退化到相邻推导
            let headDir = d || directionBetween(curr, snake[1]) || curr.direction || "RIGHT";
            let headImg = getHeadImage(headDir);
            ctx.drawImage(headImg, x, y, box, box);
        }else if (i === snake.length - 1){
            // 蛇尾：由尾巴相对上一节（靠近头的方向）推导
            const prevSeg = snake[i - 1];
            const toPrev = directionBetween(curr, prevSeg) || prevSeg.direction || "RIGHT";
            const tailImg = getTailImage(toPrev);
            ctx.drawImage(tailImg, x, y, box, box);
        }else{
            // 身体：由与前后两节的相对位置推导拐角/直线图块
            const segPrev = snake[i - 1];
            const segNext = snake[i + 1];
            const dirToPrev = directionBetween(curr, segPrev) || segPrev.direction;
            const dirToNext = directionBetween(curr, segNext) || segNext.direction;
            const bodyImg = getBodyImage(dirToPrev, dirToNext);
            ctx.drawImage(bodyImg, x, y, box, box);
        }
    }
    
    // 步骤3：绘制食物（红苹果）
    ctx.drawImage(foodImg, food.x, food.y, box, box);
    // 更新HUD显示（移除Canvas内文字显示，使用HTML界面）
    updateHUD();
}

// 仅负责推进一次逻辑帧（移动、吃、死亡判断）。不做渲染。
function update(){
    // 获取当前蛇头位置
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // 根据方向推进一个格子
    if( d == "LEFT") snakeX -= box;
    if( d == "UP") snakeY -= box;
    if( d == "RIGHT") snakeX += box;
    if( d == "DOWN") snakeY += box;

    // 吃到食物
    if(snakeX == food.x && snakeY == food.y){
        const points = calculateComboScore();
        score += points;
        
        // 播放音效
        if (gameStorage.getSettings().sound) {
            eat.volume = gameStorage.getSettings().volume / 100;
            eat.play();
        }
        
        // 显示得分动画
        const canvas = document.getElementById('snake');
        const rect = canvas.getBoundingClientRect();
        const x = rect.left + (food.x / 608) * rect.width;
        const y = rect.top + (food.y / 608) * rect.height;
        GameUI.showScoreAnimation(points, x, y);
        
        // 生成新食物
        food = {
            x : Math.floor(Math.random()*17+1) * box,
            y : Math.floor(Math.random()*15+3) * box
        };
        
        // 更新最高分
        gameStorage.updateBestScore(score);
        
        // 更新游戏速度和等级
        updateGameSpeed();
        updateHUD();
        
        // 不 pop()，长度 +1
    }else{
        snake.pop();
    }

    // 新蛇头
    let newHead = { x: snakeX, y: snakeY, direction: d };

    // 碰撞/越界
    if(snakeX < box || snakeX > 17 * box || snakeY < 3*box || snakeY > 17*box || collision(newHead,snake)){
        // 停止计时器与渲染
        if (game){ clearInterval(game); game = null; }
        if (rafId){ cancelAnimationFrame(rafId); rafId = null; }
        
        // 播放死亡音效
        if (gameStorage.getSettings().sound) {
            dead.volume = gameStorage.getSettings().volume / 100;
            dead.play();
        }
        
        // 更新最高分记录
        gameStorage.updateBestScore(score);
        
        // 显示游戏结束界面
        GameUI.gameOver(score, level);
        
        return;
    }

    snake.unshift(newHead);
}

// ==================== 游戏启动区域 ====================

/**
 * 启动/控制游戏
 */
function cloneSnake(arr){
    return arr.map(s => ({ x: s.x, y: s.y, direction: s.direction }));
}

function tick(){
    // 保存上一帧位置用于插值
    prevSnake = cloneSnake(snake);
    lastTickAt = performance.now();
    update();
}

function startRenderLoop(){
    function loop(){
        const now = performance.now();
        const alpha = Math.max(0, Math.min(1, (now - lastTickAt) / gameSpeed));
        render(alpha);
        rafId = requestAnimationFrame(loop);
    }
    if (!rafId){ rafId = requestAnimationFrame(loop); }
}

window.startGame = function(speed){
    if (typeof speed === "number") gameSpeed = speed;
    if (game){ clearInterval(game); game = null; }
    prevSnake = cloneSnake(snake);
    lastTickAt = performance.now();
    game = setInterval(tick, gameSpeed);
    startRenderLoop();
    updateHUD();
};

window.pauseGame = function(){
    if (game){ clearInterval(game); game = null; }
    if (rafId){ cancelAnimationFrame(rafId); rafId = null; }
};

window.resumeGame = function(){
    if (!game){
        lastTickAt = performance.now();
        game = setInterval(tick, gameSpeed);
    }
    if (!rafId){ startRenderLoop(); }
};

window.restartGame = function(){
    // 重置游戏状态
    snake = [{ x: 9 * box, y: 10 * box, direction: "RIGHT" }];
    food = { x : Math.floor(Math.random()*17+1) * box,
             y : Math.floor(Math.random()*15+3) * box };
    score = 0;
    level = 1;
    comboCount = 0;
    gameSpeed = baseSpeed;
    d = undefined;
    lastScoreTime = 0;
    
    startGame();
};

// 游戏初始化时不自动开始，等待用户操作
// startGame(gameSpeed);
