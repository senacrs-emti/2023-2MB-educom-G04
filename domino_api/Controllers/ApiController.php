<?php
define('CHARACTERS', '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

class ApiController 
{
    private $model;
    private $data = array();

    public function __construct()
    {
        global $database;
        $this->model = new DataModel($database);
        header('Content-Type: application/json');
    }

    private function returnError($message)
    {
        $this->data['Error'] = true;
        $this->data['Description'] = $message;
        die(json_encode($this->data));
    }

    private function CreateRoom()
    {
        if (!isset($_GET['room_name']))
            $this->returnError('Room name was not send');

        $lastRoom = $this->model->getLastRoom()->fetch_assoc();

        if (empty($lastRoom))
            $lastRoom['Code'] = '';

        $lastRoom['Name'] = $_GET['room_name'];

        $sobra = 1;
        for ($i = strlen($lastRoom['Code']) - 1; $i >= 0; $i--)
        {
            $pos = strpos(CHARACTERS, $lastRoom['Code'][$i]) + $sobra;
            $sobra = (int)($pos / 62);
            $lastRoom['Code'][$i] = CHARACTERS[$pos % 62];
        }

        if ($sobra !== 0)
            $lastRoom['Code'] = CHARACTERS[$sobra % 62] . $lastRoom['Code'];

        $this->model->saveRoom($lastRoom['Code'], $lastRoom['Name']);

        $data['Error'] = false;
        $data['Code'] = $lastRoom['Code'];

        die(json_encode($data));
    }

    private function ranking_general()
    {
        $ranking = $this->model->getRankingGeneral();

        $data['Error'] = false;
        $data['Ranking'] = array();

        while ($row = $ranking->fetch_assoc())
        {
            $data['Ranking'][] = array(
                'Name' => $row['Name'],
                'Score' => $row['Score']
            );
        }

        die(json_encode($data));
    }

    public function ranking_room()
    {
        if (!isset($_GET['room_code']))
            $this->returnError('Room code was not send');

        $roomId = $this->model->existsRoom($_GET['room_code'])->fetch_assoc();

        if (empty($roomId))
            $this->returnError('Room does not exists');
        
        $ranking = $this->model->getRankingRoom($roomId['ID']);

        $data['Error'] = false;
        $data['Ranking'] = array();

        while ($row = $ranking->fetch_assoc())
        {
            $data['Ranking'][] = array(
                'Name' => $row['Name'],
                'Score' => $row['Score']
            );
        }

        die(json_encode($data));
    }

    public function ranking_player_in_room()
    {
        if (!isset($_GET['room_code']))
            $this->returnError('Room code was not send');

        if (!isset($_GET['game_id']))
            $this->returnError('Game ID was not send');

        $data['Error'] = false;
        $ranking = $this->model->getRankingPlayerInRoom($_GET['room_code']);
        
        $position = 0;
        $counter = 1;
        while ($row = $ranking->fetch_assoc())
        {
            if ($row['Game_ID'] == $_GET['game_id'])
            {
                $position = $counter;
                break;
            }

            $counter++;
        }

        if ($position == 0)
            die(json_encode($data));
        

        $data['Error'] = false;
        $data['Position'] = $position;

        die(json_encode($data));
    }

    public function start_game()
    {
        if (!isset($_GET['room_code']))
            $this->returnError('Room code was not send');

        $room = $this->model->existsRoom($_GET['room_code'])->fetch_assoc();

        if (empty($room))
            $this->returnError('Room does not exists');

        if (!isset($_GET['player_name']))
            $this->returnError('Player name was not send');

        $game = $this->model->startGame($room['ID'], $_GET['player_name'])->fetch_assoc();

        if (empty($game))
            $this->returnError('Error starting game');

        $data['Error'] = false;
        $data['Game_ID'] = $game['ID'];

        die(json_encode($data));
    }

    public function new_question()
    {
        if (!isset($_GET['game_id']))
            $this->returnError('Game ID was not send');

        $game = $this->model->getGame($_GET['game_id'])->fetch_assoc();

        if (empty($game))
            $this->returnError('Game does not exists');

        $gameData;

        if (empty($game['Data']))
        {
            $gameData[0] = 0;
            $gameData[1] = rand(1, 5);
            $gameData[2] = rand(1, 5);

            while ($gameData[1] == $gameData[2])
                $gameData[2] = rand(1, 5);

            $gameData[3] = 0;
            $gameData[4] = 1;
            $gameData[5] = 1;
        }
        else
            $gameData = explode(';', $game['Data']);

        if (!$gameData[4])
            $this->returnError('You have to answer the question');

        
        
        $data['Error'] = false;
        $data['Left'] = $gameData[1];
        $data['Right'] = $gameData[2];

        do
        {
            $randonValue = rand(2, 12);
            $invalid1 = $randonValue - $gameData[1];
            $invalid2 = $randonValue - $gameData[2];
        } while ($invalid1 <= 0 || $invalid2 <= 0 || $invalid1 > 6 || $invalid2 > 6);

        $data['Sum'] = $randonValue;

        $array = array();
        for ($i = 0; $i < 6; $i++)
        {
            do
            {
                $value = rand(1, 5);
            } while ($value == $invalid1 || $value == $invalid2);

            $array[$i] = $value;
        }

        $pos = rand(0, 5);

        if (rand(0, 1))
        {
            $array[$pos] = $invalid1;

            if ($pos % 2 == 0)
                $gameData[1] = $array[$pos + 1];
            else
                $gameData[1] = $array[$pos - 1];    
        }
        else
        {
            $array[$pos] = $invalid2;
            
            
            if ($pos % 2 == 0)
                $gameData[2] = $array[$pos + 1];
            else
                $gameData[2] = $array[$pos - 1];    
        }
        
        $pos = (int)($pos / 2);

        $gameData[3] = $pos;
        $gameData[4] = 0;

        $gameDataString = $gameData[0] . ';' . $gameData[1] . ';' . $gameData[2] . ';' . $gameData[3] . ';' . $gameData[4] . ';' . $gameData[5];

        $this->model->newQuestion($_GET['game_id'], $gameDataString);

        $data['Options'] = array_chunk($array, 2);

        die(json_encode($data));
    }

    public function verify_answer()
    {
        if (!isset($_GET['game_id']))
            $this->returnError('Game ID was not send');

        $game = $this->model->getGame($_GET['game_id'])->fetch_assoc();

        if (empty($game))
            $this->returnError('Game does not exists');

        if (empty($game['Data']))
            $this->returnError('You have to start the game first');

        if (!isset($_GET['answer']))
            $this->returnError('Answer was not send');
        
        $gameData = explode(';', $game['Data']);
        
        if ($gameData[4])
            $this->returnError('The question was already answered');


        $data['Error'] = false;
        
        if ($gameData[3] == $_GET['answer'])
        {
            $gameData[0] += $gameData[5];
            $gameData[4] = 1;

            $stringGameData = $gameData[0] . ';' . $gameData[1] . ';' . $gameData[2] . ';' . $gameData[3] . ';' . $gameData[4] . ';' . $gameData[5];

            $this->model->updateGame($game['ID'], $stringGameData);
        
            $data['Correct'] = true;
        }
        else
        {
            $this->model->saveGame($game['Room_ID'], $game['NameUser'], $gameData[0], $_GET['game_id']);
            $this->model->deleteGame($_GET['game_id']);
            $data['Correct'] = false;
        }

        $data['Score'] = $gameData[0];
        
        die(json_encode($data));
    }

    public function new_round()
    {
        if (!isset($_GET['game_id']))
            $this->returnError('Game ID was not send');

        $game = $this->model->getGame($_GET['game_id'])->fetch_assoc();

        if (empty($game))
            $this->returnError('Game does not exists');

        if (empty($game['Data']))
            $this->returnError('You have to start the game first');

        $gameData = explode(';', $game['Data']);

        if (!$gameData[4])
            $this->returnError('You have to answer the question');

        $gameData[4] = 1;
        $gameData[5]++;

        $gameDataString = $gameData[0] . ';' . $gameData[1] . ';' . $gameData[2] . ';' . $gameData[3] . ';' . $gameData[4] . ';' . $gameData[5];

        $this->model->updateGame($game['ID'], $gameDataString);

        $data['Error'] = false;
        $data['Left'] = $gameData[1];
        $data['Right'] = $gameData[2];

        die(json_encode($data));
    }

    public function getAction()
    {
        if (!isset($_GET['command']))
            $this->returnError('Command to execute was not send');

        $command = $_GET['command'];

        if ($command == "create_room")
            $this->CreateRoom();
        else if ($command == "ranking_general")
            $this->ranking_general();
        else if ($command == "ranking_room")
            $this->ranking_room();
        else if ($command == "ranking_player_in_room")
            $this->ranking_player_in_room();
        else if ($command == "start_game")
            $this->start_game();
        else if ($command == "new_question")
            $this->new_question();
        else if ($command == "verify_answer")
            $this->verify_answer();
        else if ($command == "new_round")
            $this->new_round();
        else
            $this->returnError('Invalid command');

        die(json_encode($this->data));
    }
}
?>
