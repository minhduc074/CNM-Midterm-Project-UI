<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>Sign Up</h1>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 mt-3>
          <v-layout column>
            <v-flex>
              <v-text-field
                name="fullname"
                label="Fullname"
                id="fullname"
                type="fullname"
                v-model="user.fullname"
                required></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                name="username"
                label="Username"
                id="username"
                type="username"
                v-model="user.username"
                required></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                name="password"
                label="Password"
                id="password"
                type="password"
                v-model="user.password"
                required></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                name="confirmPassword"
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                v-model="user.confirmPassword"
                required
                ></v-text-field>
            </v-flex>
            <select v-model="user.role">
                <option disabled value="">Please select role</option>
                <option>Admin</option>
                <option>Staff</option>
                <option>Driver</option>
            </select>
            <v-flex>
              <v-text-field
                v-if="user.role === 'Driver'" 
                name="phone"
                label="Phone"
                id="phone"
                type="phone"
                v-model="user.phone"
                required
                ></v-text-field>
            </v-flex>
            <v-flex>
              <select v-model="user.staff_role" v-if="user.role === 'Staff'">
                <option disabled value="">Please select role</option>
                <option>Request Receiver</option>
                <option>Location Identifier</option>
            </select>
            </v-flex>
            <v-flex class="text-xs-center" mt-5>
              <v-btn color="primary" type="submit" @click="SignUp">Sign Up</v-btn>
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
        fullname: "",
        username: "",
        password: "",
        confirmPassword: "",
        role: "",
        phone: "",
        staff_role: ""
      }
    };
  },
  methods: {
    SignUp() {
      const self = this;

      if (self.user.password != self.user.confirmPassword) {
        console.log("Password donot match");
        return;
      }

      var data = {
        fullname: self.user.fullname,
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
        if (self.user.staff_role == "Request Receiver") {
          data["role"] = 2;
        } else if (self.user.staff_role == "Location Identifier") {
          data["role"] = 1;
        } else {
          console.log("Staff Role error");
          return;
        }
      } else if (self.user.role == "Driver") {
        role_url = "driver";
        data["phone"] = self.user.phone;
      } else {
        console.log("Role error");
        return;
      }

      console.log(data);
      if (self.username != "" && self.password != "") {
        self.loading = true;
        self.$axios
          .post(self.$myStore.state.wepAPI.url + role_url + "/register/", data)
          .then(res => {
            console.log(res.data);
            self.$router.push("/Login");
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