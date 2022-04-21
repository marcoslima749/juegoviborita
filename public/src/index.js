//Refs canvas y contexto
let papel = document.querySelector('canvas');
let ctx = papel.getContext('2d')






/*
esta constante tiene como propiedad el "code" de la key presionada,
así usando el e.code podemos mandar la variación de coordenadas [x,y]
que corresponda, sumando o restando
 */
const DIRECCION = {
    ArrowUp: [0,-1],
    KeyW: [0,-1],
    ArrowDown: [0,1],
    KeyS: [0,1],
    ArrowLeft: [-1,0],
    KeyA: [-1,0],
    ArrowRight: [1,0],
    KeyD: [1,0]
}

//Un multiplicador para el desplazamiento
let VELOCIDAD = 10;

//El state de la dirección y la posición inicial del bicho
let controles = {
    direccion : {
        x: 1,
        y: 0
    },
    bicho: [{x:0,y:0}]
}




const INTERVALO = 200; //El intervalo en que se llama a la función
let TAMAÑO = 10; //tamaño de la cabeza de la viborita ojo ahí podés hacer flashereadas, cambiando esto.
let looper = () => {
    setInterval(loop, INTERVALO);
}

let loop = () => {
    const sq = controles.bicho[0]; //la posición de la cabeza del bicho
    let dx = controles.direccion.x * VELOCIDAD; //la dirección en x multiplicada por la velocidad
    let dy = controles.direccion.y * VELOCIDAD; //la dirección en y
    sq.x += dx; //a la posición actual (sq o controles.bicho[0]) se le suma la dirección a cada loop (o sea aumenta la posición en x y se mueve a la derecha, aumenta en y y se mueve hacia abajo)
    sq.y += dy;
    //llamo a una nueva animación con dibujar
    requestAnimationFrame(dibujar);
}

let dibujar = (color) => {

    //borrar el canvas con clearRect (o sea se borra todo en ese rectangulo)
    ctx.clearRect(0,0,500,500);

    const sq = controles.bicho[0];
    //Creando la viborita
    //Se indica el color del próximo objeto a crear
    ctx.fillStyle = 'green';
    //Se crea un rectángulo (x,y,width,height) correspondiente a la cabeza
    ctx.fillRect(sq.x,sq.y,TAMAÑO,TAMAÑO);


}



//Capturando el teclado

document.onkeydown = (e)=> {
    //console.log(e.code);
    //console.log(e.key);

    //no entra si la tecla no es de dirección
    const existe = !!DIRECCION[e.code]; //bang bang! estás liquidado

    if(existe) {
        //no entra si la dirección es la contraria a la actual (la viborita no puede volver sobre sí misma)
        const [x, y] = DIRECCION[e.code]
        //Es verdad que x (la dirección presionada)
        //es distinto que el inverso de la dirección x actual ("""-"""controles.direccion.x)
        //o sea, no vuelve.
        const noVuelveEnX = x !== -controles.direccion.x; 
        const noVuelveEnY = y !== -controles.direccion.y; 
        if(noVuelveEnX && noVuelveEnY){
    
            //Cambia la dirección según la tecla presionada 
            controles.direccion.x = x;
            controles.direccion.y = y;
        } 
    }

}


window.onload = ()=> {
    looper();
}

