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
           const eventData = transformEventData(data) // Imprimir os dados da resposta
           return sendDataToServer(eventData)
        })
        .catch(error => {
            console.log('Erro:', error);
        });
}

  function transformEventData(data) {
    const eventData = data.map(element => {
      return {
        title: element.Titulo,
        description: element.Disciplina,
        start: element.Inicio,
        end: element.Termo
      };
    });
  
    return eventData;
  }

  function sendDataToServer(eventData) {

    const url = 'http://localhost:3000/events'; // Replace with your server's URL
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
    };
  
    return fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error('Post handling error: ' + response.status);
        }
        return response.json(); // Parse the response as JSON and return the result
      })
      .then(result => {
        console.log('Event data sent successfully:', result);
        return result;
      })
      .catch(error => {
        console.log('Error sending event data to the server:', error);
        throw error;
      });
  }

module.exports = {
    getCalendar
};