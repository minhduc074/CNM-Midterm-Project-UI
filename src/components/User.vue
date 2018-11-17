<template>

  <v-container fill-height>
    <v-layout justify-center align-center v-if="profile">
      
      <v-flex xs12 sm8 md8 style="max-width: 600px">
        <v-card >
          <v-toolbar dark color="primary">
            <v-toolbar-title>Profile</v-toolbar-title>               
          </v-toolbar>

         
          <v-flex class="ml-3 my-4">
            <v-avatar size="75px" class="mr-2" >
                        <img
                        class="img-circle elevation-2 "
                        src="https://raw.githubusercontent.com/vuetifyjs/docs/dev/static/doc-images/lists/1.jpg"
                        >
                    </v-avatar>
                    
                    <v-btn color="primary" >Upload</v-btn>
                    <v-btn>Delete</v-btn> 
          </v-flex>
          
          <v-spacer></v-spacer>
          <v-divider></v-divider>
          <v-spacer></v-spacer>
          <v-card-text>
            <v-form>
              <v-text-field 
                prepend-icon="person" 
                required 
                v-model="profile.fullname" 
                name="fullname" 
                label="Full Name" 
                type="text">
              </v-text-field>
              <v-text-field 
                v-if="user" 
                prepend-icon="face" 
                required 
                v-model="user.username" 
                name="username" 
                label="Username" 
                type="username">
              </v-text-field>
              <v-text-field 
                v-if="user" 
                prepend-icon="lock" 
                required 
                v-model="user.password" 
                name="password" 
                label="Password" 
                type="password">
              </v-text-field>

              <v-text-field 
                v-if="user && user.role === 'driver'" 
                prepend-icon="phone" 
                required 
                v-model="user.phone" 
                name="phone" 
                label="Phone" 
                type="phone" >
              </v-text-field>

              <!--
              <v-text-field 
                v-model="this.profile.id" 
                hint="Create a unique URL for your profile. Many people use their first and last name. <br> [Ex: reel.ly/misha.collins]"
                persistent-hint
                id="username"  
                prepend-icon="link" 
                name="username" 
                required
                label="Profile URL " 
                type="text">
              </v-text-field>
              -->
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- <p class="red-text center" v-if="feedback">{{ feedback }}</p> -->
            <v-btn flat @click.native="updatemyProfile" color="primary">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
export default {
  data() {
    const self = this;
    return {
      user: {
        username: self.$myStore.state.user.username,
        password: self.$myStore.state.user.password,
        role: self.$myStore.state.user.role,
        phone: self.$myStore.state.user.phone
      },
      profile: {
        fullname: self.$myStore.state.user.fullname
      }
    };
  },
  methods: {
    updatemyProfile() {
      const self = this;
      const data = {
        username: self.user.username,
        password: self.user.password,
        fullname: self.profile.fullname
      };
      // checking if the input is valid
      //if (this.$refs.form.validate()) {

      if (self.user.role == "driver") {
        data["phone"] = self.user.phone;
      }

      let config = {
          headers: {
            "x-access-token": self.$myStore.state.user.access_token,
          }
        }
        console.log(config);

      self.loading = true;
      self.$axios
        .post(
          self.$myStore.state.wepAPI.url + self.user.role + "/update/",
          data, config
        )
        .then(res => {
          console.log(res.data);
          self.$myStore.state.user.username = res.data.username;
          self.$myStore.state.user.password = self.user.password;
          self.$myStore.state.user.fullname = self.profile.fullname;
          if (self.$myStore.state.user.role == "driver") {
            self.$myStore.state.user.phone = self.user.phone;
          }
          console.log(self.$myStore.state.user);
          self.$router.push("/");
        })
        .catch(e => {
          self.loading = false;
          console.log(e);
          if(e.response.status == 401 || e.response.status == 403)
              self.silence_login();
        });
    },
    silence_login() {
      var self = this;
      const data = {
        username: self.$myStore.state.user.username,
        password: self.$myStore.state.user.password
      };
      console.log("silence_login");
      var role_url = self.$myStore.state.user.role;
      if (
        self.$myStore.state.user.username != "" &&
        self.$myStore.state.user.password != ""
      ) {
        self.loading = true;
        self.$axios
          .post(self.$myStore.state.wepAPI.url + role_url + "/login/", data)
          .then(res => {
            console.log(res.data);
            self.$myStore.state.user.fullname = res.data.fullname;
            self.$myStore.state.user.access_token = res.data.access_token;
            self.$myStore.state.user.refresh_token = res.data.refresh_token;
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