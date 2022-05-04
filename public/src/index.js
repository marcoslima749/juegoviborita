

/*
FUNCIONALIDADES ADICIONALES ESPERADAS:
LISTO -TIENE QUE TENER UNA PANTALLA PRINCIPAL PARA CLICKEAR EN "EMPEZAR"
LISTO -A MEDIDA QUE TRANSCURRA EL JUEGO TIENE QUE IR SUMANDO PUNTOS A UN TOTAL DE SCORE EN LA PANTALLA
LISTO -CUANDO TERMINA TIENE QUE MOSTRAR EL SCORE EN EL CENTRO, SI ES EL MEJOR DE LOS SCORE GUARDADOS EN LOCAL
  STORAGE ME TIENE QUE PEDIR QUE INGRESE LAS 3 INICIALES
LISTO -LUEGO DE ESO ME TIENE QUE MOSTRAR UN PROMPT PARA VOLVER A EMPEZAR O NO
  SI APRETO NO - VA A LA PANTALLA PRINCIPAL
LISTO -A MEDIDA QUE LE SERPIENTE VA COMIENDO LA COMIDA TIENE QUE IR CRECIENDO CADA VEZ MÁS (+2,+3)
  Y EL LOOP TAMBIÉN TIENE QUE SER CADA VEZ MÁS RÁPIDO (INTERVALO--)
LISTO -TIENE QUE TENER CONTROLES VISIBLES (BOTONCITOS) PARA PODER JUGAR DESDE EL CELU
-TIENE QUE CAPTURAR EL SWIPE
LISTO PONELEEEEEE -BUENO, TIENE QUE SER RESPONSIVE
LISTO -EL CANVAS TENDRÍA QUE TOMAR EL TAMAÑO DE LA PANTALLA DEL USUARIO (CELU O DESKTOP)

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

ROXANA: LAS PAREDES PUEDEN SER UN BLOQUE ABIERTO Y OTRO CERRADO,
SI PASA POR EL BLOQUE ABIERTO APARECE POR EL OTRO LADO
SI TOCA EL CERRADO MUERE
OTRA PUEDE SER QUE SEA LA MITAD DE LA PARED (O UNA PARTE) ABIERTA Y LA OTRA CERRADA
Y QUE VAYAN CAMBIANDO O MOVIENDOSE

CADA 2-3 NIVELES LA FORMA DE LA SERPIENTE PUEDE IR CAMBIANDO (UN GORRITO, UNAS OREJITAS, UNOS ANTIOJITOS)

YO
NIVELES 1 AL 5: SIN PAREDES
NIVELES 6 AL 10: MITAD PAREDES
NIVELES 11 A 15: PAREDES SE MUEVEN
NIVELES 16 A 20: CAEN BOMBAS!
NIVELES 21 A 25: VAN PASANDO OTROS BICHOS JAJAJ QUE FLASH
NIVEL 26: UN JEFE?? UFF
NIVELES 27+: PAREDES RANDOM, SE MUEVEN RANDOM, PASAN BICHOS, BOMBAS 

*/

//constante de las dimensiones del canvas (ojo porque también están definidas en el html)
//ya fue las aplico desde acá y listo
const ANCHO_ALTO_VIBORITA = 10; //tamaño de la cabeza de la viborita ojo ahí podés hacer flashereadas, cambiando esto.
const DIMENSION_CANVAS = 300; //TIENE QUE SER UN MÚLTIPLO DEL TAMAÑO DE LA VIBORITA SI NO VAS A TENER QUILOMBO

const INTERVALO_MAX_DEFAULT = 120; //El intervalo por default y también el valor más algo (velocidad más lenta)
const INTERVALO_DISMINUCION_DEFAULT = 20; //El valor que se le resta a intervalo en cada estomagoLleno
const INTERVALO_MIN_DEFAULT = 60; //Intervalo mínimo, pasando este límite aumenta el nivel y se restura el intervalo al valor inicial

//Estos valores son los de arriba al inicio. Pero a medida que suban los niveles se van a ir modificando
//para que a más nivel:
//la velocidad inicial sea un poco más rápida (intervalo_max va a ser menor)
//la disminución sea un poco menor (intervalo_disminucion va a ser menor)
//el intervalo minimo va a ser un poco menor también (intervalo_min va a ser menor)

let intervalo_max = INTERVALO_MAX_DEFAULT;
let intervalo_disminucion = INTERVALO_DISMINUCION_DEFAULT;
let intervalo_min = INTERVALO_MIN_DEFAULT;
let turbo = false;

let intervalo = intervalo_max; //El intervalo ACTUAL en que se llama a la función

//el nivel puede aumentar cuando la velocidad llega a cierto punto (el intervalo llega a menos de tanto)
//cuando aumenta el nivel la velocidad baja al valor inicial y el crecimiento se tiene que acelerar (+2, +3)
//OJO el crecimiento puede ser el mismo nivel! +1 en el nivel 1, +2 en el nivel 2, etc

//Un contador para saber cuántas comidas comió la serpiente
let porciones = 0;

//y cada cierto número de comidas (porciones = estomagoLleno) aumentar la velocidad (disminuir intervalo)
let estomagoLleno = 3;

//Valores que salen en la UI---------------------------------------------------------

//El valor de nivel es también el que se suma en el crecimiento,
//así a medida que sube el nivel crece más rápido
let nivel = 1;
//puntaje total
let puntaje = 0;

let highScore = [];

if (typeof(Storage) !== 'undefined') {
  // Código cuando Storage es compatible
  if(localStorage.getItem('laBichaHighScore')) {
    highScore = JSON.parse(localStorage.getItem('laBichaHighScore'));
  } else {
    highScore =  [{
      nombre: 'MJL',
      puntaje: 10
    },{
      nombre: 'CAPTAIN TSUBASA',
      puntaje:  27
    },{
      nombre: 'SOLID SNAKE',
      puntaje: 5
    }];
  }
} else {
 // Código cuando Storage NO es compatible
 highScore =  [{
  nombre: 'MJL',
  puntaje: 10
},{
  nombre: 'CAPTAIN TSUBASA',
  puntaje:  27
},{
  nombre: 'SOLID SNAKE',
  puntaje: 5
}];
}





//puntaje al final del juego, se asigna en la funcion perdiste
let ultimoPuntaje;
let ultimoNivel;


//Los puntos que aumenta el puntaje cada vez que la serpiente come una comida
let puntosPorComida = 10;
//Los puntos por avanzar de nivel
let puntosPorNivel = 100;
//Los puntos deberían ser más grandes a medida que se sube de nivel porque no es lo mismo
//comer en el nivel uno que comer en el nivel 100 ---AUNQUE ESTO PODRÍA HACER PENSAR QUE ALGUIEN QUE HIZO MIL PUNTOS MÁS QUE OTRO LE RE GANÓ Y CAPAZ SÓLO COMIÓ UNA SOLA COMIDA MÁS. MEJOR LO DEJAMOS CONSTANTE

//Valores que salen en la UI---------------------------------------------------------

const ELEMENTOS = {
  CABEZA: {
    color: "green"
  },
  VIBORITA: {
    color: "green"
  },
  COMIDA: {
    color: "white"
  },
  PARED: {
    color: "orange",
    img: "./assets/sprites/pared.png"
  }
};

//Refs canvas y contexto
let papel = document.querySelector("canvas");

//Pantallas

let container = document.getElementById('container');

let pantallaInicio = document.getElementById('pantallaInicio');
let pantallaLogin = document.getElementById('pantallaLogin');
let pantallaGameover = document.getElementById('pantallaGameover');
let pantallaHighscore = document.getElementById('pantallaHighscore');
let pantallaNivel = document.getElementById('pantallaNivel');
let pantallaPausa = document.getElementById('pantallaPausa');


//Elementos de la UI
let nivelValor = document.getElementById("nivelValor");
let popupNivelValor = document.getElementById('popupNivelValor');
let puntajeValor = document.getElementById("scoreValor");
let gameoverPuntajeValor = document.getElementById("gameoverPuntajeValor");
let inputGameoverNombre = document.getElementById("inputGameoverNombre");
let vidaValor = document.getElementById('vidaValor');
let tabla = document.getElementById('tabla');



//Botones

let botonArriba = document.getElementById('botonArriba');
let botonIzquierda = document.getElementById('botonIzquierda');
let botonAbajo = document.getElementById('botonAbajo');
let botonDerecha = document.getElementById('botonDerecha');

let botonTurbo = document.getElementById('botonTurbo');

let btnIniciar = document.getElementById('btnIniciar');

let botonGameoverJugar = document.getElementById('botonGameoverJugar');

let botonPausaContinuar = document.getElementById('botonPausaContinuar');


//Aplicando los event listeners

botonArriba.onclick = (e)=> {
  e.preventDefault()
  document.dispatchEvent(new KeyboardEvent('keydown', {
    "code": "ArrowUp"
  }));
};

botonIzquierda.onclick = (e)=> {
  e.preventDefault()
  document.dispatchEvent(new KeyboardEvent('keydown', {
    "code": "ArrowLeft"
  }));
};

botonAbajo.onclick = (e)=> {
  e.preventDefault()
  document.dispatchEvent(new KeyboardEvent('keydown', {
    "code": "ArrowDown"
  }));
};


botonDerecha.onclick = (e)=> {
  e.preventDefault()
  document.dispatchEvent(new KeyboardEvent('keydown', {
    "code": "ArrowRight"
  }));
};

botonTurbo.onclick = (e)=> {
  e.preventDefault()
}

botonTurbo.onmousedown = (e)=> {
  e.preventDefault()
  document.dispatchEvent(new KeyboardEvent('keydown', {
    "code": "Space"
  }));
};

botonTurbo.onmouseup = (e)=> {
  e.preventDefault()
  document.dispatchEvent(new KeyboardEvent('keyup', {
    "code": "Space"
  }));
};

btnIniciar.onclick = (e) => {
  e.preventDefault();

  let posiciones = highScore.map((hs)=> nuevoHighScore(hs.nombre, hs.puntaje)).join('');
  //console.log(posiciones)
  tabla.innerHTML = posiciones;
  
  iniciar();
};

botonPausaContinuar.onclick = (e) => {
  e.preventDefault();
  ocultar(pantallaPausa);
  controles.pausa = false;
  if(controles.animaciones.length) {
    controles.animaciones.forEach((a)=>a.resume());
  }
};

botonGameoverJugar.onclick = (e) => {
  e.preventDefault();
  let nombre = inputGameoverNombre.innerText;
  if(nombre.trim() !== "") {
    highScore.push({nombre: nombre, puntaje: ultimoPuntaje});
    localStorage.setItem('laBichaHighScore', JSON.stringify(highScore));
  }
  //No hace falta poner pausable = false porque al redirigir se reinicia el juego
  window.location.href = '/';
};


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

const OTRAS_TECLAS = {
  Space: 'turbo',
  Escape: 'pausa'
}



//Un multiplicador para el desplazamiento
//El desplazamiento mínimo tiene que ser el tamaño de la viborita y la comida
//porque si no no la embocás nunca más
//EL DESPLAZAMIENTO TIENE QUE SER SIEMPRE UN MÚLTIPLO DEL TAMAÑO DE LA VIBORITA
let DESPLAZAMIENTO = ANCHO_ALTO_VIBORITA;

//Una función para randomizar la posición y dirección oficiales ---'oficiales' le mandó

let cualquierLado = (diresNoPermitidas = [], posNoPermitidas = []) => {
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

  const TOTAL_POSICIONES = Math.pow(DIMENSION_CANVAS / ANCHO_ALTO_VIBORITA, 2);
  let posRandom = {
    x:
      parseInt(Math.random() * (DIMENSION_CANVAS / ANCHO_ALTO_VIBORITA)) *
      DESPLAZAMIENTO,
    y:
      parseInt(Math.random() * (DIMENSION_CANVAS / ANCHO_ALTO_VIBORITA)) *
      DESPLAZAMIENTO,
  };
  //La comida no puede aparecer donde está el bicho ni las paredes
  /* posNoPermitidas.push(...controles.bicho);
  posNoPermitidas.push(...controles.paredes); */
  if (posNoPermitidas.length) {
    //Hay lugar?
    if (posNoPermitidas.length === TOTAL_POSICIONES) {
      //Si no hay lugar (un milagro realmente) sube de nivel (aunque podría bien ganar el juego)
      subirNivel();
    } else {
      //Si hay lugar hay que ver si la posición no se pisa con la cola de la viborita

      let cambiarPosicion = posNoPermitidas.some((estaNo) =>
        equivalen(posRandom, estaNo)
      );
      while (cambiarPosicion) {
        //Mientras se pise se vuelve a escribir posRandom y a comparar
        //TO DO: Esto habría que ver de optimizarlo
        posRandom = {
          x:
            parseInt(Math.random() * (DIMENSION_CANVAS / ANCHO_ALTO_VIBORITA)) *
            DESPLAZAMIENTO,
          y:
            parseInt(Math.random() * (DIMENSION_CANVAS / ANCHO_ALTO_VIBORITA)) *
            DESPLAZAMIENTO,
        };
        cambiarPosicion = posNoPermitidas.some((pnp) =>
          equivalen(pnp, posRandom)
        );
      }
    }
  }

  return {
    posicion: posRandom,
    direccion: {
      x: DIRECCION[direRandom][0],
      y: DIRECCION[direRandom][1],
    },
  };
};

const getDiresNoPermitidas = () => {

  //calculando las prohibiciones de dirección según la posición del bicho
  let head = controles.bicho[0];

  let prohibiciones = [];
    //Esto se va a usar para calcular el mínimo a partir de un porcentaje
    let porcentajeMin = 40; //***USAR ESTE SOLO PARA MODIFICAR AMBOS BORDES
    let porcentajeMax = 100 - porcentajeMin;

    let valorMin = (DIMENSION_CANVAS * porcentajeMin) / 100; //calculando el valor mínimo
    let valorMax = (DIMENSION_CANVAS * porcentajeMax) / 100; //calculando el valor máximo

    //Prohibiciones en x
    //Si el valor es igual o inferior al mínimo, el bicho está en el borde izquierdo
    //Entonces no puede ir hacia la izquierda
    if (head.x <= valorMin) {
      prohibiciones.push("ArrowLeft", "KeyA");
    }
    //Si el valor es igual o superior al máximo, el bicho está en el borde derecho
    //Entonces no puede ir hacia la derecha
    if (head.x >= valorMax) {
      prohibiciones.push("ArrowRight", "KeyD");
    }
    //Prohibiciones en y
    //Si el valor es igual o inferior al mínimo, el bicho está en el borde superior
    //Entonces no puede ir hacia arriba
    if (head.y <= valorMin) {
      prohibiciones.push("ArrowUp", "KeyW");
    }
    //Si el valor es igual o superior al máximo, el bicho está en el borde inferior
    //Entonces no puede ir hacia abajo
    if (head.y >= valorMax) {
      prohibiciones.push("ArrowDown", "KeyS");
    }

    //Retornando las direcciones prohibidas
    return prohibiciones;

}

const valorInicial = () => {

  let bicho = cualquierLado([],[...controles.paredes]).posicion;
  let comida = cualquierLado([],[...controles.bicho, ...controles.paredes]).posicion;

  if (bicho.x !== comida.x || bicho.y !== comida.y) {
    
     let direccion = cualquierLado(getDiresNoPermitidas()).direccion;

    return {
      direccion: {
        x: direccion.x,
        y: direccion.y,
      },
      proximaDireccion : [],
      bicho: [{ x: bicho.x, y: bicho.y },{ x: bicho.x, y: bicho.y }],
      cuatroPasosAtras: {
        posiciones: [],
        direcciones: [],
      },
      vida: 3,
      comida: comida,
      jugando: true,
      pausa: false,
      paredes : [],
      animando: false,
      pausable: true,
      animaciones : [],
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
  proximaDireccion : [],
  bicho: [{ x: 0, y: 0 }],
  cuatroPasosAtras: {
    posiciones: [],
    direcciones: [],
  },
  vida: 3,
  comida: { x: 0, y: 250 },
  jugando: false,
  pausa : false,
  paredes : [],
  animando: false,
  pausable: false,
  animaciones : [],
  crecimiento: 0,
};

let dibujarElemento = (elemento, x, y) => {
  //Creando el elemento (viborita o comida)
  //Se indica el color según el objeto que se vaya a crear (verde es la viborita y amarillo es la comida)
  ctx.fillStyle = elemento.color;
  //Se crea un rectángulo (x,y,width,height) correspondiente a la cabeza
  ctx.fillRect(x, y, ANCHO_ALTO_VIBORITA, ANCHO_ALTO_VIBORITA);
};

let dibujarCabeza = (x, y) => {
  //Se indica el color según el objeto que se vaya a crear (verde es la viborita y amarillo es la comida)
  ctx.fillStyle = ELEMENTOS.VIBORITA.color;
  //Se crea un rectángulo (x,y,width,height) correspondiente a la cabeza
  ctx.fillRect(x, y, ANCHO_ALTO_VIBORITA, ANCHO_ALTO_VIBORITA);

  //Saco un quinto de la cabeza de la viborita para hacerle los ojos
  let dospixels = ANCHO_ALTO_VIBORITA / 5;

  ctx.fillStyle = 'white';
  ctx.fillRect(x + dospixels, y + dospixels, dospixels, dospixels);
  ctx.fillRect(x + dospixels * 3, y + dospixels, dospixels, dospixels);

  //Las pupilas tienen que mirar la comida, es decir que se ponen en una de cuatro esquinas
  ctx.fillStyle = 'black';
  let comidaALaDerecha = controles.comida.x - x > 0; //Si la comida está a la derecha pinta la pupila a la derecha
  let comidaAbajo = controles.comida.y - y > 0; //Si la comida está Abajo pinta la pupila abajo
  ctx.fillRect(x + dospixels * (comidaALaDerecha ? 1.5 : 1), y + dospixels * (comidaAbajo ? 1.5 : 1), dospixels / 2, dospixels / 2);
  ctx.fillRect(x + dospixels * (comidaALaDerecha ? 3.5 : 3), y + dospixels * (comidaAbajo ? 1.5 : 1), dospixels / 2, dospixels / 2);


  
  //Después vemos si le pongo colmillos y lengua
  
  //Si está yendo a la derecha
  if(controles.direccion.x === 1) {
    ctx.fillStyle = 'black';
    if(ELEMENTOS.VIBORITA.color === 'green'){
    ctx.fillRect(x + dospixels, y + dospixels * 3, dospixels / 2, dospixels / 2);
    }
    ctx.fillRect(x + dospixels, y + dospixels * 3.5, dospixels * 3, dospixels / 2);
  }
  //Si está yendo a la izquierda
  if(controles.direccion.x === -1) {
    ctx.fillStyle = 'black';
    if(ELEMENTOS.VIBORITA.color === 'green'){
    ctx.fillRect(x + dospixels * 3.5, y + dospixels * 3, dospixels / 2, dospixels / 2);
    }
    ctx.fillRect(x + dospixels, y + dospixels * 3.5, dospixels * 3, dospixels / 2);
  }
  
  //Si está yendo a abajo
  if(controles.direccion.y === 1) {
    ctx.fillStyle = 'black';
    if(ELEMENTOS.VIBORITA.color === 'green'){
      ctx.fillRect(x + dospixels, y + dospixels * 3.25, dospixels / 2, dospixels / 2);
      ctx.fillRect(x + dospixels * 3.5, y + dospixels * 3, dospixels / 2, dospixels / 2);
    }
    ctx.fillRect(x + dospixels, y + dospixels * 3.75, dospixels * 3, dospixels / 2);
  }

  //Si está yendo a arriba
 
 /* 
  if(controles.direccion.y === -1) {
    ctx.fillStyle = 'black';
    ctx.fillRect(x + dospixels, y + dospixels / 2 , dospixels / 2, dospixels / 2);
    //ctx.fillRect(x + dospixels * 3.5, y + dospixels / 2, dospixels / 2, dospixels / 2);
    ctx.fillRect(x + dospixels, y, dospixels * 3, dospixels / 2);
  } */



};

let dibujarCola = (x,y) => {
//Se indica el color según el objeto que se vaya a crear (verde es la viborita y amarillo es la comida)
ctx.fillStyle = ELEMENTOS.VIBORITA.color;


//Se crea un rectángulo (x,y,width,height) correspondiente a la COLA

ctx.fillRect(x, y, ANCHO_ALTO_VIBORITA, ANCHO_ALTO_VIBORITA);

/* 
//ESTO LO COMENTÉ PORQUE NO ME GUSTÓ CÓMO QUEDÓ, CAPAZ MÁS ADELANTO LO HAGO

//Si el nodo anterior está a la derecha

if(controles.bicho[controles.bicho.length - 2].x > x) {

  ctx.fillStyle = ELEMENTOS.VIBORITA.color;
  ctx.fillRect(x + 1,y + 3,1,3);
  ctx.fillRect(x + 3,y + 2,1,5);
  ctx.fillRect(x + 5,y + 1,1,7);
  ctx.fillRect(x + 7,y+0.5,3,9);

  ctx.fillStyle = 'black';
  ctx.fillRect(x,y + 4,1,2);
  ctx.fillRect(x + 2,y + 3,1,4);
  ctx.fillRect(x + 4,y + 2,1,6);
  ctx.fillRect(x + 6,y + 1,1,8);

}

//Si el nodo anterior está a la izquierda
if(controles.bicho[controles.bicho.length - 2].x < x) {

  ctx.fillStyle = ELEMENTOS.VIBORITA.color;
  ctx.fillRect(x + 6,y + 3,1,3);
  ctx.fillRect(x + 4,y + 2,1,5);
  ctx.fillRect(x + 2,y + 1,1,7);
  ctx.fillRect(x,y+0.5,3,9);

  ctx.fillStyle = 'black';
  ctx.fillRect(x + 9,y + 4,1,2);
  ctx.fillRect(x + 7,y + 3,1,4);
  ctx.fillRect(x + 5,y + 2,1,6);
  ctx.fillRect(x + 3,y + 1,1,8);

}

 */


}

let dibujarParedes = () => {
  let imgPared = document.createElement('img');
  imgPared.src = ELEMENTOS.PARED.img;
  controles.paredes.forEach((pared)=> {
    ctx.drawImage(imgPared,pared.x,pared.y,10,10);
  });
  imgPared = null;
}

let dibujar = () => {
  //borrar el canvas con clearRect (o sea se borra todo en ese rectangulo)
  ctx.clearRect(0, 0, 500, 500);

  //Loop para dibujar todos los nodos
  for (let i = 0; i < controles.bicho.length; i++) {
    const nodo = controles.bicho[i];

    if(i === 0) {
      dibujarCabeza(nodo.x, nodo.y);
    } else if(i === controles.bicho.length - 1) {
      dibujarCola(nodo.x, nodo.y)
    } else {
      dibujarElemento(ELEMENTOS.VIBORITA, nodo.x, nodo.y);
    }
  }
  const comida = controles.comida;
  dibujarElemento(ELEMENTOS.COMIDA, comida.x, comida.y);
  dibujarParedes();
};

let otraComida = () => {
  let otroLado = cualquierLado([],[...controles.bicho, ...controles.paredes]).posicion;
  controles.comida.x = otroLado.x;
  controles.comida.y = otroLado.y;
};

let choco = () => {
  let head = controles.bicho[0];

  //Chequea si algun nodo aparte de los primeros trestiene la misma posición del head
  //Esto es porque para chocarse consigo misma la cabeza tiene que morder el quinto nodo
  //HAY QUE REVISAR QUE NO SE PUEDA CAMBAR LA DIRECCION MÁS RÁPIDO QUE EL LOOP
  let seMordioLaCola = controles.bicho.some(
    (nodo, index) => index > 3 && nodo.x === head.x && nodo.y === head.y
  );


  //ME LLEVO ESTA FUNCIONALIDAD PARA HACER PASAR LA VIBORITA PARA EL OTRO LADO
 /*  //Si x < 0 se fue para la izquiera de la pantalla
  //Si x >= DIM entonces ya se fue porque su costado izquirdo empieza donde termina el canvas
  let seFueDelCanvas =
    head.x < 0 ||
    head.x >= DIMENSION_CANVAS ||
    head.y < 0 ||
    head.y >= DIMENSION_CANVAS; */

  //Si la cabeza está en la misma posición que cualquiera de las paredes entonces se la morfo  
  let seComioLaPared = controles.paredes.some((pared)=> head.x === pared.x && head.y === pared.y)

  return seMordioLaCola || seComioLaPared /* seFueDelCanvas */;
};

let subirNivel = () => {

  //EN NINGUN MOMENTO SUBIRNIVEL RESETEA LAS POSICIONES, HAY QUE HACER ESO

  //Resetea las direcciones futuras y las posiciones anteriores

  controles.proximaDireccion = [];
  controles.cuatroPasosAtras = {
    posiciones: [],
    direcciones: [],
  };
  controles.crecimiento = 0;

  //Suma los puntos por nivel multiplicado por el nivel para que a más nivel más puntos y lo muestra en pantalla
  puntaje += puntosPorNivel * nivel;
  puntajeValor.innerText = puntaje;
  gameoverPuntajeValor.innerText = puntaje;

  //Sube el nivel y lo muestra en pantalla
  nivel++;
  nivelValor.innerText = nivel;
  popupNivelValor.innerText = nivel;

  //Paredes segun el nivel alcanzado

  if(nivel >= 2 && nivel <=10) {
    //Limpiando las paredes
    controles.paredes = []
    //PAREDES A LA MITAD
    for(y = 0; y < DIMENSION_CANVAS / 2; y += ANCHO_ALTO_VIBORITA) {
      //de la izquierda, desde arriba a la mitad
      controles.paredes.push({x:0,y});
      //de la derecha, desde la mitad abajo
      controles.paredes.push({x:DIMENSION_CANVAS - ANCHO_ALTO_VIBORITA,y: y + DIMENSION_CANVAS / 2});
      //de abajo, desde la izquierda a la mitad
      controles.paredes.push({y:DIMENSION_CANVAS - ANCHO_ALTO_VIBORITA, x: y});
      //de arriba, desde la mitad a la derecha
      controles.paredes.push({y:0,x: y + DIMENSION_CANVAS / 2});
    }
  }

  if(nivel >= 11 && nivel <=15) {
    //PAREDES SE MUEVEN
    //Limpiando las paredes
    controles.paredes = []



  }
  
  if(nivel >= 16 && nivel <=20) {
    //PAREDES DE UNA SI UNA NO
    //Limpiando las paredes
    controles.paredes = []

  }

  













  //Reduce el bicho a uno y pone el intervalo al maximo (restaura la velocidad)
  controles.bicho.length = 2;
  controles.bicho[0] = cualquierLado([],[...controles.paredes]).posicion;
  controles.bicho[1] = copia(controles.bicho[0]);
  controles.direccion = cualquierLado(getDiresNoPermitidas()).direccion;
  console.log('bicho acortado: ', controles.bicho);
  //Probando si sirve subir la velocidad inicial a cada nivel o hay que hacerlo cada 3 niveles poneleeee

  //Por ahora lo comentamos
/* 
  intervalo_max -= intervalo_disminucion;
  intervalo_min -= intervalo_disminucion;
  intervalo_disminucion /= 2;
   */

  intervalo = intervalo_max;

  console.log('nuevos intervalos: ', 'intervalor_max: ', intervalo_max,'intervalo_min: ',intervalo_min,'intervalo_disminucion: ',intervalo_disminucion);

  mostrar(pantallaNivel);
  controles.animando = true;
  controles.pausable = false;
  turbo = false;
  botonTurbo.firstElementChild.classList.remove('activo');
  console.log("bicho antes de la animacion de nivel",controles.bicho);
  let animacionSubirNivel = new Timer(()=> {
    ocultar(pantallaNivel);
    controles.animando = false;
    controles.pausable = true;
    console.log("bicho después de la animacion de nivel",controles.bicho);
  },3000);

  controles.animaciones.push(animacionSubirNivel);

};

let subirVelocidad = () => {
  intervalo -= intervalo_disminucion;
  if (intervalo === intervalo_min) {
    subirNivel();
  }
};

let pausarResumir = () => {
  if(controles.pausable) {
    
    controles.pausa = !controles.pausa;
  
      if(controles.pausa) {
        mostrar(pantallaPausa);
        controles.animaciones.forEach((animacion)=>{
          animacion.pause();
        });
      } else {
        ocultar(pantallaPausa);
        controles.animaciones.forEach((animacion)=>{
          animacion.resume();
        });
      }
  }

}

let retroceder = () => {
  //Se supone que tenemos las dos últimas posiciones en dosPasosAtras
  //Animamos la viborita haciendo aparecer y desaparecer

  controles.animando = true;

  //Las próximas direcciones no tienen sentido porque chocó
  //También se va a asignar la dirección de la posición tres pasos atrás así que no tiene sentido guardar
  //Se eliminan las próximas direcciones
  controles.proximaDireccion = [];

  //Si choca al toque la animación anterior tiene que desaparecer
  if(controles.animaciones.length) {
    controles.animaciones.forEach(a=>a.pause());
    controles.animaciones = [];
  }
  //La viborita se pone roja
  ELEMENTOS.VIBORITA.color = 'red'
  //La posición de choque es una posición ilegal por lo que vuelve inmediatamente a la posición anterior
  controles.bicho = copia(controles.cuatroPasosAtras.posiciones[0]);
  controles.direccion = copia(controles.cuatroPasosAtras.direcciones[0]);

  let pasoUno = new Timer(() => {
    //Checkea que existan las posiciones anteriores y se asignan
    if(controles.cuatroPasosAtras.posiciones[1]){
      controles.bicho = copia(controles.cuatroPasosAtras.posiciones[1]);
      controles.direccion = copia(controles.cuatroPasosAtras.direcciones[1]);
    }
  },1000);
  
  /* setTimeout(() => {
    controles.bicho = copia(controles.cuatroPasosAtras.posiciones[1]);
  },1000); */
  
  let pasoDos = new Timer(() => {
    if(controles.cuatroPasosAtras.posiciones[2]){
      controles.bicho = copia(controles.cuatroPasosAtras.posiciones[2]);
      controles.direccion = copia(controles.cuatroPasosAtras.direcciones[2]);
    }
  },2000)
  
  /* setTimeout(() => {
    controles.bicho = copia(controles.cuatroPasosAtras.posiciones[2]);
  },2000); */
  
  let pasoTres = new Timer(() => {
    if(controles.cuatroPasosAtras.posiciones[3]){
      controles.bicho = copia(controles.cuatroPasosAtras.posiciones[3]);
      controles.direccion = copia(controles.cuatroPasosAtras.direcciones[3]);
    }
  },3000)

  /* setTimeout(() => {
    controles.bicho = copia(controles.cuatroPasosAtras.posiciones[3]);
  },3000); */
  
  //Seteando la posicion y direccion y volviendo a empezar
  
  let pasoCuatro = new Timer(() => {
    if(controles.cuatroPasosAtras.posiciones[4]){
    //Asigna la dirección de la última posición asignada (se asume que las direcciones y las posiciones tienen el mismo largo)
    controles.bicho = copia(controles.cuatroPasosAtras.posiciones[4]);
    controles.direccion = copia(controles.cuatroPasosAtras.direcciones[4]);
    }

    //La próxima direccion no tiene sentido, se resetea para que siga con la dirección en la que venía
    controles.proximaDireccion = [];

    //La viborita ya se recuperó
    ELEMENTOS.VIBORITA.color = 'green'
    controles.animando = false;
    //Se limpian las animaciones
    controles.animaciones = [];

    //Las posiciones y direcciones anteriores se resetean a la última posición asignada
    //Esto es porque si se vuelve a chocar enseguida las posiciones anteriores pueden
    //Ser la posición donde choca y perderías otra vida instantáneamente = gameover

    
    controles.cuatroPasosAtras.posiciones[0] = controles.cuatroPasosAtras.posiciones[controles.cuatroPasosAtras.posiciones.length - 1];
    console.log('posiciones antes de modificar el lenght:', JSON.parse(JSON.stringify(controles.cuatroPasosAtras.posiciones)))
    controles.cuatroPasosAtras.posiciones.length = 1;
    controles.cuatroPasosAtras.direcciones[0] = controles.cuatroPasosAtras.direcciones[controles.cuatroPasosAtras.direcciones.length - 1];
    console.log('direcciones antes de mod el lenght:', JSON.parse(JSON.stringify(controles.cuatroPasosAtras.direcciones)))
    controles.cuatroPasosAtras.direcciones.length = 1;
    console.log('posiciones despues de mod el length:', JSON.parse(JSON.stringify(controles.cuatroPasosAtras.posiciones)))
    console.log('direcciones después de mod:', JSON.parse(JSON.stringify(controles.cuatroPasosAtras.direcciones)))
  },4000)

  /* setTimeout(() => {
    controles.bicho = copia(controles.cuatroPasosAtras.posiciones[4]);
    controles.direccion = copia(controles.cuatroPasosAtras.direcciones[4]);
    ELEMENTOS.VIBORITA.color = 'green'
    controles.animando = false;
  },4000); */

  //Las animaciones se guardan en controles.animaciones para poder pausarlas y resumirlas
  controles.animaciones.push(pasoUno,pasoDos,pasoTres,pasoCuatro);

}

//Seteando el loop

let loop = () => {

  //let str = Date.now().toString();
  //console.log('loop: ' +  str.substring(str.length - 4, str.length));


  //Primero chequea se está jugando(?)
  if(controles.jugando && !controles.pausa  && !controles.animando) {

    let dx = controles.direccion.x * DESPLAZAMIENTO; //la dirección en x multiplicada por el desplazamiento
    let dy = controles.direccion.y * DESPLAZAMIENTO; //la dirección en y
    
    //Hay un bug que si apretás rápido las teclas cambia la dirección dos veces antes
    //del próximo cuadro y eso te permite volver sobre vos mismo y ese movimiento es ilegal
    //La solución que se me ocurrió es que cada que toque de teclado pushea una dirección
    //a controles.proximaDireccion. Pero a cada loop se asigna, si existe, la próxima dirección
    //desde ese mismo array, y se hace shift para sacar el índice 0.
    //Pero si el length del array es mayor a tres movimientos se recorta a 3
    //Entonces tocar el teclado a lo loco no te va a servir más, y la dire va a cambiar
    //Una sola vez por cuadro, porque se reasigna en cada cuadro
    //ahora la comprobación para que no vuelva sobre sí misma es antes de asignar la próxima dire

    //Controla que exista una próxima dirección
    if(controles.proximaDireccion.length) {
      const proximaX = controles.proximaDireccion[0].x;
      const proximaY = controles.proximaDireccion[0].y;

    //Acá se tiene que verificar que no vuelva sobre sí misma. Si vuelve entonces la próxima dirección se elimina
    //no entra si la dirección es la contraria a la actual (la viborita no puede volver sobre sí misma)
    //Es verdad que x (la dirección presionada)
    //es distinto que el inverso de la dirección x actual ("""-"""controles.direccion.x)
    //o sea, no vuelve.
    const noVuelveEnX = proximaX !== -controles.direccion.x;
    const noVuelveEnY = proximaY !== -controles.direccion.y;
    if (noVuelveEnX && noVuelveEnY) {
      //Cambia la dirección a la próxima
      controles.direccion.x = proximaX;
      controles.direccion.y = proximaY;
    }
    //Una vez asignada o ignorada, se elimina la primera para dejarle el paso a las siguientes
      controles.proximaDireccion.shift();
    
    }




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

  


    //Guarda la posición completa y la direccion anterior para poder volver dos pasos atrás si choca
    //Lo inserta en el indice 0 con unshift y luego recorta el lenght a 2 para conservar sólo los dos últimos
    controles.cuatroPasosAtras.posiciones.unshift(copia(controles.bicho));

    //Checkea que el length sea mayor 5 previo a cortar el sobrante
    //Si no se hace esto  en la situación de chocar dos veces seguidas rápido se termina en un error
    //Por pasar undefined a copia() (json.parse)
    if(controles.cuatroPasosAtras.posiciones.length > 5) {
      controles.cuatroPasosAtras.posiciones.length = 5;
    }


    controles.cuatroPasosAtras.direcciones.unshift(copia(controles.direccion));
    if(controles.cuatroPasosAtras.direcciones.length > 5) {
      controles.cuatroPasosAtras.direcciones.length = 5;
    }


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
    
    /* LOOP */
    
    let comida = controles.comida;
    let head = controles.bicho[0]; //Referenciamos la cabeza
    
    //Si se pasó del canvas entonces tiene que pasar para el otro lado, según el nivel
  
    //NIVEL 1 AL 4
  
    if(nivel <=1) {
    //Si x < 0 se fue para la izquiera de la pantalla
    //Si x >= DIM entonces ya se fue porque su costado izquirdo empieza donde termina el canvas
    //En cada caso se reasigna la variable al otro lado de la pantalla
    
    if(head.x < 0) {
      head.x = DIMENSION_CANVAS - ANCHO_ALTO_VIBORITA;
    }
    if(head.x >= DIMENSION_CANVAS) {
      head.x = 0;
    }
    if(head.y < 0) {
      head.y = DIMENSION_CANVAS - ANCHO_ALTO_VIBORITA;
    }
    if(head.y >= DIMENSION_CANVAS) {
      head.y = 0;
    }
    
  }
  
  if(nivel >= 2 && nivel < 10) {
    //Acá se supone que están las paredes cruzadas entonces tiene que aparecer del otro lado PERO EN ESPEJO
    
    if(head.x < 0) {
      head.x = DIMENSION_CANVAS - ANCHO_ALTO_VIBORITA;
      //hay que acomodar la y para que esté espejada
      head.y = Math.abs(head.y - DIMENSION_CANVAS) - ANCHO_ALTO_VIBORITA; // La parte de mas arriba está ocupada por una pared por eso se resta un cuadrito
    }
    if(head.x >= DIMENSION_CANVAS) {
      head.x = 0;
      head.y = Math.abs(head.y - DIMENSION_CANVAS ) - ANCHO_ALTO_VIBORITA;
    }
    if(head.y < 0) {
      head.y = DIMENSION_CANVAS - ANCHO_ALTO_VIBORITA;
      head.x = Math.abs(head.x - DIMENSION_CANVAS) - ANCHO_ALTO_VIBORITA;
    }
    if(head.y >= DIMENSION_CANVAS) {
      head.y = 0;
      head.x = Math.abs(head.x - DIMENSION_CANVAS) - ANCHO_ALTO_VIBORITA;
    }
    
  }
  
  
  
  //Chequeamos si la viborita se comió la comida (en el primer loop siempre va a dar falso porque siempre aparecen en distintos lugares)
  let niamniam = head.x === comida.x && head.y === comida.y;
  
  
  //Ni idea de por qué está en esta posición y no antes de empezar
  //Chequea si chocó y cambia el estado de jugando
  if (choco()) {
    //console.log('choco', 'jugando: ', controles.jugando, 'vida:', controles.vida);
      turbo = false;
      botonTurbo.firstElementChild.classList.remove('activo');
      controles.vida -=1;
      vidaValor.innerHTML = controles.vida;
  
      if(controles.vida === 0){
        perdiste();
      } else {
        retroceder()
      }

  }

  if (niamniam) {
    //Aumenta el puntaje
    puntaje += puntosPorComida;
    puntajeValor.innerText = puntaje;
    gameoverPuntajeValor.innerText = puntaje;

    //Suma el valor del nivel al crecimiento para luego hacer crecer la viborita
    controles.crecimiento += nivel;

    //Suma la comida a las porciones

    porciones += 1;

    //Chequea si ya comió mucho

    if (porciones === estomagoLleno) {
      porciones = 0;
      subirVelocidad();
    }

    //reposiciona la comida
    otraComida();
  }
  
  //Chequea el crecimiento para alargar la viborita
  if (controles.crecimiento > 0) {
    controles.bicho.push(cola); //la cola queda duplicada y se acomoda en el loop
    controles.crecimiento -= 1;
  }

}
  //llamo a una nueva animación con dibujar
  requestAnimationFrame(dibujar);

  //Al terminar se llama a sí misma luego de INTERVALO,
  //creando así un loop infinito que hace correr el juego.
  //Una razón por la que se esté poniendo muchos setTimeOut y no un solo setInterval es
  //porque de esa manera se puede modificar INTERVALO para aumentar la dificultad (?)
  //También podría aumentar la dificultad modificando el DESPLAZAMIENTO?...

  setTimeout(loop, /* 1000 */ turbo ? intervalo_min : intervalo); //Si está activado el turbo la velocidad es máxima (intervalo_min)

  if(controles.animando) {

    
    
    let imgActual = papel.toDataURL('image/png');
    if(imgAnterior !== imgActual) {
      console.log('bicho: ', JSON.parse(JSON.stringify(controles.bicho)));
      console.log('direccion: ', JSON.parse(JSON.stringify(controles.direccion)));
      console.log('proximadireccion: ', JSON.parse(JSON.stringify(controles.proximaDireccion)));
      console.log('cuatropasosatras: ', JSON.parse(JSON.stringify(controles.cuatroPasosAtras)));
      console.log('%c ', `font-size:400px; background:url(${imgActual}) no-repeat;`);
      imgAnterior = imgActual;
    }


  }

  /* 

  VER QUE ONDA CON ESTO
  
  (function(url) {
    // Create a new `Image` instance
    var image = new Image();
  
    image.onload = function() {
      // Inside here we already have the dimensions of the loaded image
      var style = [
        // Hacky way of forcing image's viewport using `font-size` and `line-height`
        'font-size: 1px;',
        'line-height: ' + this.height + 'px;',
  
        // Hacky way of forcing a middle/center anchor point for the image
        'padding: ' + this.height * .5 + 'px ' + this.width * .5 + 'px;',
  
        // Set image dimensions
        'background-size: ' + this.width + 'px ' + this.height + 'px;',
  
        // Set image URL
        'background: url('+ url +');'
       ].join(' ');
  
       // notice the space after %c
       console.log('%c ', style);
    };
  
    // Actually loads the image
    image.src = url;
  })('https://i.cloudup.com/Zqeq2GhGjt-3000x3000.jpeg');
  
  */



};

var imgAnterior;

/* -----------------------UTILIDADES-------------------------- */

//Utilidad para comprar los objetos de posicion
const equivalen = (obj1, obj2) => {
  return obj1.x === obj2.x && obj1.y === obj2.y;
};

//Utilidad para copiar objetos
const copia = (fuente) => {
  return JSON.parse(JSON.stringify(fuente));
};

//Para mostrar u ocultar elementos
const mostrar = (elemento) => {
  if(elemento.classList.contains('ocultar')) {
    elemento.classList.remove('ocultar');
  }
  container.classList.add('blur');
}
const ocultar = (elemento) => {
  if(!elemento.classList.contains('ocultar')) {
  elemento.classList.add('ocultar');
  }
  container.classList.remove('blur');
}

/*TIMER stackoverflow te amo https://stackoverflow.com/questions/3969475/javascript-pause-settimeout */

var Timer = function(callback, delay) {
  var timerId, start, remaining = delay;

  this.pause = function() {
      window.clearTimeout(timerId);
      timerId = null;
      remaining -= Date.now() - start;
  };

  this.resume = function() {
      if (timerId) {
          return;
      }

      start = Date.now();
      timerId = window.setTimeout(callback, remaining);
  };

  this.resume();
};

/*stackoverflow te amo*/

/* constructor de los puntajes */

const nuevoHighScore = (nombre,puntaje) => {
  return `<li class="puntaje">
	<span class="puntaje-nombre">${nombre}</span> :
	<span class="puntaje-valor">${puntaje}</span>
</li>`;
}

/* constructor de los puntajes */

/* -----------------------UTILIDADES-------------------------- */

//Capturando el teclado

document.onkeydown = (e) => {
  //console.log(e.code);
  //console.log(e.key);

  //no entra si la tecla no es de dirección
  const esDeDireccion = !!DIRECCION[e.code]; //bang bang! estás liquidado ah re

  if (esDeDireccion && controles.jugando && !controles.pausa ) {
    //ACÁ HAY QUE HACER EL CÓDIGO PARA PUSHEAR A PRÓXIMAS DIRECCIONES
    //La comprobación de que no vuelva sobre sí misma ahora se hace en el loop antes de cada movimiento
    const [x, y] = DIRECCION[e.code];

      //Se comprueba que el array no tenga más de 3 direcciones
      //Si tiene más de tres direcciones se ignora la instrucción y sólo se reflejan los botones presionados
      if(controles.proximaDireccion.length < 3) {
        controles.proximaDireccion.push({x,y});
      }
      



    //Modifica los estilos del teclado virtual para reflejar el estado el teclado físico
    switch (e.code) {
      case 'ArrowUp': //arriba
      case 'KeyW': //arriba
        botonArriba.firstElementChild.classList.add('activo');
        break;
      case 'ArrowDown': //abajo
      case 'KeyS': //abajo
        botonAbajo.firstElementChild.classList.add('activo');
        break;
      case 'ArrowLeft': //izquierda
      case 'KeyA': //izquierda
        botonIzquierda.firstElementChild.classList.add('activo');
        break;
      case 'ArrowRight': //derecha
      case 'KeyD': //derecha
        botonDerecha.firstElementChild.classList.add('activo');
    }
  }

  //Si es la tecla espaciadora le pone turbo
  let esTurbo = OTRAS_TECLAS[e.code] === 'turbo';
  if(esTurbo && controles.jugando && !controles.animando && !controles.pausa ) {
    turbo = true;
    //console.log('esturbo', e.code, 'turbo: ',turbo)
    botonTurbo.firstElementChild.classList.add('activo');
  }
  
  //Si es escape le pone o saca pausa
  let esPausa = OTRAS_TECLAS[e.code] === 'pausa';
  if(esPausa) {
    pausarResumir()
  }
  
  
};

document.onkeyup = (e) => {
  //Si es la tecla espaciadora le saca el turbo
  const esTurbo = OTRAS_TECLAS[e.code] === 'turbo';
  if(esTurbo && controles.jugando && !controles.animando && !controles.pausa ) {
    turbo = false;
    botonTurbo.firstElementChild.classList.remove('activo');
    //console.log('esturbo', e.code, 'turbo: ',turbo)
  }

  //Modifica los estilos del teclado virtual para reflejar el estado el teclado físico
  switch (e.code) {
    case 'ArrowUp': //arriba
    case 'KeyW': //arriba
      botonArriba.firstElementChild.classList.remove('activo');
      break;
    case 'ArrowDown': //abajo
    case 'KeyS': //abajo
      botonAbajo.firstElementChild.classList.remove('activo');
      break;
    case 'ArrowLeft': //izquierda
    case 'KeyA': //izquierda
      botonIzquierda.firstElementChild.classList.remove('activo');
      break;
    case 'ArrowRight': //derecha
    case 'KeyD': //derecha
      botonDerecha.firstElementChild.classList.remove('activo');
  }


};




const iniciar = () => {
  vidaValor.innerText = controles.vida;
  container.classList.remove('blur');
  pantallaInicio.classList.add('ocultar');
};

const perdiste = () => {
  controles.jugando = false;
  turbo = false;
  
  //Recolecta los puntajes para el highscore etc
  ultimoPuntaje = puntaje;
  ultimoNivel = nivel;

  //Restaura los valores al inicio y los muestra en pantalla
  puntaje = 0;
  puntajeValor.innerText = puntaje;

  nivel = 1;
  nivelValor.innerText = nivel;
  popupNivelValor.innerText = nivel;

  porciones = 0;

  intervalo_max = INTERVALO_MAX_DEFAULT;
  intervalo_min = INTERVALO_MIN_DEFAULT;
  intervalo_disminucion = INTERVALO_DISMINUCION_DEFAULT;

  intervalo = intervalo_max;




  //Animar como que pierde
  //popup para ver si quiere jugar de vuelta? si quiere iniciar(), si no pantallita principal :P
    
  controles.pausable = false;
  mostrar(pantallaGameover);
};


window.onload = () => {
  mostrar(pantallaInicio);
  controles = valorInicial();
  loop()
};


/*
REVISARRRRRRRRRRRRRR PARA EL SWIPE

let ongoingTouches = [];

function handleStart(evt) {
  evt.preventDefault();
  log('touchstart.');
  const touches = evt.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    log(`touchstart: ${i}.`);
    ongoingTouches.push(copyTouch(touches[i]));
    
    log(`color of touch with id ${ touches[i].identifier } = ${ color }`);
    
  }
}

function handleMove(evt) {
  evt.preventDefault();
  const el = document.getElementById('canvas');
  const touches = evt.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    const idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      log(`continuing touch ${ idx }`);
      log(`ctx.moveTo( ${ ongoingTouches[idx].pageX }, ${ ongoingTouches[idx].pageY } );`);
      
      //ESTA ES LA INFO DE LOS EVENTOS
      ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      log(`ctx.lineTo( ${ touches[i].pageX }, ${ touches[i].pageY } );`);
      ctx.lineTo(touches[i].pageX, touches[i].pageY);

      //DURANTE EL LOOP REEMPLAZA UN VALOR CON OTRO REVISAR POR QUÉ
      ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record

    } else {
      log('can\'t figure out which touch to continue');
    }
  }
}



function ongoingTouchIndexById(idToFind) {
  for (let i = 0; i < ongoingTouches.length; i++) {
    const id = ongoingTouches[i].identifier;

    if (id == idToFind) {
      return i;
    }
  }
  return -1;    // not found
}


//VER ESTA FUNCIÓN PARA REMPLAZAR A copia() PORQUE PUEDE QUE SEA MÁS RÁPIDA(?)

function copyTouch({ identifier, pageX, pageY }) {
  return { identifier, pageX, pageY };
}


*/