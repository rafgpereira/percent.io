//Geração de dados úteis para o funcionamento:
function getDate() {
  const newDate = new Date();
  const day = newDate.getDate();
  const month = newDate.getMonth();
  const year = newDate.getFullYear();
  const hour = (23 - newDate.getHours()).toString();
  const minute = (59 - newDate.getMinutes()).toString();
  const second = (59 - newDate.getSeconds()).toString();

  return { day, month, year, hour, minute, second };
}
function editTime() {
  const { hour, minute, second } = getDate();
  return `${hour.padStart(2, "0")}:${minute.padStart(2,"0")}:${second.padStart(2, "0")}`;
}
function createSecretNumber() {
  const { day, month, year } = getDate();
  const secretNumber = parseInt((year + month * day ** 3) % 100);
  document.body.style.setProperty("--progress", secretNumber);
  return secretNumber;
}
//Declarações:
function declarations() {
  const tipInformation = document.querySelector(".tip");
  const attemptInformation = document.querySelector(".remaining-attempts");
  const guessButton = document.querySelector("#guess");
  const numberInput = document.querySelector("#numInput");
  const popup = document.querySelector("#popup");
  const popupTitle = document.querySelector("#h2-popup");
  const popupText = document.querySelector("#p-popup");
  const popupButton = document.querySelector("#botao-popup");
  return { tipInformation, attemptInformation, guessButton, numberInput, popup, popupTitle, popupText, popupButton}
}

//Função que remove os Inputs apos o jogo:
function removeInput() {
  const {guessButton, attemptInformation, numberInput} = declarations()
guessButton.remove();
numberInput.remove();
attemptInformation.remove();
}

function newGameTime() {
  const {tipInformation} = declarations() 
setInterval(() => {
  const timeLeft = editTime();
  tipInformation.innerHTML = `Novo jogo em </br> ${timeLeft}`;
}, 0);

tipInformation.style.color = `#f1c40f`;
}

function dailyAttempts() {
  const { day, month, year } = getDate();
  const {popup, popupButton} = declarations()
  if (!localStorage.getItem(`${year}${month}${day}`)) {
    localStorage.setItem(`${year}${month}${day}`, 3);
    popup.showModal();
    popupButton.addEventListener("click", () => {
      popup.close();
    });
  } else if (localStorage.getItem(`${year}${month}${day}`) == 0) {
    removeInput();
    newGameTime();
  }
}

//Funções que apresentam os popup's:
function victoryWarning(remainingAttempts) {
  const {popup, popupButton, popupText, popupTitle} = declarations()
popupButton.addEventListener("click", () => {
  popup.close();
});
setTimeout(() => {
  popup.showModal();
  popupTitle.innerHTML = "Parabéns!";
  popupText.innerHTML = `O número secreto é ${createSecretNumber()}! </br> Tentativas utilizadas: ${ 4 - remainingAttempts}`;
}, 0);
newGameTime();

}

function defeatWarning() {
  const {popup, popupButton, popupText, popupTitle} = declarations()
popupButton.addEventListener("click", () => {
  popup.close();
});
setTimeout(() => {
  popup.showModal();
  popupTitle.innerHTML = "Ops!";
  popupText.innerHTML = `As tentativas acabaram! </br> O número secreto era ${createSecretNumber()}. </br> Tente novamente amanhã.`;
}, 0);
newGameTime();
}

//Função que verifica o chute e responde:
function checkGuess(remainingAttempts) {
  const { day, month, year } = getDate();
  const {tipInformation, numberInput} = declarations()
  const guessNumber = numberInput.value;
  const secretNumber = createSecretNumber();
  if (guessNumber == secretNumber) {
    localStorage.setItem(`${year}${month}${day}`, 0);
    victoryWarning(remainingAttempts);
    removeInput()
  } else {
    if (guessNumber > secretNumber) {
      tipInformation.innerHTML += `<span style="color: #00e1ff;">${guessNumber} está acima!</br>`;
      tipInformation.style.color = `#00e1ff`;
      console.log(guessNumber +" acima " + remainingAttempts)
    } else {
      tipInformation.innerHTML += `<span style="color: #ff1b1b;">${guessNumber} está abaixo!</br>`;
      tipInformation.style.color = `#ff1b1b`;
      console.log(guessNumber + " abaixo " + remainingAttempts)
    }

    remainingAttempts--;
    localStorage.setItem(`${year}${month}${day}`, remainingAttempts);
    if (remainingAttempts == 0) {
        dailyAttempts()
      defeatWarning();
    }

  }
  numberInput.value = "";
  main()
}

const {guessButton, numberInput} = declarations()
const {year, month, day} = getDate()
guessButton.addEventListener("click", function () {
  if (localStorage.getItem(`${year}${month}${day}`) > 0) {
    checkGuess(main());
  }
});
numberInput.addEventListener("keydown", function verificaTecla(event) {
  if (event.key == "Enter") {
    if (localStorage.getItem(`${year}${month}${day}`) > 0) {
      checkGuess(main());
    }
  }
});

function main() {
  createSecretNumber();
  dailyAttempts();
  const {attemptInformation} = declarations()
  const { day, month, year } = getDate();
  const remainingAttempts = parseInt(
    localStorage.getItem(`${year}${month}${day}`)
  );
  attemptInformation.innerHTML = `Tentativas restantes: ${remainingAttempts}`
    return remainingAttempts
}
main()
