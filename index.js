class PahoHandler {
    constructor(host, port, clientId) {
      this.host = host;
      this.port = port;
      this.clientId = clientId;
      this.client = new Paho.Client(this.host, this.port, this.clientId);
      this.client.connect({
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
  
  const array = [1, 2, 3, 4];
  
  const pahoHandler = new PahoHandler('test.mosquitto.org', 8080, "clientjs");
  
  
  window.addEventListener('DOMContentLoaded', () => {
  
    const subscribeInput = document.querySelector('#subscribe');
    const subscribeButton = document.querySelector('#subscribe-button');
    const messageInput = document.querySelector('#message');
    const sendButton = document.querySelector('#send-button');
    const topicInput = document.querySelector('#topic');
    const messages = document.querySelector('#messages');
  
    subscribeButton.addEventListener('click', () => {
      pahoHandler.subscribe(subscribeInput.value);
    });
  
    sendButton.addEventListener('click', () => {
      pahoHandler.send(topicInput.value, messageInput.value);
    });
    const onMessage = (message) => {
      const messageElement = document.createElement('li');
      messageElement.innerHTML = message.payloadString;
      messages.appendChild(messageElement);
    };
  
    pahoHandler.registerOnMessageArrived(onMessage);
  });