//constante de las dimensiones del canvas (ojo porque también están definidas en el html)
//ya fue las aplico desde acá y listo
const ANCHO_ALTO_CANVAS = 500;
const TAMANIO_VIBORITA = 10; //tamaño de la cabeza de la viborita ojo ahí podés hacer flashereadas, cambiando esto.
const INTERVALO = 200; //El intervalo en que se llama a la función

//Refs canvas y contexto
let papel = document.querySelector("canvas");

//Aplicando el tamaño al canvas
papel.width = ANCHO_ALTO_CANVAS;
papel.height = ANCHO_ALTO_CANVAS;

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
let VELOCIDAD = 10;

//Una función para randomizar la posición y dirección oficiales

let cualquierLado = (arrNoPermitidos = []) => {
    console.log(arrNoPermitidos)
  let todasLasDires = Object.keys(DIRECCION); //Un array con los valores del objeto DIRECCION para poder sacar uno random por el índice
  let diresPermitidas;
  if (arrNoPermitidos.length) {
    //Si se le pasa un array con algún elemento no permitido lo filtra
    diresPermitidas = todasLasDires.filter(
      (dire) => !arrNoPermitidos.includes(dire)
    ); //Filtra arrDires por los valores que no estén incluidos en la lista de nopermitidos
  } else {
    diresPermitidas = todasLasDires;
  }

  let direRandom = diresPermitidas[parseInt(Math.random() * (diresPermitidas.length - 1))]; //11 es el último índice porque son doce elementos
  return {
    posicion: {
      x: parseInt(Math.random() * ANCHO_ALTO_CANVAS),
      y: parseInt(Math.random() * ANCHO_ALTO_CANVAS),
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

        /* ESTO ANDA PERFECTO PERO ES INENTENDIBLE!
        PONER 4 IFS Y A LA ÑLALKSJDFÑLAKSDJ

        |
        v

        */
        
        let prohibiciones = [
            {//prohibe ir a la izquierda o arriba
                pos: 0, 
                dir: {
                    x: ['ArrowLeft', 'KeyA'], 
                    y: ['ArrowUp', 'KeyW']
                }
            }, 
            {//no prohibe nada
                pos: 100, 
                dir: {
                    x: [], 
                    y: []
                }
            },
            {//prohibe ir a la derecha o abajo
                pos: 400, 
                dir: {
                    x: ['ArrowRight', 'KeyD'], 
                    y: ['ArrowDown', 'KeyS']
                }
            },
        ];
        
        let dirProhibidaX = prohibiciones.reduce((prev,curr)=> {
            if(curr.pos <= bicho.x) {
                return curr;
            } else {
                return prev
            }
        }).dir.x;
        
        let dirProhibidaY= prohibiciones.reduce((prev,curr)=> {
            if(curr.pos <= bicho.y) {
                return curr;
            } else {
                return prev
            }
        }).dir.y;
        
        let direccion = cualquierLado([...dirProhibidaX, ...dirProhibidaY]).direccion;
        
        
        /*
        ^
        |
        ESTO ANDA PERFECTO PERO ES INENTENDIBLE!
        PONER 4 IFS Y A LA ÑLALKSJDFÑLAKSDJ */
        
        
        return {
            direccion: {
                x: direccion.x,
        y: direccion.y,
      },
      bicho: [{ x: bicho.x, y: bicho.y }],
      comida: comida,
      jugando: false,
    };
  } else {
    console.log("se repitieron los valores ?");
    return valorInicial();
  }
};

//El state de la dirección y la posición inicial del bicho
let controles = {
  direccion: {
    x: 1,
    y: 0,
  },
  bicho: [{ x: 0, y: 0 }],
  comida: { x: 0, y: 250 },
  jugando: false,
};

controles = valorInicial();

let looper = () => {
  setInterval(loop, INTERVALO);
};

let loop = () => {
  const head = controles.bicho[0]; //la posición de la cabeza del bicho
  let dx = controles.direccion.x * VELOCIDAD; //la dirección en x multiplicada por la velocidad
  let dy = controles.direccion.y * VELOCIDAD; //la dirección en y
  head.x += dx; //a la posición actual (sq o controles.bicho[0]) se le suma la dirección a cada loop (o sea aumenta la posición en x y se mueve a la derecha, aumenta en y y se mueve hacia abajo)
  head.y += dy;
  //llamo a una nueva animación con dibujar
  requestAnimationFrame(dibujar);
};

let dibujar = (color) => {
  //borrar el canvas con clearRect (o sea se borra todo en ese rectangulo)
  ctx.clearRect(0, 0, 500, 500);

  const head = controles.bicho[0];
  //Creando la viborita
  //Se indica el color del próximo objeto a crear
  ctx.fillStyle = "green";
  //Se crea un rectángulo (x,y,width,height) correspondiente a la cabeza
  ctx.fillRect(head.x, head.y, TAMANIO_VIBORITA, TAMANIO_VIBORITA);
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

window.onload = () => {
  looper();
};
