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
      <v-dialog v-model="dialog" max-width="50%">
        <v-btn slot="activator" color="primary" >New Customer</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout column>
                <v-flex>
                  <v-text-field v-model="editedItem.fullname" label="fullname"></v-text-field>
                </v-flex>
                <v-flex>
                  <v-text-field v-model="editedItem.phone" label="phone"></v-text-field>
                </v-flex>
                <v-flex>
                  <v-text-field v-model="editedItem.note" label="note"></v-text-field>
                </v-flex>
                 <v-flex>
                  <v-text-field v-model="editedItem.address" label="address"></v-text-field>
                </v-flex>
              </v-layout>
              
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table
      :headers="customer.headers"
      :items="customer.items"
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
      
      </template>
      <template slot="no-data">
        <v-btn color="primary" @click="getAllCustomer">Reset</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
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
        }
      ],
      items: []
    },
    desserts: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      fullname: "",
      phone: "",
      note: "",
      address:
        "Công viên phần mềm Quang Trung, Tân Chánh Hiệp, District 12, Ho Chi Minh City, Vietnam"
    },
    defaultItem: {
      id: 0,
      fullname: "",
      phone: "",
      note: "",
      address:
        "Công viên phần mềm Quang Trung, Tân Chánh Hiệp, District 12, Ho Chi Minh City, Vietnam"
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
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
              staff: customer.staff,
              driver: customer.driver,
              address: {
                latLng: null,
                main_address: customer.address,
                geocoding_address: ""
              }
            };
            self.$myStore.state.customer.push(cus);
          });
        })
        .catch(e => {
          self.loading = false;
          console.log(e);
        });
    },
    showAlert() {
      alert("Alert!");
    },
    editItem(item) {
      var self = this;
      console.log(item);
      self.$myStore.state.current_customer = item.id;
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

    deleteItem(item) {
      const index = this.desserts.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.desserts.splice(index, 1);
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>