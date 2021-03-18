<template>
<div class="container mx-3 clickable">
  
  <v-card-title>
      <h3>Clients</h3>
      <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary darken-3 btn-white"
              class="mx-2"
              v-bind="attrs"
              v-on="on"
              small
              @click="clear"  
            >
              Add new
            </v-btn>
          </template>
<!-- form ###################################################### -->
          <v-card >
          <v-form   ref="form" lazy-validation0 @submit.prevent="save" > 
            <v-card-title class="mb-0" >
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
       
            <v-card-text class="my-0 py-0">
              <v-container class="my-0 py-0">
                <h3 class="mb-4">Select Avatar</h3>
                <v-row class="my-0 py-0 justify-center">
                  <a href='#target1' >
                    <v-avatar id='target1' size="70px" class="mx-2 target avatar" @click="editedItem.img='1.png'">
                      <img src="http://127.0.0.1:8000/avatar/1.png" >
                    </v-avatar>
                  </a>
                  <a href='#target2' >
                    <v-avatar id='target2' size="70px" class="mx-2 target avatar" @click="editedItem.img='2.png'">
                      <img src="http://127.0.0.1:8000/avatar/2.png" >
                    </v-avatar>
                  </a>
                  <a href='#target3' >
                    <v-avatar id='target3' size="70px" class="mx-2 target avatar" @click="editedItem.img='3.png'">
                      <img src="http://127.0.0.1:8000/avatar/3.png" >
                    </v-avatar>
                  </a>
                  <a href='#target4' >
                    <v-avatar id='target4' size="70px" class="mx-2 target avatar" @click="editedItem.img='4.png'">
                      <img src="http://127.0.0.1:8000/avatar/4.png" >
                    </v-avatar>
                  </a>
                  <a href='#target5' >
                    <v-avatar id='target5' size="70px" class="mx-2 target avatar" @click="editedItem.img='5.png'">
                      <img src="http://127.0.0.1:8000/avatar/5.png" >
                    </v-avatar>
                  </a>
                </v-row>
                <v-row class="my-0 py-0">
                  <v-col cols="12" >
                    <v-text-field
                      v-model="editedItem.name"
                      label="Name"
                      v-validate="'required'"  
                      :error-messages="errors.collect('Name')"
                      data-vv-name="Name"
                      hide-details="auto"
                    ></v-text-field>
                    <br>
                    <v-text-field
                      v-model="editedItem.phone"
                      label="Phone #"
                      v-validate="'required|digits:11'"  
                      :error-messages="errors.collect('phone')"
                      data-vv-name="phone"
                    ></v-text-field>
                    
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" outlined text @click="close"> Cancel</v-btn>
              <v-btn color="info" @click="save" >Save</v-btn>
            </v-card-actions>
          </v-form>
          </v-card>
        </v-dialog>
      <v-spacer></v-spacer>
      <v-col cols="3" >
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          @keydown.enter="searchProduct"
        ></v-text-field>
      </v-col>
    </v-card-title>

  <v-data-table
    :headers="headers"
    :items="clients"
    :search="search"
    sort-by="name"
    class="elevation-1"
    :loading="tblLoader"
    loading-text="Loading... Please wait"
  >
    
    <template v-slot:item.name="{ item }" >
      <v-row class="vertical-align: bottom;">
        <img
          width="50px"
          height="50px"
          class="mt-0 py-1 ml-2"
          :style="{backgroundSize: 'cover', backgroundPosition: 'center' }"
          :src="`http://127.0.0.1:8000/avatar/${item.img}`"
        >
        <strong class="mt-4 ml-3">{{item.name}}</strong>
      </v-row>
    </template>

    <template v-slot:top>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Do you want to delete this Client?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-3" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-3" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2 info--text" @click="editItem(item)">
        mdi-eye
      </v-icon>
      <v-icon small class="mr-2 info--text" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon small @click="deleteItem(item)" class=" info--text">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
  
    <v-snackbar
      v-model="snackbar"
      color="green darken-3"
      width="500px"
      class="px-5"
    >
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import {apiGetAllClients,apiUpdateClientData,apiCreateClient,apiDeleteClient,apiGetClient} from "@/api/client.api";

  export default {
    data: () => ({
      previewImage:require('@/assets/default.jpg'),
      search:'',
      snackbar:false,
      tblLoader:true,
      text:'Successfully Saved!',
      dialog: false,
      dialogDelete: false,
      headers: [
        // { text: 'Client ID', value: 'id' },
        {
          text: 'Client',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Phone #', value: 'phone' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      clients: [],
      editedIndex: -1,
      editedItem: {
        name:'',
        phone:'',
        img:''
        },
      defaultItem: {},
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Client' : 'Update Client'
      },
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },
 
    mounted () {
      this.editedItem.img = Math.floor(Math.random()*(5-1+1)+1)+'.png';
      this.initialize()
    },
    methods: {
      initialize () {
        apiGetAllClients().then(({data}) => {
          this.clients = data
          this.tblLoader=false
          console.log(data, 'clients')
        })
        
  
      },
      editItem (item) {
        this.editedIndex = this.clients.indexOf(item)
        this.dialog = true
        apiGetClient(item.id).then(({data}) => {
          this.editedItem = data
          this.previewImage=`http://127.0.0.1:8000/images/${data.img}`
        })
      },
      deleteItem (item) {
        this.editedIndex = this.clients.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      deleteItemConfirm () {
        apiDeleteClient(this.editedItem.id).then(()=>{
          this.text ="1 record successfully deleted!"
          this.snackbar=true
          this.tblLoader=true
          this.closeDelete()
          this.initialize()
        })
      },
      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        
        if (this.editedIndex > -1) {
          apiUpdateClientData(this.editedItem,this.editedItem.id).then(() => {
            this.text ="Updated Successfully!"
            this.snackbar=true
            this.tblLoader=true
            this.close()
            this.initialize()
          })
        } else {
          
            this.$validator.validateAll().then(result => {
              if (result){
                apiCreateClient(this.editedItem).then(() => {
                  this.snackbar=true
                  this.tblLoader=true
                  this.close()
                  this.initialize()
                })
              }
            });
        }
        
      },
    
      clear(){
        this.previewImage=require('@/assets/default.jpg')
      }
   
       
    },
  }
</script>


<style scoped>
.btn-white{
  color:white !important;
}
 .uploading-image{
     display:flex;
   }
  .avatar:hover{
    transform: scale(1.2);
    transition: all .3s ease-in-out;
    -webkit-box-shadow: 0 5px 10px #777;
    -moz-box-shadow: 0 5px 10px #777;
    box-shadow: 0 5px 10px #777;
  }

  .avatar{
    transition: all .4s ease-in-out;
    cursor: pointer;
  }

:target {
  transform: scale(1.2);
    transition: all .3s ease-in-out;
    -webkit-box-shadow: 0 5px 10px #777;
    -moz-box-shadow: 0 5px 10px #777;
    box-shadow: 0 5px 10px #777;
    border:1px solid rgb(15, 190, 94);
}
</style>