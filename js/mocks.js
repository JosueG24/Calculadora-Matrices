// Respuestas de ejemplo para la interfaz.
// No usan los datos ingresados para hacer cálculos.

function mockTranspuesta(matriz) {
  if (matriz.length === 4) {
    return {
      ok: true,
      resultado: [[1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15], [4, 8, 12, 16]],
      pasos: [
        "Ejemplo fijo 4×4: A = [[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,16]].",
        "La fila 1 pasa a ser la columna 1 de Aᵀ: [1, 5, 9, 13].",
        "La fila 2 pasa a ser la columna 2: [2, 6, 10, 14].",
        "La fila 3 pasa a ser la columna 3: [3, 7, 11, 15].",
        "La fila 4 pasa a ser la columna 4: [4, 8, 12, 16].",
        "Resultado de ejemplo: Aᵀ = [[1,5,9,13], [2,6,10,14], [3,7,11,15], [4,8,12,16]]."
      ],
      error: null
    };
  }

  if (matriz.length === 3) {
    return {
      ok: true,
      resultado: [[1, 4, 7], [2, 5, 8], [3, 6, 9]],
      pasos: [
        "Ejemplo fijo 3×3: A = [[1,2,3], [4,5,6], [7,8,9]].",
        "La fila 1 pasa a ser la columna 1: [1, 4, 7].",
        "La fila 2 pasa a ser la columna 2: [2, 5, 8].",
        "La fila 3 pasa a ser la columna 3: [3, 6, 9].",
        "Resultado de ejemplo: Aᵀ = [[1,4,7], [2,5,8], [3,6,9]]."
      ],
      error: null
    };
  }

  return {
    ok: true,
    resultado: [[1, 3], [2, 4]],
    pasos: [
      "Ejemplo: A = [[1, 2], [3, 4]].",
      "La fila 1 de A pasa a ser la columna 1 de Aᵀ: [1, 2].",
      "La fila 2 de A pasa a ser la columna 2 de Aᵀ: [3, 4].",
      "Se intercambian las posiciones de filas y columnas: aᵢⱼ pasa a aⱼᵢ.",
      "Resultado: Aᵀ = [[1, 3], [2, 4]]."
    ],
    error: null
  };
}

function mockMultiplicacion(A, B) {
  let filasA = A.length;
  let columnasA = A[0].length;
  let filasB = B.length;
  let columnasB = B[0].length;

  if (columnasA !== filasB) {
    return {
      ok: false,
      resultado: null,
      pasos: [
        "Matriz A: " + filasA + "×" + columnasA + "; matriz B: " + filasB + "×" + columnasB + ".",
        "Para multiplicar A×B, las columnas de A deben coincidir con las filas de B.",
        "En este caso " + columnasA + " ≠ " + filasB + ", así que no se puede multiplicar."
      ],
      error: "Las columnas de A deben ser iguales a las filas de B."
    };
  }

  let resultado = [];
  for (let i = 0; i < filasA; i++) {
    let fila = [];
    for (let j = 0; j < columnasB; j++) {
      fila.push(1);
    }
    resultado.push(fila);
  }

  return {
    ok: true,
    resultado: resultado,
    pasos: [
      "Ejemplo de procedimiento: A = [[1, 2], [3, 4]] y B = [[5, 6], [7, 8]].",
      "Las columnas de A (2) coinciden con las filas de B (2); por eso la multiplicación es posible.",
      "Cada resultado se obtiene multiplicando una fila de A por una columna de B y sumando.",
      "c₁₁ = (1 × 5) + (2 × 7) = 19; c₁₂ = (1 × 6) + (2 × 8) = 22.",
      "c₂₁ = (3 × 5) + (4 × 7) = 43; c₂₂ = (3 × 6) + (4 × 8) = 50.",
      "Resultado del ejemplo: [[19, 22], [43, 50]].",
      "El mock muestra una matriz de unos de tamaño " + filasA + "×" + columnasB + "; no es el cálculo de las matrices ingresadas."
    ],
    error: null
  };
}

function mockDeterminante(matriz, metodo) {
  if (matriz.length === 2) {
    let pasos;
    if (metodo === "cofactores") {
      pasos = [
        "Ejemplo: A = [[1, 2], [3, 4]]. Se desarrolla por cofactores en la primera fila.",
        "det(A) = 1×det([4]) − 2×det([3]).",
        "Los determinantes de las matrices 1×1 son 4 y 3.",
        "det(A) = 1×4 − 2×3 = 4 − 6 = −2."
      ];
    } else {
      pasos = [
        "Ejemplo: A = [[1, 2], [3, 4]].",
        "Para una matriz 2×2, det(A) = (a × d) − (b × c).",
        "det(A) = (1 × 4) − (2 × 3) = 4 − 6 = −2."
      ];
    }

    return {
      ok: true,
      resultado: -2,
      pasos: pasos,
      error: null
    };
  }

  if (metodo === "sarrus") {
    return {
      ok: true,
      resultado: 1,
      pasos: [
        "Ejemplo: A = [[1, 2, 3], [0, 1, 4], [5, 6, 0]].",
        "Sarrus: se suman los productos de las diagonales descendentes.",
        "Descendentes: (1×1×0) + (2×4×5) + (3×0×6) = 40.",
        "Se suman los productos de las diagonales ascendentes.",
        "Ascendentes: (3×1×5) + (1×4×6) + (2×0×0) = 39.",
        "det(A) = 40 − 39 = 1."
      ],
      error: null
    };
  }

  return {
    ok: true,
    resultado: 1,
    pasos: [
      "Ejemplo: A = [[1, 2, 3], [0, 1, 4], [5, 6, 0]].",
      "Se desarrolla por cofactores usando la primera fila.",
      "det(A) = 1×det([[1, 4], [6, 0]]) − 2×det([[0, 4], [5, 0]]) + 3×det([[0, 1], [5, 6]]).",
      "Los determinantes menores son −24, −20 y −5.",
      "det(A) = 1×(−24) − 2×(−20) + 3×(−5) = −24 + 40 − 15 = 1."
    ],
    error: null
  };
}

function mockInversa(matriz, metodo) {
  if (matriz.length === 3) {
    if (metodo === "gauss-jordan") {
      return {
        ok: true,
        resultado: [[1, -1, 1], [0, 1, -1], [0, 0, 1]],
        pasos: [
          "Ejemplo: A = [[1, 1, 0], [0, 1, 1], [0, 0, 1]]. Se forma [A | I].",
          "La matriz aumentada empieza: [[1,1,0|1,0,0], [0,1,1|0,1,0], [0,0,1|0,0,1]].",
          "R₂ ← R₂ − R₃: la segunda fila queda [0, 1, 0 | 0, 1, −1].",
          "R₁ ← R₁ − R₂: la primera fila queda [1, 0, 0 | 1, −1, 1].",
          "El lado izquierdo queda como I; el lado derecho es A⁻¹.",
          "Resultado: A⁻¹ = [[1, −1, 1], [0, 1, −1], [0, 0, 1]]."
        ],
        error: null
      };
    }

    return {
      ok: true,
      resultado: [[0, 1, 0], [1, 0, 0], [0, 0, 1]],
      pasos: [
        "Ejemplo: A = [[0, 1, 0], [1, 0, 0], [0, 0, 1]].",
        "Se calcula det(A) = −1; como es distinto de cero, existe A⁻¹.",
        "Se calculan los cofactores y se forma la matriz de cofactores: [[0, −1, 0], [−1, 0, 0], [0, 0, −1]].",
        "Se transpone la matriz de cofactores para obtener adj(A). En este ejemplo no cambia.",
        "A⁻¹ = adj(A) / det(A) = adj(A) / (−1).",
        "Resultado: A⁻¹ = [[0, 1, 0], [1, 0, 0], [0, 0, 1]]."
      ],
      error: null
    };
  }

  if (metodo === "gauss-jordan") {
    return {
      ok: true,
      resultado: [[-2, 1], [1.5, -0.5]],
      pasos: [
        "Ejemplo: A = [[1, 2], [3, 4]]. Se forma [A | I] = [[1,2|1,0], [3,4|0,1]].",
        "R₂ ← R₂ − 3R₁: [[1,2|1,0], [0,−2|−3,1]].",
        "R₂ ← (−1/2)R₂: [[1,2|1,0], [0,1|1.5,−0.5]].",
        "R₁ ← R₁ − 2R₂: [[1,0|−2,1], [0,1|1.5,−0.5]].",
        "El lado izquierdo quedó como I; el lado derecho es A⁻¹.",
        "Resultado: A⁻¹ = [[−2, 1], [1.5, −0.5]]."
      ],
      error: null
    };
  }

  return {
    ok: true,
    resultado: [[-2, 1], [1.5, -0.5]],
    pasos: [
      "Ejemplo: A = [[1, 2], [3, 4]] y det(A) = (1×4) − (2×3) = −2.",
      "La matriz de cofactores es [[4, −3], [−2, 1]].",
      "Se transpone para obtener adj(A) = [[4, −2], [−3, 1]].",
      "A⁻¹ = adj(A) / det(A) = [[4,−2], [−3,1]] / (−2).",
      "Resultado: A⁻¹ = [[−2, 1], [1.5, −0.5]]."
    ],
    error: null
  };
}

function mockSistema2(metodo) {
  let pasos;

  if (metodo === "igualacion") {
    pasos = [
      "Ejemplo: 2x + y = 5 y x − y = 1.",
      "Despejamos x en ambas ecuaciones: x = (5 − y)/2 y x = y + 1.",
      "Igualamos: (5 − y)/2 = y + 1; entonces 5 − y = 2y + 2.",
      "3y = 3, por lo tanto y = 1. Sustituimos: x = y + 1 = 2.",
      "Solución de ejemplo: x = 2, y = 1."
    ];
  } else if (metodo === "sustitucion") {
    pasos = [
      "Ejemplo: 2x + y = 5 y x − y = 1.",
      "Despejamos x en la segunda ecuación: x = y + 1.",
      "Sustituimos en la primera: 2(y + 1) + y = 5.",
      "3y + 2 = 5; entonces y = 1.",
      "Sustituimos y = 1 en x = y + 1: x = 2.",
      "Solución de ejemplo: x = 2, y = 1."
    ];
  } else {
    pasos = [
      "Ejemplo: 2x + y = 5 y x − y = 1.",
      "Sumamos las ecuaciones para eliminar y: (2x + y) + (x − y) = 5 + 1.",
      "3x = 6, por lo tanto x = 2.",
      "Sustituimos x = 2 en x − y = 1: 2 − y = 1, entonces y = 1.",
      "Solución de ejemplo: x = 2, y = 1."
    ];
  }

  return {
    ok: true,
    resultado: { estado: "unica", valores: [2, 1] },
    pasos: pasos,
    error: null
  };
}

function mockSistema3(metodo) {
  let pasos;

  if (metodo === "cramer") {
    pasos = [
      "Ejemplo: x + y + z = 6; 2x − y + z = 3; x + 2y − z = 2.",
      "Matriz de coeficientes A = [[1,1,1], [2,−1,1], [1,2,−1]] y det(A) = 7.",
      "Se reemplazan las columnas por [6,3,2]: det(Aₓ) = 6(−1) − (−5) + 8 = 7.",
      "Para Aᵧ: det(Aᵧ) = −5 − 6(−3) + 1 = 14.",
      "Para A_z: det(A_z) = −8 − 1 + 6(5) = 21.",
      "Regla de Cramer: x = det(Aₓ)/det(A) = 7/7 = 1.",
      "y = det(Aᵧ)/det(A) = 14/7 = 2; z = det(A_z)/det(A) = 21/7 = 3.",
      "Solución de ejemplo: x = 1, y = 2, z = 3."
    ];
  } else if (metodo === "gauss-jordan") {
    pasos = [
      "Ejemplo: x + y + z = 6; 2x − y + z = 3; x + 2y − z = 2.",
      "Matriz aumentada: [[1,1,1|6], [2,−1,1|3], [1,2,−1|2]].",
      "R₂ ← R₂ − 2R₁ y R₃ ← R₃ − R₁: [[1,1,1|6], [0,−3,−1|−9], [0,1,−2|−4]].",
      "Intercambiamos R₂ y R₃; luego R₃ ← R₃ + 3R₂: [[1,1,1|6], [0,1,−2|−4], [0,0,−7|−21]].",
      "R₃ ← (−1/7)R₃: la tercera fila queda [0,0,1|3].",
      "R₂ ← R₂ + 2R₃; R₁ ← R₁ − R₃; R₁ ← R₁ − R₂.",
      "La matriz final es [[1,0,0|1], [0,1,0|2], [0,0,1|3]].",
      "Solución de ejemplo: x = 1, y = 2, z = 3."
    ];
  } else {
    pasos = [
      "Ejemplo: x + y + z = 6; 2x − y + z = 3; x + 2y − z = 2.",
      "Matriz aumentada: [[1,1,1|6], [2,−1,1|3], [1,2,−1|2]].",
      "R₂ ← R₂ − 2R₁ y R₃ ← R₃ − R₁: [[1,1,1|6], [0,−3,−1|−9], [0,1,−2|−4]].",
      "Intercambiamos R₂ y R₃; luego R₃ ← R₃ + 3R₂ para obtener forma triangular: [[1,1,1|6], [0,1,−2|−4], [0,0,−7|−21]].",
      "Sustitución regresiva: −7z = −21, entonces z = 3.",
      "y − 2z = −4, entonces y = 2; x + y + z = 6, entonces x = 1.",
      "Solución de ejemplo: x = 1, y = 2, z = 3."
    ];
  }

  return {
    ok: true,
    resultado: { estado: "unica", valores: [1, 2, 3] },
    pasos: pasos,
    error: null
  };
}
