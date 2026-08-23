(function () {
  const STORAGE_KEY = "ai-commerce-demo-state";
  const taskData = {
    product: {
      label: "白底产品图",
      route: "Nano Banana Pro",
      reason: "默认保护商品结构、颜色和边缘质量。",
      mode: "稳定商品展示",
      product: "复古运动服饰组合，帽子、球衣、裤装、鞋履",
      prompt: "保持商品颜色、材质、版型和图案一致，生成适合电商投放的高质感主图。"
    },
    model: {
      label: "虚拟模特图",
      route: "Nano Banana Pro",
      reason: "人物自然度、商品覆盖和广告完成度更均衡。",
      mode: "人物自然上身",
      product: "复古运动服饰组合，帽子、球衣、裤装、鞋履",
      prompt: "保持全部商品上身效果与图案一致，人物姿态自然，生成复古加油站广告图。"
    },
    scene: {
      label: "商品场景图",
      route: "Nano Banana Pro",
      reason: "多商品覆盖完整，场景融合自然。",
      mode: "多商品场景",
      product: "儿童房家居组合，床品、长颈鹿玩偶、收纳篮、玩具",
      prompt: "完整保留输入商品，在自然采光的儿童房中生成生活方式场景图。"
    },
    video: {
      label: "商品短视频",
      route: "Kling 3.0",
      reason: "服装与镜头稳定性更好，适合作为视频默认推荐。",
      mode: "人物自然动态",
      product: "人物服装展示视频，保持人物身份与服装印花",
      prompt: "人物从静止转为自然手势，镜头稳定，保持面部、服装与背景连续一致。"
    }
  };

  const candidateData = {
    nano: {
      name: "Nano Banana Pro",
      score: "4.62",
      note: "风格、人物自然度与商品覆盖最均衡，适合作为本任务首选。",
      crop: "crop-nano"
    },
    flux: {
      name: "FLUX-2-max",
      score: "4.20",
      note: "商品结构稳定，商业质感较好，但姿态约束完成度略低。",
      crop: "crop-flux"
    },
    gpt: {
      name: "GPT-Image 1.5",
      score: "4.03",
      note: "整体完成度可用，人物与背景表达较稳，商品细节仍需检查。",
      crop: "crop-gpt"
    },
    seedream: {
      name: "Seedream 4.5",
      score: "3.71",
      note: "构图完整，但复古风格与服装细节还原不足。",
      crop: "crop-seedream"
    },
    qwen: {
      name: "Qwen-3-Max",
      score: "3.24",
      note: "出现商品缺失与 CG 感，暂不作为默认推荐。",
      crop: "crop-qwen"
    }
  };

  const sceneCandidateData = {
    nano: { name: "Nano Banana Pro", score: "4.47", note: "商品覆盖完整，场景融合自然，整体完成度最高。", crop: "crop-nano" },
    flux: { name: "FLUX-2-max", score: "4.32", note: "商品结构与细节稳定，适合作为保真兜底。", crop: "crop-flux" },
    gpt: { name: "GPT-Image 1.5", score: "4.02", note: "场景完成度可用，但商品细节需要进一步复核。", crop: "crop-gpt" },
    seedream: { name: "Seedream 4.5", score: "2.83", note: "当前样例包含平台截图，需替换后再进入正式结论。", crop: "crop-seedream" },
    qwen: { name: "Qwen-3-Max", score: "3.00", note: "存在商品缺失，暂不作为多商品任务默认推荐。", crop: "crop-qwen" }
  };

  const videoCandidateData = {
    kling: { name: "Kling 3.0", score: "4.39", note: "服装、人物与镜头更稳定，适合服装展示视频。", crop: "video-crop crop-kling" },
    seedance: { name: "Seedance 2.0", score: "4.33", note: "人物身份与自然动作表现较好，适合作为互补推荐。", crop: "video-crop crop-seedance" },
    veo: { name: "Veo 3.1 Full", score: "3.93", note: "质量上限较高，适合预算更充足的备选任务。", crop: "video-crop crop-veo" },
    runway: { name: "Runway Gen 4.5", score: "3.90", note: "动作表达较强，服装连续性需要继续检查。", crop: "video-crop crop-runway" },
    wan: { name: "Wan 2.6", score: "3.73", note: "可作为成本敏感任务候选，稳定性低于双主力。", crop: "video-crop crop-wan" }
  };

  const benchmarkData = {
    image: {
      title: "图片模型评测",
      subtitle: "复古模特图任务，综合分为本次样例评分。",
      image: "images/EC/gas_station_model_image_models.jpg",
      alt: "五个图片模型生成复古模特广告图的对照",
      note: "Nano Banana Pro 在商品覆盖、人物自然度和风格完成度之间最均衡。FLUX-2-max 适合作为商品保真兜底。",
      rows: [
        ["Nano Banana Pro", "4.62", "默认模特图，综合完成度最高"],
        ["FLUX-2-max", "4.20", "商品结构与广告质感兜底"],
        ["GPT-Image 1.5", "4.03", "通用生成备选"],
        ["Seedream 4.5", "3.71", "风格与姿态需加强"],
        ["Qwen-3-Max", "3.24", "商品缺失风险较高"]
      ]
    },
    video: {
      title: "视频模型评测",
      subtitle: "服装展示任务，用关键帧检查连续一致性。",
      image: "images/EC/full_body_video_keyframes.jpg",
      alt: "六个视频模型在服装展示任务中的关键帧对照",
      note: "Kling 3.0 更适合服装稳定、镜头控制和商品锚定。Seedance 2.0 在人物自然动作上形成互补。",
      rows: [
        ["Kling 3.0", "4.39", "服装稳定与镜头控制"],
        ["Seedance 2.0", "4.33", "人物自然动作与身份保持"],
        ["Veo 3.1 Full", "3.93", "高预算质量备选"],
        ["Runway Gen 4.5", "3.90", "动作表达备选"],
        ["Wan 2.6", "3.73", "成本敏感任务候选"]
      ]
    }
  };

  function readState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (error) {
      return {};
    }
  }

  function writeState(next) {
    const state = Object.assign({}, readState(), next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return state;
  }

  function showToast(message) {
    const toast = document.querySelector("[data-toast]");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 1700);
  }

  function selectOne(container, target, selector) {
    container.querySelectorAll(selector).forEach(function (item) {
      item.classList.toggle("is-selected", item === target);
      item.setAttribute("aria-pressed", item === target ? "true" : "false");
    });
  }

  function initSetup() {
    const setup = document.querySelector("[data-setup-page]");
    if (!setup) return;

    const state = readState();
    const taskKey = state.task && taskData[state.task] ? state.task : "model";
    const productInput = document.querySelector("[data-product-input]");
    const promptInput = document.querySelector("[data-prompt-input]");
    const taskLabel = document.querySelector("[data-summary-task]");
    const platformLabel = document.querySelector("[data-summary-platform]");
    const modeLabel = document.querySelector("[data-summary-mode]");
    const routeName = document.querySelector("[data-route-name]");
    const routeReason = document.querySelector("[data-route-reason]");
    const generateButton = document.querySelector("[data-generate]");

    function applyTask(key, preserveInput) {
      const data = taskData[key];
      document.querySelectorAll("[data-task]").forEach(function (button) {
        const selected = button.dataset.task === key;
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", selected ? "true" : "false");
      });
      if (!preserveInput) {
        productInput.value = data.product;
        promptInput.value = data.prompt;
      }
      taskLabel.textContent = data.label;
      routeName.textContent = data.route;
      routeReason.textContent = data.reason;
      modeLabel.textContent = data.mode;
      writeState({ task: key, mode: data.mode });
    }

    applyTask(taskKey, Boolean(state.product || state.prompt));
    if (state.product) productInput.value = state.product;
    if (state.prompt) promptInput.value = state.prompt;

    document.querySelectorAll("[data-task]").forEach(function (button) {
      button.addEventListener("click", function () {
        applyTask(button.dataset.task, false);
      });
    });

    const sampleUpload = document.querySelector("[data-sample-upload]");
    sampleUpload.addEventListener("click", function () {
      showToast("Demo 保留当前样例素材");
    });

    document.querySelectorAll("[data-choice-group]").forEach(function (group) {
      group.addEventListener("click", function (event) {
        const choice = event.target.closest("[data-choice]");
        if (!choice) return;
        selectOne(group, choice, "[data-choice]");
        const key = group.dataset.choiceGroup;
        const value = choice.dataset.choice;
        writeState({ [key]: value });
        if (key === "platform") platformLabel.textContent = value;
        if (key === "mode") modeLabel.textContent = value;
      });
    });

    if (state.platform) {
      const platform = document.querySelector('[data-choice-group="platform"] [data-choice="' + state.platform + '"]');
      if (platform) platform.click();
    }

    generateButton.addEventListener("click", function () {
      const productField = productInput.closest(".field");
      const promptField = promptInput.closest(".field");
      productField.classList.toggle("has-error", !productInput.value.trim());
      promptField.classList.toggle("has-error", !promptInput.value.trim());
      if (!productInput.value.trim() || !promptInput.value.trim()) {
        showToast("请补充商品信息和生成目标");
        return;
      }

      writeState({
        product: productInput.value.trim(),
        prompt: promptInput.value.trim(),
        platform: platformLabel.textContent,
        mode: modeLabel.textContent
      });
      generateButton.classList.add("is-loading");
      generateButton.disabled = true;
      window.setTimeout(function () {
        window.location.href = "demo-ai-commerce-results.html";
      }, 650);
    });
  }

  function initResults() {
    const results = document.querySelector("[data-results-page]");
    if (!results) return;

    const state = readState();
    const task = taskData[state.task] || taskData.model;
    const taskContext = document.querySelector("[data-task-context]");
    const selectedName = document.querySelector("[data-selected-name]");
    const selectedScore = document.querySelector("[data-selected-score]");
    const selectedNote = document.querySelector("[data-selected-note]");
    const previewFrame = document.querySelector("[data-selected-media]");
    const decisionCopy = document.querySelector("[data-decision-copy]");
    const failureBox = document.querySelector("[data-failure-box]");
    const submitButton = document.querySelector("[data-submit-review]");
    const isVideo = state.task === "video";
    const isScene = state.task === "scene";
    const candidates = isVideo ? videoCandidateData : (isScene ? sceneCandidateData : candidateData);
    const sourceImage = isVideo
      ? "images/EC/full_body_video_keyframes.jpg"
      : (isScene ? "images/EC/children_room_image_models.jpg" : "images/EC/gas_station_model_image_models.jpg");
    const candidateStrip = document.querySelector("[data-candidate-strip]");
    const defaultCandidate = isVideo ? "kling" : "nano";
    let selectedCandidate = candidates[state.candidate] ? state.candidate : defaultCandidate;
    let decision = state.decision || "accept";

    taskContext.textContent = task.label + " / " + (state.platform || "淘宝主图 1:1");

    function renderCandidate(key) {
      const data = candidates[key];
      selectedCandidate = key;
      selectedName.textContent = data.name;
      selectedScore.textContent = data.score;
      selectedNote.textContent = data.note;
      previewFrame.innerHTML = '<img src="' + sourceImage + '" alt="' + data.name + ' 生成结果，来自实际 Benchmark 对照图">';
      previewFrame.className = "candidate-thumb selected-media " + data.crop;
      document.querySelectorAll("[data-candidate]").forEach(function (button) {
        const selected = button.dataset.candidate === key;
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", selected ? "true" : "false");
      });
      writeState({ candidate: key });
    }

    function renderDecision(next) {
      decision = next;
      document.querySelectorAll("[data-decision]").forEach(function (button) {
        const selected = button.dataset.decision === next;
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", selected ? "true" : "false");
      });
      const needsRevision = next === "revise";
      failureBox.classList.toggle("is-visible", needsRevision);
      decisionCopy.textContent = needsRevision
        ? "选择具体问题，系统会把标签写入失败样本并触发重生成策略。"
        : "采纳结果会记录模型、任务与约束，用于后续推荐效果分析。";
      submitButton.textContent = needsRevision ? "提交问题并查看后台依据" : "采纳结果并查看后台依据";
      writeState({ decision: next });
    }

    candidateStrip.innerHTML = Object.keys(candidates).map(function (key) {
      const item = candidates[key];
      return '<button class="candidate" type="button" data-candidate="' + key + '" aria-pressed="false">' +
        '<span class="candidate-thumb ' + item.crop + '"><img src="' + sourceImage + '" alt="' + item.name + ' 候选缩略图"></span>' +
        '<strong>' + item.name + '</strong><span>' + item.score + '</span></button>';
    }).join("");

    renderCandidate(selectedCandidate);
    renderDecision(decision);

    document.querySelectorAll("[data-candidate]").forEach(function (button) {
      button.addEventListener("click", function () {
        renderCandidate(button.dataset.candidate);
      });
    });

    document.querySelectorAll("[data-decision]").forEach(function (button) {
      button.addEventListener("click", function () {
        renderDecision(button.dataset.decision);
      });
    });

    document.querySelectorAll("[data-failure]").forEach(function (button) {
      button.addEventListener("click", function () {
        button.classList.toggle("is-selected");
        button.setAttribute("aria-pressed", button.classList.contains("is-selected") ? "true" : "false");
      });
    });

    submitButton.addEventListener("click", function () {
      const failures = Array.from(document.querySelectorAll("[data-failure].is-selected")).map(function (item) {
        return item.dataset.failure;
      });
      if (decision === "revise" && failures.length === 0) {
        showToast("请至少选择一个问题标签");
        return;
      }
      writeState({ candidate: selectedCandidate, decision: decision, failures: failures });
      submitButton.classList.add("is-loading");
      submitButton.disabled = true;
      window.setTimeout(function () {
        window.location.href = "demo-ai-commerce-benchmark.html";
      }, 520);
    });
  }

  function initBenchmark() {
    const benchmark = document.querySelector("[data-benchmark-page]");
    if (!benchmark) return;

    const state = readState();
    const task = taskData[state.task] || taskData.model;
    const route = document.querySelector("[data-final-route]");
    const routeContext = document.querySelector("[data-route-context]");
    const evidenceTitle = document.querySelector("[data-evidence-title]");
    const evidenceSubtitle = document.querySelector("[data-evidence-subtitle]");
    const evidenceImage = document.querySelector("[data-evidence-image]");
    const evidenceNote = document.querySelector("[data-evidence-note]");
    const ranking = document.querySelector("[data-ranking]");
    const routeList = document.querySelector("[data-route-list]");

    route.textContent = task.route;
    routeContext.textContent = task.label + " / " + (state.mode || task.mode);
    routeList.innerHTML = state.task === "video"
      ? '<div class="route-item"><strong>稳定默认推荐</strong><p>Kling 3.0 负责服装稳定、商品锚定与镜头控制。</p></div>' +
        '<div class="route-item"><strong>自然动作备选</strong><p>Seedance 2.0 负责人物身份保持和自然动作。</p></div>' +
        '<div class="route-item"><strong>质量兜底</strong><p>预算充足且追求质量上限时使用 Veo 3.1 Full。</p></div>'
      : '<div class="route-item"><strong>默认推荐</strong><p>Nano Banana Pro 负责商品场景图与虚拟模特图的综合完成度。</p></div>' +
        '<div class="route-item"><strong>保真兜底</strong><p>商品结构或细节风险较高时切换 FLUX-2-max。</p></div>' +
        '<div class="route-item"><strong>风险规则</strong><p>商品缺失、Logo 错误或结构变形时进入重生成队列。</p></div>';

    function renderBenchmark(key) {
      const data = benchmarkData[key];
      document.querySelectorAll("[data-benchmark-tab]").forEach(function (button) {
        const selected = button.dataset.benchmarkTab === key;
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", selected ? "true" : "false");
      });
      evidenceTitle.textContent = data.title;
      evidenceSubtitle.textContent = data.subtitle;
      evidenceImage.src = data.image;
      evidenceImage.alt = data.alt;
      evidenceNote.textContent = data.note;
      ranking.innerHTML = data.rows.map(function (row) {
        return '<div class="ranking-row"><strong>' + row[0] + '</strong><strong>' + row[1] + '</strong><span>' + row[2] + '</span></div>';
      }).join("");
    }

    renderBenchmark(state.task === "video" ? "video" : "image");

    document.querySelectorAll("[data-benchmark-tab]").forEach(function (button) {
      button.addEventListener("click", function () {
        renderBenchmark(button.dataset.benchmarkTab);
      });
    });
  }

  initSetup();
  initResults();
  initBenchmark();
})();
