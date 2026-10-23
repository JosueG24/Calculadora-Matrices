/* ModuloC.js - Resolución de sistemas de tres ecuaciones */

var ModuloC = {
  resolverSistema3: function (matrizAumentada, metodo) {
    const tolerancia = 0.0000000001;
    let pasos = [];

    // Calcula un determinante 3x3 con la regla de Sarrus.
    const determinante3 = (matriz) => {
      let descendentes = matriz[0][0] * matriz[1][1] * matriz[2][2] +
        matriz[0][1] * matriz[1][2] * matriz[2][0] +
        matriz[0][2] * matriz[1][0] * matriz[2][1];
      let ascendentes = matriz[0][2] * matriz[1][1] * matriz[2][0] +
        matriz[0][0] * matriz[1][2] * matriz[2][1] +
        matriz[0][1] * matriz[1][0] * matriz[2][2];
      pasos.push("Diagonales descendentes: " + descendentes + "; diagonales ascendentes: " + ascendentes + ".");
      pasos.push("det = " + descendentes + " - " + ascendentes + " = " + (descendentes - ascendentes) + ".");
      return descendentes - ascendentes;
    };

    // Hace eliminación Gaussiana o Gauss-Jordan y conserva las columnas pivote.
    const reducir = (entrada, gaussJordan) => {
      let matriz = entrada.map(fila => [...fila]);
      let pivotes = [];
      let filaPivote = 0;

      pasos.push(gaussJordan ? "Inicio Gauss-Jordan con la matriz aumentada: " + JSON.stringify(matriz) : "Inicio eliminación Gaussiana con la matriz aumentada: " + JSON.stringify(matriz));

      for (let columna = 0; columna < 3 && filaPivote < 3; columna++) {
        // Elige el pivote más grande disponible para evitar dividir por cero.
        let mejorFila = filaPivote;
        for (let fila = filaPivote + 1; fila < 3; fila++) {
          if (Math.abs(matriz[fila][columna]) > Math.abs(matriz[mejorFila][columna])) {
            mejorFila = fila;
          }
        }

        if (Math.abs(matriz[mejorFila][columna]) < tolerancia) {
          pasos.push("La columna " + (columna + 1) + " no tiene pivote distinto de cero; paso a la siguiente.");
          continue;
        }

        if (mejorFila !== filaPivote) {
          [matriz[filaPivote], matriz[mejorFila]] = [matriz[mejorFila], matriz[filaPivote]];
          pasos.push("Intercambio R" + (filaPivote + 1) + " con R" + (mejorFila + 1) + ": " + JSON.stringify(matriz) + ".");
        }

        let valorPivote = matriz[filaPivote][columna];
        if (gaussJordan) {
          matriz[filaPivote] = matriz[filaPivote].map(valor => valor / valorPivote);
          pasos.push("Normalizo R" + (filaPivote + 1) + " dividiendo entre " + valorPivote + ": " + JSON.stringify(matriz) + ".");

          for (let fila = 0; fila < 3; fila++) {
            if (fila === filaPivote) continue;
            let factor = matriz[fila][columna];
            if (Math.abs(factor) < tolerancia) continue;
            for (let j = 0; j < 4; j++) {
              matriz[fila][j] -= factor * matriz[filaPivote][j];
              if (Math.abs(matriz[fila][j]) < tolerancia) matriz[fila][j] = 0;
            }
            pasos.push("R" + (fila + 1) + " ← R" + (fila + 1) + " - (" + factor + ")R" + (filaPivote + 1) + ": " + JSON.stringify(matriz) + ".");
          }
        } else {
          for (let fila = filaPivote + 1; fila < 3; fila++) {
            let factor = matriz[fila][columna] / valorPivote;
            if (Math.abs(factor) < tolerancia) continue;
            for (let j = columna; j < 4; j++) {
              matriz[fila][j] -= factor * matriz[filaPivote][j];
              if (Math.abs(matriz[fila][j]) < tolerancia) matriz[fila][j] = 0;
            }
            pasos.push("R" + (fila + 1) + " ← R" + (fila + 1) + " - (" + factor + ")R" + (filaPivote + 1) + ": " + JSON.stringify(matriz) + ".");
          }
        }

        pivotes.push(columna);
        filaPivote++;
      }

      return { matriz: matriz, pivotes: pivotes };
    };

    const clasificarReducida = (reducida) => {
      let hayContradiccion = reducida.matriz.some(fila =>
        Math.abs(fila[0]) < tolerancia && Math.abs(fila[1]) < tolerancia &&
        Math.abs(fila[2]) < tolerancia && Math.abs(fila[3]) >= tolerancia
      );

      if (hayContradiccion) {
        pasos.push("Aparece una fila 0x + 0y + 0z = c, con c distinto de cero; el sistema es inconsistente.");
        return { ok: true, resultado: { estado: "inconsistente", valores: null }, pasos: pasos, error: null };
      }

      if (reducida.pivotes.length < 3) {
        pasos.push("Hay menos de tres pivotes y no aparece contradicción; queda al menos una variable libre.");
        pasos.push("Conclusión: el sistema tiene infinitas soluciones.");
        return { ok: true, resultado: { estado: "infinitas", valores: null }, pasos: pasos, error: null };
      }
      return null;
    };

    if (metodo === "cramer") {
      pasos.push("Método de Cramer: calculo el determinante de la matriz de coeficientes y los tres determinantes reemplazando una columna por los términos independientes.");
      let coeficientes = matrizAumentada.map(fila => fila.slice(0, 3));
      let determinante = determinante3(coeficientes);

      if (Math.abs(determinante) < tolerancia) {
        pasos.push("det(A) = 0, así que Cramer no permite obtener una solución única. Reduzco la matriz para identificar si hay contradicción o variables libres.");
        let reducida = reducir(matrizAumentada, true);
        return clasificarReducida(reducida);
      }

      let determinantes = [];
      for (let columna = 0; columna < 3; columna++) {
        let reemplazada = coeficientes.map((fila, i) =>
          fila.map((valor, j) => j === columna ? matrizAumentada[i][3] : valor)
        );
        pasos.push("Para " + ["x", "y", "z"][columna] + ", reemplazo la columna " + (columna + 1) + ": " + JSON.stringify(reemplazada) + ".");
        determinantes[columna] = determinante3(reemplazada);
      }

      let valores = determinantes.map(valor => valor / determinante);
      pasos.push("x = det(Ax)/det(A) = " + determinantes[0] + "/" + determinante + " = " + valores[0] + ".");
      pasos.push("y = det(Ay)/det(A) = " + determinantes[1] + "/" + determinante + " = " + valores[1] + ".");
      pasos.push("z = det(Az)/det(A) = " + determinantes[2] + "/" + determinante + " = " + valores[2] + ".");
      pasos.push("Solución única: x = " + valores[0] + ", y = " + valores[1] + ", z = " + valores[2] + ".");
      return { ok: true, resultado: { estado: "unica", valores: valores }, pasos: pasos, error: null };
    }

    if (metodo === "gaussiano") {
      pasos.push("Método Gaussiano: convierto la matriz aumentada en una matriz escalonada y luego despejo de abajo hacia arriba.");
      let reducida = reducir(matrizAumentada, false);
      let especial = clasificarReducida(reducida);
      if (especial) return especial;

      let valores = [0, 0, 0];
      for (let i = reducida.pivotes.length - 1; i >= 0; i--) {
        let columna = reducida.pivotes[i];
        let suma = reducida.matriz[i][3];
        let expresion = String(suma);
        for (let j = columna + 1; j < 3; j++) {
          expresion += " - (" + reducida.matriz[i][j] + " × " + valores[j] + ")";
          suma -= reducida.matriz[i][j] * valores[j];
        }
        valores[columna] = suma / reducida.matriz[i][columna];
        pasos.push(["x", "y", "z"][columna] + " = (" + expresion + ") / " + reducida.matriz[i][columna] + " = " + valores[columna] + ".");
      }
      pasos.push("Solución única: x = " + valores[0] + ", y = " + valores[1] + ", z = " + valores[2] + ".");
      return { ok: true, resultado: { estado: "unica", valores: valores }, pasos: pasos, error: null };
    }

    if (metodo === "gauss-jordan") {
      pasos.push("Método Gauss-Jordan: hago cada pivote igual a uno y elimino los demás valores de su columna.");
      let reducida = reducir(matrizAumentada, true);
      let especial = clasificarReducida(reducida);
      if (especial) return especial;

      let valores = [0, 0, 0];
      for (let i = 0; i < reducida.pivotes.length; i++) {
        valores[reducida.pivotes[i]] = reducida.matriz[i][3];
      }
      pasos.push("La parte de coeficientes quedó como la identidad.");
      pasos.push("Solución única: x = " + valores[0] + ", y = " + valores[1] + ", z = " + valores[2] + ".");
      return {
        ok: true,
        resultado: {
          estado: "unica",
          valores: valores
        },
        pasos: pasos,
        error: null
      };
    }

    return {
      ok: false,
      resultado: null,
      pasos: pasos,
      error: "Método de resolución no reconocido."
    };
  }
};
