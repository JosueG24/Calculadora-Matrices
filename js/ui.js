// ============================================================
// ui.js - Interfaz del sistema de álgebra lineal
//
// La interfaz NO hace cálculos matemáticos. Solo:
//   1. muestra la sección activa,
//   2. crea y lee las casillas,
//   3. llama a los módulos (ModuloA, ModuloB, ModuloC),
//   4. dibuja lo que los módulos devuelven.
// ============================================================

// Nombres de las 5 operaciones (coinciden con los ids del HTML: "op-...", "menu-...")
let OPERACIONES = ["transpuesta", "determinante", "inversa", "multiplicacion", "sistemas"];

// Mensaje cuando falta algún dato
let MENSAJE_VACIAS = "Completa todas las casillas con números";


// ============================================================
// GRUPO 1: NÚMEROS Y TEXTOS
// ============================================================

// Convierte un número en texto para mostrarlo: máximo 4 decimales, sin ceros
// sobrantes, sin "-0" y con el signo menos real (−)
function formatear(n) {
  if (typeof n !== "number" || isNaN(n)) {
    return String(n);
  }
  let redondeado = Math.round(n * 10000) / 10000;
  if (redondeado === 0) {
    return "0"; // así nunca sale "-0"
  }
  return String(redondeado).replace("-", "−");
}

// Agrega espacios a la izquierda hasta que el texto tenga el ancho pedido
function rellenar(texto, ancho) {
  while (texto.length < ancho) {
    texto = " " + texto;
  }
  return texto;
}

// Convierte una matriz en texto con las filas alineadas, por ejemplo:
// [  1  −2 ]
// [ 10   3 ]
function matrizATexto(matriz) {
  // Primero busco el ancho del número más largo
  let ancho = 0;
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
      let largo = formatear(matriz[i][j]).length;
      if (largo > ancho) {
        ancho = largo;
      }
    }
  }

  // Luego armo cada fila con los números alineados a la derecha
  let texto = "";
  for (let i = 0; i < matriz.length; i++) {
    let linea = "[ ";
    for (let j = 0; j < matriz[i].length; j++) {
      if (j > 0) {
        linea = linea + "  ";
      }
      linea = linea + rellenar(formatear(matriz[i][j]), ancho);
    }
    linea = linea + " ]";
    if (i > 0) {
      texto = texto + "\n";
    }
    texto = texto + linea;
  }
  return texto;
}

// Convierte una fila de la matriz aumentada en una ecuación legible, por ejemplo "2x − 1y + 3z = 5"
function ecuacionATexto(fila) {
  let letras = ["x", "y", "z"];
  let cantidad = fila.length - 1; // la última posición es el término independiente
  let texto = "";
  for (let j = 0; j < cantidad; j++) {
    if (j === 0) {
      texto = formatear(fila[j]) + letras[j];
    } else if (fila[j] < 0) {
      texto = texto + " − " + formatear(-fila[j]) + letras[j];
    } else {
      texto = texto + " + " + formatear(fila[j]) + letras[j];
    }
  }
  texto = texto + " = " + formatear(fila[cantidad]);
  return texto;
}

// Devuelve el texto de la opción elegida en un selector (por ejemplo "Regla de Sarrus")
function textoSeleccionado(idSelect) {
  let select = document.getElementById(idSelect);
  return select.options[select.selectedIndex].text;
}

// Hace una copia de una matriz (a los módulos les paso copias, no la original)
function copiarMatriz(matriz) {
  let copia = [];
  for (let i = 0; i < matriz.length; i++) {
    let fila = [];
    for (let j = 0; j < matriz[i].length; j++) {
      fila.push(matriz[i][j]);
    }
    copia.push(fila);
  }
  return copia;
}


// ============================================================
// GRUPO 2: CASILLAS (crear, leer, vaciar)
// ============================================================

// Cuando el usuario escribe en una casilla marcada en rojo, se le quita el rojo
// ("this" es la casilla donde se escribió)
function quitarError() {
  this.classList.remove("error");
}

// Crea una casilla (un <input>) vacía
function crearCasilla() {
  let casilla = document.createElement("input");
  casilla.type = "text";
  casilla.className = "casilla";
  casilla.placeholder = "0";
  casilla.oninput = quitarError;
  return casilla;
}

// Crea una cuadrícula de filas × columnas casillas dentro del contenedor indicado
function crearCuadricula(idContenedor, filas, columnas) {
  let contenedor = document.getElementById(idContenedor);
  contenedor.innerHTML = ""; // borro lo que había

  let marco = document.createElement("div"); // el marco lleva los corchetes
  marco.className = "matriz";

  let rejilla = document.createElement("div"); // la rejilla ordena las casillas
  rejilla.className = "rejilla";
  rejilla.style.gridTemplateColumns = "repeat(" + columnas + ", 64px)";

  for (let i = 0; i < filas * columnas; i++) {
    rejilla.appendChild(crearCasilla());
  }

  marco.appendChild(rejilla);
  contenedor.appendChild(marco);
}

// Crea las filas de ecuaciones: [ ] x + [ ] y + [ ] z = [ ]
function crearFormularioSistema(cantidad) {
  let contenedor = document.getElementById("formulario-sistemas");
  contenedor.innerHTML = "";
  let letras = ["x", "y", "z"];

  for (let i = 0; i < cantidad; i++) {
    let fila = document.createElement("div");
    fila.className = "ecuacion";

    for (let j = 0; j < cantidad; j++) {
      fila.appendChild(crearCasilla());

      let etiqueta = document.createElement("span");
      etiqueta.className = "etiqueta";
      if (j < cantidad - 1) {
        etiqueta.textContent = letras[j] + " +";
      } else {
        etiqueta.textContent = letras[j] + " =";
      }
      fila.appendChild(etiqueta);
    }

    fila.appendChild(crearCasilla()); // término independiente
    contenedor.appendChild(fila);
  }
}

// Convierte el texto de una casilla en número. Devuelve null si no es válido.
function textoANumero(texto) {
  texto = texto.trim().replace(",", "."); // la coma se trata como punto
  if (texto === "") {
    return null;
  }
  let numero = Number(texto);
  if (!isFinite(numero)) { // también atrapa NaN (texto que no es número)
    return null;
  }
  return numero;
}

// Lee las casillas de un contenedor (en orden, fila por fila).
// Devuelve un objeto: { matriz: [[...]], hayError: true/false }
// Las casillas vacías o inválidas se marcan en rojo.
function leerCasillas(idContenedor, filas, columnas) {
  let casillas = document.getElementById(idContenedor).querySelectorAll("input");
  let matriz = [];
  let hayError = false;

  for (let i = 0; i < filas; i++) {
    let fila = [];
    for (let j = 0; j < columnas; j++) {
      let casilla = casillas[i * columnas + j];
      let numero = textoANumero(casilla.value);
      if (numero === null) {
        casilla.classList.add("error");
        hayError = true;
        fila.push(0);
      } else {
        casilla.classList.remove("error");
        fila.push(numero);
      }
    }
    matriz.push(fila);
  }

  return { matriz: matriz, hayError: hayError };
}

// Deja vacías todas las casillas de un contenedor
function vaciarCasillas(idContenedor) {
  let casillas = document.getElementById(idContenedor).querySelectorAll("input");
  for (let i = 0; i < casillas.length; i++) {
    casillas[i].value = "";
    casillas[i].classList.remove("error");
  }
}


// ============================================================
// GRUPO 3: CONSOLA Y RESULTADO (dibujar en pantalla)
// ============================================================

// Agrega una línea al final de la consola
function escribirConsola(texto) {
  let consola = document.getElementById("consola");
  consola.textContent = consola.textContent + texto + "\n";
}

// Borra todo el texto de la consola
function limpiarConsola() {
  let consola = document.getElementById("consola");
  consola.textContent = "";
  consola.scrollTop = 0;
}

// Escribe en la consola el título de una matriz y la matriz con filas alineadas
function escribirMatrizEnConsola(titulo, matriz) {
  escribirConsola(titulo + " (" + matriz.length + "×" + matriz[0].length + "):");
  escribirConsola(matrizATexto(matriz));
}

// Escribe en la consola los pasos que devolvió el módulo (una línea por elemento)
function mostrarPasos(pasos) {
  escribirConsola("--- Procedimiento ---");
  if (pasos === null || pasos === undefined) {
    return;
  }
  for (let i = 0; i < pasos.length; i++) {
    escribirConsola(pasos[i]);
  }
}

// Borra la zona de resultado de una operación
function limpiarResultado(idResultado) {
  document.getElementById(idResultado).innerHTML = "";
}

// Muestra un texto en la zona de resultado.
// La clase decide el estilo: "mensaje-error" (rojo), "mensaje-aviso" (ámbar), "numero-grande" (verde)
function mostrarMensaje(idResultado, texto, clase) {
  let zona = document.getElementById(idResultado);
  zona.innerHTML = "";
  let linea = document.createElement("div");
  linea.className = clase;
  linea.textContent = texto;
  zona.appendChild(linea);
}

// Dibuja una matriz de resultado (solo lectura) con corchetes, y una etiqueta a la izquierda
function mostrarMatriz(idResultado, matriz, etiqueta) {
  let zona = document.getElementById(idResultado);
  zona.innerHTML = "";

  let linea = document.createElement("div");
  linea.className = "resultado-matriz";

  let texto = document.createElement("span");
  texto.className = "etiqueta-resultado";
  texto.textContent = etiqueta + " =";

  let marco = document.createElement("div");
  marco.className = "matriz";

  let rejilla = document.createElement("div");
  rejilla.className = "rejilla";
  rejilla.style.gridTemplateColumns = "repeat(" + matriz[0].length + ", auto)";

  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
      let celda = document.createElement("div");
      celda.className = "celda";
      celda.textContent = formatear(matriz[i][j]);
      rejilla.appendChild(celda);
    }
  }

  marco.appendChild(rejilla);
  linea.appendChild(texto);
  linea.appendChild(marco);
  zona.appendChild(linea);
}

// Dibuja la solución de un sistema: { estado, valores }
function mostrarSolucion(idResultado, solucion) {
  if (solucion.estado === "unica") {
    let zona = document.getElementById(idResultado);
    zona.innerHTML = "";
    let letras = ["x", "y", "z"];
    for (let i = 0; i < solucion.valores.length; i++) {
      let linea = document.createElement("div");
      linea.className = "valor";
      linea.textContent = letras[i] + " = " + formatear(solucion.valores[i]);
      zona.appendChild(linea);
    }
  } else if (solucion.estado === "infinitas") {
    mostrarMensaje(idResultado, "El sistema tiene infinitas soluciones", "mensaje-aviso");
  } else {
    // estado "inconsistente"
    mostrarMensaje(idResultado, "El sistema no tiene solución", "mensaje-aviso");
  }
}


// ============================================================
// GRUPO 4: CAMBIOS EN LA PANTALLA (menú, tamaños, métodos, limpiar)
// ============================================================

// Muestra la sección de la operación elegida, oculta las demás y marca el botón del menú
function mostrarSeccion(nombre) {
  for (let i = 0; i < OPERACIONES.length; i++) {
    let seccion = document.getElementById("op-" + OPERACIONES[i]);
    let boton = document.getElementById("menu-" + OPERACIONES[i]);
    if (OPERACIONES[i] === nombre) {
      seccion.classList.remove("oculta");
      boton.classList.add("activo");
    } else {
      seccion.classList.add("oculta");
      boton.classList.remove("activo");
    }
  }
  reiniciarSeccion(nombre);
}

// Deja una sección en su estado inicial (selectores por defecto, casillas nuevas,
// resultado y consola limpios)
function reiniciarSeccion(nombre) {
  if (nombre === "transpuesta") {
    document.getElementById("tamano-transpuesta").value = "2";
    cambiarTamanoTranspuesta();
  } else if (nombre === "determinante") {
    document.getElementById("tamano-determinante").value = "2";
    document.getElementById("metodo-determinante").value = "sarrus";
    cambiarTamanoDeterminante();
  } else if (nombre === "inversa") {
    document.getElementById("tamano-inversa").value = "2";
    document.getElementById("metodo-inversa").value = "gauss-jordan";
    cambiarTamanoInversa();
  } else if (nombre === "multiplicacion") {
    document.getElementById("filas-a-multiplicacion").value = "2";
    document.getElementById("columnas-a-multiplicacion").value = "2";
    document.getElementById("filas-b-multiplicacion").value = "2";
    document.getElementById("columnas-b-multiplicacion").value = "2";
    cambiarDimensionesA();
    cambiarDimensionesB();
  } else if (nombre === "sistemas") {
    document.getElementById("cantidad-sistemas").value = "2";
    cambiarCantidadSistemas();
  }
}

// Cambió el tamaño en Transpuesta: nuevas casillas, resultado y consola limpios
function cambiarTamanoTranspuesta() {
  let n = Number(document.getElementById("tamano-transpuesta").value);
  crearCuadricula("cuadricula-transpuesta", n, n);
  limpiarResultado("resultado-transpuesta");
  limpiarConsola();
}

// Cambió el tamaño en Determinante
function cambiarTamanoDeterminante() {
  let n = Number(document.getElementById("tamano-determinante").value);
  crearCuadricula("cuadricula-determinante", n, n);
  limpiarResultado("resultado-determinante");
  limpiarConsola();
}

// Cambió el tamaño en Inversa
function cambiarTamanoInversa() {
  let n = Number(document.getElementById("tamano-inversa").value);
  crearCuadricula("cuadricula-inversa", n, n);
  limpiarResultado("resultado-inversa");
  limpiarConsola();
}

// Cambiaron las filas o columnas de A en Multiplicación (solo se rehace la cuadrícula A)
function cambiarDimensionesA() {
  let filas = Number(document.getElementById("filas-a-multiplicacion").value);
  let columnas = Number(document.getElementById("columnas-a-multiplicacion").value);
  crearCuadricula("cuadricula-a-multiplicacion", filas, columnas);
  limpiarResultado("resultado-multiplicacion");
  limpiarConsola();
}

// Cambiaron las filas o columnas de B en Multiplicación (solo se rehace la cuadrícula B)
function cambiarDimensionesB() {
  let filas = Number(document.getElementById("filas-b-multiplicacion").value);
  let columnas = Number(document.getElementById("columnas-b-multiplicacion").value);
  crearCuadricula("cuadricula-b-multiplicacion", filas, columnas);
  limpiarResultado("resultado-multiplicacion");
  limpiarConsola();
}

// Llena el selector de método de Sistemas según la cantidad de ecuaciones
function llenarMetodosSistemas(cantidad) {
  let select = document.getElementById("metodo-sistemas");
  select.innerHTML = "";

  let valores;
  let textos;
  if (cantidad === 2) {
    valores = ["eliminacion", "igualacion", "sustitucion"];
    textos = ["Eliminación", "Igualación", "Sustitución"];
  } else {
    valores = ["cramer", "gaussiano", "gauss-jordan"];
    textos = ["Cramer", "Gaussiano", "Gauss-Jordan"];
  }

  for (let i = 0; i < valores.length; i++) {
    let opcion = document.createElement("option");
    opcion.value = valores[i];
    opcion.textContent = textos[i];
    select.appendChild(opcion);
  }
}

// Cambió la cantidad de ecuaciones: nuevos métodos, nuevo formulario, resultado y consola limpios
function cambiarCantidadSistemas() {
  let cantidad = Number(document.getElementById("cantidad-sistemas").value);
  llenarMetodosSistemas(cantidad);
  crearFormularioSistema(cantidad);
  limpiarResultado("resultado-sistemas");
  limpiarConsola();
}

// Cambió el método (en cualquier operación): se limpian solo el resultado y la consola
function cambiarMetodo(idResultado) {
  limpiarResultado(idResultado);
  limpiarConsola();
}

// Botón "Limpiar": vacía las casillas, el resultado y la consola (la configuración se mantiene)
function limpiarOperacion(nombre) {
  if (nombre === "multiplicacion") {
    vaciarCasillas("cuadricula-a-multiplicacion");
    vaciarCasillas("cuadricula-b-multiplicacion");
  } else if (nombre === "sistemas") {
    vaciarCasillas("formulario-sistemas");
  } else {
    vaciarCasillas("cuadricula-" + nombre);
  }
  limpiarResultado("resultado-" + nombre);
  limpiarConsola();
}


// ============================================================
// GRUPO 5: UNA FUNCIÓN "calcular" POR OPERACIÓN
// Todas siguen los mismos 5 pasos:
//   1. leer y validar casillas   2. armar argumentos (copias)
//   3. escribir encabezado en consola   4. llamar al módulo
//   5. escribir pasos y dibujar resultado
// ============================================================

// TRANSPUESTA -> ModuloA.transpuesta(matriz)
function calcularTranspuesta() {
  let idResultado = "resultado-transpuesta";
  let n = Number(document.getElementById("tamano-transpuesta").value);
  limpiarResultado(idResultado);
  limpiarConsola();

  // 1. Leer y validar
  let lectura = leerCasillas("cuadricula-transpuesta", n, n);
  if (lectura.hayError) {
    mostrarMensaje(idResultado, MENSAJE_VACIAS, "mensaje-error");
    return;
  }

  // 2. Argumentos
  let matriz = copiarMatriz(lectura.matriz);

  // 3. Encabezado en la consola
  escribirConsola("OPERACIÓN: Transpuesta");
  escribirMatrizEnConsola("Matriz A", matriz);
  escribirConsola("");

  // 4. Llamar al módulo
  let respuesta = ModuloA.transpuesta(copiarMatriz(matriz));

  // 5. Pasos y resultado
  mostrarPasos(respuesta.pasos);
  if (respuesta.ok) {
    mostrarMatriz(idResultado, respuesta.resultado, "Aᵀ");
  } else {
    mostrarMensaje(idResultado, respuesta.error, "mensaje-error");
  }
}

// DETERMINANTE -> ModuloB.determinante(matriz, metodo)
function calcularDeterminante() {
  let idResultado = "resultado-determinante";
  let n = Number(document.getElementById("tamano-determinante").value);
  let metodo = document.getElementById("metodo-determinante").value;
  limpiarResultado(idResultado);
  limpiarConsola();

  let lectura = leerCasillas("cuadricula-determinante", n, n);
  if (lectura.hayError) {
    mostrarMensaje(idResultado, MENSAJE_VACIAS, "mensaje-error");
    return;
  }

  let matriz = copiarMatriz(lectura.matriz);

  escribirConsola("OPERACIÓN: Determinante");
  escribirConsola("MÉTODO: " + textoSeleccionado("metodo-determinante"));
  escribirMatrizEnConsola("Matriz A", matriz);
  escribirConsola("");

  let respuesta = ModuloB.determinante(copiarMatriz(matriz), metodo);

  mostrarPasos(respuesta.pasos);
  if (respuesta.ok) {
    mostrarMensaje(idResultado, "det(A) = " + formatear(respuesta.resultado), "numero-grande");
  } else {
    mostrarMensaje(idResultado, respuesta.error, "mensaje-error");
  }
}

// INVERSA -> ModuloB.inversa(matriz, metodo)
function calcularInversa() {
  let idResultado = "resultado-inversa";
  let n = Number(document.getElementById("tamano-inversa").value);
  let metodo = document.getElementById("metodo-inversa").value;
  limpiarResultado(idResultado);
  limpiarConsola();

  let lectura = leerCasillas("cuadricula-inversa", n, n);
  if (lectura.hayError) {
    mostrarMensaje(idResultado, MENSAJE_VACIAS, "mensaje-error");
    return;
  }

  let matriz = copiarMatriz(lectura.matriz);

  escribirConsola("OPERACIÓN: Inversa");
  escribirConsola("MÉTODO: " + textoSeleccionado("metodo-inversa"));
  escribirMatrizEnConsola("Matriz A", matriz);
  escribirConsola("");

  let respuesta = ModuloB.inversa(copiarMatriz(matriz), metodo);

  mostrarPasos(respuesta.pasos);
  if (respuesta.ok) {
    mostrarMatriz(idResultado, respuesta.resultado, "A⁻¹");
  } else {
    mostrarMensaje(idResultado, respuesta.error, "mensaje-error");
  }
}

// MULTIPLICACIÓN -> ModuloA.multiplicar(A, B)
// La interfaz NO revisa si las dimensiones son compatibles: eso lo hace el módulo.
function calcularMultiplicacion() {
  let idResultado = "resultado-multiplicacion";
  let filasA = Number(document.getElementById("filas-a-multiplicacion").value);
  let columnasA = Number(document.getElementById("columnas-a-multiplicacion").value);
  let filasB = Number(document.getElementById("filas-b-multiplicacion").value);
  let columnasB = Number(document.getElementById("columnas-b-multiplicacion").value);
  limpiarResultado(idResultado);
  limpiarConsola();

  // Se leen las dos cuadrículas antes de revisar, para que se marquen las dos
  let lecturaA = leerCasillas("cuadricula-a-multiplicacion", filasA, columnasA);
  let lecturaB = leerCasillas("cuadricula-b-multiplicacion", filasB, columnasB);
  if (lecturaA.hayError || lecturaB.hayError) {
    mostrarMensaje(idResultado, MENSAJE_VACIAS, "mensaje-error");
    return;
  }

  let A = copiarMatriz(lecturaA.matriz);
  let B = copiarMatriz(lecturaB.matriz);

  escribirConsola("OPERACIÓN: Multiplicación (A × B)");
  escribirMatrizEnConsola("Matriz A", A);
  escribirConsola("");
  escribirMatrizEnConsola("Matriz B", B);
  escribirConsola("");

  let respuesta = ModuloA.multiplicar(copiarMatriz(A), copiarMatriz(B));

  mostrarPasos(respuesta.pasos);
  if (respuesta.ok) {
    mostrarMatriz(idResultado, respuesta.resultado, "A × B");
  } else {
    mostrarMensaje(idResultado, respuesta.error, "mensaje-error");
  }
}

// SISTEMAS -> ModuloA.resolverSistema2(...) con 2 ecuaciones, ModuloC.resolverSistema3(...) con 3
// A los módulos se les pasa la matriz aumentada (última columna = términos independientes).
function calcularSistemas() {
  let idResultado = "resultado-sistemas";
  let cantidad = Number(document.getElementById("cantidad-sistemas").value);
  let metodo = document.getElementById("metodo-sistemas").value;
  limpiarResultado(idResultado);
  limpiarConsola();

  // La matriz aumentada tiene "cantidad" filas y "cantidad + 1" columnas
  let lectura = leerCasillas("formulario-sistemas", cantidad, cantidad + 1);
  if (lectura.hayError) {
    mostrarMensaje(idResultado, MENSAJE_VACIAS, "mensaje-error");
    return;
  }

  let matriz = copiarMatriz(lectura.matriz);

  escribirConsola("OPERACIÓN: Sistema de " + cantidad + " ecuaciones");
  escribirConsola("MÉTODO: " + textoSeleccionado("metodo-sistemas"));
  escribirConsola("Ecuaciones:");
  for (let i = 0; i < matriz.length; i++) {
    escribirConsola(ecuacionATexto(matriz[i]));
  }
  escribirConsola("");
  escribirMatrizEnConsola("Matriz aumentada", matriz);
  escribirConsola("");

  let respuesta;
  if (cantidad === 2) {
    respuesta = ModuloA.resolverSistema2(copiarMatriz(matriz), metodo);
  } else {
    respuesta = ModuloC.resolverSistema3(copiarMatriz(matriz), metodo);
  }

  mostrarPasos(respuesta.pasos);
  if (respuesta.ok) {
    mostrarSolucion(idResultado, respuesta.resultado);
  } else {
    mostrarMensaje(idResultado, respuesta.error, "mensaje-error");
  }
}


// ============================================================
// INICIO: se ejecuta al abrir la página
// ============================================================
function abrirCaratula() {
  document.getElementById("modal-caratula").showModal();
}

function iniciar() {
  mostrarSeccion("transpuesta"); // Transpuesta 2×2 lista
  escribirConsola("Elige una operación, llena las casillas y pulsa Calcular.");
  escribirConsola("Aquí aparecerá el procedimiento paso a paso.");
  abrirCaratula();
}

iniciar();
