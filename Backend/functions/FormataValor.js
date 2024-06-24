// utils.js

/**
 * Converte uma string de preço, substituindo vírgulas por pontos.
 * @param {string} price - O preço em formato de string com vírgulas.
 * @returns {string} - O preço em formato de string com pontos.
 */
function FormataValor(valor, char_troca, char_novo) {
    return valor.replace(char_troca, char_novo);
}

module.exports = FormataValor;
