const quizData = [
  {
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
    correct: 0
  },
  {
    question: "Which language runs in a web browser?",
    options: ["Java", "C", "Python", "JavaScript"],
    correct: 3
  },
  {
    question: "Which language is used for styling web pages?",
    options: ["HTML", "JQuery", "CSS", "XML"],
    correct: 2
  },
  {
    question: "Which is not a JavaScript Framework?",
    options: ["Python Script", "JQuery", "Django", "NodeJS"],
    correct: 2
  }
];

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 15;

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const scoreEl = document.getElementById("score");

function startTimer() {
  timeLeft = 15;
  document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      disableOptions();
      showFeedback(false, "Time's up!");
    }
  }, 1000);
}

function loadQuestion() {
  clearInterval(timer);
  const current = quizData[currentQuestion];
  questionEl.textContent = current.question;
  answersEl.innerHTML = "";
  scoreEl.textContent = "";
  nextBtn.style.display = "none";

  current.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => checkAnswer(index, btn);
    answersEl.appendChild(btn);
  });

  updateProgressBar();
  startTimer();
}

function checkAnswer(selected, btn) {
  clearInterval(timer);
  const correctIndex = quizData[currentQuestion].correct;

  const buttons = answersEl.querySelectorAll("button");
  buttons.forEach((button, i) => {
    button.disabled = true;
    if (i === correctIndex) {
      button.style.backgroundColor = "#4caf50";
    } else if (i === selected) {
      button.style.backgroundColor = "#f44336";
    }
  });

  if (selected === correctIndex) {
    score++;
    showFeedback(true, "Correct!");
  } else {
    showFeedback(false, "Wrong!");
  }

  nextBtn.style.display = "inline";
  nextBtn.onclick = () => {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      loadQuestion();
    } else {
      showScore();
    }
  };
}

function disableOptions() {
  const buttons = answersEl.querySelectorAll("button");
  buttons.forEach(button => button.disabled = true);
  nextBtn.style.display = "inline";
  nextBtn.onclick = () => {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      loadQuestion();
    } else {
      showScore();
    }
  };
}

function showFeedback(isCorrect, message) {
  scoreEl.textContent = message;
  scoreEl.style.color = isCorrect ? "green" : "red";
}

function showScore() {
  questionEl.textContent = "Quiz Completed!";
  answersEl.innerHTML = "";
  scoreEl.textContent = `Your Score: ${score}/${quizData.length}`;
  nextBtn.style.display = "none";

  const userName = prompt("Enter your name for the leaderboard:");
  if (userName) {
    updateLeaderboard(userName, score);
    window.location.href = "leaderboard.html";
  }
}

function updateProgressBar() {
  const progress = (currentQuestion / quizData.length) * 100;
  document.getElementById("progress-bar").style.width = `${progress}%`;
}

function updateLeaderboard(name, score) {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({ name, score });
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

loadQuestion();
