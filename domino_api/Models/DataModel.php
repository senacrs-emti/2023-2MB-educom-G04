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
}
?>
