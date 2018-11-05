<template>

</template>

<script>
console.log(1234);

export default {
  data() {
    return {
      ret: this.logout()
    };
  },
  methods: {
    logout() {
      var self = this;

      console.log("Logout");
      self.$myStore.state.user.username = "";
      self.$myStore.state.user.password = "";
      self.$myStore.state.user.fullname = "";
      self.$myStore.state.user.access_token = "";
      self.$myStore.state.user.refresh_token = "";
      self.$router.push("/");
    }
  }
};
</script>
