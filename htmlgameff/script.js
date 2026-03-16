const QUESTIONS_PER_TEST = 20;

// 풀: 논리 위주 + 일부 수열/언어. 테스트 시작 시 20문제 랜덤 추출
const questionPool = [
  {
    type: "논리 추리",
    text: "모든 A는 B이다. 어떤 C는 A이다. 이때 항상 참인 명제는?",
    sequence: "",
    options: ["어떤 C는 B이다.", "모든 C는 B이다.", "모든 B는 C이다.", "어떤 B는 C가 아니다."],
    correct: 0,
    hint: "그림으로 집합을 그려 보세요."
  },
  {
    type: "논리 추리",
    text: "철수, 영희, 민수 중 한 명은 항상 거짓말을 하고, 나머지 둘은 항상 진실만 말한다.\n철수: “거짓말쟁이는 영희야.”\n영희: “거짓말쟁이는 민수야.”\n민수: “나는 거짓말쟁이가 아니야.”\n거짓말쟁이는 누구인가?",
    sequence: "",
    options: ["철수", "영희", "민수", "아무도 아니다"],
    correct: 1,
    hint: "각 사람이 거짓말쟁이라고 가정해 보세요."
  },
  {
    type: "논리 추리",
    text: "어느 마을에는 기사(항상 진실만 말함)와 악당(항상 거짓말만 함)만 산다.\n한 사람이 말한다. “나는 악당이다.” 이 사람은 누구인가?",
    sequence: "",
    options: ["기사", "악당", "둘 다 가능", "알 수 없다"],
    correct: 0,
    hint: "악당이 ‘나는 악당이다’라고 말할 수 있을까요?"
  },
  {
    type: "논리 추리",
    text: "네 개의 카드에 A, B, C, D가 각각 한 글자씩 적혀 있다.\n항상 A는 B보다 왼쪽에, B는 C보다 왼쪽에 있어야 한다.\n가능한 배열 중 알맞은 것은?",
    sequence: "",
    options: ["ABCD", "BACD", "CBAD", "DCBA"],
    correct: 0,
    hint: "A-B-C 순서는 지켜야 합니다."
  },
  {
    type: "논리 추리",
    text: "“비가 오면 지하철이 막힌다.”가 참일 때, 다음 중 반드시 참인 것은?",
    sequence: "",
    options: ["비가 오지 않으면 지하철이 안 막힌다.", "지하철이 막히면 비가 왔다.", "지하철이 막히지 않으면 비가 오지 않았다.", "비가 왔는데 지하철이 막히지 않을 수 있다."],
    correct: 2,
    hint: "대우 명제를 생각해 보세요."
  },
  {
    type: "논리 추리",
    text: "A, B, C 중 정확히 한 명만 진실을 말한다.\nA: “B가 거짓말을 한다.”\nB: “C가 거짓말을 한다.”\nC: “A와 B 중 한 명은 거짓말을 한다.”\n진실을 말하는 사람은?",
    sequence: "",
    options: ["A", "B", "C", "정할 수 없다"],
    correct: 2,
    hint: "C가 진실이라고 가정해 보세요."
  },
  {
    type: "논리 추리",
    text: "다음 명제가 모두 참이다.\n· 김씨는 박씨보다 키가 크다.\n· 이씨는 최씨보다 키가 작다.\n· 박씨는 이씨보다 키가 크다.\n키가 가장 큰 사람은?",
    sequence: "",
    options: ["김씨", "박씨", "이씨", "최씨"],
    correct: 0,
    hint: "크기 관계를 순서로 나열해 보세요."
  },
  {
    type: "논리 추리",
    text: "세 명 중 한 명만 진실을 말한다.\n갑: “을이 거짓말쟁이야.”\n을: “병이 거짓말쟁이야.”\n병: “갑이 거짓말쟁이야.”\n거짓말쟁이는 누구인가?",
    sequence: "",
    options: ["갑", "을", "병", "정할 수 없다"],
    correct: 1,
    hint: "을이 거짓말쟁이면 갑과 병은 진실이어야 합니다."
  },
  {
    type: "논리 추리",
    text: "“모든 과학자는 논리적이다”가 참이면, 다음 중 반드시 참인 것은?",
    sequence: "",
    options: ["논리적이지 않으면 과학자가 아니다.", "논리적이면 과학자다.", "과학자가 아니면 논리적이지 않다.", "논리적이지 않은 사람은 없다."],
    correct: 0,
    hint: "전체 부정의 대우를 생각해 보세요."
  },
  {
    type: "논리 추리",
    text: "다섯 학생 A, B, C, D, E가 한 줄로 선다. A는 B보다 앞에 있고, C는 D보다 뒤에 있으며, E는 맨 앞에 선다. 이 조건만으로 맨 뒤에 설 수 있는 사람은?",
    sequence: "",
    options: ["A만 가능", "C만 가능", "C 또는 E", "정할 수 없다"],
    correct: 2,
    hint: "E=1번, A는 B 앞. C는 D 뒤. 맨 뒤(5번)는 D 뒤에 오는 C 또는 E가 될 수 있습니다."
  },
  {
    type: "논리 추리",
    text: "A, B, C 중 정확히 한 명이 범인이다. 그들은 각각 한 번씩 말한다.\nA: “나는 범인이 아니다.”\nB: “A가 범인이다.”\nC: “B가 범인이다.”\n범인이 거짓말을 하고 나머지는 진실을 말한다면 범인은?",
    sequence: "",
    options: ["A", "B", "C", "정할 수 없다"],
    correct: 0,
    hint: "범인만 거짓말합니다. A가 범인이면 A만 거짓."
  },
  {
    type: "논리 추리",
    text: "세 문이 있다. 한 문 뒤에는 상품이 있고, 나머지 둘 뒤에는 꽝이다. 진행자는 상품 위치를 안다. 당신이 1번 문을 고른 뒤, 진행자가 3번 문을 열어 꽝을 보여 준다. 이때 2번 문으로 바꾸는 것이 유리한가?",
    sequence: "",
    options: ["바꾸는 것이 유리하다", "바꾸지 않는 것이 유리하다", "동일하다", "알 수 없다"],
    correct: 0,
    hint: "몬티 홀 문제입니다. 바꾸면 확률이 2/3로 올라갑니다."
  },
  {
    type: "논리 추리",
    text: "다음 중 “필요조건”과 “충분조건” 관계가 바르게 된 것은? (p → q일 때)\n① p는 q의 충분조건\n② q는 p의 필요조건",
    sequence: "",
    options: ["①만 맞다", "②만 맞다", "둘 다 맞다", "둘 다 틀리다"],
    correct: 2,
    hint: "p가 성립하면 q가 성립할 때, p는 q의 충분조건, q는 p의 필요조건입니다."
  },
  {
    type: "논리 추리",
    text: "A, B, C, D 네 명이 달리기 순위를 겨룬다. 알려진 정보는 다음과 같다.\n· A는 B보다 빠르다.\n· C는 꼴찌가 아니다.\n· D는 B보다 느리다.\n두 번째로 들어온 사람은?",
    sequence: "",
    options: ["A", "B", "C", "정보 부족으로 알 수 없다"],
    correct: 3,
    hint: "A>B, D는 B보다 느리므로 B>D. C는 꼴찌 아님. 1등은 A 또는 C로만 알 수 있고 2등은 정할 수 없습니다."
  },
  {
    type: "논리 추리",
    text: "“이 방에 들어오면 반드시 모자를 벗는다.”가 성립하는 방에 철수가 모자를 쓰고 들어왔다. 다음 중 반드시 참인 것은?",
    sequence: "",
    options: ["철수는 모자를 벗었다.", "철수는 규칙을 어겼다.", "이 방에서는 모자를 쓸 수 없다.", "규칙이 거짓이다."],
    correct: 1,
    hint: "들어오면 벗는다 = 들어온 사람은 벗은 상태여야 한다. 쓰고 들어왔으므로 규칙 위반."
  },
  {
    type: "언어/단어 추리",
    text: "다음 중 나머지와 성격이 다른 하나는?",
    sequence: "사과 / 배 / 포도 / 당근",
    options: ["사과", "배", "포도", "당근"],
    correct: 3,
    hint: "세 개는 과일, 하나는 채소입니다."
  },
  {
    type: "언어/단어 추리",
    text: "빈칸에 들어갈 알맞은 글자는?\n가, 나, 다, 라, ( ? ), 바",
    sequence: "",
    options: ["마", "바", "사", "아"],
    correct: 0,
    hint: "한글 자음 순서를 떠올려 보세요."
  },
  {
    type: "언어/단어 추리",
    text: "다음 중 나머지와 성격이 다른 하나는?",
    sequence: "책 / 연필 / 공책 / 구두",
    options: ["책", "연필", "공책", "구두"],
    correct: 3,
    hint: "세 개는 문구류, 하나는 신발입니다."
  },
  {
    type: "언어/단어 추리",
    text: "빈칸에 공통으로 들어갈 말은?\n(   )길 / (   )손 / (   )발",
    sequence: "",
    options: ["먼", "긴", "맨", "큰"],
    correct: 2,
    hint: "맨길, 맨손, 맨발."
  },
  {
    type: "언어/단어 추리",
    text: "다음 중 다른 하나를 고르세요.",
    sequence: "봄 / 여름 / 가을 / 토요일",
    options: ["봄", "여름", "가을", "토요일"],
    correct: 3,
    hint: "세 개는 계절, 하나는 요일입니다."
  },
  {
    type: "수열 추리",
    text: "다음 수열의 빈칸에 들어갈 수는?",
    sequence: "2, 4, 8, 16, ?",
    options: ["18", "24", "28", "32"],
    correct: 3,
    hint: "항마다 2를 곱하고 있습니다."
  },
  {
    type: "수열 추리",
    text: "다음 수열의 규칙을 찾아 ?에 들어갈 수를 고르세요.",
    sequence: "3, 6, 9, 12, ?",
    options: ["13", "14", "15", "18"],
    correct: 2,
    hint: "3씩 더해집니다."
  },
  {
    type: "수열 추리",
    text: "다음 수열의 다음 수는?",
    sequence: "1, 4, 9, 16, ?",
    options: ["20", "25", "30", "36"],
    correct: 1,
    hint: "1², 2², 3², 4², …"
  },
  {
    type: "수열 추리",
    text: "다음 수열의 다음 수는?",
    sequence: "1, 2, 4, 7, 11, ?",
    options: ["14", "15", "16", "18"],
    correct: 1,
    hint: "차이가 1, 2, 3, 4, …"
  },
  {
    type: "수열 추리",
    text: "다음 수열의 빈칸에 들어갈 수는?",
    sequence: "81, 27, 9, 3, ?",
    options: ["1", "2", "3", "9"],
    correct: 0,
    hint: "3으로 나누고 있습니다."
  },
  {
    type: "논리 추리",
    text: "어느 회사에는 항상 진실만 말하는 직원과 항상 거짓만 말하는 직원만 있다. 한 직원이 말한다. “내 옆에 앉은 사람은 거짓말쟁이야.” 이 직원이 진실을 말하는 사람이라면, 옆 사람은?",
    sequence: "",
    options: ["항상 진실을 말한다", "항상 거짓을 말한다", "둘 다 가능하다", "알 수 없다"],
    correct: 1,
    hint: ""
  },
  {
    type: "논리 추리",
    text: "세 상자 중 하나에는 사과만, 하나에는 오렌지만, 하나에는 사과와 오렌지가 섞여 있다. 각 상자에는 레이블(“사과”, “오렌지”, “믹스”)이 붙어 있는데 모두 틀리게 붙어 있다. 한 상자에서 과일 하나만 꺼내 볼 수 있을 때, 어떤 상자를 골라야 모든 상자의 내용을 알 수 있는가?",
    sequence: "",
    options: ["사과 상자", "오렌지 상자", "믹스 상자", "어느 상자든 상관없다"],
    correct: 2,
    hint: ""
  },
  {
    type: "논리 추리",
    text: "양말이 검은색 4켤레, 흰색 4켤레 들어 있는 서랍에서 눈 감고 양말을 꺼낸다. 같은 색 양말 한 켤레를 반드시 얻기 위해 최소 몇 개를 꺼내야 하는가?",
    sequence: "",
    options: ["2개", "3개", "4개", "5개"],
    correct: 1,
    hint: ""
  },
  {
    type: "논리 추리",
    text: "두 숫자의 합은 10이고, 두 숫자 모두 자연수이다. 한 사람은 합(10)을 알고, 다른 한 사람은 곱을 알고 있다. 곱을 알고 있는 사람이 “나는 두 수를 모르겠다”고 말하자, 합을 알고 있는 사람이 “그럴 줄 알았어. 나도 아직은 모르겠어”라고 답했다. 가능한 (두 수)의 쌍으로 가장 알맞은 것은?",
    sequence: "",
    options: ["1와 9", "2와 8", "3와 7", "4와 6"],
    correct: 2,
    hint: ""
  },
  {
    type: "언어/단어 추리",
    text: "다음 중 나머지와 성격이 다른 하나는?",
    sequence: "비 / 눈 / 안개 / 바람",
    options: ["비", "눈", "안개", "바람"],
    correct: 3,
    hint: ""
  },
  {
    type: "언어/단어 추리",
    text: "다음 중 나머지와 성격이 다른 하나는?",
    sequence: "버스 / 택시 / 지하철 / 자전거",
    options: ["버스", "택시", "지하철", "자전거"],
    correct: 3,
    hint: ""
  },
  {
    type: "수열 추리",
    text: "다음 수열의 다음 수는?",
    sequence: "2, 6, 12, 20, ?",
    options: ["24", "28", "30", "32"],
    correct: 1,
    hint: ""
  },
  {
    type: "수열 추리",
    text: "다음 수열의 빈칸에 알맞은 수는?",
    sequence: "1, 3, 6, 10, 15, ?",
    options: ["18", "19", "20", "21"],
    correct: 3,
    hint: ""
  },
  {
    type: "종합 추리",
    text: "다음 보기 중 규칙에서 벗어나는 하나를 고르세요.",
    sequence: "A-C-E / B-D-F / C-E-G / D-F-I",
    options: ["A-C-E", "B-D-F", "C-E-G", "D-F-I"],
    correct: 3,
    hint: ""
  }
];

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let questions = [];
let total = 0;
let currentIndex = 0;
let answers = [];

const qCounter = document.getElementById("questionCounter");
const progressBar = document.getElementById("progressBar");
const qNumber = document.getElementById("qNumber");
const qType = document.getElementById("qType");
const qText = document.getElementById("qText");
const qSeq = document.getElementById("qSequence");
const qHint = document.getElementById("qHint");
const optionsBox = document.getElementById("options");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const indexDots = document.getElementById("indexDots");
const answeredCountEl = document.getElementById("answeredCount");
const totalCountEl = document.getElementById("totalCount");
const resultBox = document.getElementById("resultBox");
const scoreText = document.getElementById("scoreText");
const iqRange = document.getElementById("iqRange");
const commentText = document.getElementById("commentText");
const detailText = document.getElementById("detailText");

function startTest() {
  const shuffled = shuffleArray(questionPool.slice());
  questions = shuffled.slice(0, QUESTIONS_PER_TEST);
  total = questions.length;
  answers = new Array(total).fill(null);
  currentIndex = 0;
  if (totalCountEl) totalCountEl.textContent = total;
  renderDots();
  renderQuestion();
}

function renderDots() {
  indexDots.innerHTML = "";
  for (let i = 0; i < total; i++) {
    const d = document.createElement("div");
    d.className = "dot";
    d.textContent = i + 1;
    d.addEventListener("click", () => {
      currentIndex = i;
      renderQuestion();
    });
    indexDots.appendChild(d);
  }
}

function updateDots() {
  const dots = indexDots.children;
  for (let i = 0; i < dots.length; i++) {
    dots[i].className = "dot";
    if (i === currentIndex) {
      dots[i].classList.add("current");
    }
    if (answers[i] !== null) {
      dots[i].classList.add("answered");
    }
  }
}

function renderQuestion() {
  const q = questions[currentIndex];
  qNumber.textContent = "문제 " + (currentIndex + 1);
  qType.textContent = q.type;
  qText.textContent = q.text;
  qSeq.textContent = q.sequence || "";
  qSeq.style.display = q.sequence ? "inline-block" : "none";
  // 힌트는 사용하지 않으므로 항상 숨김
  qHint.textContent = "";
  qHint.style.display = "none";

  optionsBox.innerHTML = "";
  q.options.forEach((opt, idx) => {
    const wrap = document.createElement("div");
    wrap.className = "option";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "option";
    input.id = "opt" + idx;
    input.value = idx;
    if (answers[currentIndex] === idx) {
      input.checked = true;
    }
    input.addEventListener("change", () => {
      answers[currentIndex] = idx;
      updateAnsweredCount();
      updateDots();
      updateNextButtonState();
    });
    const label = document.createElement("label");
    label.htmlFor = input.id;
    label.textContent = opt;
    wrap.appendChild(input);
    wrap.appendChild(label);
    optionsBox.appendChild(wrap);
  });

  qCounter.textContent = (currentIndex + 1) + " / " + total;
  const answered = answers.filter(a => a !== null).length;
  const progress = (answered / total) * 100;
  progressBar.style.width = progress + "%";

  prevBtn.disabled = currentIndex === 0;
  updateNextButtonState();
  updateDots();
  resultBox.style.display = "none";
}

function updateAnsweredCount() {
  const answered = answers.filter(a => a !== null).length;
  answeredCountEl.textContent = answered;
  const progress = (answered / total) * 100;
  progressBar.style.width = progress + "%";
}

function updateNextButtonState() {
  if (currentIndex === total - 1) {
    nextBtn.textContent = "결과 보기";
  } else {
    nextBtn.textContent = "다음 →";
  }
  nextBtn.disabled = answers[currentIndex] === null;
}

function gradeTest() {
  let score = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.correct) score++;
  });

  const percent = score / total;
  const estimatedIQ = Math.round(100 + (percent - 0.5) * 40);

  let rangeText = "";
  let comment = "";
  if (percent >= 0.9) {
    rangeText = "추정 IQ 범위: 120 이상";
    comment = "매우 뛰어난 추리 능력입니다!";
  } else if (percent >= 0.75) {
    rangeText = "추정 IQ 범위: 110 ~ 120";
    comment = "상위권에 해당하는 좋은 성과입니다.";
  } else if (percent >= 0.6) {
    rangeText = "추정 IQ 범위: 95 ~ 110";
    comment = "평균 이상 또는 평균 수준입니다.";
  } else {
    rangeText = "추정 IQ 범위: 80 ~ 95";
    comment = "조금 더 연습하면 충분히 올라갈 수 있습니다.";
  }

  scoreText.textContent = "정답: " + score + " / " + total + "문제";
  iqRange.textContent = rangeText;
  commentText.textContent = comment;
  detailText.textContent =
    "이 테스트는 재미와 연습용으로 만든 간단한 비공식 IQ 테스트이며, 실제 지능검사 결과와는 다를 수 있습니다.";

  resultBox.style.display = "block";
  resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentIndex === total - 1) {
    gradeTest();
  } else if (currentIndex < total - 1) {
    currentIndex++;
    renderQuestion();
  }
});

startTest();

