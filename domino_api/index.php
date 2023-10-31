<?php
//A fazer: criar um arquivo de configuração para as constantes e includes
//A fazer: criar um arquivo de rotas para as requisições, o que inclui a criação de um arquivo .htaccess
//A fazer: separar em duas classes os jogos online e offline e criar uma classe para o ranking (total 3 + a classe gerenciadora de requisições)

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

//alguns dados são enviados via POST e outros via GET, chamarei um metodo para cada
if ($_SERVER['REQUEST_METHOD'] === 'GET')
{
    $api->getAction();
}

$database->disconnect();
?>
