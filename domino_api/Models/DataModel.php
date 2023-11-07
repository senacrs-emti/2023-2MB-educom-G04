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
        echo $query;
        $this->database->executeQuery($query);
    }
}
?>
