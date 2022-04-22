

/**
 *PRUEBA: benchmark de los forloops con json stringify 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 

 let anchoV = 10;
 let altoV = 10;
 
 let anchoC = 3000;
 let altoC = 3000;
 
 let tiemposjson = [];
 let tiempostxt = [];
 
 for (let i = 0; i <= 100; i++) {
   let comienzojson = Date.now();
   //---------------------------------------------------
 
   let posiciones = [];
 
   for (let x = 0; x < anchoC; x += anchoV) {
     for (let y = 0; y < anchoC; y += anchoV) {
       posiciones.push(JSON.stringify({ x, y }));
     }
   }
 
   let posicionesOBJ = posiciones.map(JSON.parse);
 
   //---------------------------------------------------
   tiemposjson.push(Date.now() - comienzojson);
 
   let comienzotxt = Date.now();
   //+++++++++++++++++++++++++++++++++++++++++++++++++++
 
   let posTxt = [];
 
   for (let x = 0; x < anchoC; x += anchoV) {
     for (let y = 0; y < anchoC; y += anchoV) {
       posTxt.push(x + "-" + y);
     }
   }
   
 
   let posTxtOBJ = posTxt.map((pos) => {
     let sp = pos.split("-");
     return { x: sp[0], y: sp[1] };
   });
 
   //+++++++++++++++++++++++++++++++++++++++++++++++++++
   tiempostxt.push(Date.now() - comienzotxt);
 }
 
 let promediojson =
   tiemposjson.reduce((prev, curr) => prev + curr) / tiemposjson.length;
 
 console.log("Tiempo promedio JSON: ", promediojson);
 
 let promediotxt =
   tiempostxt.reduce((prev, curr) => prev + curr) / tiempostxt.length;
 console.log("Tiempo promedio txt: ", promediotxt);
 


 */ 


 console.log(!['a'])