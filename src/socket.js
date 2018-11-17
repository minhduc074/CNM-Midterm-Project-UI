/*
import Vue from "vue";

const socket = new WebSocket("wss://localhost:40510");

const emitter = new Vue({
  methods: {
    send(message) {
      console.log(message);
      console.log(socket);
      if (1 === socket.readyState) 
      socket.send(message);
    }
  }
});

socket.onmessage = function(msg) {
  console.log(msg);
  emitter.$emit("message", msg.data);
};
socket.onerror = function(err) {
  emitter.$emit("error", err);
};

export default emitter;
*/