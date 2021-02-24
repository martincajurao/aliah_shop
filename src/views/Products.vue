<template>
<div class="container mx-3">
  <v-card-title>
      <h3>Products</h3>
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
                  <v-col cols="6" >
                    <v-card  flat>
                      <v-card-title>Image Preview</v-card-title>
                      <v-card-text>
                        <img 
                        :src="previewImage" 
                        class="uploading-image mt-0 "
                        height="180px"
                        width="180px" 
                        />
                        <input
                        class="mt-2 pt-1" 
                        chips 
                        width="150px"
                        type="file" 
                        accept="image/jpeg" 
                        @change="uploadImage">
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="6" >
                    <v-text-field
                      v-model="editedItem.name"
                      label="Product name"
                    ></v-text-field>
                    <v-text-field
                      v-model="editedItem.price"
                      label="Price"
                    ></v-text-field>
                    <v-text-field
                      v-model="editedItem.stocks"
                      label="Stocks"
                    ></v-text-field>
                     <v-select
                     v-model="editedItem.product_category"
                      :items="items"
                      label="Select Category"
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      height="100px"
                      dense
                      v-model="editedItem.desc"
                      label="Product Description"
                      outlined
                      class="mb-0"
                    ></v-textarea>
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
    :items="desserts"
    :search="search"
    sort-by="name"
    class="elevation-1"
    :loading="tblLoader"
    loading-text="Loading... Please wait"
  >
    <template v-slot:item.stocks="{ item }">
        <v-chip :color="getColor(item.stocks)" dark>
        {{ item.stocks }}
        </v-chip>
    </template>

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
</template>
<script>
import {apiUpdateProduct, apiGetAllProducts,apiCreateProduct,apiDeleteProduct} from "@/api/product.api";
import ImagePreviewMixin from "@/mixins/ImagePreviewMixin";
  export default {
    mixins: [ImagePreviewMixin],
    name:'imageUpload',
    data: () => ({
      items:[
        {
        text:'Category 1',
        value:'1'
        },
        {
        text:'Category 2',
        value:'2'
        },
        {
        text:'Category 3',
        value:'3'
        },
      ],
      
      previewImage:require('@/assets/default.jpg'),
      search:'',
      snackbar:false,
      tblLoader:true,
      text:'Successfully Saved!',
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: 'Product code', value: 'id' },
        {
          text: 'Product Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Category', value: 'desc' },
        { text: 'Price', value: 'price' },
        { text: 'Stocks', value: 'stocks' },
        { text: 'Status', value: 'stocks' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        index: null,
        name: null,
        desc:null,
        price:null,
        stocks:null,
        product_category:null,
        img_name:null,
        image:null,
      },
      defaultItem: {
        index: null,
        name: null,
        desc: null,
        price: null,
        stocks: null,
        product_category:null,
        img_name:null,
        image:null,
      },
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Product' : 'Update Product'
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
        await apiGetAllProducts().then(({data}) => {
              this.desserts = data
              this.tblLoader=false
                console.log(data)
        })
      },
      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      deleteItemConfirm () {
        apiDeleteProduct(this.editedItem.id).then(()=>{
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
      getColor (val) {
        if (val < 10) return 'red'
        else if (val < 20) return 'orange'
        else return 'green'
      },

      save () {

        if (this.editedIndex > -1) {
          apiUpdateProduct(this.editedItem,this.editedItem.id).then(() => {
            this.text ="Updated Successfully!"
            this.snackbar=true
            this.tblLoader=true
            this.initialize()
          })
        } else {
          const formData = new FormData
          formData.set('image', this.editedItem.image)
          formData.set('name', this.editedItem.name)
          formData.set('desc', this.editedItem.desc)
          formData.set('price', this.editedItem.price)
          formData.set('stocks', this.editedItem.stocks)
          formData.set('product_category', this.editedItem.product_category)
          apiCreateProduct(formData).then(() => {
            this.snackbar=true
            this.tblLoader=true
            this.initialize()
          })
        }
        this.close()
      },
      uploadImage(e){
        const image = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = e =>{
          this.previewImage = e.target.result;
          this.editedItem.image = image
          this.editedItem.img_name = image.name
        };
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