/**
 * Converte um valor de preço, substituindo todas as ocorrências de um caractere por outro.
 * @param {string} valor - O preço como uma string (pode conter vírgula ou ponto).
 * @param {string} char_troca - O caractere que será substituído (ex: ',').
 * @param {string} char_novo - O caractere que substituirá o anterior (ex: '.').
 * @returns {string} - O preço em formato de string com os caracteres substituídos.
 */
function FormataValor(valor, char_troca, char_novo) {
    // Verifica se o valor é uma string
    if (typeof valor !== 'string') {
        throw new TypeError('O valor deve ser uma string.');
    }

    // Substitui todas as ocorrências de char_troca por char_novo
    return valor.replace(new RegExp(char_troca, 'g'), char_novo);
}

module.exports = FormataValor;
