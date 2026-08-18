(function () {
    'use strict';

    // 避免在 iframe（如 transition.html 的预加载）中重复初始化
    if (window.self !== window.top) return;

    const ENABLED_KEY = 'aodao_bg_music_enabled';
    const TIME_KEY = 'aodao_bg_music_time';
    const TRACK_KEY = 'aodao_bg_music_track';

    const ICON_ON = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
    const ICON_OFF = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';

    const MUSIC_HOME_TO_CH8 = 'assets/首页/潮间馆藏.mp3';
    const MUSIC_CH9_TO_CH14 = 'assets/首页/南岛语.mp3';
    const FADE_DURATION = 2200;
    const NORMAL_VOLUME_A = 0.28;
    const NORMAL_VOLUME_B = 1.0;

    let audio = null;
    let crossfadeOutAudio = null;
    let enabled = true;
    let waitingForInteraction = false;
    const isHome = /index\.html$/.test(location.pathname) || location.pathname === '/';

    function getCurrentTrack() {
        const match = location.pathname.match(/chapter(\d+)\.html/);
        if (match) {
            const num = parseInt(match[1], 10);
            if (num >= 9 && num <= 14) return 'B';
        }
        return 'A';
    }

    function getTrackSource(track) {
        return track === 'B' ? MUSIC_CH9_TO_CH14 : MUSIC_HOME_TO_CH8;
    }

    function getTrackVolume(track) {
        return track === 'B' ? NORMAL_VOLUME_B : NORMAL_VOLUME_A;
    }

    function fadeIn(audioEl, targetVolume, duration, onDone) {
        if (!audioEl) return;
        const startTime = performance.now();
        function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            audioEl.volume = targetVolume * progress;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else if (onDone) {
                onDone();
            }
        }
        requestAnimationFrame(step);
    }

    function fadeOut(audioEl, duration, onDone) {
        if (!audioEl) return;
        const startVolume = audioEl.volume;
        const startTime = performance.now();
        function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            audioEl.volume = startVolume * (1 - progress);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                audioEl.pause();
                if (onDone) onDone();
            }
        }
        requestAnimationFrame(step);
    }

    function crossfade(fromTrack, fromTime) {
        const currentTrack = getCurrentTrack();
        if (!fromTrack || fromTrack === currentTrack) {
            fadeIn(audio, getTrackVolume(currentTrack), FADE_DURATION);
            audio.play().then(function () {
                waitingForInteraction = false;
            }).catch(function () {
                waitingForInteraction = true;
            });
            return;
        }

        // 创建旧音乐实例，从上一页保存的时间继续播放并淡出
        crossfadeOutAudio = new Audio(getTrackSource(fromTrack));
        crossfadeOutAudio.loop = true;
        crossfadeOutAudio.preload = 'auto';
        crossfadeOutAudio.volume = getTrackVolume(fromTrack);
        crossfadeOutAudio.currentTime = fromTime || 0;

        crossfadeOutAudio.play().then(function () {
            fadeOut(crossfadeOutAudio, FADE_DURATION, function () {
                crossfadeOutAudio = null;
            });
        }).catch(function () {
            crossfadeOutAudio = null;
        });

        // 新音乐从 0 开始淡入
        audio.volume = 0;
        audio.currentTime = 0;
        audio.play().then(function () {
            waitingForInteraction = false;
            fadeIn(audio, getTrackVolume(currentTrack), FADE_DURATION);
        }).catch(function () {
            waitingForInteraction = true;
        });
    }

    function initAudio() {
        if (audio) return;

        const savedEnabled = localStorage.getItem(ENABLED_KEY);
        if (savedEnabled !== null) {
            enabled = savedEnabled !== 'false';
        }

        const currentTrack = getCurrentTrack();
        const savedTrack = sessionStorage.getItem(TRACK_KEY);
        const savedTime = parseFloat(sessionStorage.getItem(TIME_KEY) || '0');

        audio = new Audio(getTrackSource(currentTrack));
        audio.loop = true;
        audio.preload = 'auto';

        if (!enabled) {
            audio.volume = 0;
            audio.currentTime = 0;
            return;
        }

        if (savedTrack && savedTrack !== currentTrack) {
            // 不同背景音乐之间切换：执行交叉淡入淡出
            crossfade(savedTrack, savedTime);
        } else {
            // 同一背景音乐：从保存时间继续播放
            audio.volume = getTrackVolume(currentTrack);
            audio.currentTime = savedTime || 0;
        }
    }

    function play() {
        if (!audio) initAudio();
        if (!enabled || !audio) return;
        if (audio.paused) {
            audio.play().then(function () {
                waitingForInteraction = false;
            }).catch(function () {
                waitingForInteraction = true;
            });
        }
    }

    function pause() {
        if (audio) audio.pause();
        if (crossfadeOutAudio) crossfadeOutAudio.pause();
    }

    function updateIcon() {
        const btn = document.getElementById('music-toggle');
        if (!btn) return;
        btn.innerHTML = enabled ? ICON_ON : ICON_OFF;
        btn.setAttribute('aria-label', enabled ? '关闭背景音乐' : '开启背景音乐');
        btn.classList.toggle('music-off', !enabled);
    }

    function toggle() {
        enabled = !enabled;
        localStorage.setItem(ENABLED_KEY, enabled);
        updateIcon();
        if (enabled) {
            play();
        } else {
            pause();
        }
    }

    function createToggle() {
        if (!isHome) return;
        const btn = document.createElement('button');
        btn.id = 'music-toggle';
        btn.className = 'music-toggle';
        btn.type = 'button';
        btn.style.setProperty('cursor', 'pointer', 'important');
        btn.addEventListener('click', toggle);
        document.body.appendChild(btn);
        updateIcon();
    }

    function saveState() {
        if (audio) {
            sessionStorage.setItem(TIME_KEY, audio.currentTime);
            sessionStorage.setItem(TRACK_KEY, getCurrentTrack());
        }
        localStorage.setItem(ENABLED_KEY, enabled);
    }

    function onFirstInteraction() {
        if (waitingForInteraction) {
            play();
        }
        document.removeEventListener('click', onFirstInteraction, true);
        document.removeEventListener('touchstart', onFirstInteraction, true);
    }

    initAudio();
    createToggle();
    play();

    window.addEventListener('beforeunload', saveState);
    document.addEventListener('click', onFirstInteraction, true);
    document.addEventListener('touchstart', onFirstInteraction, true);
})();

