<?php
class DataModel 
{
    private $database;

    public function __construct($database) 
    {
        $this->database = $database;
    }

    public function getAllData() 
    {
        $query = "SELECT * FROM ranking";
        return $this->database->executeQuery($query);
    }

    public function getLastRoom()
    {
        $query = "SELECT * FROM room ORDER BY created_at DESC LIMIT 1";
        return $this->database->executeQuery($query);
    }

    public function saveRoom($code, $name)
    {
        $query = "INSERT INTO room (Code, Name) VALUES ('".$code."', '".$name."')";
        $this->database->executeQuery($query);
    }

    public function getRankingGeneral()
    {
        $query = "SELECT * FROM ranking ORDER BY score DESC LIMIT 10";
        return $this->database->executeQuery($query);
    }

    public function getRankingRoom($room)
    {
        $query = "SELECT * FROM ranking WHERE Room_ID = '".$room."' ORDER BY score DESC LIMIT 10";
        return $this->database->executeQuery($query);
    }

    public function existsRoom($room)
    {
        $query = "SELECT * FROM room WHERE Code = '".$room."'";
        return $this->database->executeQuery($query);
    }

    public function startGame($room, $player)
    {
        $query = "INSERT INTO games (Room_ID, NameUser) VALUES ('".$room."', '".$player."')";
        $query2 = 'SELECT * FROM games WHERE Room_ID = "'.$room.'" AND NameUser = "'.$player.'" ORDER BY Timestamp DESC LIMIT 1';     
        $this->database->executeQuery($query);
        return $this->database->executeQuery($query2);
    }

    public function getGame($gameId)
    {
        $query = "SELECT * FROM games WHERE ID = '".$gameId."'";
        return $this->database->executeQuery($query);
    }

    public function newQuestion($gameId, $data)
    {
        $query = "UPDATE games SET Data = '".$data."' WHERE ID = '".$gameId."'";
        $this->database->executeQuery($query);
    }

    public function saveGame($roomId, $nameUser, $score, $gameId)
    {
        $query = "INSERT INTO ranking (Room_ID, Name, Score, Game_ID) VALUES ('".$roomId."', '".$nameUser."', '".$score."', '".$gameId."')";
        $this->database->executeQuery($query);
    }

    public function deleteGame($gameId)
    {
        $query = "DELETE FROM games WHERE ID = '".$gameId."'";
        $this->database->executeQuery($query);
    }

    public function updateGame($gameId, $data)
    {
        $query = "UPDATE games SET Data = '".$data."' WHERE ID = '".$gameId."'";
        $this->database->executeQuery($query);
    }
}
?>