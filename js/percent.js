//Geração de dados úteis para o funcionamento:
geraDados()
function geraDados() {
    let novaData = new Date()
    let dia = novaData.getDate()
    let mes = novaData.getMonth()
    let ano = novaData.getFullYear()
    let hora = novaData.getHours() + 1
    let minuto = novaData.getMinutes() + 1
    const numeroSecreto = parseInt((ano+(mes*dia**3))%100)
    const dadosGerados = {
        dia: dia,
        mes: mes,
        ano: ano,
        hora: hora,
        minuto: minuto,
        numeroSecreto: numeroSecreto
    }
    document.body.style.setProperty("--progress", dadosGerados.numeroSecreto);
    return dadosGerados
}

//Declarações:
const dados = geraDados()
const informacaoDica = document.querySelector(".dica")
const informacaoTentativa = document.querySelector(".tentativas-restantes")
const botaoChute = document.querySelector("#guess")
const campoEntrada = document.querySelector("#numInput")
const popupInicial = document.querySelector("#bem-vindo")
const botaoPopupInicial = document.querySelector("#botao-popup-iniciar")

//Controle do Local Storage:
if (!localStorage.getItem(`${dados.dia}${dados.mes}${dados.ano}`)) {
    localStorage.setItem(`${dados.dia}${dados.mes}${dados.ano}`, "naojogou")
    popupInicial.showModal()
    botaoPopupInicial.addEventListener("click", ()=>{
        popupInicial.close()
    })
} else if (localStorage.getItem(`${dados.dia}${dados.mes}${dados.ano}`) == "jogou") {
    removeEntrada()
    tempoNovoJogo()
}
if (!localStorage.getItem(`${dados.ano}${dados.mes}${dados.dia}`)) {
    localStorage.setItem(`${dados.ano}${dados.mes}${dados.dia}`, 3)
}

//Escutas de eventos do botão de chute:
botaoChute.addEventListener("click", function () {
    if (localStorage.getItem(`${dados.dia}${dados.mes}${dados.ano}`) == "naojogou") {
        verificaTentativas()
    }
})
campoEntrada.addEventListener("keydown", function verificaTecla(event){
    if (event.key == "Enter") {
        if (localStorage.getItem(`${dados.dia}${dados.mes}${dados.ano}`) == "naojogou") {
            verificaTentativas()
        }
    }
});

//Função que analisa as tentativas restantes:
function verificaTentativas() {
    let tentativasRestantes = parseInt(localStorage.getItem(`${dados.ano}${dados.mes}${dados.dia}`))
    if (tentativasRestantes > 0) {
        verificaChute(tentativasRestantes)
    }
}

//Função que verifica o chute e responde:
function verificaChute(tentativasRestantes) {
    const numeroChute = campoEntrada.value
    if (numeroChute == dados.numeroSecreto) {
        localStorage.setItem(`${dados.dia}${dados.mes}${dados.ano}`, "jogou")
        removeEntrada()
        avisoVitoria(tentativasRestantes)
    } else if (numeroChute != dados.numeroSecreto) {
        if (numeroChute < dados.numeroSecreto) {
            informacaoDica.innerHTML = `Muito baixo!`
            informacaoDica.style.color = `#ff1b1b`
            informacaoTentativa.innerHTML = `Tentativas restantes: ${tentativasRestantes - 1}`
        } else {
            informacaoDica.innerHTML = `Muito alto!`
            informacaoDica.style.color = `#00e1ff`
            informacaoTentativa.innerHTML = `Tentativas restantes: ${tentativasRestantes - 1}`
        }
        tentativasRestantes--
        localStorage.setItem(`${dados.ano}${dados.mes}${dados.dia}`, tentativasRestantes)
        if (tentativasRestantes == 0) {
            removeEntrada()
            localStorage.setItem(`${dados.dia}${dados.mes}${dados.ano}`, "jogou")
            avisoDerrota()
        }
    }
    campoEntrada.value = ""
}

//Função que remove os Inputs apos o jogo:
function removeEntrada() {
    botaoChute.remove()
    campoEntrada.remove()
    informacaoTentativa.remove()
}

//Declarações para o popup:
const popup = document.querySelector("#popup")
const popupTitulo = document.querySelector("#h2-popup")
const popupTexto = document.querySelector("#p-popup")
const popupBotao = document.querySelector("#botao-popup");

//Funções que apresentam os popup's:
function avisoVitoria(tentativasRestantes) {
    popupBotao.addEventListener("click", () => {
        popup.close()
    });
    setTimeout(() => {
        popup.showModal()
        popupTitulo.innerHTML = "Parabéns!"
        popupTexto.innerHTML = `O número secreto é ${dados.numeroSecreto}! </br> Tentativas utilizadas: ${4 - tentativasRestantes}`
    }, 0);
    tempoNovoJogo()
}
function avisoDerrota() {
    popupBotao.addEventListener("click", () => {
        popup.close()
    });
    setTimeout(() => {
        popup.showModal()
        popupTitulo.innerHTML = "Ops!"
        popupTexto.innerHTML = `As tentativas acabaram! </br> O número secreto era ${dados.numeroSecreto}. </br> Tente novamente amanhã.`
    }, 0);
    tempoNovoJogo()
}
function tempoNovoJogo() {
    informacaoDica.innerHTML = `Novo jogo em ${24 - dados.hora} hora(s) e ${60 - dados.minuto} minuto(s).`
    informacaoDica.style.color = `#f1c40f`
}
