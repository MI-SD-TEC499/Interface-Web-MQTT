class PahoHandler {
    //definindo configurações para a conexão ao MQTT
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
    //quando consegue se conectar aparece a mensagem no terminal do console
    onSuccess() {
      console.log('connected');
    }
    //mensagem recebida
    registerOnMessageArrived(fn) {
      this.client.onMessageArrived = fn;
    }
    //se inscrevendo no tópico
    subscribe(topic) {
      this.client.subscribe(topic);
    }
    //função para enviar a mensagem para o tópico
    send(topic, message) {
      this.client.send(topic, message);
    }
  }
  //variáveis para armazenar os valores 
  var umidity = [];
  var temperature = [];
  var potenciometer = [];
  
   //conexão com o broker
  // const pahoHandler = new PahoHandler('test.mosquitto.org', 8080, "clientjs"); //broker remoto para teste
  const pahoHandler = new PahoHandler('10.0.0.101', 9001, "clientjs");
  
  
  window.addEventListener('DOMContentLoaded', () => {
  
    const subscribeInput = document.querySelector('#subscribe');
    const subscribeButton = document.querySelector('#subscribe-button');
    const messageInput = document.querySelector('#message');
    const sendButton = document.querySelector('#send-button');
    const topicInput = document.querySelector('#topic');
    //quando apertar o botão irá chamar a função de subinscrever
    subscribeButton.addEventListener('click', () => {
      pahoHandler.subscribe(subscribeInput.value);
    });
    //quando apertar o botão irá chamar a função de enviar mensagem
    sendButton.addEventListener('click', () => {
      pahoHandler.send(topicInput.value, messageInput.value);
    });
    //mensagem recebida através do tópico de subinscrita
    const onMessage = (message) => {
      var payload = message.payloadString;
      splited = payload.split(";"); //separando os valores recebidos no array
      if (umidity.length == 10) {
        umidity.shift();
        temperature.shift();
        potenciometer.shift();
      }
      //adicionando o valor recebido no gráfico
      umidity.push(Number(splited[0]));
      temperature.push(Number(splited[1]));
      potenciometer.push(Number(splited[2]));

      linechart.update(); //atualizando o gráfico
    };
  
    pahoHandler.registerOnMessageArrived(onMessage);
  });
