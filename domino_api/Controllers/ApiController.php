<?php
class ApiController 
{
    private $model;

    public function __construct()
    {
        global $database;
        $this->model = new DataModel($database);
        header('Content-Type: application/json');
    }

    private function returnError($data, $message)
    {
        $data['description'] = $message;
        die(json_encode($data));
    }

    public function getAction()
    {
        // Aqui farei a vaiidação dos dados enviados e chamarei a função específica para trarar os dados
        // Essa função irá utilizar do model para recuperar os dados do banco de dados ou chamar as funções espeficidas de outras classes
        $data = array();
        $data['error'] = true;
        
        if (!isset($_GET['command']))
            $this->returnError($data, 'Command to execute was not send');

        $command = $_GET['command'];

        if ($command == "create_room")
        {
            if (!isset($_GET['room_name']))
                $this->returnError($data, 'Room name was not send'); 

            $data['error'] = false;
            $data['room_name'] = $_GET['room_name']; // aqui chamar a função que realizará a logica e salvar no bd 
            die(json_encode($data)); 
        }
        else
            $this->returnError($data, 'Invalid command');

        
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

        echo json_encode($data);
    }
}
?>
