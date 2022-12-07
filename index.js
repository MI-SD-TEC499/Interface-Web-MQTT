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
  
  const array = [1, 2, 3, 4];
  
  // const pahoHandler = new PahoHandler('test.mosquitto.org', 8080, "clientjs");
  const pahoHandler = new PahoHandler('10.0.0.101', 9001, "clientjs");
  
  
  window.addEventListener('DOMContentLoaded', () => {
  
    const subscribeInput = document.querySelector('#subscribe');
    const subscribeButton = document.querySelector('#subscribe-button');
    const messageInput = document.querySelector('#message');
    const sendButton = document.querySelector('#send-button');
    const topicInput = document.querySelector('#topic');
    const messages = document.querySelector('#messages');
    const chartdiv = document.querySelector("#chart");
  
    subscribeButton.addEventListener('click', () => {
      pahoHandler.subscribe(subscribeInput.value);
    });
  
    sendButton.addEventListener('click', () => {
      pahoHandler.send(topicInput.value, messageInput.value);
    });
    const onMessage = (message) => {
      console.log(message)
      const messageElement = document.createElement('li');
      messageElement.innerHTML = message.payloadString;
      messages.appendChild(messageElement);
      chart = Plot.plot({
        marks: [
          Plot.line(sales, {x: "date", y: "sales", stroke: "fruit"}),
          Plot.dot(sales, {x: "date", y: "sales", r: 10, fill: "white"}),
          Plot.text(sales, {x: "date", y: "sales", text: "sales"}),
          Plot.text(sales, Plot.selectLast({
            x: "date", y: "sales", text: "fruit", z: "fruit",
            textAnchor: "start", dx: 10, fontWeight: "bold"
          }))
        ],
        y: {axis: null, inset: 15},
        marginRight: 55
      });
      chartdiv.appendChild(chart);
    };
  
    pahoHandler.registerOnMessageArrived(onMessage);
  });