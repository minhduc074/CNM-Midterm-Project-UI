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
      <br>
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
      <br/>

    </div>
    <br>
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
      new_address_str: ""
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
        lat: parseFloat(addr.lat),
        lng: parseFloat(addr.lng)
      };

      // var sampleLocation = { lat: 1.39, lng: 103.8 };

      return new Promise(function(resolve, reject) {
        geocoder.geocode({ location: locationss }, function(results, status) {
          if (status === "OK") {
            if (results[0]) {
              return results[0].formatted_address;
            } else {
              console.log(status);
              window.alert("No results found");
              return null;
            }
          }
        });
      }).then(data => {
        console.log(data);
        self.new_address_str = data;
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
      self.address_str = self.$myStore.state.customer.main_address;
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
      reverse_geocoder();
    }
  }
};
</script>