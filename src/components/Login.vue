<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>Sign In</h1>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 mt-3>
          <v-layout column>
            <v-flex>
              <v-text-field
                placeholder="Username"
                id="username"
                type="text"
                v-model="user.username"
                required></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                label="Password"
                id="password"
                type="password"
                v-model="user.password"
                required></v-text-field>
            </v-flex>
            
                <select v-model="user.role">
                    <option disabled value="">Please select role</option>
                    <option>Admin</option>
                    <option>Staff</option>
                    <option>Driver</option>
                </select>
            
            <v-flex class="text-xs-center" mt-5>
              <v-btn color="primary" type="submit" @click="login">Sign In</v-btn>
            </v-flex>
          </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: "",
        password: "",
        role: ""
      }
    };
  },
  methods: {
    login() {
      const self = this;
      const data = {
        username: self.user.username,
        password: self.user.password
      };
      // checking if the input is valid
      //if (this.$refs.form.validate()) {

      var role_url = "";
      console.log("role: " + self.user.role);

      if (self.user.role == "Admin") role_url = "admin";
      else if (self.user.role == "Staff") {
        role_url = "staffs";
      } else if (self.user.role == "Driver") {
        role_url = "driver";
      } else {
        console.log("Role error");
        return;
      }

      if (self.username != "" && self.password != "") {
        self.loading = true;
        self.$axios
          .post(self.$myStore.state.wepAPI.url + role_url + "/login/", data)
          .then(res => {
            console.log(res.data);
            self.$myStore.state.user.username = res.data.username;
            self.$myStore.state.user.password = self.user.password;
            self.$myStore.state.user.fullname = res.data.fullname;
            self.$myStore.state.user.access_token = res.data.access_token;
            self.$myStore.state.user.refresh_token = res.data.refresh_token;
            self.$myStore.state.user.role = role_url;

            if (self.user.role == "Driver") {
              self.$myStore.state.user.phone = res.data.phone;
            } else {
              self.$myStore.state.user.staff_role = res.data.role;
              if (res.data.role == 0) {
                self.$myStore.state.user.staff_role = "admin";
              } else if (res.data.role == 1) {
                self.$myStore.state.user.staff_role = "identifier";
              } else if (res.data.role == 2) {
                self.$myStore.state.user.staff_role = "receiver";
              }
            }
            console.log(self.$myStore.state.user);
            self.$router.push(
              "/" + role_url + "/" + self.$myStore.state.user.staff_role
            );
          })
          .catch(e => {
            self.loading = false;
            console.log(e);
          });
      }
    }
  }
};
</script>