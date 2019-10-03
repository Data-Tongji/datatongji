module.exports = {
// function retornaVarArr(arr, p, f){
//   res=[];
//   for(let i=p;i<f;i++){
//       res.push(arr[i]);
//   }
//   return res;
// }


// function retornaQuadrado(arr){
//   res=[];
//   for(let i=0;i<arr.length;i++){
//       res.push(Math.pow(arr[i],2));
//   }
//   return res;
// }

retornaSoma: function (arr,name) {
  var soma = arr.reduce(function(a, b) {
    return a + b.name;
  }, 0);
  return soma;
}

// function retornaMultiplicacao(x,y){
//   let res=[];
//   for (let i=0;i<x.length;i++){
//       res.push(x[i] * y[i]);
//   }
//   return res;
// }

// function retornaCorrelacao(n, somaX, somaY, somaX2,  somaY2, somaXvezesY){
//   let res=0;
//   res = ((n * somaXvezesY)-(somaX*somaY))/Math.sqrt(((n * somaX2) - Math.pow(somaX,2)) *(n*somaY2 - Math.pow(somaY,2)));
//   return res;
// }

// function retornaGrauDeCorrelacao(r, x, y){
//   if (r<0){r*=-1;}
//   let res=`A correlação existente entre ${x} e ${y} é de <b>${(r*100).toFixed(2)}%</b><br>`;
//   if (r<0.3){
//       res+= "Existe correlação <b>insignificante</b> entre as variáveis.";
//       return res;
//   }
//   if (r<0.6){
//       res+= "Existe correlação <b>fraca</b> entre as variáveis.";
//       return res;
//   }
//   if (r>=0.6){
//       res+= "Existe correlação <b>significante</b> entre as variáveis.";
//       return res;
//   }
// }

// function retornaTexto(x){
//   res="";
//   for (i=0;i<x.length-1;i++){
//       res+=x[i] + ";"
//   }
//   res+=x[x.length-1];
//   return res;
// }


// function convertToPoint(xx,yy){
//   let res=[];

//   for(let i=0;i<xx.length;i++){
//       res.push({x:xx[i], y:yy[i]});
//   }


//   return res;
// }

// function retornaA(n, somaX, somaY, somaX2, somaXvezesY){
//   let res=0;
//   res = ((n * somaXvezesY)-(somaX*somaY))/((n * somaX2) - Math.pow(somaX,2));
//   return res;
// }
// function retornaB(somaX, somaY, n, a){
//   let mX = somaX/n;
//   let mY = somaY/n;
//   let res= mY - a*mX;
//   return res;
// }

// function geraTabelaCorr(x,y,tit, sub){
//   let divTabela=document.querySelector("#divTabelaCorrelacao");
//   divTabela.innerHTML="";
//   let res='<table class="table table-bordered">'
//   res+=`<tr><th>${tit}</th><th>${sub}</th></tr>`;
//   for(i=0;i<x.length;i++){
//       res+=`<tr><td>${x[i].toFixed(2)}</td><td>${y[i].toFixed(2)}</td></tr>`;
//   }
//   res+='</table>'
//   divTabela.innerHTML = res;
// }

}