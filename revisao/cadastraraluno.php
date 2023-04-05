<?php
include("conexao.php");
$alunonome=$_POST["alunonome"];
$alunocidade=$_POST["alunocidade"];
$sexo=$_POST["sexo"];
mysqli_query($conexao,"INSERT into alunos (nome,cidade,sexo) values ('$alunonome','$alunocidade','$sexo')");
header("location:cadastro.php");
?>