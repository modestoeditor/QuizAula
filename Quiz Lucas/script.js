
const questions = [
  // 1) (Fácil)
  {
    text: "Qual é o nome do alter ego do Homem de Ferro?",
    options: ["Tony Stark", "Steve Rogers", "Bruce Banner", "Peter Parker"],
    correctIndex: 0
  },
  // 2) (Fácil-Médio)
  {
    text: "Em qual filme da Marvel o personagem Thanos aparece pela primeira vez em cena pós-créditos (do MCU moderno)?",
    options: ["Vingadores (2012)", "Os Vingadores: Era de Ultron (2015)", "Guardiões da Galáxia (2014)", "Thor: O Mundo Sombrio"],
    correctIndex: 2
  },
  // 3) (Médio)
  {
    text: "Qual é o material do escudo do Capitão América no MCU?",
    options: ["Vibranium", "Adamantium", "Uru", "Carbonita"],
    correctIndex: 0
  },
  // 4) (Médio-Difícil)
  {
    text: "Qual personagem foi o primeiro Vingador a usar o nome \"Hulk\" nos quadrinhos clássicos?",
    options: ["Bruce Banner", "Rick Jones", "Amadeus Cho", "Thunderbolt Ross"],
    correctIndex: 0
  },
  // 5) (Difícil)
  {
    text: "Nos quadrinhos, quem é o criador original do conceito da equipe 'Guardiões da Galáxia' moderna (anos 2008 em diante)?",
    options: ["Dan Abnett e Andy Lanning", "Brian Michael Bendis", "Jonathan Hickman", "Mark Millar"],
    correctIndex: 0
  }
];

let currentIndex = 0;   // índice da pergunta atual
let score = 0;          // quantidade de acertos
let hasAnswered = false; // se a opção já foi marcada

const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const nextBtn = document.getElementById("nextBtn");

const resultScreen = document.getElementById("resultScreen");
const scoreText = document.getElementById("scoreText");
const scoreMessage = document.getElementById("scoreMessage");
const restartBtn = document.getElementById("restartBtn");
const srFeedback = document.getElementById("srFeedback");

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function loadQuestions() {
  currentIndex = 0;
  score = 0;
  hasAnswered = false;

  // Atualiza UI base
  resultScreen.classList.add("hidden");
  document.querySelector(".card__footer").classList.remove("hidden");
  nextBtn.disabled = true;
  nextBtn.setAttribute("aria-disabled", "true");

  questionsInPlay = questions.slice();

  renderQuestion();
}

function resetQuiz() {
  loadQuestions();
}

let questionsInPlay = questions.slice();

function renderQuestion() {
  const total = questionsInPlay.length;
  const q = questionsInPlay[currentIndex];

  // Progresso textual e barra
  progressText.textContent = `Pergunta ${currentIndex + 1} de ${total}`;
  const pct = Math.round(((currentIndex) / total) * 100);
  progressBar.style.width = `${pct}%`;
  document.querySelector(".progress").setAttribute("aria-valuenow", String(currentIndex));

  // Pergunta
  questionText.textContent = q.text;

  // Limpa opções
  optionsContainer.innerHTML = "";
  hasAnswered = false;
  nextBtn.disabled = true;
  nextBtn.setAttribute("aria-disabled", "true");

  // Cria os 4 botões de resposta
  q.options.forEach((optText, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn option";
    btn.textContent = optText;

    // Atributo aria para estado de seleção (atualizado ao clicar)
    btn.setAttribute("aria-pressed", "false");

    // Data-índice para identificação
    btn.dataset.index = String(idx);

    // Clique de resposta
    btn.addEventListener("click", () => handleAnswer(btn, idx, q.correctIndex));

    optionsContainer.appendChild(btn);
  });
}
function handleAnswer(clickedBtn, chosenIndex, correctIndex) {
  if (hasAnswered) return; // evita re-clique
  hasAnswered = true;

  // Marca estado de seleção
  clickedBtn.setAttribute("aria-pressed", "true");

  // Avalia e aplica classes
  const isCorrect = chosenIndex === correctIndex;
  if (isCorrect) {
    clickedBtn.classList.add("correct");
    score += 1;
    srFeedback.textContent = "Resposta correta.";
  } else {
    clickedBtn.classList.add("wrong");
    srFeedback.textContent = "Resposta incorreta.";
  }

  // Destaca também a correta, caso o usuário tenha errado
  const optionButtons = [...optionsContainer.querySelectorAll(".option")];
  optionButtons.forEach((btn) => {
    btn.disabled = true;
    if (Number(btn.dataset.index) === correctIndex) {
      btn.classList.add("correct");
    }
  });

  // Habilita botão Próxima
  nextBtn.disabled = false;
  nextBtn.setAttribute("aria-disabled", "false");
}

/* Avança para a próxima pergunta ou mostra resultados no fim.
 */
function nextQuestion() {
  const lastIndex = questionsInPlay.length - 1;

  if (currentIndex < lastIndex) {
    currentIndex += 1;
    renderQuestion();
  } else {
    showResults();
  }
}
function showResults() {
  // Atualiza barra ao 100%
  progressBar.style.width = "100%";
  document.querySelector(".progress").setAttribute("aria-valuenow", String(questionsInPlay.length));

  const total = questionsInPlay.length;
  scoreText.textContent = `Você acertou ${score} de ${total}`;

  let message = "Tente mais!";
  if (score >= 4) message = "Ótimo!";
  else if (score >= 2) message = "Bom!";

  scoreMessage.textContent = message;

  // Mostra bloco de resultado e esconde footer do cartão
  resultScreen.classList.remove("hidden");
  document.querySelector(".card__footer").classList.add("hidden");
}

/* Eventos */

nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", resetQuiz);

/* Inicia o quiz ao carregar a página */
document.addEventListener("DOMContentLoaded", loadQuestions);