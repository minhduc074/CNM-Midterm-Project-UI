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
            
                <select v-model="role">
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
        password: ""
      },
      role: ""
    };
  },
  methods: {
        login() {
            const self = this;
            const data = {"username": self.user.username, "password": self.user.password};
          // checking if the input is valid
            //if (this.$refs.form.validate()) {
            
            if (1) {
              self.loading = true;
              self.$axios.post('http://localhost:3000/staffs/login/', data).then(res => {
                console.log(res.data);
                this.$myStore.state.user = res.data;
                self.$router.push('/');
              }).catch(e => {
                self.loading = false;
                console.log(e);
              })
            }
            
        }
    }
};
</script>