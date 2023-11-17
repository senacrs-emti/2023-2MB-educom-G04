<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', '');
define('DB_NAME', 'dominoonline');

require_once './Models/Database.php';
require_once './Models/DataModel.php';
require_once './Controllers/ApiController.php';

$database = new Database(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
$database->connect();

$api = new ApiController();

if ($_SERVER['REQUEST_METHOD'] === 'GET')
{
    if (!isset($_GET['command']))
        $api->returnError('Command to execute was not send');

    $command = $_GET['command'];

    if ($command == "ranking_general")
        $api->rankingGeneral();
    else if ($command == "ranking_room")
        $api->rankingRoom();
    else if ($command == "ranking_player_in_room")
        $api->rankingPlayerInRoom();
    else
        $api->returnError('Invalid command');
}
else
{
    if (!isset($_POST['command']))
        $api->returnError('Command to execute was not send');

    $command = $_POST['command'];

    if ($command == "create_room")
        $api->createRoom();
    else if ($command == "start_game")
        $api->startGame();
    else if ($command == "new_question")
        $api->newQuestion();
    else if ($command == "verify_answer")
        $api->verifyAnswer();
    else if ($command == "new_round")
        $api->newRound();
    else
        $api->returnError('Invalid command');
}

$database->disconnect();
?>
