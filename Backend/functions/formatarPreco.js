// Função para formatar o preço e trocar ponto por vírgula
function formatarPreco(preco) {
    if (typeof preco !== 'number' || isNaN(preco)) {
        return '';
    }

    // Formatar o preço como moeda em BRL (R$)
    let precoFormatado = preco.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    // Substituir o ponto por vírgula
    //return precoFormatado.replace('.', ',');
    return precoFormatado;
}

module.exports = formatarPreco;
