<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>cadastrar</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
</head>

<body class="p-3 mb-2 bg-dark text-white">
    <form action="cadastraraluno.php" method="post" class="container-fluid col-4 position-absolute top-50 start-50 translate-middle">
        <label class="form-label">Nome:</label>
        <input type="text" class="form-control" name="alunonome" require><br>
        <label class="form-label">Cidade:</label>
        <input type="text" class="form-control " name="alunocidade" require>
        <label class="form-label mt-3">Sexo:</label><br>
        <input type="radio" id="sexo-m" name="sexo" value="M">
        <label for="sexo-m">Masculino</label><br>
        <input type="radio" id="sexo-f" name="sexo" value="F">
        <label for="sexo-f">Feminio</label><br>
        <div class="row mt-3">
        <a href="index.php" class="btn btn-primary">Voltar ao início</a>
        <input type="submit" class="btn btn-success mt-3" value="cadastrar">
        </div>
    </form>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
</body>

</html>