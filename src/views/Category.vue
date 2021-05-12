<template>
<div class="container mx-3" v-if="$store.getters.user.access_level < 2">
  <v-card-title>
      <h3>Products Category</h3>
      <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary darken-3 btn-white"
              class="mx-2"
              v-bind="attrs"
              v-on="on"
              small           
            >
              Add new
            </v-btn>
          </template>
<!-- form ###################################################### -->
          <v-card >
          <v-form   ref="form" lazy-validation0> 
            <v-card-title class="mb-0" >
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text class="my-0 py-0">
              <v-container class="my-0 py-0">
                <v-row class="my-0 py-0">
                  <v-col cols="12" >
                    <v-text-field
                      v-model="editedItem.name"
                      label="Category name"
                    ></v-text-field>
                    <v-text-field
                      v-model="editedItem.status"
                      label="Status"
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
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        @keydown.enter="searchProduct"
      ></v-text-field>
    </v-card-title>

  <v-data-table
    :headers="headers"
    :items="category"
    :search="search"
    sort-by="name"
    class="elevation-1"
    :loading="tblLoader"
    loading-text="Loading... Please wait"
  >
    <template v-slot:top>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Do you want to delete this product?</v-card-title>
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
      <v-icon small class="mr-2 indigo--text" @click="editItem(item)">
        mdi-eye
      </v-icon>
      <v-icon small class="mr-2 info--text" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon small @click="deleteItem(item)" class=" pink--text">
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
import {apiUpdateCategory, apiGetAllCategory,apiCreateCategory,apiDeleteCategory} from "@/api/category.api";
import ImagePreviewMixin from "@/mixins/ImagePreviewMixin";
  export default {
    mixins: [ImagePreviewMixin],
    name:'imageUpload',
    data: () => ({
      search:'',
      snackbar:false,
      tblLoader:true,
      text:'Successfully Saved!',
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: 'Category code', value: 'id' },
        { text: 'Category Name', value: 'name' },
        { text: 'status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },

      ],
      category: [],
      editedIndex: -1,
      editedItem: {
        index: null,
        name: null,
        status:null,
      },
      defaultItem: {
        index: null,
        name: null,
        status: null,
      },
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Category' : 'Update Category'
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
      async initialize () {
        await apiGetAllCategory().then(({data}) => {
              this.category = data
              this.tblLoader=false
                console.log(data)
        })
      },
      editItem (item) {
        this.editedIndex = this.category.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        this.editedIndex = this.category.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      deleteItemConfirm () {
        apiDeleteCategory(this.editedItem.id).then(()=>{
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
          apiUpdateCategory(this.editedItem,this.editedItem.id).then(() => {
            this.text ="Updated Successfully!"
            this.snackbar=true
            this.tblLoader=true
            this.initialize()
          })
        } else {
          apiCreateCategory(this.editedItem).then(() => {
            this.snackbar=true
            this.tblLoader=true
            this.initialize()
          })
        }
        this.close()
      },
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
</style>