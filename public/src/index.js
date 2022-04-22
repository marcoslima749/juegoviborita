//BUSCA! //CONTINUAR

/*
FUNCIONALIDADES ADICIONALES ESPERADAS:
-TIENE QUE TENER UNA PANTALLA PRINCIPAL PARA CLICKEAR EN "EMPEZAR"
-A MEDIDA QUE TRANSCURRA EL JUEGO TIENE QUE IR SUMANDO PUNTOS A UN TOTAL DE SCORE EN LA PANTALLA
-CUANDO TERMINA TIENE QUE MOSTRAR EL SCORE EN EL CENTRO, SI ES EL MEJOR DE LOS SCORE GUARDADOS EN LOCAL
STORAGE ME TIENE QUE PEDIR QUE INGRESE LAS 3 INICIALES
-LUEGO DE ESO ME TIENE QUE MOSTRAR UN PROMPT PARA VOLVER A EMPEZAR O NO
SI APRETO NO - VA A LA PANTALLA PRINCIPAL
-A MEDIDA QUE LE SERPIENTE VA COMIENDO LA COMIDA TIENE QUE IR CRECIENDO CADA VEZ MÁS (+2,+3)
Y EL LOOP TAMBIÉN TIENE QUE SER CADA VEZ MÁS RÁPIDO (INTERVALO--)
-TIENE QUE TENER CONTROLES VISIBLES (BOTONCITOS) PARA PODER JUGAR DESDE EL CELU
-BUENO, TIENE QUE SER RESPONSIVE
-EL CANVAS TENDRÍA QUE TOMAR EL TAMAÑO DE LA PANTALLA DEL USUARIO (CELU O DESKTOP)

-YO QUIERO QUE TENGA UNA ANIMACIÓN DE PÉRDIDA COMO QUE SE VA HACIENDO CHICA DESDE LA COLA Y CUANDO
LLEGA A LA CABEZA TINTINEA Y SE ROMPE? UH FLASH QUE EXPLOTE EN PEDAZOS
*/

/*
CANCIONES POR SI PINTA PONER SONIDO:
(averiguar el tema de los derechos de autor)

fuente: spotify
-----------------------
nombre: Symbolus
artista: Zef
--


-----------------------



*/

//constante de las dimensiones del canvas (ojo porque también están definidas en el html)
//ya fue las aplico desde acá y listo
const ANCHO_ALTO_VIBORITA = 10; //tamaño de la cabeza de la viborita ojo ahí podés hacer flashereadas, cambiando esto.
const DIMENSION_CANVAS = 200; //TIENE QUE SER UN MÚLTIPLO DEL TAMAÑO DE LA VIBORITA SI NO VAS A TENER QUILOMBO

const INTERVALO_MAX = 90; //El intervalo por default y también el valor más algo (velocidad más lenta)
let intervalo = 90; //El intervalo en que se llama a la función
const INTERVALO_DISMINUCION = 10; //El valor que se le resta a intervalo en cada estomagoLleno
const INTERVALO_MIN = 10; //Intervalo mínimo, pasando este límite aumenta el nivel y se restura el intervalo al valor inicial

//el nivel puede aumentar cuando la velocidad llega a cierto punto (el intervalo llega a menos de tanto)
//cuando aumenta el nivel la velocidad baja al valor inicial y el crecimiento se tiene que acelerar (+2, +3)
//OJO el crecimiento puede ser el mismo nivel! +1 en el nivel 1, +2 en el nivel 2, etc

//Un contador para saber cuántas comidas comió la serpiente
let porciones = 0;

//y cada cierto número de comidas (porciones = estomagoLleno) aumentar la velocidad (disminuir intervalo)
let estomagoLleno = 5;

//Valores que salen en la UI---------------------------------------------------------

//El valor de nivel es también el que se suma en el crecimiento,
//así a medida que sube el nivel crece más rápido
let nivel = 1;
//puntaje total
let puntaje = 0;

//Los puntos que aumenta el puntaje cada vez que la serpiente come una comida
let puntosPorComida = 10;
//Los puntos por avanzar de nivel
let puntosPorNivel = 100;
//Los puntos deberían ser más grandes a medida que se sube de nivel porque no es lo mismo
//comer en el nivel uno que comer en el nivel 100 ---AUNQUE ESTO PODRÍA HACER PENSAR QUE ALGUIEN QUE HIZO MIL PUNTOS MÁS QUE OTRO LE RE GANÓ Y CAPAZ SÓLO COMIÓ UNA SOLA COMIDA MÁS. MEJOR LO DEJAMOS CONSTANTE

//Valores que salen en la UI---------------------------------------------------------

const ELEMENTOS = {
  VIBORITA: {
    color: "green",
  },
  COMIDA: {
    color: "white",
  },
};

//Refs canvas y contexto
let papel = document.querySelector("canvas");

//Aplicando el tamaño al canvas
papel.width = DIMENSION_CANVAS;
papel.height = DIMENSION_CANVAS;

let ctx = papel.getContext("2d");

/*
esta constante tiene como propiedad el "code" de la key presionada,
así usando el e.code podemos mandar la variación de coordenadas [x,y]
que corresponda, sumando o restando
 */
const DIRECCION = {
  ArrowUp: [0, -1],
  KeyW: [0, -1],
  ArrowDown: [0, 1],
  KeyS: [0, 1],
  ArrowLeft: [-1, 0],
  KeyA: [-1, 0],
  ArrowRight: [1, 0],
  KeyD: [1, 0],
};

//Un multiplicador para el desplazamiento
//El desplazamiento mínimo tiene que ser el tamaño de la viborita y la comida
//porque si no no la embocás nunca más
//EL DESPLAZAMIENTO TIENE QUE SER SIEMPRE UN MÚLTIPLO DEL TAMAÑO DE LA VIBORITA
let DESPLAZAMIENTO = ANCHO_ALTO_VIBORITA;

//Una función para randomizar la posición y dirección oficiales ---'oficiales' le mandó

let cualquierLado = (diresNoPermitidas = [], posNoPermitdas = []) => {
  //console.log(arrNoPermitidos)
  let todasLasDires = Object.keys(DIRECCION); //Un array con los valores del objeto DIRECCION para poder sacar uno random por el índice
  let diresPermitidas;
  if (diresNoPermitidas.length) {
    //Si se le pasa un array con algún elemento no permitido lo filtra
    diresPermitidas = todasLasDires.filter(
      (dire) => !diresNoPermitidas.includes(dire)
    ); //Filtra arrDires por los valores que no estén incluidos en la lista de nopermitidos
  } else {
    diresPermitidas = todasLasDires;
  }

  let direRandom =
    diresPermitidas[parseInt(Math.random() * (diresPermitidas.length - 1))]; //Es el último índice

  //Calculando una posición para la comida que no puede ser sobre la viborita
  //Se calcula la cantidad de posiciones posibles para utilizar al reposicionar la comida
  //Como el canvas puede tener
  const TOTAL_POSICIONES = Math.pow(DIMENSION_CANVAS / ANCHO_ALTO_VIBORITA, 2);

  if (posNoPermitdas.length) {
    //Hay lugar?
    if (posNoPermitdas.length === TOTAL_POSICIONES) {
      subirNivel();
    } else {
      //Hay que ver las posiciones posibles, es decir todas las que no esté el bicho
      let posPermitidas = [];
      for (let x = 0; x < DIMENSION_CANVAS; x += ANCHO_ALTO_VIBORITA) {
        //PARAPAPRARPARPAPRPARPAPRA DESPUÉS LO VEMOS
        //CONTINUAR
      }
    }
  }

  return {
    posicion: {
      x:
        parseInt(Math.random() * (DIMENSION_CANVAS / ANCHO_ALTO_VIBORITA)) *
        DESPLAZAMIENTO,
      y:
        parseInt(Math.random() * (DIMENSION_CANVAS / ANCHO_ALTO_VIBORITA)) *
        DESPLAZAMIENTO,
    },
    direccion: {
      x: DIRECCION[direRandom][0],
      y: DIRECCION[direRandom][1],
    },
  };
};

const valorInicial = () => {
  let bicho = cualquierLado().posicion;
  let comida = cualquierLado().posicion;

  if (bicho.x !== comida.x || bicho.y !== comida.y) {
    //calculando las prohibiciones de dirección según la posición del bicho
    let prohibiciones = [];
    //Esto se va a usar para calcular el mínimo a partir de un porcentaje
    let porcentajeMin = 40; //***USAR ESTE SOLO PARA MODIFICAR AMBOS BORDES
    let porcentajeMax = 100 - porcentajeMin;

    let valorMin = (DIMENSION_CANVAS * porcentajeMin) / 100; //calculando el valor mínimo
    let valorMax = (DIMENSION_CANVAS * porcentajeMax) / 100; //calculando el valor máximo

    //Prohibiciones en x
    //Si el valor es igual o inferior al mínimo, el bicho está en el borde izquierdo
    //Entonces no puede ir hacia la izquierda
    if (bicho.x <= valorMin) {
      prohibiciones.push("ArrowLeft", "KeyA");
    }
    //Si el valor es igual o superior al máximo, el bicho está en el borde derecho
    //Entonces no puede ir hacia la derecha
    if (bicho.x >= valorMax) {
      prohibiciones.push("ArrowRight", "KeyD");
    }
    //Prohibiciones en y
    //Si el valor es igual o inferior al mínimo, el bicho está en el borde superior
    //Entonces no puede ir hacia arriba
    if (bicho.y <= valorMin) {
      prohibiciones.push("ArrowUp", "KeyW");
    }
    //Si el valor es igual o superior al máximo, el bicho está en el borde inferior
    //Entonces no puede ir hacia abajo
    if (bicho.y >= valorMax) {
      prohibiciones.push("ArrowDown", "KeyS");
    }

    //Calculando la dirección viable según las prohibiciones generadas
    let direccion = cualquierLado(prohibiciones).direccion;

    return {
      direccion: {
        x: direccion.x,
        y: direccion.y,
      },
      bicho: [{ x: bicho.x, y: bicho.y }],
      comida: comida,
      jugando: true,
      crecimiento: 0,
    };
  } else {
    console.log("se repitieron los valores¿?");
    return valorInicial();
  }
};

//El state de la dirección y la posición inicial del bicho
//Solo para tener presente la estructura pero nunca pasa
let controles = {
  direccion: {
    x: 1,
    y: 0,
  },
  bicho: [{ x: 0, y: 0 }],
  comida: { x: 0, y: 250 },
  jugando: true,
  crecimiento: 0,
};

let dibujarElemento = (elemento, x, y) => {
  //Creando el elemento (viborita o comida)
  //Se indica el color según el objeto que se vaya a crear (verde es la viborita y amarillo es la comida)
  ctx.fillStyle = elemento.color;
  //Se crea un rectángulo (x,y,width,height) correspondiente a la cabeza
  ctx.fillRect(x, y, ANCHO_ALTO_VIBORITA, ANCHO_ALTO_VIBORITA);
};

let dibujar = () => {
  //borrar el canvas con clearRect (o sea se borra todo en ese rectangulo)
  ctx.clearRect(0, 0, 500, 500);

  //Loop para dibujar todos los nodos
  for (let i = 0; i < controles.bicho.length; i++) {
    const nodo = controles.bicho[i];
    dibujarElemento(ELEMENTOS.VIBORITA, nodo.x, nodo.y);
  }
  const comida = controles.comida;
  dibujarElemento(ELEMENTOS.COMIDA, comida.x, comida.y);
};

let otraComida = () => {
  let otroLado = cualquierLado().posicion;
  controles.comida.x = otroLado.x;
  controles.comida.y = otroLado.y;
};

let choco = () => {
  const head = controles.bicho[0];

  //Chequea si algun nodo aparte del head tiene la misma posición del head y devuelve true si encuentra uno
  let seMordioLaCola = controles.bicho.some(
    (nodo, index) => index > 0 && nodo.x === head.x && nodo.y === head.y
  );

  //Si x < 0 se fue para la izquiera de la pantalla
  //Si x >= DIM entonces ya se fue porque su costado izquirdo empieza donde termina el canvas
  let seFueDelCanvas =
    head.x < 0 ||
    head.x >= DIMENSION_CANVAS ||
    head.y < 0 ||
    head.y >= DIMENSION_CANVAS;

  return seMordioLaCola || seFueDelCanvas;
};

let subirNivel = () => {
  nivel++;
  puntaje += puntosPorNivel;
  controles.bicho.length = 1;
  intervalo = INTERVALO_MAX;
};

let subirVelocidad = () => {
  intervalo -= INTERVALO_DISMINUCION;
  porciones = 0;
  if (intervalo === INTERVALO_MIN) {
    subirNivel();
  }
};

//Seteando el loop

let loop = () => {
  let dx = controles.direccion.x * DESPLAZAMIENTO; //la dirección en x multiplicada por el desplazamiento
  let dy = controles.direccion.y * DESPLAZAMIENTO; //la dirección en y

  /* LOOP */
  //defino la cola del bicho (el útlimo objeto en el array)
  let cola = {};
  //Se define el último índice del array bicho para utilizarlo
  let ultimoIndiceBicho = controles.bicho.length - 1;
  //Copia superficialmente los valores del último objeto en el array bicho a la variable cola
  //Para poder asignar un nodo con la misma posición de la cola en la función crecimiento
  Object.assign(cola, controles.bicho[ultimoIndiceBicho]);
  //Un loop al revés para acomodar primero las posiciones de la cola hasta la cabeza (para no perderlas)
  //y luego la de la cabeza

  //Primero chequea se está jugando(?)

  if (controles.jugando) {
    for (let i = ultimoIndiceBicho; i > -1; i--) {
      let nodo = controles.bicho[i]; //el nodo original con su posición

      if (i === 0) {
        //a la posición actual (nodo o controles.bicho[0]) se le suma la dirección a cada loop
        //(o sea aumenta la posición en x y se mueve a la derecha, aumenta en y y se mueve hacia abajo)
        nodo.x += dx;
        nodo.y += dy;
      } else {
        //Se va copiando de atrás para adelante la posición del nodo anterior
        //Para
        nodo.x = controles.bicho[i - 1].x;
        nodo.y = controles.bicho[i - 1].y;
      }
    }
  }

  /* LOOP */

  //Chequeamos si la viborita se comió la comida (en el primer loop siempre va a dar falso porque siempre aparecen en distintos lugares)
  let comida = controles.comida;
  let head = controles.bicho[0]; //Referenciamos la cabeza
  let niamniam = head.x === comida.x && head.y === comida.y;

  //Ni idea de por qué está en esta posición y no antes de empezar
  //Chequea si chocó y cambia el estado de jugando
  if (choco()) {
    controles.jugando = false;
    perdiste();
  }

  if (niamniam) {
    controles.crecimiento += 1; //Suma uno al crecimiento para luego hacer crecer la viborita

    otraComida();
  }
  //Chequea el crecimiento para alargar la viborita
  if (controles.crecimiento > 0) {
    controles.bicho.push(cola); //la cola queda duplicada y se acomoda en el loop
    controles.crecimiento -= 1;
  }

  //llamo a una nueva animación con dibujar
  requestAnimationFrame(dibujar);

  //Al terminar se llama a sí misma luego de INTERVALO,
  //creando así un loop infinito que hace correr el juego.
  //Una razón por la que se esté poniendo muchos setTimeOut y no un solo setInterval es
  //porque de esa manera se puede modificar INTERVALO para aumentar la dificultad (?)
  //También podría aumentar la dificultad modificando el DESPLAZAMIENTO?...
  setTimeout(loop, intervalo);
};

//Capturando el teclado

document.onkeydown = (e) => {
  //console.log(e.code);
  //console.log(e.key);

  //no entra si la tecla no es de dirección
  const existe = !!DIRECCION[e.code]; //bang bang! estás liquidado

  if (existe) {
    //no entra si la dirección es la contraria a la actual (la viborita no puede volver sobre sí misma)
    const [x, y] = DIRECCION[e.code];
    //Es verdad que x (la dirección presionada)
    //es distinto que el inverso de la dirección x actual ("""-"""controles.direccion.x)
    //o sea, no vuelve.
    const noVuelveEnX = x !== -controles.direccion.x;
    const noVuelveEnY = y !== -controles.direccion.y;
    if (noVuelveEnX && noVuelveEnY) {
      //Cambia la dirección según la tecla presionada
      controles.direccion.x = x;
      controles.direccion.y = y;
    }
  }
};

const iniciar = () => {
  controles = valorInicial();
};

const perdiste = () => {
  //Animar como que pierde
  //popup para ver si quiere jugar de vuelta? si quiere iniciar(), si no pantallita principal :P
  iniciar();
};

window.onload = () => {
  iniciar();
  loop();
};
