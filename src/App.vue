<template>
<v-app>
    <v-navigation-drawer v-model="sidebar" app>
        <v-list>
            <v-list-tile v-for="item in menuItems" :key="item.title" :to="item.path">
                <v-list-tile-action>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>{{ item.title }}</v-list-tile-content>
            </v-list-tile>
        </v-list>
    </v-navigation-drawer>

    <v-toolbar app>
        <span class="hidden-sm-and-up">
        <v-toolbar-side-icon @click="sidebar = !sidebar">
        </v-toolbar-side-icon>
      </span>
        <v-toolbar-title>
            <router-link to="/" tag="span" style="cursor: pointer">
                {{ appTitle }}
            </router-link>
        </v-toolbar-title>
        <v-toolbar-items class="hidden-xs-only">
            <v-btn flat v-for="item in menuItems" :key="item.title" :to="item.path">
                <v-icon left dark>{{ item.icon }}</v-icon>
                {{ item.title }}
            </v-btn>
        </v-toolbar-items>
    </v-toolbar>

    <v-content>
        <router-view></router-view>
    </v-content>

</v-app>
</template>

<script>
import io from "socket.io-client";
export default {
  data() {
    return {
      appTitle: "Car Booking",
      sidebar: false,
      menuItems: this.getMenu(),
      user: this.$myStore.state.user.username,
      messages: [],
      socket: io("localhost:3001")
    };
  },
  methods: {
    getMenu() {
      var self = this;
      var menu = [];

      menu.push({
        title: "Home",
        path:
          "/" +
          self.$myStore.state.user.role +
          "/" +
          self.$myStore.state.user.staff_role,
        icon: "home"
      });
      if (self.$myStore.state.user.username == "") {
        menu.push({
          title: "Sign Up",
          path: "/signup",
          icon: "face"
        });
        menu.push({
          title: "Sign In",
          path: "/Login",
          icon: "lock_open"
        });
      } else {
        menu.push({
          title: self.$myStore.state.user.fullname,
          path: "/user",
          icon: "face"
        });
        menu.push({
          title: "Logout",
          path: "/logout",
          icon: "lock_open"
        });
      }
      return menu;
    },
    sendRegister() {
      console.log("REGISTER: " + this.user);
      this.socket.emit("REGISTER", {
        username: this.user,
        role: this.$myStore.state.user.role
      });
    },
    customer_status_id2str(id) {
      console.log("customer_status_id2str: id=" + id);
      var self = this;
      var ret = "";
      console.log(self.$myStore.state.customer_status);
      self.$myStore.state.customer_status.forEach(element => {
        if (id === element.id) {
          console.log("customer_status_id2str: returning: " + element.text);
          ret = element.text;
        }
      });
      return ret;
    }
  },
  computed: {
    username() {
      var self = this;
      return self.$myStore.state.user.username;
    },
    fullname() {
      var self = this;
      return self.$myStore.state.user.fullname;
    },
    staff_role() {
      var self = this;
      return self.$myStore.state.user.staff_role;
    }
  },
  watch: {
    username(newUsername, old_username) {
      console.log(old_username + " => " + newUsername);
      this.menuItems = this.getMenu();
      (this.user = this.$myStore.state.user.username), this.sendRegister();
    },
    fullname(newFullname, oldFullname) {
      console.log(oldFullname + " => " + newFullname);
      this.menuItems = this.getMenu();
    },
    staff_role(newstaff_role, oldstaff_role) {
      console.log(oldstaff_role + " => " + newstaff_role);

      this.menuItems = this.getMenu();
    }
  },
  mounted() {
    this.socket.on("MESSAGE", data => {
      console.log("Receive MESSAGE event: ");
      console.log(data);
      //this.messages = [...this.messages, data];
      // you can also do this.messages.push(data)
    });

    this.socket.on("UPDATE", data => {
      var self = this;
      console.log("Receive UPDATE event: ");
      console.log(data);
      var json = JSON.parse(data);
      console.log(json.topic);
      // you can also do this.messages.push(data)
      if (json.topic == "driver") {
        if (json.event == "new_customer") {
          console.log("New customer event");
          self.$myStore.state.driver_customer = json.customer;
          self.$myStore.state.driver_customer_rejected = json.driver;
        }
      } else if (json.topic == "customer") {
        if (json.event == "new") {
          console.log("New customer event");
          var cus = json.customer;
          cus.address = {
            latLng: json.customer.geocoding,
            main_address: json.customer.address,
            geocoding_address: json.customer.geocoding
          };
          self.$myStore.state.customer.push(cus);
          self.$myStore.state.customer_update_count++;
          console.log(self.$myStore.state.customer);
        } else if (json.event == "update_status") {
          var cus = json.customer;
          self.$myStore.state.customer.forEach(c => {
            if (c.id == cus.id) {
              c.status = self.customer_status_id2str(cus.status);
              self.$myStore.state.customer_update_count++;
            }
          });

          console.log(self.$myStore.state.customer);
        } else if (json.event == "update_address") {
          var cus = json.customer;
          self.$myStore.state.customer.forEach(c => {
            if (c.id == cus.id) {
              c.address.geocoding_address = cus.address;
              c.address.latLng = JSON.parse(cus.address);
              self.$myStore.state.customer_update_count++;
            }
          });

          console.log(self.$myStore.state.customer);
        } else if (json.event == "update_note") {
        } else if (json.event == "update_staff") {
          var cus = json.customer;
          self.$myStore.state.customer.forEach(c => {
            if (c.id == cus.id) {
              c.address.staff = cus.staff;
              self.$myStore.state.customer_update_count++;
            }
          });

          console.log(self.$myStore.state.customer);
        } else if (json.event == "update_driver") {
          var cus = json.customer;
          self.$myStore.state.customer.forEach(c => {
            if (c.id == cus.id) {
              c.driver = cus.driver;
              self.$myStore.state.customer_update_count++;
            }
          });

          console.log(self.$myStore.state.customer);
        }
      } else if (json.topic == "staff") {

      }
    });
  }
};
</script>
