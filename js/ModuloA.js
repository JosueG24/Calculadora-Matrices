/* ============================================================
   ModuloA.js - Transpuesta, Multiplicación y Sistemas 2x2
   ============================================================ */

var ModuloA = {
  transpuesta: function (matriz) {

    let MatrizTranspuesta = [];
    let pasos = ['Recibimos matriz a trabajar'];

    for (let fila = 0; fila < matriz.length; fila++) {
      for (let columna = 0; columna < matriz[fila].length; columna++) {
        if (!MatrizTranspuesta[columna]) {
          MatrizTranspuesta[columna] = [];
        }
        pasos.push('intercambiamos valor ' + matriz[fila][columna] + ' de posicion :' + columna + ', ' + fila + ' a posicion :' + fila + ', ' + columna)
        MatrizTranspuesta[columna][fila] = matriz[fila][columna]
      }
    }

    return {
      ok: true,
      resultado: MatrizTranspuesta,
      pasos: pasos,
      error: null
    };
  },


  multiplicar: function (MatrizA, MatrizB) {

    let pasos = ['Recibimos matrices A y B para multiplicar']
    let MatrizResultado = [];
    let columnasA = MatrizA[0].length;
    let filasB = MatrizB.length;


    pasos.push('Verificamos si cantidad filas de A coincide con cantidad de columnas de B')
    if (columnasA !== filasB) {
      pasos.push('matrices no se pueden mutilplicar debido a que cantidad filas de A no coincide con cantidad de columnas de B')
      return {
        ok: true,
        resultado: MatrizResultado,
        pasos: pasos,
        error: null
      };
    }

    for (let fila = 0; fila < MatrizA.length; fila++) {
      MatrizResultado[fila] = [];
      pasos.push('iniciamos a operar fila :' + (fila + 1))
      for (let columna = 0; columna < MatrizA[fila].length; columna++) {
        let suma = 0;
        pasos.push('iniciamos a operar columna :' + (columna + 1))
        for (let k = 0; k < MatrizA[fila].length; k++) {
          suma += MatrizA[fila][k] * MatrizB[k][columna];
          pasos.push('realizamos operacion :' + MatrizA[fila][k] + ' * ' + MatrizB[k][columna] + ' = ' + MatrizA[fila][k] * MatrizB[k][columna])
        }

        pasos.push('resultado de suma casilla  : ' + fila + ', ' + columna + ' :' + suma)
        MatrizResultado[fila][columna] = suma;
      }

    }

    return {
      ok: true,
      resultado: MatrizResultado,
      pasos: pasos,
      error: null
    };
  },

  resolverEliminacion2: function (sistema) {
    const tolerancia = 0.0000000001;
    let pasos = [];

    // Trabajo sobre una copia para conservar el sistema original.
    let matriz = sistema.map(fila => [...fila]);
    let filaPivote = 0;
    let columnasPivote = [];

    pasos.push("Voy a usar eliminación para convertir un coeficiente de la segunda fila en cero.");

    // Busco un pivote en cada columna de las variables: x y luego y.
    for (let columna = 0; columna < 2 && filaPivote < 2; columna++) {
      let mejorFila = filaPivote;

      // Busco un coeficiente distinto de cero para usarlo como pivote.
      for (let fila = filaPivote + 1; fila < 2; fila++) {
        if (
          Math.abs(matriz[fila][columna]) >
          Math.abs(matriz[mejorFila][columna])
        ) {
          mejorFila = fila;
        }
      }

      // Si toda esta columna tiene ceros, paso a la siguiente variable.
      if (Math.abs(matriz[mejorFila][columna]) < tolerancia) {
        pasos.push(
          "No encuentro un pivote distinto de cero en la columna " +
          (columna === 0 ? "de x" : "de y") + "; pruebo con la siguiente variable."
        );
        continue;
      }

      // Si el pivote está en otra fila, intercambio las ecuaciones.
      if (mejorFila !== filaPivote) {
        pasos.push(
          "El pivote actual es cero; intercambio R" + (filaPivote + 1) +
          " con R" + (mejorFila + 1) + "."
        );
        [matriz[filaPivote], matriz[mejorFila]] =
          [matriz[mejorFila], matriz[filaPivote]];

        pasos.push("Después del intercambio: " + JSON.stringify(matriz));
      }

      let nombreVariable = columna === 0 ? "x" : "y";
      let pivote = matriz[filaPivote][columna];
      pasos.push(
        "Uso " + pivote + " como pivote en la columna de " + nombreVariable +
        " (fila " + (filaPivote + 1) + ")."
      );

      // Uso el pivote para hacer cero el coeficiente debajo de él.
      for (let fila = filaPivote + 1; fila < 2; fila++) {
        let coeficienteAEliminar = matriz[fila][columna];
        let factor = coeficienteAEliminar / pivote;

        pasos.push(
          "Calculo el factor dividiendo el coeficiente que quiero cancelar " +
          "(" + coeficienteAEliminar + ") entre el pivote (" + pivote + ")."
        );
        pasos.push(
          "Factor = " + coeficienteAEliminar + " / " + pivote + " = " + factor + "."
        );
        pasos.push(
          "Aplico R" + (fila + 1) + " ← R" + (fila + 1) +
          " - (" + factor + ")R" + (filaPivote + 1) + "."
        );

        let nombresColumnas = ["coeficiente de x", "coeficiente de y", "término independiente"];
        for (let j = 0; j < 3; j++) {
          let valorAnterior = matriz[fila][j];
          let valorReferencia = matriz[filaPivote][j];
          let nuevoValor = valorAnterior - factor * valorReferencia;

          pasos.push(
            nombresColumnas[j] + ": " + valorAnterior +
            " - (" + factor + " × " + valorReferencia + ") = " + nuevoValor + "."
          );

          matriz[fila][j] = nuevoValor;

          // Evito que queden residuos como 0.00000000001 en vez de cero.
          if (Math.abs(matriz[fila][j]) < tolerancia) {
            matriz[fila][j] = 0;
          }
        }

        pasos.push("La matriz después de eliminar queda: " + JSON.stringify(matriz));
      }

      columnasPivote.push(columna);
      filaPivote++;
    }

    // Si aparece 0 = un número distinto de cero, el sistema no tiene solución.
    let hayContradiccion = matriz.some(fila =>
      Math.abs(fila[0]) < tolerancia &&
      Math.abs(fila[1]) < tolerancia &&
      Math.abs(fila[2]) >= tolerancia
    );

    if (hayContradiccion) {
      let filaContradictoria = matriz.find(fila =>
        Math.abs(fila[0]) < tolerancia &&
        Math.abs(fila[1]) < tolerancia &&
        Math.abs(fila[2]) >= tolerancia
      );
      pasos.push(
        "Reviso la última fila: 0x + 0y = " + filaContradictoria[2] + "."
      );
      pasos.push("Esto equivale a 0 = " + filaContradictoria[2] + ", una contradicción.");
      pasos.push("Conclusión: el sistema no tiene solución.");

      return {
        ok: true,
        resultado: { estado: "inconsistente", valores: null },
        pasos: pasos,
        error: null
      };
    }

    // Si no hay dos pivotes y tampoco contradicción, queda una variable libre.
    if (columnasPivote.length < 2) {
      pasos.push("Al terminar la eliminación, no obtuve dos pivotes para las dos variables.");
      pasos.push("Una ecuación quedó repetida o dependiente de la otra, así que queda una variable libre.");
      pasos.push("Conclusión: el sistema tiene infinitas soluciones.");

      return {
        ok: true,
        resultado: { estado: "infinita", valores: null },
        pasos: pasos,
        error: null
      };
    }

    // Sustituyo desde la última fila hacia arriba para hallar y luego x.
    let valores = [0, 0];

    for (let i = columnasPivote.length - 1; i >= 0; i--) {
      let columna = columnasPivote[i];
      let variable = columna === 0 ? "x" : "y";
      let suma = matriz[i][2];
      let expresion = String(matriz[i][2]);

      pasos.push(
        "Ahora despejo " + variable + " usando la fila " + (i + 1) +
        ": " + JSON.stringify(matriz[i]) + "."
      );

      for (let j = columna + 1; j < 2; j++) {
        pasos.push(
          "Resto el aporte de " + (j === 0 ? "x" : "y") +
          ": " + suma + " - (" + matriz[i][j] + " × " + valores[j] + ")."
        );
        suma -= matriz[i][j] * valores[j];
        expresion += " - (" + matriz[i][j] + " × " + valores[j] + ")";
      }

      valores[columna] = suma / matriz[i][columna];
      pasos.push(
        variable + " = (" + expresion + ") / " + matriz[i][columna] +
        " = " + valores[columna] + "."
      );
    }

    pasos.push("Solución única: x = " + valores[0] + ", y = " + valores[1] + ".");

    // Compruebo que los valores hallados satisfagan las ecuaciones originales.
    for (let i = 0; i < sistema.length; i++) {
      let ladoIzquierdo = sistema[i][0] * valores[0] + sistema[i][1] * valores[1];
      pasos.push(
        "Compruebo la ecuación " + (i + 1) + ": (" + sistema[i][0] +
        " × " + valores[0] + ") + (" + sistema[i][1] + " × " +
        valores[1] + ") = " + ladoIzquierdo + "; el resultado esperado es " +
        sistema[i][2] + "."
      );
    }

    return {
      ok: true,
      resultado: { estado: "unica", valores: valores },
      pasos: pasos,
      error: null
    };
  },

  resolverSistema2: function (matrizAumentada, metodo) {
    let Resultado = 0;
    console.log(metodo)
    switch (metodo) {

      case 'eliminacion':
        Resultado = this.resolverEliminacion2(matrizAumentada)
        break;
      case 'igualacion':
        break;
      case 'sustitucion':
        break;
      default:
        break;

    }
    return {
      ok: Resultado.ok,
      resultado: Resultado.resultado,
      pasos: Resultado.pasos,
      error: Resultado.error
    };
  }
};