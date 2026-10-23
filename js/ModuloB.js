/* 
   ModuloB.js - Determinantes e Inversas de Matrices
    */

var ModuloB = {

  determinante: function (matriz, metodo) {

    let Resultado = 0;
    let pasos = ['empezamos calculo de determinante']

    //validar si matriz es 2x2 o 3x3
    if (matriz.length < 3) {
      // si es 2x2 simplemente operamos ad - bc
      pasos.push('Matriz de 2 x 2, utilizamos metodo ad - bc')
      Resultado = matriz[0][0] * matriz[1][1] - matriz[1][0] * matriz[0][1]
      pasos.push('Calculamos : ' + matriz[0][0] + '*' + matriz[1][1] + '-' + matriz[1][0] + '*' + matriz[0][1] + ' = ' + Resultado)

    } else if (matriz.length == 3) {// si es 3x3 verificamos segun metodo seleccionado


      if (metodo == 'sarrus') {
        pasos.push('Matriz de 3 x 3, utilizamos metodo sarrus')
        let p1 = matriz[0][0] * matriz[1][1] * matriz[2][2] + matriz[0][1] * matriz[1][2] * matriz[2][0] + matriz[0][2] * matriz[1][0] * matriz[2][1]
        pasos.push('operamos : ' + matriz[0][0] + '*' + matriz[1][1] + '*' + matriz[2][2] + ' + ' + matriz[0][1] + '*' + matriz[1][2] + '*' + matriz[2][0] + ' + ' + matriz[0][2] + '*' + matriz[1][0] + '*' + matriz[2][1] + ' = ' + p1)
        let p2 = matriz[2][0] * matriz[1][1] * matriz[0][2] + matriz[2][1] * matriz[1][2] * matriz[0][0] + matriz[2][2] * matriz[1][0] * matriz[0][1]
        pasos.push('operamos : ' + matriz[2][0] + '*' + matriz[1][1] + '*' + matriz[0][2] + ' + ' + matriz[2][1] + '*' + matriz[1][2] + '*' + matriz[0][0] + ' + ' + matriz[2][2] + '*' + matriz[1][0] + '*' + matriz[0][1] + ' = ' + p2)
        Resultado = p1 - p2
        pasos.push('Resultado : ' + p1 + ' - ' + p2 + ' = ' + (p1 - p2))
      } else if (metodo === 'cofactores') {

        pasos.push('Matriz de 3 x 3, utilizamos metodo cofactores')
        let pt1 = matriz[1][1] * matriz[2][2] - matriz[2][1] * matriz[1][2]
        pt1 = matriz[0][0] * pt1
        pasos.push('operamos : ' + matriz[0][0] + '[ (' + matriz[1][1] + '*' + matriz[2][2] + ') - (' + matriz[2][1] + '*' + matriz[1][2] + ') ] = ' + pt1)


        let pt2 = matriz[1][0] * matriz[2][2] - matriz[2][0] * matriz[1][2]
        pt2 = matriz[0][1] * pt2
        pasos.push('operamos : ' + matriz[0][1] + '[ (' + matriz[1][0] + '*' + matriz[2][2] + ') - (' + matriz[2][0] + '*' + matriz[1][2] + ') ] = ' + pt2)


        let pt3 = matriz[1][0] * matriz[2][1] - matriz[2][0] * matriz[1][1]
        pt3 = matriz[0][2] * pt3
        pasos.push('operamos : ' + matriz[0][2] + '[ (' + matriz[1][0] + '*' + matriz[2][1] + ') - (' + matriz[2][0] + '*' + matriz[1][1] + ') ] = ' + pt3)

        Resultado = pt1 - pt2 + pt3
        pasos.push('Resultado : ' + pt1 + ' - ' + pt2 + ' + ' + pt3 + ' = ' + (pt1 - pt2 + pt3))
      }
    }

    return {
      ok: true,
      resultado: Resultado,
      pasos: pasos,
      error: null
    };
  },

  inversa: function (matriz, metodo) {

    const inversaGaussJordan = (matriz) => {

      // Construimos [A | I]
      const ampliada = matriz.map((fila, i) => [
        ...fila,
        ...Array.from({ length: matriz.length }, (_, j) => (i === j ? 1 : 0))
      ]);

      pasos.push("Matriz aumentada inicial [A | I]: " + JSON.stringify(ampliada));
      for (let columna = 0; columna < matriz.length; columna++) {
        // Buscar un pivote distinto de cero
        let pivote = columna;

        for (let fila = columna + 1; fila < matriz.length; fila++) {
          if (Math.abs(ampliada[fila][columna]) >
            Math.abs(ampliada[pivote][columna])) {
            pivote = fila;
          }
        }

        if (Math.abs(ampliada[pivote][columna]) < 1e-10) {
          return null;
        }

        // Intercambiar filas si hace falta
        [ampliada[columna], ampliada[pivote]] = [ampliada[pivote], ampliada[columna]];
        if (pivote !== columna) pasos.push("Intercambiamos filas " + (columna + 1) + " y " + (pivote + 1) + ": " + JSON.stringify(ampliada));

        // Convertir el pivote en 1
        const valorPivote = ampliada[columna][columna];
        ampliada[columna] = ampliada[columna].map(valor => valor / valorPivote);
        pasos.push("Normalizamos la fila " + (columna + 1) + " dividiéndola entre " + valorPivote + ": " + JSON.stringify(ampliada));

        // Hacer ceros en el resto de la columna
        for (let fila = 0; fila < matriz.length; fila++) {
          if (fila === columna) continue;

          const factor = ampliada[fila][columna];
          pasos.push("Fila " + (fila + 1) + " ← fila " + (fila + 1) + " - (" + factor + ") × fila " + (columna + 1));

          ampliada[fila] = ampliada[fila].map(
            (valor, j) => valor - factor * ampliada[columna][j]
          );
          pasos.push('Matriz aumentada después de la operación: ' + JSON.stringify(ampliada));
        }
      }

      pasos.push("El lado izquierdo quedó como I; el lado derecho contiene A⁻¹.");
      // Devolver la parte derecha de [I | A⁻¹]
      return ampliada.map(fila => fila.slice(matriz.length));
    }

    const determinanteMenor = (matriz) => {
      if (matriz.length === 1) {
        return matriz[0][0];
      }

      return matriz[0][0] * matriz[1][1] -
        matriz[0][1] * matriz[1][0];
    }

    const inversaAdjunta = (matriz, determinante) => {
      const n = matriz.length;

      if (Math.abs(determinante) < 1e-10) {
        return null;
      }

      // Calcular y mostrar cada cofactor
      let cofactores = [];
      for (let i = 0; i < n; i++) {
        let filaCofactores = [];
        for (let j = 0; j < n; j++) {
          let menor = [];
          for (let fila = 0; fila < n; fila++) {
            if (fila !== i) {
              let filaMenor = [];
              for (let columna = 0; columna < n; columna++) {
                if (columna !== j) filaMenor.push(matriz[fila][columna]);
              }
              menor.push(filaMenor);
            }
          }
          let detMenor = determinanteMenor(menor);
          let signo = (i + j) % 2 === 0 ? 1 : -1;
          let cofactor = signo * detMenor;
          pasos.push('C' + (i + 1) + (j + 1) + ' = ' + signo + ' × det' + JSON.stringify(menor) + ' = ' + cofactor);
          filaCofactores.push(cofactor);
        }
        cofactores.push(filaCofactores);
      }

      pasos.push("Matriz de cofactores: " + JSON.stringify(cofactores));
      // La adjunta es la transpuesta de la matriz de cofactores.
      const adjunta = cofactores[0].map((_, j) =>
        cofactores.map(fila => fila[j])
      );

      pasos.push("Transponemos la matriz de cofactores para obtener la adjunta: " + JSON.stringify(adjunta));
      pasos.push("Dividimos cada elemento de la adjunta entre el determinante " + determinante + " para obtener A⁻¹.");
      return adjunta.map(fila =>
        fila.map(valor => valor / determinante)
      );
    }

    let Resultado = [];
    const determinante = this.determinante(matriz, 'sarrus'); // ejecutamos funcion que creamos antes para obtener determinante
    console.log(determinante)
    let pasos = [...determinante.pasos]

    // primero verificar determinante es distinta de 0
    if (determinante.resultado == 0) {
      pasos.push('la matriz no tiene inversa debido a que la determinante es 0')
      return {
        ok: false,
        resultado: null,
        pasos: pasos,
        error: 'imposible calcular inversa'
      };
    } else {
      if (metodo == 'gauss-jordan') {
        Resultado = inversaGaussJordan(matriz);
      } else if (metodo == 'adjunta') {
        Resultado = inversaAdjunta(matriz, determinante.resultado);
      }
    }

    return {
      ok: true,
      resultado: Resultado,
      pasos: pasos,
      error: null
    };


  }
}