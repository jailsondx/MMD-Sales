function CompletaCodBarras(value) {
    // Converte o valor para string
    const valueStr = String(value);
    
    // Completa com zeros à esquerda até que a string tenha 6 dígitos
    const paddedValue = valueStr.padStart(6, '0');
    return paddedValue;
}
module.exports = CompletaCodBarras;
// Exemplos de uso
/*
console.log(padWithZeros(123));      // Saída: "000123"
console.log(padWithZeros(12345));    // Saída: "012345"
console.log(padWithZeros(123456));   // Saída: "123456"
console.log(padWithZeros(1));        // Saída: "000001"
console.log(padWithZeros(0));        // Saída: "000000"
*/
