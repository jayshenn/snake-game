/**
 * UI 界面管理模块
 * 管理所有游戏界面的显示和交互
 */
class GameUIManager {
    constructor() {
        this.currentState = 'menu';
        this.screens = {
            menu: document.getElementById('mainMenu'),
            game: document.getElementById('gameScreen'),
            pause: document.getElementById('pauseScreen'),
            gameOver: document.getElementById('gameOverScreen'),
            settings: document.getElementById('settingsScreen'),
            stats: document.getElementById('statsScreen')
        };
        
        this.init();
    }

    init() {
        this.showScreen('menu');
        this.updateMenuStats();
        this.setupSettings();
        
        // 设置输入管理器回调
        inputManager.setPauseCallback(() => {
            if (this.currentState === 'playing') {
                this.pauseGame();
            } else if (this.currentState === 'paused') {
                this.resumeGame();
            }
        });
    }

    /**
     * 显示指定界面
     */
    showScreen(screenName) {
        // 隐藏所有界面
        Object.values(this.screens).forEach(screen => {
            if (screen) screen.classList.remove('active');
        });
        
        // 显示目标界面
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
            this.currentState = screenName;
        }
    }

    /**
     * 开始新游戏
     */
    startNewGame() {
        this.showScreen('game');
        this.currentState = 'playing';
        
        // 重置游戏数据并开始
        if (window.restartGame) {
            window.restartGame();
        }
    }

    /**
     * 暂停游戏
     */
    pauseGame() {
        if (this.currentState === 'playing') {
            this.showScreen('pause');
            this.currentState = 'paused';
            
            if (window.pauseGame) {
                window.pauseGame();
            }
        }
    }

    /**
     * 继续游戏
     */
    resumeGame() {
        if (this.currentState === 'paused') {
            this.showScreen('game');
            this.currentState = 'playing';
            
            if (window.resumeGame) {
                window.resumeGame();
            }
        }
    }

    /**
     * 重新开始游戏
     */
    restartGame() {
        this.showScreen('game');
        this.currentState = 'playing';
        
        if (window.restartGame) {
            window.restartGame();
        }
    }

    /**
     * 游戏结束
     */
    gameOver(score, level) {
        this.currentState = 'gameOver';
        
        // 更新最终统计
        document.getElementById('finalScore').textContent = score;
        document.getElementById('finalBestScore').textContent = gameStorage.data.bestScore;
        document.getElementById('finalLevel').textContent = level;
        
        // 记录游戏数据
        const isNewRecord = gameStorage.updateBestScore(score);
        gameStorage.recordGame(score, level);
        
        // 显示新纪录提示
        if (isNewRecord) {
            this.showNewRecordAnimation();
        }
        
        this.showScreen('gameOver');
    }

    /**
     * 返回主菜单
     */
    backToMenu() {
        this.showScreen('menu');
        this.currentState = 'menu';
        this.updateMenuStats();
        
        // 停止游戏
        if (window.pauseGame) {
            window.pauseGame();
        }
    }

    /**
     * 显示设置界面
     */
    showSettings() {
        this.showScreen('settings');
        this.loadSettings();
    }

    /**
     * 关闭设置界面
     */
    closeSettings() {
        this.saveSettings();
        this.showScreen('menu');
    }

    /**
     * 显示统计界面
     */
    showStats() {
        this.showScreen('stats');
        this.updateStats();
    }

    /**
     * 关闭统计界面
     */
    closeStats() {
        this.showScreen('menu');
    }

    /**
     * 更新菜单统计信息
     */
    updateMenuStats() {
        const bestScore = document.getElementById('menuBestScore');
        if (bestScore) {
            bestScore.textContent = gameStorage.data.bestScore;
        }
    }

    /**
     * 更新统计界面数据
     */
    updateStats() {
        const stats = gameStorage.getStats();
        
        document.getElementById('totalGames').textContent = stats.totalGames;
        document.getElementById('totalScore').textContent = stats.totalScore;
        document.getElementById('avgScore').textContent = stats.averageScore;
        document.getElementById('maxLevel').textContent = stats.maxLevel;
    }

    /**
     * 加载设置
     */
    loadSettings() {
        const settings = gameStorage.getSettings();
        
        document.getElementById('soundToggle').checked = settings.sound;
        document.getElementById('volumeSlider').value = settings.volume;
        document.getElementById('controlType').value = settings.controlType;
    }

    /**
     * 保存设置
     */
    saveSettings() {
        const settings = {
            sound: document.getElementById('soundToggle').checked,
            volume: parseInt(document.getElementById('volumeSlider').value),
            controlType: document.getElementById('controlType').value
        };
        
        gameStorage.updateSettings(settings);
        this.applySettings(settings);
    }

    /**
     * 应用设置
     */
    applySettings(settings) {
        // 应用虚拟控制显示设置
        const virtualControls = document.getElementById('virtualControls');
        if (virtualControls) {
            const shouldShow = settings.controlType === 'touch' || 
                             (settings.controlType === 'both' && this.isMobile());
            virtualControls.style.display = shouldShow ? 'flex' : 'none';
        }
    }

    /**
     * 设置界面初始化
     */
    setupSettings() {
        const settings = gameStorage.getSettings();
        this.applySettings(settings);
    }

    /**
     * 检测是否为移动设备
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * 显示得分动画
     */
    showScoreAnimation(points, x, y) {
        const container = document.getElementById('scoreAnimations');
        if (!container) return;

        const scoreEl = document.createElement('div');
        scoreEl.className = 'score-animation';
        scoreEl.textContent = `+${points}`;
        scoreEl.style.left = x + 'px';
        scoreEl.style.top = y + 'px';
        
        container.appendChild(scoreEl);
        
        // 动画结束后移除元素
        setTimeout(() => {
            if (scoreEl.parentNode) {
                scoreEl.parentNode.removeChild(scoreEl);
            }
        }, 1000);
    }

    /**
     * 显示新纪录动画
     */
    showNewRecordAnimation() {
        // 可以添加更复杂的新纪录庆祝动画
        const gameOverTitle = document.querySelector('.game-over-title');
        if (gameOverTitle) {
            gameOverTitle.textContent = '🎉 新纪录！';
            gameOverTitle.classList.add('new-record');
        }
    }

    /**
     * 处理ESC键
     */
    handleEscape() {
        switch(this.currentState) {
            case 'playing':
                this.pauseGame();
                break;
            case 'paused':
                this.backToMenu();
                break;
            case 'settings':
                this.closeSettings();
                break;
            case 'stats':
                this.closeStats();
                break;
            case 'gameOver':
                this.backToMenu();
                break;
        }
    }

    /**
     * 更新HUD显示
     */
    updateHUD(score, bestScore, level) {
        const scoreEl = document.getElementById('scoreValue');
        const bestScoreEl = document.getElementById('bestScoreValue');
        const levelEl = document.getElementById('levelValue');
        
        if (scoreEl) scoreEl.textContent = score;
        if (bestScoreEl) bestScoreEl.textContent = bestScore;
        if (levelEl) levelEl.textContent = level;
    }
}

// 全局UI管理器实例
const GameUI = new GameUIManager();