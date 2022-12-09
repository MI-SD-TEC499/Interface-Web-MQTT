class PahoHandler {
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
  
    onSuccess() {
      console.log('connected');
    }
  
    registerOnMessageArrived(fn) {
      this.client.onMessageArrived = fn;
    }
  
    subscribe(topic) {
      this.client.subscribe(topic);
    }
  
    send(topic, message) {
      this.client.send(topic, message);
    }
  }
  
  var umidity = [];
  var temperature = [];
  var potenciometer = [];
  
  // const pahoHandler = new PahoHandler('test.mosquitto.org', 8080, "clientjs");
  const pahoHandler = new PahoHandler('10.0.0.101', 9001, "clientjs");
  
  
  window.addEventListener('DOMContentLoaded', () => {
  
    const subscribeInput = document.querySelector('#subscribe');
    const subscribeButton = document.querySelector('#subscribe-button');
    const messageInput = document.querySelector('#message');
    const sendButton = document.querySelector('#send-button');
    const topicInput = document.querySelector('#topic');
  
    subscribeButton.addEventListener('click', () => {
      pahoHandler.subscribe(subscribeInput.value);
    });
  
    sendButton.addEventListener('click', () => {
      pahoHandler.send(topicInput.value, messageInput.value);
    });
    const onMessage = (message) => {
      var payload = message.payloadString;
      splited = payload.split(";");
      if (umidity.length == 10) {
        umidity.shift();
        temperature.shift();
        potenciometer.shift();
      }
      umidity.push(Number(splited[0]));
      temperature.push(Number(splited[1]));
      potenciometer.push(Number(splited[2]));

      linechart.update();
    };
  
    pahoHandler.registerOnMessageArrived(onMessage);
  });