const resultado = document.querySelector("#resultado");
const numeros = document.querySelectorAll(".numero");
const operadores = document.querySelectorAll(".operador");
const igual = document.querySelector(".igual");
const decimal = document.querySelector(".decimal");
const limpar = document.querySelector(".limpar");

let valorAtual = "";
let operadorAtual = "";
let operadorAnterior = "";
let resultadoFinal = null;

numeros.forEach(numero => {
  numero.addEventListener("click", () => {
    if (numero.textContent === "0" && valorAtual === "") {
      return;
    }
    valorAtual += numero.textContent;
    resultado.value = valorAtual;
  });
});

operadores.forEach(operador => {
  operador.addEventListener("click", () => {
    if (operadorAnterior === "") {
      operadorAnterior = operador.textContent;
      resultadoFinal = parseFloat(valorAtual);
      valorAtual = "";
      resultado.value = "";
    } else {
      operadorAtual = operador.textContent;
      if (operadorAnterior === "+") {
        resultadoFinal += parseFloat(valorAtual);
      } else if (operadorAnterior === "-") {
        resultadoFinal -= parseFloat(valorAtual);
      } else if (operadorAnterior === "*") {
        resultadoFinal *= parseFloat(valorAtual);
      } else if (operadorAnterior === "/") {
        resultadoFinal /= parseFloat(valorAtual);
      }
      operadorAnterior = operadorAtual;
      valorAtual = "";
      resultado.value = "";
    }
  });
});

igual.addEventListener("click", () => {
  if (valorAtual !== "") {
    if (operadorAnterior === "+") {
      resultadoFinal += parseFloat(valorAtual);
    } else if (operadorAnterior === "-") {
      resultadoFinal -= parseFloat(valorAtual);
    } else if (operadorAnterior === "*") {
      resultadoFinal *= parseFloat(valorAtual);
    } else if (operadorAnterior === "/") {
      resultadoFinal /= parseFloat(valorAtual);
    }
    valorAtual = resultadoFinal.toString();
    resultado.value = valorAtual;
    operadorAnterior = "";
  }
});

limpar.addEventListener("click", () => {
    valorAtual = "";
    operadorAtual = "";
    operadorAnterior = "";
    resultadoFinal = null;
    resultado.value = "";
  });
  
decimal.addEventListener("click", () => {
  if (valorAtual.indexOf(".") === -1) {
    valorAtual += ".";
    resultado.value = valorAtual;
  }
});