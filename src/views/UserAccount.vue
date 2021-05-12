<template>
<div class="container mx-3 clickable" v-if="$store.getters.user.access_level < 2">
  
  <v-card-title>
      <h3>User Accounts</h3>
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
              REGISTER
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
                <v-row class="my-0 py-0">
                  <v-col cols="12" >
                    <v-select
                    label="Account Type"
                    :items="account_types"
                    :item-text="account_types.text"
                    :item-value="account_types.value"
                     v-validate="'required'"  
                      :error-messages="errors.collect('Account Type')"
                      data-vv-name="Account Type"
                      v-model="editedItem.access_level"
                    >
                    </v-select>  
                    <v-text-field
                      v-model="editedItem.name"
                      label="Name"
                      v-validate="'required|min:3'"  
                      :error-messages="errors.collect('Name')"
                      data-vv-name="Name"
                    ></v-text-field>
                   
                    <v-text-field
                      v-model="editedItem.email"
                      label="Username or Email"
                      v-validate="'required|min:4'"  
                      :error-messages="errors.collect('email')"
                      data-vv-name="email"
                    ></v-text-field>
                
                    <v-text-field
                      v-model="editedItem.password"
                      label="Password"
                      v-validate="'required'"  
                      type="password"
                      :error-messages="errors.collect('password')"
                      data-vv-name="password"
                      ref="password"
                    ></v-text-field>
                    <v-text-field
                      v-model="editedItem.password_confirmation"
                      label="Confirm Password"
                      type="password"
                      v-validate="'required|confirmed:password'"  
                      :error-messages="errors.collect('confirm password')"
                      data-vv-name="confirm password"
                    ></v-text-field>
                    <div class="error--text" style="text-align:center;">
                        <span  v-if="error">{{error}}</span>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" outlined text @click="close"> Cancel</v-btn>
              <v-btn color="info" @click="save" >Submit</v-btn>
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
    :items="users"
    :search="search"
    sort-by="name"
    class="elevation-1"
    :loading="tblLoader"
    loading-text="Loading... Please wait"
  >
    
    

    <template v-slot:top>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Do you want to delete this User?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-3" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-3" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </template>
    <template v-slot:item.access_level="{ item }">
      {{ item.access_level == 0 ? 'Super Admin' : (item.access_level == 1 ? 'Admin' : 'Employee') }}
    </template>

    <template v-slot:item.actions="{ item }">
  
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
  <div v-else>
      <v-alert
        outlined
        type="error"
        class="mt-16 "
      >
        <strong >You are restricted to access this page!</strong>
      </v-alert>
    </div>
</template>
<script>
import {apiGetAllUsers,apiCreateUser,apiGetUser,apiDeleteUser,apiUpdateUser } from "@/api/user.api";

  export default {
    data: () => ({
      error:'',
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
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Username/Email', value: 'email' },
        { text: 'Account Type', value: 'access_level' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      users: [],
      editedIndex: -1,
      editedItem: {
          name: '',
          email: '',
          password: '',
          password_confirmation: '',
          access_level: '',
      },
      defaultItem: {},
      account_types:[
        //   {text:'Super Admin', value: 0},
          {text:'Admin', value: 1},
          {text:'Employee', value: 2},
      ]
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Register Account' : 'Update account'
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
      this.initialize()
    },
    methods: {
      initialize () {
        apiGetAllUsers().then(({data}) => {
          this.users = data
          this.tblLoader=false
          console.log(data, 'users')
        })
        
  
      },
      editItem (item) {
        this.editedIndex = this.users.indexOf(item)
        this.dialog = true
        apiGetUser(item.id).then(({data}) => {
          this.editedItem = data
        })
      },
      deleteItem (item) {
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      deleteItemConfirm () {
        apiDeleteUser(this.editedItem.id).then(()=>{
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
          
            this.$validator.validateAll().then(result => {
                if (result){
                    apiUpdateUser(this.editedItem,this.editedItem.id).then(() => {
                        this.text ="Updated Successfully!"
                        this.snackbar=true
                        this.tblLoader=true
                        this.close()
                        this.initialize()
                    })
                }
            });
        } else {
          
            this.$validator.validateAll().then(result => {
              if (result){
                apiCreateUser(this.editedItem).then(() => {
                  this.snackbar=true
                  this.tblLoader=true
                  this.text ="Created Successfully!"
                  this.close()
                  this.initialize()
                }).catch(({response}) => {
                    this.error = response.data.errors.email[0]
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