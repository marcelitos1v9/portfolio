<?php
include("conexao.php");
$varida=$_GET['ida'];
mysqli_query($conexao,"DELETE FROM alunos where codigo=$varida");
header("location:index.php");
?>