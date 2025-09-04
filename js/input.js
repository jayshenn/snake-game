/**
 * 输入处理模块
 * 统一管理键盘和触控输入
 */
class InputManager {
    constructor() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.minSwipeDistance = 50;
        this.onDirectionChange = null;
        this.onPause = null;
        
        this.init();
    }

    init() {
        this.setupKeyboardInput();
        this.setupTouchInput();
        this.setupVirtualControls();
        this.detectMobile();
    }

    /**
     * 检测是否为移动设备
     */
    detectMobile() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const virtualControls = document.getElementById('virtualControls');
        
        if (isMobile && virtualControls) {
            virtualControls.style.display = 'flex';
        }
    }

    /**
     * 设置键盘输入
     */
    setupKeyboardInput() {
        document.addEventListener('keydown', (e) => {
            e.preventDefault();
            
            const key = e.keyCode;
            let direction = null;

            // 方向键和WASD
            switch(key) {
                case 37: case 65: // 左箭头 / A
                    direction = 'LEFT';
                    break;
                case 38: case 87: // 上箭头 / W
                    direction = 'UP';
                    break;
                case 39: case 68: // 右箭头 / D
                    direction = 'RIGHT';
                    break;
                case 40: case 83: // 下箭头 / S
                    direction = 'DOWN';
                    break;
                case 32: // 空格键 - 暂停/继续
                    if (this.onPause) {
                        this.onPause();
                    }
                    break;
                case 27: // ESC键 - 返回菜单
                    GameUI.handleEscape();
                    break;
                case 82: // R键 - 重新开始
                    if (GameUI.currentState === 'playing') {
                        GameUI.restartGame();
                    }
                    break;
            }

            if (direction && this.onDirectionChange) {
                this.onDirectionChange(direction);
            }
        });
    }

    /**
     * 设置触控输入（滑动手势）
     */
    setupTouchInput() {
        const canvas = document.getElementById('snake');
        if (!canvas) return;

        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
        }, { passive: false });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault(); // 防止页面滚动
        }, { passive: false });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            
            if (!e.changedTouches || !e.changedTouches[0]) return;
            
            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - this.touchStartX;
            const deltaY = touch.clientY - this.touchStartY;
            
            const absDeltaX = Math.abs(deltaX);
            const absDeltaY = Math.abs(deltaY);
            
            // 检查是否达到最小滑动距离
            if (Math.max(absDeltaX, absDeltaY) < this.minSwipeDistance) {
                return;
            }
            
            let direction = null;
            
            // 判断主要滑动方向
            if (absDeltaX > absDeltaY) {
                // 水平滑动
                direction = deltaX > 0 ? 'RIGHT' : 'LEFT';
            } else {
                // 垂直滑动
                direction = deltaY > 0 ? 'DOWN' : 'UP';
            }
            
            if (direction && this.onDirectionChange) {
                this.onDirectionChange(direction);
            }
        }, { passive: false });
    }

    /**
     * 设置虚拟按钮控制
     */
    setupVirtualControls() {
        const virtualBtns = document.querySelectorAll('.v-btn');
        
        virtualBtns.forEach(btn => {
            // 触摸事件
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                btn.classList.add('pressed');
                const direction = btn.dataset.direction;
                
                if (direction && this.onDirectionChange) {
                    this.onDirectionChange(direction);
                }
            }, { passive: false });
            
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                btn.classList.remove('pressed');
            }, { passive: false });
            
            // 鼠标事件（PC端测试用）
            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                btn.classList.add('pressed');
                const direction = btn.dataset.direction;
                
                if (direction && this.onDirectionChange) {
                    this.onDirectionChange(direction);
                }
            });
            
            btn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                btn.classList.remove('pressed');
            });
        });
    }

    /**
     * 设置方向改变回调
     */
    setDirectionCallback(callback) {
        this.onDirectionChange = callback;
    }

    /**
     * 设置暂停回调
     */
    setPauseCallback(callback) {
        this.onPause = callback;
    }
}

// 全局输入管理器实例
const inputManager = new InputManager();