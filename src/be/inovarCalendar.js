function getCalendar(token) {
    const url = 'https://aefhp.unicard.pt/inovarconsulta/api/agenda/semana/2207/2';

    const headers = {
        Authorization: 'Bearer ' + token
    };

    const options = {
        method: 'GET',
        headers
    };

    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Get handling error: ' + response.status);
            }
            return response.json(); // Analisar a resposta como JSON e retornar os dados
        })
        .then(data => {
            console.log(data); // Imprimir os dados da resposta
        })
        .catch(error => {
            console.log('Erro:', error);
        });
}

module.exports = {
    getCalendar
};