<?php include("conexao.php");?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crudt</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
</head>

<body class="p-3 mb-2 bg-dark text-white">
    
    <div class="text-center mt-3 " >
        <center>
    <a class="btn btn-light mb-3 " href="cadastro.php">Cadastrar</a>
            <div class="col-3 justify-content-center">
            <form action="index.php" method="post">
            <input type="text" name="buscar" class="form-control col-2" placeholder="Buscar">
            <input type="submit" class="btn btn-warning mt-3" value="buscar">
            <br></br>
            </form>
</center>
            </div>
            <?php 
            if(empty($_POST["buscar"])){
                echo "nenhum resultado";
            }else{
                $varbusca = $_POST["buscar"];
            
            ?>
        </div>
        <div class="container-fluid col-6">
        <table border="1"  class="table table-dark table-striped">
            <tr>
            <th> 
                
                Frase
                </td>
                <td >
                    Editar
                </td>
                <td> 
                    Excluir
                </td>
            </th>

        <?php

        $query = mysqli_query($conexao, "SELECT * from alunos where nome like '%$varbusca%'");
        while($exibe = mysqli_fetch_array($query)){
            $varsexo = ($exibe[3]=='M')?"o":"a";
               
            echo "<tr>".
            "<td>".strtoupper($varsexo)." alun$varsexo"." <b>". $exibe[1]."</b> mora na cidade de ".$exibe[2].".</td>"."<td><a class='btn btn-warning' href='cadastroatualiza.php?ida=".$exibe[0]."'>Editar<a/></td>".
            "<td><a class='btn btn-danger' href='deletaraluno.php?ida=".$exibe[0]."'>Excluir </a></td>".
            "<tr>";
        }
       
        ?>
        </table>
        <?php
            }
        ?>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
</body>

</html>