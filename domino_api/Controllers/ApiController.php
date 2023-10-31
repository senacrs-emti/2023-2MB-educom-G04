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

    public function getAction()
    {
        // Aqui farei a vaiidação dos dados enviados e chamarei a função específica para trarar os dados
        // Essa função irá utilizar do model para recuperar os dados do banco de dados ou chamar as funções espeficidas de outras classes
        $result = $this->model->getAllData();
        $data = array();
        $data['error'] = false;
    
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

        echo json_encode($data);
    }
}
?>
