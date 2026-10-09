/* Shared About content for the home footer and project-page dialog. */
(function () {
  'use strict';

  var EMAIL = 'zhou_ziheng1@outlook.com';
  var projects = [
    {
      title: 'LLM-to-3D Fabrication', context: '同济大学 · 研究助理',
      date: '2024.04 - 2025.05', tag: 'AI生成3D / 几何处理 / 实体搭建',
      href: 'work-LLM_to_Construction.html', image: 'images/llmToConstruction/BRIDGE_00.webp',
      alt: '由多规格木质构件搭建的桥梁实体模型',
      text: '参与Prompt驱动的3D生成与离散建造，将生成Mesh、Rhino几何处理、OR-Tools约束优化与木构件搭建连接起来。在团队既有算法基础上调参与改进约束，使输出直接确定多种尺寸构件的数量和装配位置，并参与实体搭建。'
    },
    {
      title: '空间机器人运动及仿真训练', context: 'UCL · 研究项目',
      date: '2022.09 - 2023.12', tag: '3D打印 / 机器人控制 / 仿真验证',
      href: 'work-ucl.html', image: 'images/UCL/prototype_1.webp',
      alt: '六关节空间机器人的实体原型与结构示意',
      text: '负责机器人运动算法与搭建相关工作，参与六关节机器人的3D建模、打印、装配和控制。在Unity / ML-Agents中开展接近、抓取、移动和放置等子任务训练，并结合Unity、树莓派及DXL控制模块完成策略驱动的实体动作验证。'
    },
    {
      title: 'AI电商素材生成平台', context: '业余合作项目 · 产品设计与评测',
      date: '2025.11 - 至今', tag: '需求拆解 / 多模型评测 / 模型选择策略',
      href: 'work-ai-commerce.html', image: 'images/EC/0.webp',
      alt: 'AI电商素材生成项目的视觉素材展示',
      text: '参与商品图、模特图和视频生成工具的产品设计，完成需求拆解、PRD及模型评测。比较5款图片模型与6款视频模型，通过人工主评和多模态辅助复核识别失败类型，形成任务级模型选择策略与反馈采集方案。'
    }
  ];

  var practices = [
    {
      title: 'AICO｜AI工作流设计与项目交付', date: '2025.05 - 至今',
      href: 'work-interior-ai.html',
      text: '以3D空间原型为基础，通过自主设计的Prompt、ComfyUI控制与局部修整重构视觉生产流程。将同等用途表现图的制作时间由约1–2个工作日缩短至2–3小时，用于实际交付并推动团队复用。'
    },
    {
      title: '空间晶格机器人3D打印Workshop', date: '本科期间',
      text: '使用PLA、PETG开展六轴机械臂空间晶格打印，负责机器人编程与实体操作；通过挤出、风冷和运动速度调试，处理节点粘结、塌陷及出料不稳定问题。'
    },
    {
      title: 'DUCK CE全球四城联动活动', date: '2025',
      href: 'work-global-relay-conference.html',
      text: '在三人团队中负责生成式图像与动态内容，直接对接客户和设计负责人。将四座城市、不同时段组织为统一视觉叙事，根据反馈迭代风格，交付20余张图片、10余组动态方案及Logo设计。'
    }
  ];

  function projectMarkup(p) {
    return '<article class="about-project">' +
      '<a class="about-project-image" href="' + p.href + '" tabindex="-1" aria-hidden="true">' +
        '<img src="' + p.image + '" alt="' + p.alt + '" loading="lazy" width="560" height="400"></a>' +
      '<div class="about-project-copy"><div class="about-project-meta"><span>' + p.context + '</span><span>' + p.date + '</span></div>' +
        '<h4><a href="' + p.href + '">' + p.title + '<span class="about-link-arrow" aria-hidden="true">↗</span></a></h4>' +
        '<p>' + p.text + '</p><p class="about-project-tags">' + p.tag + '</p></div></article>';
  }

  function practiceMarkup(p) {
    var title = p.href ? '<a href="' + p.href + '">' + p.title + '<span class="about-link-arrow" aria-hidden="true">↗</span></a>' : p.title;
    return '<article class="about-practice"><div class="about-practice-heading"><h4>' + title + '</h4><span>' + p.date + '</span></div><p>' + p.text + '</p></article>';
  }

  function makeMainHTML() {
    return '<div class="about-inner">' +
      '<header class="about-intro"><p class="about-kicker">ABOUT / ZIHENG ZHOU</p>' +
        '<h2 class="about-title" id="about-title">周子恒<span>3D创作与AI工作流</span></h2>' +
        '<p class="about-lede">我有空间设计与数字制造背景，关注AI如何参与3D创作，以及生成结果如何进入编辑、制作和使用。</p>' +
        '<p class="about-lede about-lede-secondary">我的实践包括AI生成3D、几何处理、机器人仿真与实体搭建，也包括商业项目中的AI视觉工作流和图像、视频模型评测。相比单次生成的效果，我更在意创作者能否控制结果、继续修改，并最终完成交付。</p>' +
        '<p class="about-statement">从模型到实体，从创作实践到工具设计。</p>' +
      '</header>' +
      '<section class="about-section" aria-labelledby="about-selected"><div class="about-section-heading"><h3 id="about-selected">主要项目</h3><span>3D实践与产品方法</span></div>' + projects.map(projectMarkup).join('') + '</section>' +
      '<section class="about-section" aria-labelledby="about-practices"><div class="about-section-heading"><h3 id="about-practices">补充实践</h3><span>商业交付与制作实验</span></div><div class="about-practices">' + practices.map(practiceMarkup).join('') + '</div></section>' +
      '<section class="about-section" aria-labelledby="about-education"><div class="about-section-heading"><h3 id="about-education">教育背景</h3></div>' +
        '<div class="about-education"><div><h4>伦敦大学学院（UCL）</h4><p>建筑设计硕士 · Distinction</p></div><span>2022.09 - 2023.12</span></div>' +
        '<div class="about-education"><div><h4>青岛理工大学</h4><p>建筑学学士 · 专业排名2/81 · 校级优秀毕业生</p></div><span>2017.09 - 2022.06</span></div></section>' +
      '<footer class="about-contact"><h3>保持联系</h3><p>关注3D创作工具、AI生成工作流与数字制造产品。</p>' +
        '<a class="about-email" href="mailto:' + EMAIL + '">' + EMAIL + '</a>' +
        '<nav class="about-contact-links" aria-label="简历与联系"><a href="doc/简历.pdf" target="_blank" rel="noopener noreferrer">AI＋3D简历 <span aria-hidden="true">↗</span></a><a href="mailto:' + EMAIL + '">发送邮件 <span aria-hidden="true">↗</span></a><a href="index.html">返回首页 <span aria-hidden="true">↗</span></a></nav>' +
      '</footer></div>';
  }

  var embedded = !!document.getElementById('footerStage');
  var overlay, closeBtn, lastTrigger, savedScroll = 0, isOpen = false;

  function closeIndexOverlays() {
    document.body.classList.remove('index-open');
    var panel = document.getElementById('indexOverlay');
    if (panel) { panel.classList.remove('is-open'); panel.setAttribute('aria-hidden', 'true'); }
    var button = document.getElementById('indexViewBtn');
    if (button) button.classList.remove('active');
    document.body.style.overflow = '';
  }

  function open(trigger) {
    if (isOpen || embedded || !overlay) return;
    isOpen = true;
    lastTrigger = trigger || document.activeElement;
    savedScroll = window.scrollY;
    closeIndexOverlays();
    overlay.inert = false;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('about-lock');
    document.body.classList.add('about-lock');
    window.requestAnimationFrame(function () {
      if (isOpen) closeBtn.focus({ preventScroll: true });
    });
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.remove('is-open');
    document.documentElement.classList.remove('about-lock');
    document.body.classList.remove('about-lock');
    if (lastTrigger && lastTrigger.isConnected) lastTrigger.focus({ preventScroll: true });
    else document.activeElement.blur();
    overlay.setAttribute('aria-hidden', 'true');
    overlay.inert = true;
    window.scrollTo(0, savedScroll);
  }

  function handleHash() {
    if (embedded || location.hash !== '#about') return;
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* file URLs can restrict history. */ }
    open(document.querySelector('[data-about-open]'));
  }

  function init() {
    if (embedded) {
      var mount = document.querySelector('#footerStage .footer-mount');
      if (mount) mount.innerHTML = makeMainHTML();
      return;
    }
    overlay = document.createElement('section');
    overlay.className = 'about-overlay';
    overlay.id = 'aboutOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'about-title');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.inert = true;
    overlay.innerHTML = '<button class="about-close" type="button" aria-label="关闭关于我" title="关闭">&times;</button><div class="about-scroll">' + makeMainHTML() + '</div>';
    document.body.appendChild(overlay);
    closeBtn = overlay.querySelector('.about-close');
    closeBtn.addEventListener('click', close);
    handleHash();
  }

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest && event.target.closest('[data-about-open]');
    if (!embedded && trigger) { event.preventDefault(); open(trigger); }
  });
  document.addEventListener('keydown', function (event) {
    if (!isOpen) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); }
    if (event.key !== 'Tab') return;
    var stops = overlay.querySelectorAll('button, a[href]:not([tabindex="-1"])');
    var first = stops[0], last = stops[stops.length - 1];
    if (!overlay.contains(document.activeElement)) { event.preventDefault(); first.focus(); }
    else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  window.addEventListener('hashchange', handleHash);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  window.AboutOverlay = { open: open, close: close };
})();
