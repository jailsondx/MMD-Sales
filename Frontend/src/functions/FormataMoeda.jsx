function formatarMoeda() {
    var elemento = document.getElementById('formPreco');
    var valor = elemento.value;
    
    valor = valor + '';
    valor = parseInt(valor.replace(/[\D]+/g,''));
    
   
    valor = valor + '';
    
 
    valor = valor.replace(/([0-9]{2})$/g, ",$1");
  
    if (valor.length > 6) {
      valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    }
    
    
    elemento.value = valor;
  }
  
  export default formatarMoeda;