// requisicao 

const api = "./../domino_api/";

function Req(dados,tipo){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", api,true);
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xhr.send(dados);
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            return xhr.responseText;
        }
        else {
            return false;
        }
    }
    
}

function create_room(){
    let nomesala="Tiago"; //capturar do input
    let dados=`command=create_room&room_name=${nomesala}`;
    let retorno = Req(dados,1);
    if(retorno == undefined || retorno==false || retorno["Error"] == true){
        alert("erro ao realizar requisicao");
      return;
    }
    console.log(retorno); // mostrar na tela
}

function start_game(){
    let codigosala="Tiago"; //capturar do input
    let nomejogador="Tiago"; //capturar do input
    let dados=`command=start_game&room_code=${codigosala}&player_name=${nomejogador}`;
    let retorno=Req(dados,1);
    if(retorno == undefined ||retorno==false || retorno["Error"] == true) {
      alert("erro ao realizar requisicao");
      return;
    }
   alert(retorno); // mostrar na tela
}

function new_question(){
    let idjogo="Tiago"; //capturar do input
    let dados=`command=new_question&game_id=${idjogo}`;
    let retorno=Req(dados,1);
    if(retorno == undefined ||retorno==false || retorno["Error"] == true) {
      alert("erro ao realizar requisicao");
      return;
    
    }
   alert(retorno); // mostrar na tela
}

function verify_answer(){
    let idjogo="Tiago"; //capturar do input
    let idxresposta="Tiago"; //capturar do input
    let dados=`command=verify_answer&game_id=${idjogo}&answer=${idxresposta}`;
    let retorno=Req(dados,1);
    if(retorno == undefined ||retorno==false || retorno["Error"] == true) {
      alert("erro ao realizar requisicao");
      return;
    
    }
   alert(retorno); // mostrar na tela
}


function new_round(){
    let idjogo="Tiago"; //capturar do input
    let dados=`command=new_round&game_id=${idjogo}`;
    let retorno=Req(dados,1);
    if(retorno == undefined ||retorno==false || retorno["Error"] == true) {
      alert("erro ao realizar requisicao");
      return;
    
    }
   alert(retorno); // mostrar na tela
}


function ranking_general(){
    let dados=`command=ranking_general`;
    let retorno=Req(dados,0);
    if(retorno == undefined || retorno==false || retorno["Error"] == true) {
      alert("erro ao realizar requisicao");
      return;
    
    }
   alert(retorno); // mostrar na tela
}

function ranking_room(){
    let codigosala="Tiago"; //capturar do input
    let dados=`command=ranking_room&room_code=${codigosala}`;
    let retorno=Req(dados,0);
    if(retorno == undefined || retorno==false || retorno["Error"] == true) {
      alert("erro ao realizar requisicao");
      return;
    
    }
   alert(retorno); // mostrar na tela
}


function ranking_player_in_room(){
    let codigosala="Tiago"; //capturar do input
    let idjogo="Tiago"; //capturar do input
    let dados=`command=ranking_player_in_room&room_code=${codigosala}&game_id=${idjogo}`;
    let retorno=Req(dados,0);
    if(retorno == undefined || retorno==false || retorno["Error"] == true) {
      alert("erro ao realizar requisicao");
      return;
    
    }
   alert(retorno); // mostrar na tela
}