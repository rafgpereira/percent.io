//Geração de dados úteis para o funcionamento:
function geraData() {
  const novaData = new Date();
  const dia = novaData.getDate();
  const mes = novaData.getMonth();
  const ano = novaData.getFullYear();
  const hora = (23 - novaData.getHours()).toString();
  const minuto = (59 - novaData.getMinutes()).toString();
  const segundo = (59 - novaData.getSeconds()).toString();

  return { dia, mes, ano, hora, minuto, segundo };
}
function editaHora() {
  const { hora, minuto, segundo } = geraData();
  return `${hora.padStart(2, "0")}:${minuto.padStart(2,"0")}:${segundo.padStart(2, "0")}`;
}
function geraNumeroSecreto() {
  const { dia, mes, ano } = geraData();
  const numeroSecreto = parseInt((ano + mes * dia ** 3) % 100);
  document.body.style.setProperty("--progress", numeroSecreto);
  return numeroSecreto;
}
//Declarações:
function declaracoes() {
  const informacaoDica = document.querySelector(".dica");
  const informacaoTentativa = document.querySelector(".tentativas-restantes");
  const botaoChute = document.querySelector("#guess");
  const campoEntrada = document.querySelector("#numInput");
  const popup = document.querySelector("#popup");
  const popupTitulo = document.querySelector("#h2-popup");
  const popupTexto = document.querySelector("#p-popup");
  const popupBotao = document.querySelector("#botao-popup");
  return { informacaoDica, informacaoTentativa, botaoChute, campoEntrada, popup, popupTitulo, popupTexto, popupBotao}
}

//Função que remove os Inputs apos o jogo:
function removeEntrada() {
  const {botaoChute, informacaoTentativa, campoEntrada} = declaracoes()
botaoChute.remove();
campoEntrada.remove();
informacaoTentativa.remove();
}

function tempoNovoJogo() {
  const {informacaoDica} = declaracoes() 
setInterval(() => {
  const tempoRestante = editaHora();
  informacaoDica.innerHTML = `Novo jogo em </br> ${tempoRestante}`;
}, 0);

informacaoDica.style.color = `#f1c40f`;
}

function tentativasDiarias() {
  const { dia, mes, ano } = geraData();
  const {popup, popupBotao} = declaracoes()
  if (!localStorage.getItem(`${ano}${mes}${dia}`)) {
    localStorage.setItem(`${ano}${mes}${dia}`, 3);
    popup.showModal();
    popupBotao.addEventListener("click", () => {
      popup.close();
    });
  } else if (localStorage.getItem(`${ano}${mes}${dia}`) == 0) {
    removeEntrada();
    tempoNovoJogo();
  }
}

//Funções que apresentam os popup's:
function avisoVitoria(tentativasRestantes) {
  const {popup, popupBotao, popupTexto, popupTitulo} = declaracoes()
popupBotao.addEventListener("click", () => {
  popup.close();
});
setTimeout(() => {
  popup.showModal();
  popupTitulo.innerHTML = "Parabéns!";
  popupTexto.innerHTML = `O número secreto é ${geraNumeroSecreto()}! </br> Tentativas utilizadas: ${ 4 - tentativasRestantes}`;
}, 0);
tempoNovoJogo();

}

function avisoDerrota() {
  const {popup, popupBotao, popupTexto, popupTitulo} = declaracoes()
popupBotao.addEventListener("click", () => {
  popup.close();
});
setTimeout(() => {
  popup.showModal();
  popupTitulo.innerHTML = "Ops!";
  popupTexto.innerHTML = `As tentativas acabaram! </br> O número secreto era ${geraNumeroSecreto()}. </br> Tente novamente amanhã.`;
}, 0);
tempoNovoJogo();
}

//Função que verifica o chute e responde:
function verificaChute(tentativasRestantes) {
  const { dia, mes, ano } = geraData();
  const {informacaoDica, campoEntrada} = declaracoes()
  const numeroChute = campoEntrada.value;
  const numeroSecreto = geraNumeroSecreto();
  if (numeroChute == numeroSecreto) {
    localStorage.setItem(`${ano}${mes}${dia}`, 0);
    avisoVitoria(tentativasRestantes);
    removeEntrada()
  } else {
    if (numeroChute > numeroSecreto) {
      informacaoDica.innerHTML += `<span style="color: #00e1ff;">${numeroChute} está acima!</br>`;
      informacaoDica.style.color = `#00e1ff`;
      console.log(numeroChute +" acima " + tentativasRestantes)
    } else {
      informacaoDica.innerHTML += `<span style="color: #ff1b1b;">${numeroChute} está abaixo!</br>`;
      informacaoDica.style.color = `#ff1b1b`;
      console.log(numeroChute + " abaixo " + tentativasRestantes)
    }

    tentativasRestantes--;
    localStorage.setItem(`${ano}${mes}${dia}`, tentativasRestantes);
    if (tentativasRestantes == 0) {
        tentativasDiarias()
      avisoDerrota();
    }

  }
  campoEntrada.value = "";
  main()
}

const {botaoChute, campoEntrada} = declaracoes()
const {ano, mes, dia} = geraData()
botaoChute.addEventListener("click", function () {
  if (localStorage.getItem(`${ano}${mes}${dia}`) > 0) {
    verificaChute(main());
  }
});
campoEntrada.addEventListener("keydown", function verificaTecla(event) {
  if (event.key == "Enter") {
    if (localStorage.getItem(`${ano}${mes}${dia}`) > 0) {
      verificaChute(main());
    }
  }
});

function main() {
  geraNumeroSecreto();
  tentativasDiarias();
  const {informacaoTentativa} = declaracoes()
  const { dia, mes, ano } = geraData();
  const tentativasRestantes = parseInt(
    localStorage.getItem(`${ano}${mes}${dia}`)
  );
  informacaoTentativa.innerHTML = `Tentativas restantes: ${tentativasRestantes}`
    return tentativasRestantes
}
main()
