/* =========================================================
   About Overlay —— 全站共用的「关于我」定位层
   1) 注入一套完全相同的 Overlay 结构（六份页面文案零差异）
   2) 右侧 SELECTED PATH = lieflat-charts L11 Trend Lineage 纵向转写
      - 竖轴 = 时间（2017 → NOW），横轴 = 3 条能力轨迹
      - 细实线 = 持续积累；小方形 = 真实项目节点；横向引线 = 能力迁移
      - 禁用圆形节点 / 图例 / 装饰虚线 / 彩色
   3) 打开锁滚动、Esc 与 X 关闭、焦点进出、hash(#about) 直达
   无外部依赖，file:// 可直接运行
   ========================================================= */
(function () {
  'use strict';

  var EMAIL = 'zhou_ziheng1@outlook.com';
  var RESUME = 'doc/简历.pdf';
  var MAILTO = 'mailto:' + EMAIL;

  /* ── 经历数据：问题 / 方法 / 产出 / 带来 ── */
  var NODES = [
    {
      time: '2017.09 — 2022.06',
      title: '建筑学基础 / 青岛理工大学',
      track: 'SPATIAL',
      lanes: [0],
      y0: 2017.75,
      q: '如何理解空间、功能、动线与构造之间的关系。',
      m: '建筑设计训练、空间方案推演、图面表达与实体模型制作。',
      o: '建立空间尺度、构造逻辑和场景表达基础。',
      g: '之后能够从真实空间约束而非抽象功能定义产品问题。'
    },
    {
      time: '2022.09 — 2023.12',
      title: '空间机器人与智能建造 / UCL Bartlett',
      track: 'SPATIAL + COMPUTATIONAL',
      lanes: [0, 1],
      y0: 2022.75,
      q: '如何将人员难以进入环境中的模块化搭建任务，转成可控制的机器人动作。',
      m: '参与实体机器人、关节控制、双机动作与 Unity ML-Agents 训练。',
      o: '完成实体结构、Unity → Raspberry Pi → U2D2 → DXL 控制链、单机与双机动作验证，以及 PPO 抓取训练。',
      g: '理解实体原型、控制变量和训练过程如何共同组成可验证系统。'
    },
    {
      time: '2024.04 — 2025.05',
      title: 'LLM-to-3D Fabrication / 同济大学 CAUP',
      track: 'COMPUTATIONAL',
      lanes: [1],
      y0: 2024.3,
      q: '生成的连续 Mesh 如何进入可制造、可重构的实体搭建流程。',
      m: '使用文本/图像到 Mesh 的生成链路，结合构件预算、可制造性和结构约束完成离散化与优化。',
      o: '将桥梁 Mesh 转化为离散木构件系统，并与斯图加特大学团队完成 1:50 实体模型搭建与重构验证。',
      g: '将“生成结果”理解为需要被约束、导出和验证的生产输入，而非最终交付。'
    },
    {
      time: '2025.05 — 至今',
      title: '商业建筑 AIGC 工作流 / AICO',
      track: 'SPATIAL + PRODUCT',
      lanes: [0, 2],
      y0: 2025.4,
      q: '如何让建筑与商业空间的前期视觉生成从一次性灵感，变成可复用的设计工作流。',
      m: '将草图、Rhino 截图、风格参考和 Prompt 组织为可控生成输入。',
      o: '参与 ComfyUI 概念图生成工作流与 Prompt 模板沉淀。',
      g: '理解生成能力进入团队协作时，需要输入规范、变量控制和复用机制。'
    },
    {
      time: '2026.01 — 2026.05',
      title: 'AI 电商素材生成平台',
      track: 'PRODUCT',
      lanes: [2],
      y0: 2026.05,
      q: '商家需要更可控的 AI 商品素材，但模型能力、操作成本和商业可用性存在明显差异。',
      m: '完成 PRD、竞品研究、7 个模型 Benchmark、5 组项目样本测试、产品原型与评测框架。',
      o: '形成商品还原度、人物一致性、综合可控性、商业可用性、稳定性和成本效率等评估维度。',
      g: '从设计与技术视角进入产品判断，开始用用户任务、模型能力和验证标准组织 AI 产品方案。'
    }
  ];

  /* ── 三条能力轨迹（顺序与图例一致：SPATIAL / COMPUTATIONAL / PRODUCT）── */
  var LANES = [
    { key: 'SPATIAL', cn: '空间设计', x: 150, from: 2017.75, to: 2026.7 },
    { key: 'COMPUTATIONAL', cn: '计算与制造', x: 255, from: 2022.75, to: 2025.4 },
    { key: 'PRODUCT', cn: '产品化', x: 360, from: 2025.4, to: 2026.7 }
  ];

  /* ── L11 Trend Lineage 纵向编码 ── */
  var Y0 = 2017, TOP = 34, STEP = 27, AXIS = 46, RIGHT = 404, VBW = 430, VBH = 340;
  var NOW_Y = TOP + (2026.8 - Y0) * STEP;
  function yY(y) { return TOP + (y - Y0) * STEP; }

  var NS = 'http://www.w3.org/2000/svg';
  function el(p, t, a) {
    var n = document.createElementNS(NS, t);
    for (var k in a) n.setAttribute(k, a[k]);
    p.appendChild(n);
    return n;
  }
  function txt(p, a, s) {
    var n = el(p, 'text', a);
    n.textContent = s;
    return n;
  }

  var overlay, panel, closeBtn, aside, chart, listEl;
  var nodeEls = [], itemEls = [], activeIndex = -1, rendered = false;
  var lastTrigger = null, savedScroll = 0, isOpen = false;
  var embedded = !!document.getElementById('footerStage');

  /* ── 复用文案与结构 ── */
  function makeItems() {
    return NODES.map(function (n, i) {
      return '' +
        '<li class="path-item" data-node="' + i + '">' +
          '<button class="path-item-btn" type="button" aria-expanded="false">' +
            '<span class="path-time">' + n.time + '</span>' +
            '<span class="path-name">' + n.title + '</span>' +
            '<span class="path-track">' + n.track + '</span>' +
          '</button>' +
          '<div class="path-detail">' +
            '<p><b>问题</b><span>' + n.q + '</span></p>' +
            '<p><b>方法</b><span>' + n.m + '</span></p>' +
            '<p><b>产出</b><span>' + n.o + '</span></p>' +
            '<p><b>带来</b><span>' + n.g + '</span></p>' +
          '</div>' +
        '</li>';
    }).join('');
  }

  function makeMainHTML() {
    return '' +
      '<div class="about-inner">' +
        '<div class="about-grid">' +
          '<div class="about-main">' +
            '<p class="about-kicker">ABOUT / ZIHENG ZHOU</p>' +
            '<h2 class="about-title">把空间问题，<br>做成可验证的 AI 工具。</h2>' +
            '<p class="about-lede">' +
              '<span>我来自建筑与空间设计背景，当前关注 AIGC、空间智能与产品化方法。</span>' +
              '<span>我的工作从真实场景与设计意图出发，明确输入条件、模型变量和输出标准，再用原型、评测或实体过程验证方案是否成立。</span>' +
            '</p>' +
            '<h3 class="about-sub">我如何工作</h3>' +
            '<div class="about-caps">' +
              '<div class="cap">' +
                '<span class="cap-no">01</span>' +
                '<div>' +
                  '<p class="cap-head">空间语境</p>' +
                  '<p class="cap-body">理解空间、构件、动线和现场约束，让技术方案回应真实任务，而不是停留在抽象功能。</p>' +
                '</div>' +
              '</div>' +
              '<div class="cap">' +
                '<span class="cap-no">02</span>' +
                '<div>' +
                  '<p class="cap-head">产品判断</p>' +
                  '<p class="cap-body">把模糊需求拆成输入、变量、输出与验证标准；在生成效果、可控性、成本与可执行性之间做取舍。</p>' +
                '</div>' +
              '</div>' +
              '<div class="cap">' +
                '<span class="cap-no">03</span>' +
                '<div>' +
                  '<p class="cap-head">技术转译</p>' +
                  '<p class="cap-body">将生成模型、数字制造、交互原型和评测方法，转化为团队可以讨论、使用和继续迭代的工作流。</p>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="about-contact">' +
              '<p class="contact-kicker">开放合作 / AI 产品、AIGC 工作流、空间智能与数字制造</p>' +
              '<p class="contact-mail">Email: <a href="' + MAILTO + '">' + EMAIL + '</a></p>' +
              '<div class="contact-actions">' +
                '<a class="contact-btn" href="' + RESUME + '" target="_blank" rel="noopener noreferrer">查看简历 ↗</a>' +
                '<a class="contact-btn" href="' + MAILTO + '">发送邮件 ↗</a>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<aside class="about-path" aria-label="经历路径">' +
            '<div class="path-head">' +
              '<p class="path-kicker">SELECTED PATH</p>' +
              '<p class="path-range">2017 — NOW</p>' +
            '</div>' +
            '<svg class="path-chart" id="aboutLineage" viewBox="0 0 ' + VBW + ' ' + VBH + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="能力路径时间轴：2017 至今，空间设计、计算与制造、产品化三条轨迹"></svg>' +
            '<ol class="path-list">' + makeItems() + '</ol>' +
            '<p class="path-hint">悬停或点击节点，查看该段经历的问题 / 方法 / 产出 / 带来。</p>' +
            '<p class="path-foot">FROM SPATIAL DESIGN TO AI PRODUCT SYSTEMS</p>' +
          '</aside>' +
        '</div>' +
      '</div>';
  }

  /* ── 构建 DOM ── */
  function bindPathEvents() {
    itemEls.forEach(function (li, i) {
      var btn = li.querySelector('.path-item-btn');
      btn.addEventListener('click', function () { toggle(i); });
      btn.addEventListener('mouseenter', function () { highlight(i); });
      btn.addEventListener('focus', function () { highlight(i); });
    });
  }

  function build() {
    if (embedded) {
      var mount = document.querySelector('#footerStage .footer-mount');
      if (!mount) return;
      mount.innerHTML = makeMainHTML();
      aside = mount.querySelector('.about-path');
      chart = mount.querySelector('#aboutLineage');
      listEl = mount.querySelector('.path-list');
      itemEls = Array.prototype.slice.call(listEl.querySelectorAll('.path-item'));
      bindPathEvents();
      if (!rendered) { renderChart(); rendered = true; }
      return;
    }

    overlay = document.createElement('div');
    overlay.className = 'about-overlay';
    overlay.id = 'aboutOverlay';
    overlay.setAttribute('aria-hidden', 'true');

    overlay.innerHTML = '' +
      '<div class="about-scroll">' +
        '<button class="about-close" type="button" aria-label="关闭关于我">' +
          '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' +
            '<path d="M5 5 L19 19 M19 5 L5 19" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
          '</svg>' +
        '</button>' +
        makeMainHTML() +
      '</div>';

    document.body.appendChild(overlay);

    panel = overlay.querySelector('.about-inner');
    closeBtn = overlay.querySelector('.about-close');
    aside = overlay.querySelector('.about-path');
    chart = overlay.querySelector('#aboutLineage');
    listEl = overlay.querySelector('.path-list');

    itemEls = Array.prototype.slice.call(listEl.querySelectorAll('.path-item'));

    closeBtn.addEventListener('click', close);
    bindPathEvents();
  }

  /* ── 渲染时间轴（L11 纵向转写）── */
  function renderChart() {
    if (!chart) return;
    chart.innerHTML = '';
    nodeEls = [];

    // 年份网格线 + 年份标签（L11 的环境结构层）
    for (var yr = Y0; yr <= 2026; yr++) {
      var gy = yY(yr);
      el(chart, 'line', {
        x1: AXIS, y1: gy, x2: RIGHT, y2: gy,
        stroke: 'rgba(255,255,255,0.10)', 'stroke-width': 0.8,
        class: 'ln-grid', style: 'animation-delay:' + ((yr - Y0) * 0.03) + 's'
      });
      txt(chart, {
        x: AXIS - 10, y: gy + 3, 'font-size': 8.5, 'font-weight': 700,
        fill: 'rgba(255,255,255,0.42)', 'text-anchor': 'end',
        class: 'ln-label', style: 'animation-delay:' + ((yr - Y0) * 0.03) + 's'
      }, String(yr));
    }

    // 竖向时间主轴
    el(chart, 'line', {
      x1: AXIS, y1: yY(Y0) - 6, x2: AXIS, y2: NOW_Y,
      stroke: 'rgba(255,255,255,0.22)', 'stroke-width': 1,
      class: 'ln-grid', style: 'animation-delay:0.1s'
    });

    // NOW 基线（L11 的 today's baseline）
    el(chart, 'line', {
      x1: AXIS, y1: NOW_Y, x2: RIGHT, y2: NOW_Y,
      stroke: 'rgba(255,255,255,0.14)', 'stroke-width': 0.8,
      class: 'ln-grid', style: 'animation-delay:0.3s'
    });

    // 三条能力轨迹：细实线 = 持续积累
    LANES.forEach(function (lane, li) {
      el(chart, 'line', {
        x1: lane.x, y1: yY(lane.from), x2: lane.x, y2: yY(lane.to),
        stroke: 'rgba(255,255,255,0.34)', 'stroke-width': 1,
        pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1,
        class: 'ln-lane', style: 'animation-delay:' + (0.25 + li * 0.1) + 's'
      });
      txt(chart, {
        x: lane.x, y: 14, 'font-size': 8.5, 'font-weight': 700,
        fill: 'rgba(255,255,255,0.72)', 'text-anchor': 'middle',
        class: 'ln-label', style: 'animation-delay:' + (0.15 + li * 0.06) + 's'
      }, lane.key);
      txt(chart, {
        x: lane.x, y: 24, 'font-size': 8, 'font-weight': 600,
        fill: 'rgba(255,255,255,0.4)', 'text-anchor': 'middle',
        class: 'ln-label', style: 'animation-delay:' + (0.15 + li * 0.06) + 's'
      }, lane.cn);
    });

    // 跨轨迹迁移引线
    NODES.forEach(function (n) {
      if (n.lanes.length < 2) return;
      var xs = n.lanes.map(function (li) { return LANES[li].x; });
      el(chart, 'line', {
        x1: Math.min.apply(null, xs), y1: yY(n.y0),
        x2: Math.max.apply(null, xs), y2: yY(n.y0),
        stroke: 'rgba(255,255,255,0.28)', 'stroke-width': 1,
        class: 'ln-grid', style: 'animation-delay:0.5s'
      });
    });

    // 真实项目节点：小方形标记（禁用圆形节点）
    NODES.forEach(function (n, ni) {
      n.lanes.forEach(function (li) {
        var x = LANES[li].x, y = yY(n.y0);
        var g = el(chart, 'g', { class: 'ln-node', 'data-node': ni, focusable: 'false' });
        el(g, 'rect', {
          class: 'ln-halo', x: x - 7, y: y - 7, width: 14, height: 14
        });
        el(g, 'rect', {
          class: 'ln-sq', x: x - 3, y: y - 3, width: 6, height: 6,
          style: 'animation-delay:' + (0.45 + ni * 0.07) + 's'
        });
        var hit = el(g, 'rect', { x: x - 11, y: y - 11, width: 22, height: 22, fill: 'transparent' });
        hit.setAttribute('data-node', ni);
        g.addEventListener('mouseenter', function () { highlight(ni); });
        g.addEventListener('click', function () { toggle(ni); });
        nodeEls.push(g);
      });
    });

    txt(chart, {
      x: RIGHT, y: NOW_Y - 5, 'font-size': 7.5, 'font-weight': 700,
      fill: 'rgba(255,255,255,0.34)', 'text-anchor': 'end',
      class: 'ln-label', style: 'animation-delay:0.4s'
    }, 'NOW');
  }

  /* ── 高亮 / 展开（桌面一次一个）── */
  function isDesktop() {
    return window.matchMedia('(min-width: 1101px)').matches;
  }
  function setActive(i) {
    activeIndex = i;
    nodeEls.forEach(function (g) {
      g.classList.toggle('is-active', Number(g.getAttribute('data-node')) === i);
    });
    itemEls.forEach(function (li, k) {
      li.classList.toggle('is-active', k === i);
      var b = li.querySelector('.path-item-btn');
      if (b) b.setAttribute('aria-expanded', String(k === i));
    });
    aside.classList.add('has-active');
  }
  function clearActive() {
    activeIndex = -1;
    nodeEls.forEach(function (g) { g.classList.remove('is-active'); });
    itemEls.forEach(function (li) {
      li.classList.remove('is-active');
      var b = li.querySelector('.path-item-btn');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
    aside.classList.remove('has-active');
  }
  function highlight(i) {
    if (!isDesktop() || activeIndex === i) return;
    setActive(i);
  }
  function toggle(i) {
    if (activeIndex === i) clearActive();
    else setActive(i);
  }

  /* ── 打开 / 关闭 ── */
  function closeIndexOverlays() {
    document.body.classList.remove('index-open');
    var io = document.getElementById('indexOverlay');
    if (io) {
      io.classList.remove('is-open');
      io.setAttribute('aria-hidden', 'true');
    }
    var ib = document.getElementById('indexViewBtn');
    if (ib) ib.classList.remove('active');
    document.body.style.overflow = '';
  }

  function open(trigger) {
    if (isOpen || embedded) return;
    isOpen = true;
    lastTrigger = trigger || document.activeElement || null;
    closeIndexOverlays();
    savedScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
    if (!rendered) { renderChart(); rendered = true; }
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('about-lock');
    document.body.classList.add('about-lock');
    try { closeBtn.focus({ preventScroll: true }); } catch (e) { closeBtn.focus(); }
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('about-lock');
    document.body.classList.remove('about-lock');
    var y = savedScroll;
    window.requestAnimationFrame(function () { window.scrollTo(0, y); });
    if (lastTrigger && lastTrigger.focus) {
      try { lastTrigger.focus({ preventScroll: true }); } catch (e) { lastTrigger.focus(); }
    }
    lastTrigger = null;
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) close();
  });

  document.addEventListener('click', function (e) {
    if (embedded) return;
    var t = e.target;
    if (!t || !t.closest) return;
    var trigger = t.closest('[data-about-open]');
    if (!trigger) return;
    e.preventDefault();
    open(trigger);
  });

  /* ── #about 直达：embedded 模式由宿主页自己切到 footer stage，
        浮层模式才需要主动打开。about.html 仍跳 index.html#about。── */
  function handleHash() {
    if (embedded) return;
    if (location.hash !== '#about') return;
    try {
      history.replaceState(null, '', location.pathname + location.search);
    } catch (e) { /* file:// 下可能不支持，忽略 */ }
    var btn = document.querySelector('[data-about-open]') || document.getElementById('aboutBtnTop');
    open(btn);
  }
  window.addEventListener('hashchange', handleHash);

  function init() {
    build();
    handleHash();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.AboutOverlay = { open: open, close: close };
})();
