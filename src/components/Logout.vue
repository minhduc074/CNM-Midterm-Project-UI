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

      const data = {"username": self.$myStore.state.user.username, "password": self.$myStore.state.user.password};
      let config = {
          headers: {
            "x-access-token": self.$myStore.state.user.access_token,
          }
        }
        console.log(config);
      self.loading = true;
      self.$axios
        .post(
          self.$myStore.state.wepAPI.url +
            self.$myStore.state.user.role +
            "/logout/",
          data, config
        )
        .then(res => {
          console.log(res.data);

          self.$myStore.state.user.username = "";
          self.$myStore.state.user.password = "";
          self.$myStore.state.user.fullname = "";
          self.$myStore.state.user.access_token = "";
          self.$myStore.state.user.refresh_token = "";
          self.$myStore.state.user.role = "";

          console.log(self.$myStore.state.user);
          self.$router.push("/");
        })
        .catch(e => {
          self.$myStore.state.user.username = "";
          self.$myStore.state.user.password = "";
          self.$myStore.state.user.fullname = "";
          self.$myStore.state.user.access_token = "";
          self.$myStore.state.user.refresh_token = "";
          self.$myStore.state.user.role = "";

          self.loading = false;
          console.log(e);
          self.$router.push("/");
        });
    }
  }
};
</script>
