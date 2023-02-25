//Definições de tempo:
let data = new Date();
let day = data.getDate();
let week = data.getDay() + 1;
let hour = data.getHours() + 1;
let minutes = data.getMinutes() + 1;

//Cálculo da porcentagem baseada no tempo e aplicação na barra:
let secretNumber;
day = day + 52 + week * 3;
week = week + 23 + day * 2;
secretNumber = parseInt(
  Math.abs(
    ((day * 71137 + day * week * 75320) * (week * day * week * 97935)) % 100
  )
);
document.body.style.setProperty("--progress", secretNumber);

// Teantativas
const intialAttempts = window.localStorage.getItem(`${day}-attemps`) || 3;

//Bloqueio de reload no mesmo dia:
const havePlayed = window.localStorage.getItem(day);
if (havePlayed) {
  var node = document.getElementById("bar-button");
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
  if (24 - hour < 1) {
    document.getElementById("write").textContent = `Novo jogo em ${
      60 - minutes
    } minutos.`;
  } else {
    document.getElementById("write").textContent = `Novo jogo em ${
      24 - hour
    } horas e ${60 - minutes} minutos.`;
  }
} else {
  alert(
    `Adivinhe a porcentagem indicada na barra em ${intialAttempts} tentativas.`
  );
}

//Execução do button com enter:
function enterPress(event) {
  if (event.key === "Enter") {
    document.getElementById("guess").click();
  }
}

//Função lógica:
function loadGame() {
  const savedAttemps = window.localStorage.getItem(`${day}-attemps`);
  let attempts = savedAttemps ? parseInt(savedAttemps) : 3;
  let available = 0;

  //Declaração de divs de texto:
  const p = document.getElementById("write");
  const correct = document.getElementById("correct");
  const lose = document.getElementById("lose");
  const time = document.getElementById("time");

  //Coleta do palpite e condições/comparações:
  let guessNumber = parseInt(document.getElementById("numInput").value);

  if (
    (guessNumber > 100 && available == 0) ||
    (guessNumber < 1 && available == 0)
  ) {
    if (attempts > 1) {
      p.textContent = `Apenas valores entre 1 e 100. Restam ${attempts} tentativas.`;
    } else {
      p.textContent = `Apenas valores entre 1 e 100. Resta ${attempts} tentativa.`;
    }
    return;
  }

  if (guessNumber === secretNumber && available == 0) {
    p.textContent = ``;
    correct.textContent = `Parabéns, a resposta é ${guessNumber}%. Acerto na ${
      4 - attempts
    }ª tentativa.`;
    if (24 - hour < 1) {
      time.textContent = `Novo jogo em ${60 - minutes} minutos.`;
    } else {
      time.textContent = `Novo jogo em ${24 - hour} horas e ${
        60 - minutes
      } minutos.`;
    }
    available++;
    window.localStorage.setItem(day, "true");
    return 0;
  } else if (attempts === 1 && available == 0) {
    p.textContent = ``;
    lose.textContent = `As tentativas acabaram. A resposta era ${secretNumber}%.`;
    if (24 - hour < 1) {
      time.textContent = `Novo jogo em ${60 - minutes} minutos.`;
    } else {
      time.textContent = `Novo jogo em ${24 - hour} horas e ${
        60 - minutes
      } minutos.`;
    }
    available++;
    window.localStorage.setItem(day, "true");
    return 0;
  } else if (guessNumber > secretNumber && available == 0) {
    window.localStorage.setItem(`${day}-attemps`, attempts - 1);
    if (attempts > 1) {
      p.textContent = `A resposta é MENOR que ${guessNumber}%. Restam ${
        attempts - 1
      } tentativas.`;
    } else {
      p.textContent = `A resposta é MENOR que ${guessNumber}%. Resta ${
        attempts - 1
      } tentativa.`;
    }
  } else if (guessNumber < secretNumber && available == 0) {
    window.localStorage.setItem(`${day}-attemps`, attempts - 1);

    p.textContent = `A resposta é MAIOR que ${guessNumber}%. ${
      attempts > 1 ? "Restam" : "Resta"
    } ${attempts - 1} ${attempts > 1 ? "tentativas" : "tentativa"}.`;
  }
  //Limpa input após recolher entrada:
  document.getElementById("numInput").value = "";
}
