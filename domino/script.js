let api = "./../domino_api/index.php";

let isGameRunning = false;

let gameCode;
let roomCode;

let points = 0;
let baseTime = 60;
let timeLeft = baseTime;
let round = 1;
let answered = false;
let correctcount = 0;

let left = 0;
let right = 0;
let sum = 0;
let options = [];

function PageIndex()
{
    document.getElementById("pageindex").style.display = "flex";
    document.getElementById("pagecreateroom").style.display = "none";
    document.getElementById("pagejoinroom").style.display = "none";
    document.getElementById("pagegame").style.display = "none";
    document.getElementById("pageinstructions").style.display = "none";
    document.getElementById("pageranking").style.display = "none";

    document.getElementById("gamegeneral").innerHTML = "";

    document.getElementById("roomcodebox").style.display = "none";
    document.getElementById("seeranking").style.display = "none";
    document.getElementById("createroom").style.display = "block";
    document.getElementById("roomname").disabled = false;

    if (isGameRunning)
    {
        isGameRunning = false;
        baseTime = 60;
        timeLeft = baseTime;
    
        dominoClicked(-1);
    }
}

function PageCreate()
{
    document.getElementById("pageindex").style.display = "none";
    document.getElementById("pagecreateroom").style.display = "flex";
    document.getElementById("pagejoinroom").style.display = "none";
    document.getElementById("pagegame").style.display = "none";
    document.getElementById("pageinstructions").style.display = "none";
    document.getElementById("pageranking").style.display = "none";
}

function PageJoin()
{
    document.getElementById("pageindex").style.display = "none";
    document.getElementById("pagecreateroom").style.display = "none";
    document.getElementById("pagejoinroom").style.display = "flex";
    document.getElementById("pagegame").style.display = "none";
    document.getElementById("pageinstructions").style.display = "none";
    document.getElementById("pageranking").style.display = "none";
}

function PageGame()
{
    document.getElementById("pageindex").style.display = "none";
    document.getElementById("pagecreateroom").style.display = "none";
    document.getElementById("pagejoinroom").style.display = "none";
    document.getElementById("pagegame").style.display = "none";
    document.getElementById("pagegame").style.display = "flex";
    document.getElementById("pageinstructions").style.display = "none";
    document.getElementById("pageranking").style.display = "none";
    RunGame();
}

function PageInstructions()
{
    document.getElementById("pageindex").style.display = "none";
    document.getElementById("pagecreateroom").style.display = "none";
    document.getElementById("pagejoinroom").style.display = "none";
    document.getElementById("pagegame").style.display = "none";
    document.getElementById("pagegame").style.display = "none";
    document.getElementById("pageinstructions").style.display = "flex";
    document.getElementById("pageranking").style.display = "none";

    document.getElementById("roomcodebox").style.display = "none";
    document.getElementById("seeranking").style.display = "none";
    document.getElementById("createroom").style.display = "block";
    document.getElementById("roomname").disabled = false;
}

function PageRanking(title, foo)
{
    document.getElementById("pageindex").style.display = "none";
    document.getElementById("pagecreateroom").style.display = "none";
    document.getElementById("pagejoinroom").style.display = "none";
    document.getElementById("pagegame").style.display = "none";
    document.getElementById("pagegame").style.display = "none";
    document.getElementById("pageinstructions").style.display = "none";

    let ranking = document.getElementById("pageranking");

    ranking.style.display = "flex";
    ranking.innerHTML = "<h2>"+title+"</h2>";
    ranking.innerHTML += "<a class='button' onclick=\""+foo+"('"+title+"')\" style='width: 40%;'>Atualizar Ranking</a>";
    ranking.innerHTML += "<div class='ranking-line'><h3 class='line-pos'>Posição</h3><h3 class='line-name'>Nome<h3><h3class='line-points'>Pontuação<h3></div>";
}

function RoomRanking(title)
{
    PageRanking(title, "RoomRanking");

    let xhr = new XMLHttpRequest();
    xhr.open("GET", api + "?command=ranking_room&room_code=" + roomCode);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send();
    xhr.onload = function() {
        if (xhr.status === 200) {
            let json = JSON.parse(xhr.responseText);

            if (json["Error"] == true) {
                return;
            } else {
                let ranking = document.getElementById("pageranking");
            
                for (let i = 0; i < json["Ranking"].length; i++)
                {
                    ranking.innerHTML += "<div class='ranking-line'><h3 class='line-pos'>"+(i+1)+"°</h3><h3 class='line-name'>"+json["Ranking"][i]["Name"]+"<h3><h3class='line-points'>"+json["Ranking"][i]["Score"]+"<h3></div>";
                }
            }
        } else {
            alert(`Error ${xhr.status}: ${xhr.statusText}`);
        }
    };
}

function RankingGeneral(title)
{
    PageRanking(title, "RankingGeneral");

    let xhr = new XMLHttpRequest();
    xhr.open("GET", api + "?command=ranking_general");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send();
    xhr.onload = function() {
        if (xhr.status === 200) {
            let json = JSON.parse(xhr.responseText);

            if (json["Error"] == true) {
                return;
            } else {
                let ranking = document.getElementById("pageranking");
                
                for (let i = 0; i < json["Ranking"].length; i++)
                {
                    ranking.innerHTML += "<div class='ranking-line'><h3 class='line-pos'>"+(i+1)+"°</h3><h3 class='line-name'>"+json["Ranking"][i]["Name"]+"<h3><h3class='line-points'>"+json["Ranking"][i]["Score"]+"<h3></div>";
                }
            }
        } else {
            alert(`Error ${xhr.status}: ${xhr.statusText}`);
        }
    };
}

function CreateRoom()
{
    let roomName = document.getElementById("roomname").value;

    if (roomName == "")
    {
        alert("Please enter a room name");
        return;
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST", api);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("command=create_room&room_name=" + roomName);
    xhr.onload = function() {
        if (xhr.status === 200) {
            let json = JSON.parse(xhr.responseText);
            if (json["Error"] == true) {
                return;
            } else {
                document.getElementById("roomcode").innerHTML = json["Code"];
                document.getElementById("roomcodebox").style.display = "flex";
                document.getElementById("seeranking").style.display = "block";
                document.getElementById("createroom").style.display = "none";
                document.getElementById("roomname").disabled = true;

                roomCode = json["Code"];
            }
        } else {
            alert(`Error ${xhr.status}: ${xhr.statusText}`);
        }
    };
}

function JoinRoom() 
{
    let player = document.getElementById("playername").value;
    roomCode = document.getElementById("roomcodeinput").value;

    if (player == "")
    {
        alert("Please enter a player name");
        return;
    }

    if (roomCode == "")
    {
        alert("Please enter a room code");
        return;
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST", api);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("command=start_game&room_code=" + roomCode + "&player_name=" + player);
    xhr.onload = function() {
        if (xhr.status === 200) {
            let json = JSON.parse(xhr.responseText);
            if (json["Error"] == true) {
                return;
            } else {
                gameCode = json["Game_ID"];
                PageGame(); 
            }
        } else {
            alert(`Error ${xhr.status}: ${xhr.statusText}`);
        }
    };
}

function RunGame()
{
    let xhr = new XMLHttpRequest();
    xhr.open("POST", api);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("command=new_question&game_id=" + gameCode);
    xhr.onload = function() {
        if (xhr.status === 200) {
            let json = JSON.parse(xhr.responseText);
            if (json["Error"] == true) {
                return;
            } else {
                left = json["Left"];
                right = json["Right"];
                sum = json["Sum"];
                options = json["Options"];

                addDomino(left, right, 0);
                setOptions();
                setSum();
            }
        } else {
            alert(`Error ${xhr.status}: ${xhr.statusText}`);
        }
    };

    isGameRunning = true;
}

function NewQuestion(){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", api);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("command=new_question&game_id=" + gameCode);
    xhr.onload = function() {
        if (xhr.status === 200) {
            let json = JSON.parse(xhr.responseText);
            if (json["Error"] == true) {
                return;
            } else {
                left = json["Left"];
                right = json["Right"];
                sum = json["Sum"];
                options = json["Options"];

                setOptions();
                setSum();
            }
        } else {
            alert(`Error ${xhr.status}: ${xhr.statusText}`);
        }
    };
}

function newRound()
{
    let xhr = new XMLHttpRequest();
    xhr.open("POST", api);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("command=new_round&game_id=" + gameCode);
    xhr.onload = function() {
        if (xhr.status === 200) {
            let json = JSON.parse(xhr.responseText);
            if (json["Error"] == true) {
                return;
            } else {
                left = json["Left"];
                right = json["Right"];

                document.getElementById("gamegeneral").innerHTML = " ";
                addDomino(left, right, 0);
            }
        } else {
            alert(`Error ${xhr.status}: ${xhr.statusText}`);
        }
    };

}

function addDomino(dleft, dright, side)
{
    let gamegeneral = document.getElementById("gamegeneral");
    let domino = "<div class='domino'><div class='domino-left'>"+dleft+"</div><div class='domino-right'>"+dright+"</div></div>";
    if (side == 0)
        gamegeneral.innerHTML = domino + gamegeneral.innerHTML;
    else
        gamegeneral.innerHTML = gamegeneral.innerHTML + domino;
}

function setOptions()
{
    let option0 = document.getElementById("option0");
    let option1 = document.getElementById("option1");
    let option2 = document.getElementById("option2");

    option0.innerHTML = "<div class='domino-left'>"+options[0][0]+"</div><div class='domino-right'>"+options[0][1]+"</div>";
    option1.innerHTML = "<div class='domino-left'>"+options[1][0]+"</div><div class='domino-right'>"+options[1][1]+"</div>";
    option2.innerHTML = "<div class='domino-left'>"+options[2][0]+"</div><div class='domino-right'>"+options[2][1]+"</div>";
}

function setSum()
{
    document.getElementById("sum").innerHTML = sum;
}

function dominoClicked(idx)
{
    let xhr = new XMLHttpRequest();
    xhr.open("POST", api);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("command=verify_answer&game_id=" + gameCode + "&answer=" + idx);
    xhr.onload = function() {
        if (xhr.status === 200) {
            let json = JSON.parse(xhr.responseText);
            if (json["Error"] == true) {
                return;
            } else {
                if (json["Correct"] == true)
                {
                    moveDomino(idx);

                    points = json["Score"];
                    correctcount++;
                    if (correctcount >= 4)
                    {
                        round++;
                        correctcount = 0;

                        if (baseTime > 10)
                        {
                            baseTime -= 10;
                            timeLeft = baseTime;
                        }

                        newRound();
                    }

                    NewQuestion();
                }
                else
                {
                    isGameRunning = false;
                    RoomRanking("Ranking da Sala " + roomCode);
                }
                answered = true;
            }
        } else {
            alert(`Error ${xhr.status}: ${xhr.statusText}`);
        }
    };
}

function moveDomino(idx)
{
    let domino = document.getElementById("option" + idx);

    let dleft = domino.firstChild.innerHTML;
    let dright = domino.lastChild.innerHTML;

    if (sum - dleft == right)
    {
        addDomino(dleft, dright, 1);
        right = dright;
    }
    else if (sum - dright == left)
    {
        addDomino(dleft, dright, 0);
        left = dleft;
    }
    else if (sum - dleft == left)
    {
        addDomino(dright, dleft, 0);
        left = dright;
    }
    else if (sum - dright == right)
    {
        addDomino(dright, dleft, 1);
        right = dleft;
    }
    else
    {
        alert("Erro!");
    }
}

setInterval(function() {
    if (!isGameRunning) return;

    timeLeft--;

    if (timeLeft == 0)
    {
        dominoClicked(-1);
        RoomRanking("Ranking da Sala " + roomCode);
    }

    document.getElementById("timer").innerHTML = timeLeft;
    document.getElementById("round").innerHTML = round;
    document.getElementById("score").innerHTML = points;
}, 1000);
