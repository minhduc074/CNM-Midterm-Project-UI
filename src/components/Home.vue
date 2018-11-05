<template>
  <div class="hello">
    <h1>The count is: {{ count }}</h1>
    <button @click='doIncrement' >Increment</button>

    <h1>The count is: {{ username }}</h1>
    <button @click='changeUsername' >changeUsername</button>
  </div>
</template>

<script>
export default {
  name: 'hello',
  computed: {
    count () {
      return this.$myStore.state.count;
    },
    username(){
        return this.$myStore.state.user.username;
    }
  },
  methods: {
    doIncrement () {
      this.$myStore.commit('increment');
    },
    changeUsername () {
      this.$myStore.state.user.username = "asdxcvxvgfdt"
    }
  }
}
</script>
