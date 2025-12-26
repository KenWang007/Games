/**
 * 音频管理系统
 * 使用 Web Audio API 生成音效（无需外部音频文件）
 */

export class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
        this.isMusicEnabled = true;
        this.isSfxEnabled = true;
        
        // 背景音乐相关
        this.bgmOscillators = [];
        this.bgmInterval = null;
        this.isPlayingBgm = false;
        
        this.init();
    }
    
    /**
     * 初始化音频上下文
     */
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // 主音量控制
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            
            // 音乐音量
            this.musicGain = this.audioContext.createGain();
            this.musicGain.gain.value = this.musicVolume;
            this.musicGain.connect(this.masterGain);
            
            // 音效音量
            this.sfxGain = this.audioContext.createGain();
            this.sfxGain.gain.value = this.sfxVolume;
            this.sfxGain.connect(this.masterGain);
            
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }
    
    /**
     * 恢复音频上下文（需要用户交互后调用）
     */
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
    
    /**
     * 播放音效
     */
    playSfx(type) {
        if (!this.audioContext || !this.isSfxEnabled) return;
        
        this.resume();
        
        switch (type) {
            case 'plant':
                this.playPlantSound();
                break;
            case 'sun':
                this.playSunSound();
                break;
            case 'shoot':
                this.playShootSound();
                break;
            case 'hit':
                this.playHitSound();
                break;
            case 'zombieGroan':
                this.playZombieGroan();
                break;
            case 'win':
                this.playWinSound();
                break;
            case 'lose':
                this.playLoseSound();
                break;
            case 'click':
                this.playClickSound();
                break;
        }
    }
    
    /**
     * 种植音效 - 柔和的"噗"声
     */
    playPlantSound() {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
        
        osc.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.15);
    }
    
    /**
     * 收集阳光音效 - 清脆的叮声
     */
    playSunSound() {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
        osc.frequency.setValueAtTime(1200, this.audioContext.currentTime + 0.05);
        osc.frequency.setValueAtTime(1000, this.audioContext.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        osc.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.2);
    }
    
    /**
     * 射击音效 - 短促的"啵"声
     */
    playShootSound() {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(300, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.08);
        
        gain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.1);
    }
    
    /**
     * 击中音效 - 闷响
     */
    playHitSound() {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, this.audioContext.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.12);
        
        osc.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.12);
    }
    
    /**
     * 僵尸呻吟 - 低沉的声音
     */
    playZombieGroan() {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, this.audioContext.currentTime);
        osc.frequency.linearRampToValueAtTime(80, this.audioContext.currentTime + 0.3);
        
        gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
        
        osc.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.4);
    }
    
    /**
     * 胜利音效 - 欢快的上升音阶
     */
    playWinSound() {
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        
        notes.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            const startTime = this.audioContext.currentTime + i * 0.15;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
            
            osc.connect(gain);
            gain.connect(this.sfxGain);
            
            osc.start(startTime);
            osc.stop(startTime + 0.3);
        });
    }
    
    /**
     * 失败音效 - 下降的音调
     */
    playLoseSound() {
        const notes = [400, 350, 300, 250];
        
        notes.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            const startTime = this.audioContext.currentTime + i * 0.2;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.35);
            
            osc.connect(gain);
            gain.connect(this.sfxGain);
            
            osc.start(startTime);
            osc.stop(startTime + 0.35);
        });
    }
    
    /**
     * 点击音效
     */
    playClickSound() {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = 600;
        
        gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
        
        osc.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.05);
    }
    
    /**
     * 开始播放背景音乐
     */
    startBgm() {
        if (!this.audioContext || !this.isMusicEnabled || this.isPlayingBgm) return;
        
        this.resume();
        this.isPlayingBgm = true;
        
        // 简单的循环旋律
        const melody = [
            { note: 262, duration: 0.25 }, // C4
            { note: 294, duration: 0.25 }, // D4
            { note: 330, duration: 0.25 }, // E4
            { note: 294, duration: 0.25 }, // D4
            { note: 262, duration: 0.5 },  // C4
            { note: 330, duration: 0.25 }, // E4
            { note: 392, duration: 0.5 },  // G4
            { note: 330, duration: 0.25 }, // E4
            { note: 262, duration: 0.5 },  // C4
        ];
        
        let noteIndex = 0;
        const playNextNote = () => {
            if (!this.isPlayingBgm || !this.isMusicEnabled) return;
            
            const { note, duration } = melody[noteIndex];
            this.playBgmNote(note, duration);
            
            noteIndex = (noteIndex + 1) % melody.length;
        };
        
        // 立即播放第一个音符
        playNextNote();
        
        // 设置循环
        this.bgmInterval = setInterval(() => {
            playNextNote();
        }, 400);
    }
    
    /**
     * 播放背景音乐音符
     */
    playBgmNote(frequency, duration) {
        if (!this.audioContext) return;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'triangle';
        osc.frequency.value = frequency;
        
        const now = this.audioContext.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
        gain.gain.setValueAtTime(0.1, now + duration * 0.7);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        osc.connect(gain);
        gain.connect(this.musicGain);
        
        osc.start(now);
        osc.stop(now + duration);
    }
    
    /**
     * 停止背景音乐
     */
    stopBgm() {
        this.isPlayingBgm = false;
        if (this.bgmInterval) {
            clearInterval(this.bgmInterval);
            this.bgmInterval = null;
        }
    }
    
    /**
     * 设置音乐音量
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.musicGain) {
            this.musicGain.gain.value = this.musicVolume;
        }
    }
    
    /**
     * 设置音效音量
     */
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        if (this.sfxGain) {
            this.sfxGain.gain.value = this.sfxVolume;
        }
    }
    
    /**
     * 切换音乐开关
     */
    toggleMusic() {
        this.isMusicEnabled = !this.isMusicEnabled;
        if (!this.isMusicEnabled) {
            this.stopBgm();
        }
        return this.isMusicEnabled;
    }
    
    /**
     * 切换音效开关
     */
    toggleSfx() {
        this.isSfxEnabled = !this.isSfxEnabled;
        return this.isSfxEnabled;
    }
    
    /**
     * 设置全部静音
     */
    setMuted(muted) {
        if (this.masterGain) {
            this.masterGain.gain.value = muted ? 0 : 1;
        }
        if (muted) {
            this.stopBgm();
        }
    }
    
    /**
     * 获取音频状态
     */
    getState() {
        return {
            musicEnabled: this.isMusicEnabled,
            sfxEnabled: this.isSfxEnabled,
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume,
            isPlayingBgm: this.isPlayingBgm
        };
    }
}

