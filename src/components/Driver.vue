<template>
  <div>
    <div>
      <v-flex>
      <h3>
        Customer addres: 
        </h3>
        <v-text-field v-model="address_str">
        </v-text-field>
      
      </v-flex>
      <label>
        
      </label>
      <label>
        <h3>
        Driver addres: 
        </h3>
        <v-text-field v-model="new_address_str" placeholder="Driver Address">
        </v-text-field>
      </label>
      <v-flex class="text-xs-center" mt-5>
        <v-btn color="primary" type="submit" @click="Save">Save</v-btn>
      </v-flex>
      <v-dialog v-model="dialog" max-width="50%">
        <v-btn slot="activator" color="primary" >New Customer</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">New Customer</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout column>
                <v-flex>
                  <v-text-field v-model="this.$myStore.state.driver_customer.fullname" label="fullname"></v-text-field>
                </v-flex>
                <v-flex>
                  <v-text-field v-model="this.$myStore.state.driver_customer.phone" label="phone"></v-text-field>
                </v-flex>
                <v-flex>
                  <v-text-field v-model="this.$myStore.state.driver_customer.note" label="note"></v-text-field>
                </v-flex>
                 <v-flex>
                  <v-text-field v-model="this.$myStore.state.driver_customer.address" label="address"></v-text-field>
                </v-flex>
              </v-layout>
              
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click.native="Accept">Accept</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </div>
    <gmap-map
      :center="center"
      :zoom="15"
      style="width:100%;  height: 600px;"
      @click="clicked"
    >
    <GmapMarker v-if="markers" :position="markers" label="C" :center="center"/>
    <GmapMarker v-if="latLng" :position="latLng" label="D" :center="center"/>

    </gmap-map>
  </div>
</template>

<script>
export default {
  name: "GoogleMap",
  data() {
    return {
      // default to Montreal to keep it simple
      // change this to whatever makes sense
      center: { lat: 0, lng: 0 },
      markers: null,
      places: [],
      currentPlace: null,
      latLng: null,
      address_str: "",
      new_address_str: "",
      dialog: null
    };
  },

  mounted() {
    //this.getCustomerAddress();
    this.getDriverAddress();
  },

  methods: {
    // receives a place object via the autocomplete component
    setPlace(place) {
      var self = this;
      self.currentPlace = place;
      self.addMarker();
      self.geocoder();
    },
    addMarker() {
      var self = this;
      if (self.currentPlace) {
        const marker = {
          lat: self.currentPlace.geometry.location.lat(),
          lng: self.currentPlace.geometry.location.lng()
        };
        self.markers = marker;
        self.places.push(self.currentPlace);
        self.center = marker;
      }
    },
    geocoder() {
      var self = this;
      var geocoder = new google.maps.Geocoder();
      var address = self.currentPlace.formatted_address;
      console.log(self.currentPlace);

      geocoder.geocode({ address: address }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          self.latLng = self.markers;
          self.latLng.lat = results[0].geometry.location.lat();
          self.latLng.lng = results[0].geometry.location.lng();

          console.log(self.latLng);
          // initialize(latitude,longitude);
        }
      });
    },
    reverse_geocoder(locationss) {
      console.log("reverse_geocoder");
      var self = this;

      var geocoder = new google.maps.Geocoder();
      console.log("latLng: " + self.latLng);

      console.log("locationss: " + locationss);
      // var sampleLocation = { lat: 1.39, lng: 103.8 };
      geocoder.geocode({ location: locationss }, function(results, status) {
        console.log(results[0]);
        if (status === "OK") {
          if (results[0]) {
            console.log(status);
            console.log(results[0].formatted_address);
            self.new_address_str = results[0].formatted_address;
            self.$myStore.state.driver_customer.geocoding_address = self.new_address_str;
          } else {
            console.log(status);
            window.alert("No results found");
            return null;
          }
        }
      });
    },
    getCustomerAddress: function() {
      console.log("getCustomerAddress");
      var self = this;
      /*
      self.places = self.$myStore.state.main_address;
      self.center = {
        lat: self.$myStore.state.latLng.lat,
        lng: self.$myStore.state.latLng.lng
      };
      */
      console.log(self.$myStore.state.driver_customer);
      self.address_str =
        self.$myStore.state.driver_customer.address;

      console.log(self.address_str);

        self.markers = JSON.parse(self.$myStore.state.driver_customer.geocoding);
    },
    getDriverAddress() {
      var self = this;
      console.log("getDriverAddress");
      navigator.geolocation.getCurrentPosition(position => {
        self.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        self.latLng = self.center;
        console.log("latLng" + self.latLng);
        self.reverse_geocoder(self.latLng);
      });
    },
    clicked(e) {
      var self = this;
      console.log(e.latLng);
      self.latLng = e.latLng;
      var location = {
        lat: self.latLng.lat(),
        lng: self.latLng.lng()
      };
      self.reverse_geocoder(location);
      self.UpdateAddress();
    },
    Save() {
      var self = this;
      self.UpdateAddress();
      //self.UpdateCustomerStatus(2);
    },
    UpdateAddress() {
      console.log("UpdateAddress");
      const self = this;
      const data = {
        address: self.new_address_str,
        geocoding_address: JSON.stringify(self.latLng),
        username: "driver1",
        //username: self.$myStore.state.user.username
        lat: self.latLng.lat(),
        lng: self.latLng.lng()
      };
      // checking if the input is valid
      //if (this.$refs.form.validate()) {

      console.log(data);
      if (self.username != "" && self.password != "") {
        self.loading = true;
        self.$axios
          .post(self.$myStore.state.wepAPI.url + "driver/address/", data)
          .then(res => {
            console.log(res.data);
          })
          .catch(e => {
            self.loading = false;
            console.log(e);
          });
      }
    },
    UpdateCustomerStatus(status) {
      const self = this;
      var data = {
        status: status,
        id: self.$myStore.state.current_customer
      };
      // checking if the input is valid
      //if (this.$refs.form.validate()) {

      if (self.username != "" && self.password != "") {
        self.loading = true;
        self.$axios
          .post(self.$myStore.state.wepAPI.url + "customer/status/", data)
          .then(res => {
            console.log(res.data);
          })
          .catch(e => {
            self.loading = false;
            console.log(e);
          });
      }
    },
    UpdateCustomerFromServer() {
      var self = this;
      self.address_str = self.$myStore.state.driver_customer.address;
      console.log("UpdateCustomerFromServer: " );
      console.log(self.$myStore.state.driver_customer);
    self.getCustomerAddress()

    },

    close() {
      self.$myStore.state.driver_customer = {};
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    Accept() {
      this.UpdateCustomerFromServer();
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
  },
  computed: {},

  watch: {
    customer(new_customer, old_customer) {
      console.log(old_customer + " => " + new_customer);
      if(new_customer != {})
      {
        this.dialog = true;
      }
      
      
    }
  },
  computed: {
    customer() {
      var self = this;
      return self.$myStore.state.driver_customer;
    },
  }
};
</script>