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
        resultado: { estado: "infinitas", valores: null },
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

  resolverIgualacion2: function (sistema) {
    const tolerancia = 0.0000000001;
    let pasos = [];
    pasos.push("Voy a despejar la misma variable en las dos ecuaciones y luego igualar las expresiones.");

    // Busco una variable cuyo coeficiente no sea cero en ambas ecuaciones.
    let variable = -1;
    for (let columna = 0; columna < 2; columna++) {
      if (Math.abs(sistema[0][columna]) >= tolerancia && Math.abs(sistema[1][columna]) >= tolerancia) {
        variable = columna;
        break;
      }
    }

    // Si ambas ecuaciones solo contienen variables distintas, se despeja cada una.
    if (variable === -1) {
      let primeraVariable = Math.abs(sistema[0][0]) >= tolerancia ? 0 : (Math.abs(sistema[0][1]) >= tolerancia ? 1 : -1);
      let segundaVariable = Math.abs(sistema[1][0]) >= tolerancia ? 0 : (Math.abs(sistema[1][1]) >= tolerancia ? 1 : -1);

      if (primeraVariable === -1 || segundaVariable === -1) {
        let filaVacia = primeraVariable === -1 ? sistema[0] : sistema[1];
        if (Math.abs(filaVacia[2]) >= tolerancia) {
          pasos.push("Una ecuación queda 0 = " + filaVacia[2] + "; es una contradicción.");
          return { ok: true, resultado: { estado: "inconsistente", valores: null }, pasos: pasos, error: null };
        }
        pasos.push("Una ecuación queda 0 = 0, así que no agrega una condición nueva.");
        pasos.push("La otra ecuación deja una variable libre; hay infinitas soluciones.");
        return { ok: true, resultado: { estado: "infinitas", valores: null }, pasos: pasos, error: null };
      }

      if (primeraVariable === segundaVariable) {
        pasos.push("Las ecuaciones no permiten despejar dos variables independientes; reviso si son compatibles.");
        return this.resolverEliminacion2(sistema);
      }

      let valores = [0, 0];
      valores[primeraVariable] = sistema[0][2] / sistema[0][primeraVariable];
      valores[segundaVariable] = sistema[1][2] / sistema[1][segundaVariable];
      pasos.push("Despejo " + (primeraVariable === 0 ? "x" : "y") + " de la primera ecuación: " + valores[primeraVariable] + ".");
      pasos.push("Despejo " + (segundaVariable === 0 ? "x" : "y") + " de la segunda ecuación: " + valores[segundaVariable] + ".");
      pasos.push("Solución única: x = " + valores[0] + ", y = " + valores[1] + ".");
      return { ok: true, resultado: { estado: "unica", valores: valores }, pasos: pasos, error: null };
    }

    let otraVariable = variable === 0 ? 1 : 0;
    let nombreVariable = variable === 0 ? "x" : "y";
    let nombreOtra = otraVariable === 0 ? "x" : "y";
    let expresion1 = "(" + sistema[0][2] + " - " + sistema[0][otraVariable] + nombreOtra + ") / " + sistema[0][variable];
    let expresion2 = "(" + sistema[1][2] + " - " + sistema[1][otraVariable] + nombreOtra + ") / " + sistema[1][variable];
    let constante1 = sistema[0][2] / sistema[0][variable];
    let constante2 = sistema[1][2] / sistema[1][variable];
    let pendiente1 = sistema[0][otraVariable] / sistema[0][variable];
    let pendiente2 = sistema[1][otraVariable] / sistema[1][variable];

    pasos.push("Ecuación 1: " + nombreVariable + " = " + expresion1 + " = " + constante1 + " - (" + pendiente1 + ")" + nombreOtra + ".");
    pasos.push("Ecuación 2: " + nombreVariable + " = " + expresion2 + " = " + constante2 + " - (" + pendiente2 + ")" + nombreOtra + ".");
    pasos.push("Igualo las expresiones despejadas de " + nombreVariable + ".");

    let coeficiente = pendiente2 - pendiente1;
    let termino = constante2 - constante1;
    pasos.push("(" + pendiente2 + " - " + pendiente1 + ")" + nombreOtra + " = " + constante2 + " - " + constante1 + ".");

    if (Math.abs(coeficiente) < tolerancia) {
      if (Math.abs(termino) < tolerancia) {
        pasos.push("La igualdad se cumple para cualquier valor de " + nombreOtra + "; el sistema tiene infinitas soluciones.");
        return { ok: true, resultado: { estado: "infinitas", valores: null }, pasos: pasos, error: null };
      }
      pasos.push("La igualdad produce 0 = " + termino + ", una contradicción; el sistema no tiene solución.");
      return { ok: true, resultado: { estado: "inconsistente", valores: null }, pasos: pasos, error: null };
    }

    let valores = [0, 0];
    valores[otraVariable] = termino / coeficiente;
    valores[variable] = (sistema[0][2] - sistema[0][otraVariable] * valores[otraVariable]) / sistema[0][variable];
    pasos.push(nombreOtra + " = " + termino + " / " + coeficiente + " = " + valores[otraVariable] + ".");
    pasos.push("Sustituyo " + nombreOtra + " en el despeje de " + nombreVariable + ": " + nombreVariable + " = " + valores[variable] + ".");
    pasos.push("Solución única: x = " + valores[0] + ", y = " + valores[1] + ".");
    return { ok: true, resultado: { estado: "unica", valores: valores }, pasos: pasos, error: null };
  },

  resolverSustitucion2: function (sistema) {
    const tolerancia = 0.0000000001;
    let pasos = [];
    pasos.push("Voy a despejar una variable de una ecuación y sustituirla en la otra.");

    // Elijo una ecuación con algún coeficiente distinto de cero.
    let filaDespeje = -1;
    for (let fila = 0; fila < 2; fila++) {
      if (Math.abs(sistema[fila][0]) >= tolerancia || Math.abs(sistema[fila][1]) >= tolerancia) {
        filaDespeje = fila;
        break;
      }
    }

    if (filaDespeje === -1) {
      let consistente = Math.abs(sistema[0][2]) < tolerancia && Math.abs(sistema[1][2]) < tolerancia;
      pasos.push(consistente ? "Ambas ecuaciones quedan 0 = 0; cualquier par (x, y) es solución." : "Hay una ecuación de la forma 0 = c, con c distinto de cero; existe contradicción.");
      return { ok: true, resultado: { estado: consistente ? "infinitas" : "inconsistente", valores: null }, pasos: pasos, error: null };
    }

    let columna = Math.abs(sistema[filaDespeje][0]) >= tolerancia ? 0 : 1;
    let otra = columna === 0 ? 1 : 0;
    let nombre = columna === 0 ? "x" : "y";
    let nombreOtra = otra === 0 ? "x" : "y";
    let filaSustitucion = filaDespeje === 0 ? 1 : 0;
    let coeficienteDespeje = sistema[filaDespeje][columna];
    let coeficienteOtra = sistema[filaDespeje][otra];
    let constanteDespeje = sistema[filaDespeje][2];
    let expresion = "(" + constanteDespeje + " - " + coeficienteOtra + nombreOtra + ") / " + coeficienteDespeje;

    pasos.push("De la ecuación " + (filaDespeje + 1) + ", despejo " + nombre + " = " + expresion + ".");
    pasos.push("Sustituyo esa expresión en la ecuación " + (filaSustitucion + 1) + ".");

    let coeficiente = sistema[filaSustitucion][otra] - sistema[filaSustitucion][columna] * coeficienteOtra / coeficienteDespeje;
    let termino = sistema[filaSustitucion][2] - sistema[filaSustitucion][columna] * constanteDespeje / coeficienteDespeje;
    pasos.push("Después de sustituir: " + coeficiente + nombreOtra + " = " + termino + ".");

    if (Math.abs(coeficiente) < tolerancia) {
      if (Math.abs(termino) < tolerancia) {
        pasos.push("La igualdad queda 0 = 0; hay infinitas soluciones.");
        return { ok: true, resultado: { estado: "infinitas", valores: null }, pasos: pasos, error: null };
      }
      pasos.push("La igualdad queda 0 = " + termino + "; el sistema no tiene solución.");
      return { ok: true, resultado: { estado: "inconsistente", valores: null }, pasos: pasos, error: null };
    }

    let valores = [0, 0];
    valores[otra] = termino / coeficiente;
    valores[columna] = (constanteDespeje - coeficienteOtra * valores[otra]) / coeficienteDespeje;
    pasos.push(nombreOtra + " = " + termino + " / " + coeficiente + " = " + valores[otra] + ".");
    pasos.push("Sustituyo " + nombreOtra + " en el despeje: " + nombre + " = " + valores[columna] + ".");
    pasos.push("Solución única: x = " + valores[0] + ", y = " + valores[1] + ".");
    return { ok: true, resultado: { estado: "unica", valores: valores }, pasos: pasos, error: null };
  },

  resolverSistema2: function (matrizAumentada, metodo) {
    let Resultado;
    switch (metodo) {
      case 'eliminacion':
        Resultado = this.resolverEliminacion2(matrizAumentada);
        break;
      case 'igualacion':
        Resultado = this.resolverIgualacion2(matrizAumentada);
        break;
      case 'sustitucion':
        Resultado = this.resolverSustitucion2(matrizAumentada);
        break;
      default:
        Resultado = { ok: false, resultado: null, pasos: [], error: 'Método de resolución no reconocido.' };
    }
    return Resultado;
  }
};
