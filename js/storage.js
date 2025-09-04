/**
 * 游戏数据存储管理模块
 * 使用 localStorage 实现本地数据持久化
 */
class GameStorage {
    constructor() {
        this.storageKey = 'snakeGameData';
        this.defaultData = {
            bestScore: 0,
            totalGames: 0,
            totalScore: 0,
            maxLevel: 1,
            settings: {
                sound: true,
                volume: 50,
                controlType: 'both'
            },
            achievements: []
        };
        this.data = this.loadData();
    }

    /**
     * 从 localStorage 加载数据
     */
    loadData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                return { ...this.defaultData, ...parsed };
            }
        } catch (error) {
            console.warn('Failed to load game data:', error);
        }
        return { ...this.defaultData };
    }

    /**
     * 保存数据到 localStorage
     */
    saveData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (error) {
            console.warn('Failed to save game data:', error);
        }
    }

    /**
     * 更新最高分
     */
    updateBestScore(score) {
        if (score > this.data.bestScore) {
            this.data.bestScore = score;
            this.saveData();
            return true; // 新纪录
        }
        return false;
    }

    /**
     * 记录游戏完成
     */
    recordGame(score, level) {
        this.data.totalGames++;
        this.data.totalScore += score;
        
        if (level > this.data.maxLevel) {
            this.data.maxLevel = level;
        }
        
        this.saveData();
    }

    /**
     * 获取平均分
     */
    getAverageScore() {
        return this.data.totalGames > 0 
            ? Math.round(this.data.totalScore / this.data.totalGames) 
            : 0;
    }

    /**
     * 更新设置
     */
    updateSettings(settings) {
        this.data.settings = { ...this.data.settings, ...settings };
        this.saveData();
    }

    /**
     * 获取设置
     */
    getSettings() {
        return { ...this.data.settings };
    }

    /**
     * 获取统计数据
     */
    getStats() {
        return {
            bestScore: this.data.bestScore,
            totalGames: this.data.totalGames,
            totalScore: this.data.totalScore,
            averageScore: this.getAverageScore(),
            maxLevel: this.data.maxLevel
        };
    }

    /**
     * 重置所有数据
     */
    resetData() {
        this.data = { ...this.defaultData };
        this.saveData();
    }
}

// 全局存储实例
const gameStorage = new GameStorage();