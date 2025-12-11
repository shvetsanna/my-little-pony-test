 const questions = [
  {
    q: "Что тебе ближе всего в школе/универе?",
    a: [
      { t: "Учиться и узнавать новое", w: { magic: 2, creativity: 1 } },
      { t: "Помогать друзьям и поддерживать", w: { kindness: 2 } },
      { t: "Смеяться, делать атмосферу", w: { laughter: 2 } },
      { t: "Быть лидером в команде", w: { loyalty: 2 } },
    ],
  },
  {
    q: "Как ты действуешь в стрессовой ситуации?",
    a: [
      { t: "Думаю и решаю логично", w: { magic: 2, honesty: 1 } },
      { t: "Успокаиваю других и себя", w: { kindness: 2 } },
      { t: "Разряжаю шуткой", w: { laughter: 2 } },
      { t: "Быстро беру ответственность", w: { loyalty: 2 } },
    ],
  },
  {
    q: "Твой идеальный выходной?",
    a: [
      { t: "Книги/курсы/новый навык", w: { magic: 2 } },
      { t: "Творчество: рисовать/снимать/делать", w: { creativity: 2 } },
      { t: "Встреча с друзьями и приколы", w: { laughter: 2 } },
      { t: "Спорт/движ/активности", w: { loyalty: 1, honesty: 1 } },
    ],
  },
  {
    q: "Какой комплимент тебе приятнее всего?",
    a: [
      { t: "Ты умная и сильная", w: { magic: 2 } },
      { t: "С тобой тепло и спокойно", w: { kindness: 2 } },
      { t: "Ты заряжаешь всех", w: { laughter: 2 } },
      { t: "На тебя можно положиться", w: { loyalty: 2, honesty: 1 } },
    ],
  },
  {
    q: "Что ты ценишь в людях больше всего?",
    a: [
      { t: "Честность", w: { honesty: 2 } },
      { t: "Доброе сердце", w: { kindness: 2 } },
      { t: "Верность и поддержка", w: { loyalty: 2 } },
      { t: "Креатив и идея", w: { creativity: 2 } },
    ],
  },
  {
    q: "Если у тебя появляется идея, ты…",
    a: [
      { t: "Планирую и делаю шаг за шагом", w: { magic: 1, honesty: 1 } },
      { t: "Сразу начинаю творить", w: { creativity: 2 } },
      { t: "Зову друзей и делаю вместе", w: { loyalty: 1, laughter: 1 } },
      { t: "Думаю, как это поможет другим", w: { kindness: 2 } },
    ],
  },
  {
    q: "Твоя энергия чаще всего такая:",
    a: [
      { t: "Спокойная, уверенная", w: { honesty: 2 } },
      { t: "Яркая, весёлая", w: { laughter: 2 } },
      { t: "Мягкая и заботливая", w: { kindness: 2 } },
      { t: "Смелая и командная", w: { loyalty: 2 } },
    ],
  },
];

const poniesByMark = {
  magic: {
    name: "Twilight Sparkle",
    desc: "Ты любишь учиться, развиваться и собирать знания. Когда надо — ты собранная и очень сильная."
  },
  kindness: {
    name: "Fluttershy",
    desc: "Ты мягкая, заботливая и умеешь поддержать. С тобой безопасно и тепло."
  },
  loyalty: {
    name: "Rainbow Dash",
    desc: "Ты смелая, быстрая и верная. Ты умеешь вдохновлять и не бросаешь своих."
  },
  laughter: {
    name: "Pinkie Pie",
    desc: "Ты про радость, энергию и атмосферу. Ты умеешь поднимать настроение и делать день ярче."
  },
  honesty: {
    name: "Applejack",
    desc: "Ты честная и надёжная. Ты не любишь фальшь и умеешь держать слово."
  },
  creativity: {
    name: "Rarity",
    desc: "Ты про стиль, идеи и красоту. Ты видишь детали и превращаешь обычное в вау."
  },
};

let i = 0;
let picked = null;
let score = 0;
const points = { magic: 0, kindness: 0, loyalty: 0, laughter: 0, honesty: 0, creativity: 0 };

const $q = document.getElementById("question");
const $answers = document.getElementById("answers");
const $next = document.getElementById("nextBtn");
const $back = document.getElementById("backBtn");
const $score = document.getElementById("score");
const $counter = document.getElementById("qCounter");
const $bar = document.getElementById("bar");

render();

$next.addEventListener("click", () => {
  if (picked === null) return;

  const item = questions[i].a[picked];
  addWeights(item.w);

  if (i < questions.length - 1) {
    i++;
    picked = null;
    render();
  } else {
    const markKey = bestMark();
    const pony = poniesByMark[markKey];

    localStorage.setItem("mlp_result", JSON.stringify({
      markKey,
      pony,
      score,
      points
    }));

    window.location.href = "result.html";
  }
});

$back.addEventListener("click", () => {
  if (i === 0) return;
  // Чтобы “назад” было честным — перезапускаем (очень просто и безопасно для сдачи)
  // Можно усложнить и хранить историю, но для лёгкого проекта так ок.
  resetAll();
});

function render() {
  const total = questions.length;
  const pct = Math.round(((i) / total) * 100);
  $bar.style.width = `${pct}%`;

  $counter.textContent = `Вопрос ${i + 1} из ${total}`;
  $q.textContent = questions[i].q;

  $answers.innerHTML = "";
  questions[i].a.forEach((ans, idx) => {
    const btn = document.createElement("button");
    btn.className = "answer";
    btn.type = "button";
    btn.textContent = ans.t;

    btn.addEventListener("click", () => {
      picked = idx;
      [...$answers.children].forEach(el => el.classList.remove("selected"));
      btn.classList.add("selected");
      $next.disabled = false;
    });

    $answers.appendChild(btn);
  });

  $next.disabled = true;
  $back.disabled = (i === 0);
  $score.textContent = String(score);
}

function addWeights(w) {
  Object.keys(w).forEach(k => {
    points[k] += w[k];
    score += w[k];
  });
  $score.textContent = String(score);
}

function bestMark() {
  let bestK = "magic";
  let bestV = -Infinity;
  for (const k in points) {
    if (points[k] > bestV) { bestV = points[k]; bestK = k; }
  }
  return bestK;
}

function resetAll() {
  i = 0;
  picked = null;
  score = 0;
  for (const k in points) points[k] = 0;
  render();
}
