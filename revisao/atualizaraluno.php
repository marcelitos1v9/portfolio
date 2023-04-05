<?php include("conexao.php");

$alunocodigo=$_POST["alunocodigo"];
$alunonome=$_POST["alunonome"];
$alunocidade=$_POST["alunocidade"];
$sexo=$_POST["sexos"];
mysqli_query($conexao,"UPDATE alunos set nome='$alunonome',cidade='$alunocidade',sexo='$sexo' where codigo = '$alunocodigo'");

header("location:index.php");
?>