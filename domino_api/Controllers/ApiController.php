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

        print_r($lastRoom);

        if (empty($lastRoom))
            $lastRoom['Code'] = '';

        $lastRoom['Name'] = $_GET['room_name'];

        $sobra = 1;
        for ($i = strlen($lastRoom['Code']) - 1; $i >= 0; $i--) {
            $pos = strpos(CHARACTERS, $lastRoom['Code'][$i]) + $sobra;
            $sobra = (int)($pos / 62);
            $lastRoom['Code'][$i] = CHARACTERS[$pos % 62];
        }

        if ($sobra !== 0) {
            $lastRoom['Code'] = CHARACTERS[$sobra % 62] . $lastRoom['Code'];
        }

        $this->model->saveRoom($lastRoom['Code'], $lastRoom['Name']);

        $data['Error'] = false;
        $data['Code'] = $lastRoom['Code'];

        die(json_encode($data));
    }

    public function getAction()
    {
        // Aqui farei a vaiidação dos dados enviados e chamarei a função específica para trarar os dados
        // Essa função irá utilizar do model para recuperar os dados do banco de dados ou chamar as funções espeficidas de outras classes
        
        if (!isset($_GET['command']))
            $this->returnError('Command to execute was not send');

        $command = $_GET['command'];

        if ($command == "create_room")
            $this->CreateRoom();
        else
            $this->returnError('Invalid command');

        
        /*
        $result = $this->model->getAllData();
    
        if ($result === false)
        {
            $data['error'] = true;
            $data['message'] = 'Ocorreu um erro ao recuperar os dados.';
        } else
        {
            if ($result->num_rows > 0)
            {
                while ($row = $result->fetch_assoc())
                    $data[] = $row;
            }   
        }
        */

        echo json_encode($this->data);
    }
}
?>
