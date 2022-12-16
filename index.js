class PahoHandler {
    // Definindo configurações para a conexão ao MQTT
    constructor(host, port, clientId) {
      this.host = host;
      this.port = port;
      this.clientId = clientId;
      this.client = new Paho.MQTT.Client(this.host, this.port, this.clientId);
      this.client.connect({
        userName: "aluno",
        password: "@luno*123",
        onSuccess: this.onSuccess,
        timeout: 3,
      });
    }
    // Quando consegue se conectar ao broker aparece a mensagem no terminal do console
    onSuccess() {
      console.log('connected');
    }
    // Mensagem recebida
    registerOnMessageArrived(fn) {
      this.client.onMessageArrived = fn;
    }
    // Se inscrevendo no tópico
    subscribe(topic) {
      this.client.subscribe(topic);
    }
    // Função para enviar a mensagem para o tópico
    send(topic, message) {
      this.client.send(topic, message);
    }
  }
  // Variáveis para armazenar os valores
  var times = [];
  var umidity = [];
  var temperature = [];
  var potenciometer = [];
  
  // Conexão com o broker
  const pahoHandler = new PahoHandler('10.0.0.101', 9001, "clientjs");
  
  
  window.addEventListener('DOMContentLoaded', () => {
  
    const subscribeInput = document.querySelector('#subscribe');
    const subscribeButton = document.querySelector('#subscribe-button');
    const messageInput = document.querySelector('#message');
    const sendButton = document.querySelector('#send-button');
    const topicInput = document.querySelector('#topic');
    const intervalTime = document.querySelector('#interval');
    // Quando apertar o botão irá chamar a função de subscrever
    subscribeButton.addEventListener('click', () => {
      pahoHandler.subscribe(subscribeInput.value);
    });

    // Quando apertar o botão irá chamar a função de enviar mensagem
    sendButton.addEventListener('click', () => {
      pahoHandler.send(topicInput.value, messageInput.value);
    });
    // Executa quando a mensagem é recebida através do tópico subscrito
    const onMessage = (message) => {
      var payload = message.payloadString;
      var date = new Date;
      let unixtime = date.getTime();
      let time = new Date(unixtime).toLocaleTimeString();

      splited = payload.split(";"); //separando os valores recebidos no array
      // Dá um shift nos valores quando chega ao máximo de 10
      if (umidity.length == 10) {
        umidity.shift();
        temperature.shift();
        potenciometer.shift();
        times.shift();
      }

      // Adicionando os valores recebido no gráfico
      umidity.push(Number(splited[0]));
      temperature.push(Number(splited[1]));
      potenciometer.push(Number(splited[2])/10);
      times.push(time);

      // Exibe o intervalo na interface
      intervalTime.innerHTML = "Intervalo: " + splited[3] + " segundos.";

      //atualizando o gráfico
      linechart.update(); 
    };
  
    pahoHandler.registerOnMessageArrived(onMessage);
  });
