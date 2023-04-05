<?php
$servidor="127.0.0.1";
$usuario="root";
$senha="";
$db="escola";

$conexao = mysqli_connect($servidor,$usuario,$senha);
mysqli_select_db($conexao,$db);
mysqli_set_charset($conexao,"UTF-8");
?>