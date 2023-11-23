let api = "./../domino_api/index.php";

let isGameRunning = false;

let gameCode;

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

    document.getElementById("gamegeneral").innerHTML = "";

    isGameRunning = false;
    baseTime = 60;
    timeLeft = baseTime;
}

function PageCreate()
{
    document.getElementById("pageindex").style.display = "none";
    document.getElementById("pagecreateroom").style.display = "flex";
    document.getElementById("pagejoinroom").style.display = "none";
    document.getElementById("pagegame").style.display = "none";
}

function PageJoin()
{
    document.getElementById("pageindex").style.display = "none";
    document.getElementById("pagecreateroom").style.display = "none";
    document.getElementById("pagejoinroom").style.display = "flex";
    document.getElementById("pagegame").style.display = "none";
}

function PageGame()
{
    document.getElementById("pageindex").style.display = "none";
    document.getElementById("pagecreateroom").style.display = "none";
    document.getElementById("pagejoinroom").style.display = "none";
    document.getElementById("pagegame").style.display = "none";
    document.getElementById("pagegame").style.display = "flex";
    RunGame();
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
                document.getElementById("seeranking").href = api + "?command=ranking_room&room_code=" + json["Code"];
                document.getElementById("createroom").style.display = "none";
                document.getElementById("roomname").disabled = true;
            }
        } else {
            alert(`Error ${xhr.status}: ${xhr.statusText}`);
        }
    };
}

function JoinRoom() 
{
    let player = document.getElementById("playername").value;
    let roomCode = document.getElementById("roomcodeinput").value;

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

                document.getElementById("gamegeneral").innerHTML = "";
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

                        if (baseTime > 20)
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
                    alert("Errou!");    
                    window.location.reload(); //go to ranking
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
        alert("Acabou o tempo!");
        dominoClicked(-1);
        window.location.reload(); //go to ranking
    }

    document.getElementById("timer").innerHTML = timeLeft;
    document.getElementById("round").innerHTML = round;
    document.getElementById("score").innerHTML = points;
}, 1000);
