<template>
<div class="container mx-3 clickable">
  <pdf-preview style="z-index:999;" :filename="filename" :dialog="previewDialogStatus" @closePdfPreview="previewDialogStatus=false"> </pdf-preview>
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
                         hide-details="auto"
                        class="mt-2 pt-1" 
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
                      v-validate="'required'"  
                      :error-messages="errors.collect('Product Name')"
                      data-vv-name="Product Name"
                      hide-details="auto"
                    ></v-text-field>
                    <v-text-field
                      v-model="editedItem.price"
                      label="Price"
                      v-validate="'required|decimal'"  
                      :error-messages="errors.collect('price')"
                      data-vv-name="price"
                    ></v-text-field>
                    <v-text-field
                      v-model="editedItem.stocks"
                      label="Stocks"
                      v-validate="'required|decimal'"  
                      :error-messages="errors.collect('Stocks')"
                      data-vv-name="Stocks"
                    ></v-text-field>
                     <v-select
                      v-model="editedItem.product_category"
                      :items="items"
                      item-text="name"
                      item-value="id"
                      label="Category"
                      dense
                      v-validate="'required'"  
                      :error-messages="errors.collect('Product Category')"
                      data-vv-name="Product Category"
                    ></v-select>
                    <v-text-field
                      v-model="editedItem.desc"
                      label="Barcode"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <vue-barcode style="margin:auto; display:block; width:100%;" height="40" v-model="editedItem.desc"   fontOptions="bold"></vue-barcode>
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
    :items="desserts"
    :search="search"
    sort-by="name"
    class="elevation-1"
    :loading="tblLoader"
    loading-text="Loading... Please wait"
  >
    <template v-slot:item.stocks="{ item }">
        <v-chip 
        :color="getColor(item.stocks)" 
        outlined
        >
        {{ item.stocks }}
        </v-chip>
    </template>

    <template v-slot:item.created_at="{ item }">
      {{ format_date(item.created_at) }}
    </template>
    <template v-slot:item.price="{ item }">
      {{ formatMoney(item.price) }}
    </template>

    <template v-slot:item.img="{ item }">
        <img
          width="50px"
          height="45px"
          class="mt-2 pt-0"
          :style="{backgroundSize: 'cover', backgroundPosition: 'center' }"
          :src="`http://127.0.0.1:8000/images/${item.img}`"
        >
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
      <v-icon small class="mr-2 info--text" @click="showbarcodeDialog(item)">
        mdi-barcode
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
      width="100%"
      class="px-5"
      max-width="100%"
      tile
      app
      
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

<!-- dialog pop up -->
    <div class="text-center">
      <v-dialog
        v-model="bacodeDialog"
        width="400"
        class="pa-10"
      >
        <v-card>
          <v-card-title class="info white--text">
            Barcode Generator
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="count"
              label="Number of Pieces"
              v-validate="'required|numeric'"  
              :error-messages="errors.collect('Number of pieces')"
              data-vv-name="Number of pieces"
              class="my-6"
            ></v-text-field>
            <v-select
              :items="barcodeSettings"
              item-text="name"
              item-value="value"
              v-model="barcodePaperSize"
              dense
              label="Paper Size"
            ></v-select>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="info"
              outlined
              @click="bacodeDialog = false"
            >
              Close
            </v-btn>
            <v-btn
              color="info"
              @click="generateBarcode"
            >
              Generate
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>
<script>
import {apiUpdateProduct, apiGetAllProducts,apiCreateProduct,apiDeleteProduct,apiGetProduct, apiGenerateBarcode} from "@/api/product.api";
import {apiGetAllCategory} from "@/api/category.api";
import ImagePreviewMixin from "@/mixins/ImagePreviewMixin";
import VueBarcode from 'vue-barcode';
import FormatHelper from "@/mixins/FormatHelper"
import PdfPreview from '@/components/features/PrintPreviewPdf'

  export default {
    mixins: [ImagePreviewMixin,FormatHelper],
    name:'imageUpload',
    data: () => ({
      previewDialogStatus: false,
      filename:'',
      barcode:'',
      selected_id:'',
      bacodeDialog:false,
      items:[],
      previewImage:require('@/assets/default.jpg'),
      search:'',
      snackbar:false,
      tblLoader:true,
      text:'Successfully Saved!',
      dialog: false,
      dialogDelete: false,
      barcodePaperSize:'A4',
      count:5,
      barcodeSettings:[{name:'A4', value:'A4'},{name:'Letter', value:'Letter'},{name:'Legal', value:'Legal'}, ],
      headers: [
        { text: "Image", value: "img", sortable: false },
        {
          text: 'Product Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Barcode', value: 'desc' },
        { text: 'Category', value: 'category.name' },
        { text: 'Price', value: 'price' },
        { text: 'Stocks', value: 'stocks' },
        { text: 'Date Created', value: 'created_at' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {price:1,stocks:1,desc:''},
      defaultItem: {},
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
      initialize () {
        apiGetAllProducts().then(({data}) => {
          this.desserts = data
          this.tblLoader=false
          // this.uploadImage(data.img)
          console.log(data)
        })
        apiGetAllCategory().then(({data}) =>{
          this.items=data
        })
      },
      editItem (item) {
        this.previewImage=require('@/assets/default.jpg')
        this.editedIndex = this.desserts.indexOf(item)
        this.dialog = true
        apiGetProduct(item.id).then(({data}) => {
          this.editedItem = data
          this.editedItem.product_category=data.category.id
          this.previewImage=`http://127.0.0.1:8000/images/${data.img}`
        })
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
          const formData = new FormData
          formData.set('image', this.editedItem.image)
          formData.set('img', this.editedItem.img)
          formData.set('name', this.editedItem.name)
          formData.set('desc', this.editedItem.desc)
          formData.set('price', this.editedItem.price)
          formData.set('stocks', this.editedItem.stocks)
          formData.set('product_category', this.editedItem.product_category)
          formData.append('_method', 'patch');
          apiUpdateProduct(formData,this.editedItem.id).then(() => {
            this.text ="Updated Successfully!"
            this.snackbar=true
            this.tblLoader=true
            this.close()
            this.initialize()
          })
        } else {
          
            this.$validator.validateAll().then(result => {
              if (result){
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
                  this.close()
                  this.initialize()
                })
              }
            });
        }
        
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
      clear(){
        this.editedItem.desc = Math.floor(1000000000 + Math.random() * 900000)
        this.previewImage=require('@/assets/default.jpg')
      },
      showbarcodeDialog(item){
        this.bacodeDialog=true
        this.selected_id = item.id
      },
      generateBarcode(){
        apiGenerateBarcode({id:this.selected_id, size:this.barcodePaperSize, count:parseInt(this.count)}).then(({data}) =>{
          console.log(data)
          this.bacodeDialog=false
          this.filename = 'preview.pdf'
          this.previewDialogStatus=true
        })
      }
       
    },
    components:{
      VueBarcode,
      PdfPreview
    }
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