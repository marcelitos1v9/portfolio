<?php include("conexao.php"); ?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atualizar</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
</head>

<body class="p-3 mb-2 bg-dark text-white">
    <?php
    $varida = $_GET["ida"];
    $query = mysqli_query($conexao, "SELECT * FROM alunos where codigo = $varida");
    while ($exibe = mysqli_fetch_array($query)) {
    ?>

        <form action="atualizaraluno.php" method="post" class="container-fluid col-4 position-absolute top-50 start-50 translate-middle">
            <input type="hidden" name="alunocodigo" value="<?php echo $exibe[0] ?>">
            <label class="form-label">Nome:</label>
            <input type="text" class="form-control" name="alunonome" value="<?php echo $exibe[1] ?>"><br>
            <label class="form-label">Cidade:</label>
            <input type="text" class="form-control " name="alunocidade" value="<?php echo $exibe[2] ?>">
            <label class="form-label mt-3">Sexo:</label><br>
            <input type="radio" id="sexo-m" name="sexos" value="M" <?php if ($exibe[3] == "M") {
                                                                        echo "checked";
                                                                    } ?>>
            <label for="sexo-m">Masculino</label><br>
            <input type="radio" id="sexo-f" name="sexos" value="F" <?php if ($exibe[3] == "F") {
                                                                        echo "checked";
                                                                    } ?>>
            <label for="sexo-f">Feminino</label><br>

            <div class="row mt-3">
                <a href="index.php" class="btn btn-primary">Voltar ao início</a>
                <input type="submit" class="btn btn-success mt-3" value="atualizar">
            </div>
        </form>
    <?php } ?>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
</body>

</html>