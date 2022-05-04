/* let arr = [{a:1,b:2}];
let arr2 = [];

arr2 = JSON.parse(JSON.stringify(arr));
//arr2.push(arr[0]);

console.log(arr[0] === arr2[0]); */

/* let arrLenght = [];

console.log(!!arrLenght.length); */


let arr = [1,2,3,4,5,6,7,8,9,0];
console.log('arr antes de modificar lenght: ', arr);
arr.length = 2;
console.log('arr despues de modificar lenght: ', arr);
