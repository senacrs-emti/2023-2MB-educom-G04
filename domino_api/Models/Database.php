<?php
class Database
{
    private $host;
    private $username;
    private $password;
    private $database;
    private $connection;

    public function __construct($host, $username, $password, $database)
    {
        $this->host = $host;
        $this->username = $username;
        $this->password = $password;
        $this->database = $database;
    }

    public function connect()
    {
        $this->connection = new mysqli($this->host, $this->username, $this->password, $this->database);

        if ($this->connection->connect_error)
        {
            die('Erro na conexão com o banco de dados: ' . $this->connection->connect_error);
        }
    }

    public function disconnect()
    {
        $this->connection->close();
    }

    public function executeQuery($query)
    {
        return $this->connection->query($query);
    }
}
?>
