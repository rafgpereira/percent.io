let data = new Date();
let day = data.getDate();
let week = data.getDay()+1;
let hour = data.getHours()+1;
let minutes = data.getMinutes()+1;
let secretNumber;

day=day+52+week*3;
week= week+23+day*2;

secretNumber = parseInt(Math.abs((day*71137+(day*week*75320))*((week*day*week)*97935)%100));



const havePlayed = window.localStorage.getItem(day);
if (havePlayed) {
    var node = document.getElementById('bar-button');
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
    document.getElementById('write').textContent = `Novo jogo em ${24-hour} horas e ${60-minutes} minutos.`;
}else{
    alert("Adivinhe a porcentagem indicada na barra em 4 tentativas.");
}

document.body.style.setProperty('--progress', secretNumber);
let attempts = 4;
function enterPress(event) {
    if (event.key === 'Enter') {
      document.getElementById("guess").click();
      return false;
    }
    return true;
}    
    let a=0;
function loadGame(){

    const p = document.getElementById('write');
    const correct = document.getElementById('correct');
    const lose =document.getElementById('lose');
    let guessNumber = parseInt(document.getElementById("numInput").value);

    if(guessNumber===secretNumber){
        p.textContent = ``;
        correct.textContent = `Parabéns, a porcentagem é ${guessNumber}. Você acertou em ${(5-attempts)} tentativa(s).`;
        document.getElementById('time').textContent = `Novo jogo em ${24-hour} horas e ${60-minutes} minutos.`;
        a++;
        return 0;
    } else if(attempts===1 && a==0){
        p.textContent=``;
        lose.textContent = `GAME OVER! As tentativas acabaram. A porcentagem era ${secretNumber}.`;
        document.getElementById('time').textContent = `Novo jogo em ${24-hour} horas e ${60-minutes} minutos.`;
        return 0;
    } else if((guessNumber>100&&a==0)||(guessNumber<1 && a==0)){
        p.textContent = `Apenas valores entre 1 e 100. Você ainda tem ${attempts} tentativa(s).`;
            
    } else if( guessNumber>secretNumber && a==0){
        attempts--;
        p.textContent = `A porcentagem é MENOR que ${guessNumber}, você ainda tem ${attempts} tentativa(s).`;
    } else if(guessNumber<secretNumber&& a==0){
        attempts--;
        p.textContent = `A porcentagem é MAIOR que ${guessNumber}, você ainda tem ${attempts} tentativa(s).`;
        
    } 
    document.getElementById("numInput").value = "";
}
window.localStorage.setItem(day, 'true');
