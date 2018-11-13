<template>
<div>
    <v-toolbar flat color="white">
      <v-toolbar-title>My CRUD</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
    </v-toolbar>
  <v-data-table
    v-model="customer.selected"
    :headers="customer.headers"
    :items="customer.items"
    hide-actions
    class="elevation-1"
  >
    <template slot="items" slot-scope="props">
      <td>{{ props.item.id }}</td>
      <td class="text-xs-left">{{ props.item.fullname }}</td>
      <td class="text-xs-left">{{ props.item.phone }}</td>
      <td class="text-xs-left">{{ props.item.address.main_address }}</td>
      <td class="text-xs-left">{{ props.item.note }}</td>
      <td class="text-xs-left">{{ props.item.status }}</td>
      <td class="text-xs-left">{{ props.item.staff }}</td>
      <td class="text-xs-left">{{ props.item.driver }}</td>
      <td class="justify-center layout px-0">
          <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          >
            edit
          </v-icon>
        </td>
    </template>
  </v-data-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      customer: {
        selected: [],
        headers: [
          {
            text: "ID",
            align: "left",
            sortable: true,
            value: "id"
          },
          {
            text: "Customer name",
            align: "left",
            sortable: false,
            value: "fullname"
          },
          {
            text: "Phone",
            align: "left",
            sortable: false,
            value: "phone"
          },
          {
            text: "Address",
            align: "left",
            sortable: false,
            value: "address"
          },
          {
            text: "Note",
            align: "left",
            sortable: false,
            value: "note"
          },
          {
            text: "status",
            align: "left",
            sortable: true,
            value: "status"
          },
          {
            text: "staff",
            align: "left",
            sortable: true,
            value: "staff"
          },
          {
            text: "driver",
            align: "left",
            sortable: true,
            value: "driver"
          },
          {
            text: "action",
            align: "left",
            sortable: false,
            value: "name"
          }
        ],
        items: []
      }
    };
  },
  mounted() {
    this.getAllCustomer();
  },
  methods: {
    getAllCustomer() {
      var self = this;
      self.loading = true;
      self.$axios
        .get(self.$myStore.state.wepAPI.url + "customer/")
        .then(res => {
          console.log(res.data);
          self.$myStore.state.customer = [];
          self.customer.items = self.$myStore.state.customer;
          res.data.forEach(customer => {
            var cus = {
              id: customer.id,
              fullname: customer.fullname,
              phone: customer.phone,
              note: customer.note,
              status: self.customer_status_id2str(customer.status),

              status_text: "",
              staff: customer.staff,
              driver: customer.driver,
              address: {
                latLng: null,
                main_address: customer.address,
                geocoding_address: ""
              }
            };
            //cus.status = self.customer_status_id2str(customer.status);

            self.$myStore.state.customer.push(cus);
          });
        })
        .catch(e => {
          self.loading = false;
          console.log(e);
        });
    },
    editItem(item) {
      var self = this;
      console.log(item);
      self.$myStore.state.current_customer = item.id;
      self.update_staff(item);
      self.update_status(item, 1);
      self.$router.push("/staffs/Identifier/maps");
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
    },
    update_staff(customer) {
      var self = this;
      var data = { id: customer.id, staff: self.$myStore.state.user.username };

      self.loading = true;
      self.$axios
        .post(self.$myStore.state.wepAPI.url + "customer/staff", data)
        .then(res => {
          console.log(res.data);
        })
        .catch(e => {
          self.loading = false;
          console.log(e);
        });
    },
    update_status(customer, status) {
      var self = this;
      var data = { id: customer.id, status: status };

      self.loading = true;
      self.$axios
        .post(self.$myStore.state.wepAPI.url + "customer/status", data)
        .then(res => {
          console.log(res.data);
        })
        .catch(e => {
          self.loading = false;
          console.log(e);
        });
    }
  }
};
</script>