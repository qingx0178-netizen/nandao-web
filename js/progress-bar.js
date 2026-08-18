(function () {
    'use strict';

    // 进度配置：按交互章节顺序映射
    const PROGRESS_STEPS = [
        { file: 'index.html', ratio: 0, label: '未启程' },
        { file: 'chapter2.html', ratio: 1 / 7, label: '抵达' },
        { file: 'chapter4.html', ratio: 2 / 7, label: '初遇' },
        { file: 'chapter6.html', ratio: 3 / 7, label: '拼凑' },
        { file: 'chapter8.html', ratio: 4 / 7, label: '对岸' },
        { file: 'chapter10.html', ratio: 5 / 7, label: '远航' },
        { file: 'chapter12.html', ratio: 6 / 7, label: '共振' },
        { file: 'chapter14.html', ratio: 7 / 7, label: '回响' }
    ];

    function getCurrentStep() {
        const path = window.location.pathname;
        let fileName = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
        fileName = fileName.split('?')[0].split('#')[0];
        const step = PROGRESS_STEPS.find(function (item) {
            return item.file === fileName;
        });
        return step || PROGRESS_STEPS[0];
    }

    function createProgressBar() {
        const step = getCurrentStep();
        const percent = Math.round(step.ratio * 100);

        const container = document.createElement('div');
        container.className = 'explore-progress';
        container.setAttribute('role', 'progressbar');
        container.setAttribute('aria-valuenow', percent);
        container.setAttribute('aria-valuemin', '0');
        container.setAttribute('aria-valuemax', '100');
        container.setAttribute('aria-label', '探索进程：' + step.label + ' ' + percent + '%');

        const scroll = document.createElement('div');
        scroll.className = 'progress-scroll';

        const track = document.createElement('div');
        track.className = 'progress-track';

        const fill = document.createElement('div');
        fill.className = 'progress-fill';
        fill.style.width = (step.ratio * 100) + '%';

        const startMarker = document.createElement('span');
        startMarker.className = 'progress-marker start';
        startMarker.setAttribute('aria-hidden', 'true');

        const endMarker = document.createElement('span');
        endMarker.className = 'progress-marker end';
        endMarker.setAttribute('aria-hidden', 'true');

        const journal = document.createElement('img');
        journal.className = 'progress-journal';
        journal.src = 'assets/images/日志本.png';
        journal.alt = '日志本';
        journal.style.left = (step.ratio * 100) + '%';

        const tooltip = document.createElement('span');
        tooltip.className = 'progress-tooltip';
        tooltip.textContent = step.label + ' · ' + percent + '%';
        journal.appendChild(tooltip);

        const label = document.createElement('span');
        label.className = 'progress-label';
        label.textContent = step.label;

        track.appendChild(fill);
        track.appendChild(startMarker);
        track.appendChild(endMarker);
        track.appendChild(journal);
        track.appendChild(label);
        scroll.appendChild(track);
        container.appendChild(scroll);

        return container;
    }

    function init() {
        if (document.getElementById('explore-progress-root')) {
            return;
        }

        const bar = createProgressBar();
        bar.id = 'explore-progress-root';

        const body = document.body;
        body.insertBefore(bar, body.firstChild);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
