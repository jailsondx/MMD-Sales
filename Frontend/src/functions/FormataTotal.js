// Função para formatar o valor total, adicionando separadores de milhar
export default function FormataTotal(valor) {
    let partes = valor.toString().split(".");
    partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return partes.join(",");
}
