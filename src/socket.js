import Vue from "vue";

const socket = new WebSocket("wss://localhost:3000");

const emitter = new Vue({
  methods: {
    send(message) {
      console.log(message);
      console.log(this.$socket);
      if (1 === this.$socket.readyState) this.$socket.send(message);
    }
  }
});

socket.onmessage = function(msg) {
  emitter.$emit("message", msg.data);
};
socket.onerror = function(err) {
  emitter.$emit("error", err);
};

export default emitter;
