// Função para obter a data no formato YYYY-MM-DD
function getCurrentDate() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');  // Mês começa do 0 (Janeiro), então somamos 1
    const year = currentDate.getFullYear();

    return `${year}-${month}-${day}`;
}

// Função para obter a hora no formato HH:MM:SS
function getCurrentTime() {
    const currentDate = new Date();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

// Exporte ambas as funções para uso em outros arquivos
module.exports = { getCurrentDate, getCurrentTime };
