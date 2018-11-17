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
        <h3>
        Enter Customer addres: 
        <gmap-autocomplete
          @place_changed="setPlace">
        </gmap-autocomplete>
        </h3>
        
      </label>
      <label>
        <v-text-field v-model="new_address_str" placeholder="New Address">
        </v-text-field>
      </label>
      <v-flex class="text-xs-center" mt-5>
        <v-btn color="primary" type="submit" @click="Save">Save</v-btn>
      </v-flex>

    </div>
    <gmap-map
      :center="center"
      :zoom="15"
      style="width:100%;  height: 600px;"
      @click="clicked"
    >
    <GmapMarker v-if="markers" :position="markers" label="C" :center="center"/>
    <GmapMarker v-if="latLng" :position="latLng" label="N" :center="center"/>

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
      index_customer: this.getIndexCustomer()
    };
  },

  mounted() {
    this.getCustomerAddress();
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
    reverse_geocoder() {
      var self = this;

      var geocoder = new google.maps.Geocoder();

      var locationss = {
        lat: self.latLng.lat(),
        lng: self.latLng.lng()
      };

      console.log(locationss);
      // var sampleLocation = { lat: 1.39, lng: 103.8 };
      geocoder.geocode({ location: locationss }, function(results, status) {
        console.log(results[0]);
        if (status === "OK") {
          if (results[0]) {
            console.log(status);
            console.log(results[0].formatted_address);
            self.new_address_str = results[0].formatted_address;
            self.$myStore.state.customer[
              self.index_customer
            ].geocoding_address = self.new_address_str;
          } else {
            console.log(status);
            window.alert("No results found");
            return null;
          }
        }
      });
    },
    getCustomerAddress: function() {
      var self = this;
      /*
      self.places = self.$myStore.state.main_address;
      self.center = {
        lat: self.$myStore.state.latLng.lat,
        lng: self.$myStore.state.latLng.lng
      };
      */
      console.log(this.$myStore.state.current_customer);
      self.address_str =
        self.$myStore.state.customer[self.index_customer].address.main_address;

      console.log(self.$myStore.state.customer);
      console.log(self.address_str);

      navigator.geolocation.getCurrentPosition(position => {
        self.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    },
    clicked(e) {
      var self = this;
      console.log(e.latLng);
      self.latLng = e.latLng;
      self.reverse_geocoder();
    },
    Save() {
      var self = this;
      self.UpdateAddress();
      self.UpdateStatus(2);

      self.$router.push("/staffs/Identifier/");
    },
    UpdateAddress() {
      const self = this;
      const data = {
        address: JSON.stringify(self.latLng),
        lat: self.latLng.lat(),
        lng: self.latLng.lng(),
        id: self.index_customer
      };
      // checking if the input is valid
      //if (this.$refs.form.validate()) {

      console.log(data);
      if (self.username != "" && self.password != "") {
        let config = {
          headers: {
            "x-access-token": self.$myStore.state.user.access_token,
          }
        }
        console.log(config);
        self.loading = true;
        self.$axios
          .post(self.$myStore.state.wepAPI.url + "customer/address/", data, config)
          .then(res => {
            console.log(res.data);
          })
          .catch(e => {
            self.loading = false;
            console.log(e);
          });
      }
    },
    UpdateStatus(status) {
      const self = this;
      const data = {
        status: status,
        id: self.$myStore.state.current_customer
      };
      // checking if the input is valid
      //if (this.$refs.form.validate()) {

      if (self.username != "" && self.password != "") {
        let config = {
          headers: {
            "x-access-token": self.$myStore.state.user.access_token,
          }
        }
        console.log(config);
        self.loading = true;
        self.$axios
          .post(self.$myStore.state.wepAPI.url + "customer/status/", data, config)
          .then(res => {
            console.log(res.data);
          })
          .catch(e => {
            self.loading = false;
            console.log(e);
          });
      }
    },
    getIndexCustomer() {
      var self = this;
      var ret = 0;

      console.log(
        "Current customer ID: " + self.$myStore.state.current_customer
      );
      console.log("customer count: " + self.$myStore.state.customer.length);

      for (var i = 0; i < self.$myStore.state.customer.length; i++) {
        if (
          self.$myStore.state.customer[i].id ==
          self.$myStore.state.current_customer
        )
          ret = i;
      }
      console.log("getIndexCustomer returned: " + ret);
      return ret;
    }
  }
};
</script>