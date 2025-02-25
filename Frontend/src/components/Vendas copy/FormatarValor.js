// Função para formatar valores em reais
export default function formatarValor(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
