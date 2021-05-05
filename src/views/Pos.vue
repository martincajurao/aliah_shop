<template >
    <div id="app" >
        <v-container style="background-color:white;" >
          <v-row >
             <v-col md="8"  >
              
              <div style="width:20%; display:inline-block;"><h3>Recent Purchase </h3></div>
              <div style="width:80%; display:inline-block;">
                <v-text-field
                v-model="barcode"
                prepend-inner-icon="mdi-barcode"
                label="barcode Reader"
                solo
                flat
                autofocus
                dense
                @input="searchBarcode"
                class="my-0 py-0"
                style="position:absolute; top:11%; right:15%; width:20%;"
                ></v-text-field>
                <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                label="Search Product"
                solo
                flat
                dense
                @input="searchProduct"
                class="my-0 py-0"
                style="position:absolute; top:10%; width:46%;"
                ></v-text-field>
              </div>
               <v-row class="mt-1">
                
                <v-card id="cards" v-for="item in products" :key="item.id"  class="mx-2 my-2"  max-width="181">
                  <v-img
                  height="150"
                  :style="{backgroundSize: 'cover', backgroundPosition: 'center' }"                  
                  :src="`http://127.0.0.1:8000/images/${item.product.img}`"
                  ></v-img>
                 <h4 class="ml-3 mt-1 mb-0 dotdot">{{item.product.name}}</h4> 
                  <!-- <v-select
                      v-model="selected_variant"
                      :items="item.sku"
                      item-text="color" 
                      item-value="id"
                      label="Select Variant"
                      dense
                      style="height: 33px; font-weigth:9px !important;"
                      flat
                      solo
                      class="pa-0 ma-0"
                    >
                    <template slot="selection" slot-scope="data">
                      {{ data.item.color }} - {{ data.item.size }}
                    </template>
                    <template slot="item" slot-scope="data">
                      {{ data.item.color }} - {{ data.item.size }}
                    </template>
                    </v-select> -->
                
                
                <div class="px-3">
                  <div style="width:50%; display:inline-block; font-size:12px;">
                    <v-chip class="ma-0 py-0" small label>  <b>{{item.size}}</b> </v-chip>
                  </div>
                  <div style="width:50%; display:inline-block; text-align:right; font-size:12px;">
                    <v-chip class="ma-0 py-0" small label>  <b>{{item.color}}</b> </v-chip>
                  </div>
                </div>
                <div class="px-3">
                  <div style="width:50%; display:inline-block;">{{formatMoney(item.price)}}</div>
                  <div v-if="item.stocks > 5" style="color: green; width:50%; display:inline-block; text-align:right; font-size:12px;">Available: {{item.stocks}}</div>
                  <div v-else style="color: red; width:50%; display:inline-block; text-align:right; font-size:12px;">Available: {{item.stocks}}</div>
                </div>
                  <v-card-actions v-if="item.stocks > 0">
                    <v-btn @click="addToPurchase(item)" tile color="info" width="100%">
                    <v-icon>mdi-cart-arrow-right</v-icon>
                      buy
                    </v-btn>
                  </v-card-actions>
                  <v-card-actions v-else>
                    <v-btn disabled @click="addToPurchase(item)" tile color="info" width="100%">
                    <v-icon>mdi-cart-arrow-right</v-icon>
                      buy
                    </v-btn>
                  </v-card-actions>
                </v-card>
               </v-row>
             </v-col>
             <v-col md="4" >
              <v-card style="height:79vh;" class="mt-10 px-3 ">
                <v-simple-table height="409">
                    <thead>
                      <tr>
                        <!-- <th class="text-left" style="width:50px;"></th> -->
                        <th colspan="2" class="text-left pl-0">Product</th>
                        <th class="text-right mx-0">Price</th>
                        <th class="text-right mx-0">Qty</th>
                        <th class="text-right mx-0">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody style="height:60vh;">
                      <tr  class="ml-0 pl-0 " v-for="item in purchase" :key="item.name">
                        <td colspan="2" class="text-left pl-0"><small>{{ item.name }}</small></td>
                        <td class="text-right"><div style="width:48px; display:block;">{{ formatMoney(item.price) }}</div></td>
                        <td class="text-right">
                          <div style="width:60px;">
                            <button @click="decrement(item)" class="py-0 px-1 btn btn-info" style="border: 1px solid #f2f2f2; background-color: #f2f2f2; ">-</button>
                            <input  @change="computeSubtoal(item)" readonly style="width:20px; text-align:center; border: 1px solid #f2f2f2;" v-model="item.qty">
                            <button @click="addToPurchase(item)" class="py-0 px-1" style="border: 1px solid #f2f2f2; background-color:#f2f2f2;">+</button>
                          </div>
                        </td>
                        <td class="text-right"><div style="width:48px; display:block;">{{ formatMoney(item.subtotal) }}</div></td>
                      </tr>
                    </tbody>
                 
                </v-simple-table>
                <div style="width:347px;">
                  <v-btn
                  class="my-2 px-1 py-0 text-bold"
                  outlined
                  color="success"
                  small
                  @click="reset"
                >
                  reset
                  <v-icon>mdi-cached</v-icon>
                </v-btn>
                  <hr>
                  <div class="mt-2" >
                    <span style="width:50%; display:inline-block">Total tax:</span>
                    <span class="text-right" style="width:50%; display:inline-block">0.00</span>
                  </div>
                  <div class="mb-1" style="font-weight:bolder; font-size:24px; color:red;">
                    <span style="width:50%; display:inline-block">TOTAL:</span>
                    <span class="text-right " style="width:50%; display:inline-block">{{formatMoney(total)}}.00</span>
                  </div>
                    <v-btn
                      color="success"
                      @click="checkPaymentDialog"
                      style="width:100%;"
                    >
                    <v-icon class="mr-1">mdi-credit-card-check </v-icon>
                      accept payment
                    </v-btn>
                    <v-dialog
                      transition="dialog-bottom-transition"
                      max-width="500"
                      v-model="paymentDialog"
                      :loading="loader"
                    >
                      <template v-slot:default="dialog">
                        <v-card>
                          <v-toolbar
                            color="info"
                            dark
                          >Accept Payment</v-toolbar>
                          <v-card-text class="pt-4">
                            
                          <v-form   ref="form" lazy-validation0 @submit.prevent="save" > 
                            <v-card-text class="my-0 py-0">
                              <v-container class="my-0 py-0">
                                <v-row class="my-0 py-0">
                                  <v-col cols="12" >
                                    <h3>Amount</h3>
                                      <v-text-field
                                      placeholder="0.00"
                                      prefix="₱"
                                      class="mt-2"
                                      label="Cash Amount"
                                      autofocus
                                      required
                                      v-validate="`required|integer|min_value:${total}`"  
                                      :error-messages="errors.collect('Amount')"
                                      data-vv-name="Amount"
                                      style=" font-size:30px;"
                                      v-model="cash"
                                      :loading="loader"
                                    ></v-text-field>
                                   
                                    <transition name="slide-fade">
                                      <div v-if="showSelectClient"  >
                                        <h3 class="my-2">Select Customer</h3>
                                        <model-select :options="options"
                                          v-model="item"
                                          placeholder="Search customer's name">
                                        </model-select>
                                        <v-card-actions class="justify-end">
                                          <v-btn class="my-1" small right  color="primary" @click="justCreateNew">Just Create New</v-btn>
                                        </v-card-actions>
                                      </div>
                                    </transition>
                                    <br>
                                    <h3>Create Client's information</h3>
                                    <v-text-field
                                      label="Name"
                                      v-model="item.text"
                                      v-validate="'required'"  
                                      :error-messages="errors.collect('Name')"
                                      data-vv-name="Name"
                                      hide-details="auto"
                                      :loading="loader"
                                    ></v-text-field>
                                    <br>
                                    <v-text-field
                                      label="Phone #"
                                      v-model="item.phone"
                                      v-validate="'digits:11'"  
                                      :error-messages="errors.collect('Phone')"
                                      data-vv-name="Phone"
                                      :loading="loader"
                                    ></v-text-field>
                                     <v-chip
                                      class="mt-1"
                                      color="success"
                                      outlined
                                      @click="showSelectClient=true"
                                    >
                                      <b>Customer already exist?</b>
                                      
                                    </v-chip>
                                  </v-col>
                                </v-row>
                              </v-container>
                            </v-card-text>
                          </v-form>
                          </v-card-text>
                          <v-card-actions class="justify-end">
                            <v-btn
                              ref="closeDialog"
                              outlined
                              @click="dialog.value = false"
                              color="info"
                            >Cancel</v-btn>
                            <v-btn
                              @click="save"
                              color="info"
                              :disabled="loader"
                              :loading="loader"
                              class="white--text"
                            ><v-icon>mdi-content-save</v-icon>save</v-btn>
                          </v-card-actions>
                        </v-card>
                      </template>
                    </v-dialog>
                </div>
              </v-card>
             </v-col>
             <v-col cols="auto">
            </v-col>
          </v-row>
          <v-row>
          </v-row>
        </v-container>

        <!-- Sanckbar -->
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

        <!-- change dilaog -->
        <v-row justify="center">
          <v-dialog
            v-model="dialogx"
            max-width="250"
          >
            <v-card>
              <v-card-title class="headline">
                Your change is: <span class="pl-2" style="color:green">{{formatMoney(change)}}.00</span>
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="green darken-1"
                  text
                  @click="dialogx = false"
                >
                  Ok
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>

        <!-- loading dialog -->
        <div class="text-center">
        <v-dialog
          v-model="loader"
          hide-overlay
          persistent
          width="300"
        >
          <v-card
            color="success"
            dark
          >
            <v-card-text>
              Saving record...
              <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
              ></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </div>
</template>
<script>
import {apiGetFeaturedProducts,apiSearchProduct,apiSearchBarcode} from "@/api/product.api";
import {apiGetAllClients} from "@/api/client.api";
import {apiCreateTransaction} from "@/api/transaction.api";
import { ModelSelect } from 'vue-search-select'
import 'vue-search-select/dist/VueSearchSelect.css'
import FormatHelper from "@/mixins/FormatHelper"

export default {
    mixins:[FormatHelper],
    data: () => ({
      selected_variant:'',
      barcode:'',
      search:'',
      dialogx: false,
      loader:false,
      paymentDialog:false,
      text:'',
      snackbar:false,
      isNewClient:true,
      showSelectClient:false,
      total:0,
      change:0,
      cash:null,
      products:[],
      purchase:[],
        headers: [
        // { text: "Image", value: "img", sortable: false },
        { text: 'Product', value: 'name' },
        { text: 'Qty', value: 1 },
        { text: 'Price', value: 'price' },
      ],
      options: [],
      item: {
        value: '',
        name: '',
        phone: '',
        amount: '',
        purchase:[],
      },
     
    }),
    mounted () {
      
      this.initialize()
    },
    watch:{
      item(val){
        val.amount = this.total
        val.purchase = this.purchase
      },
    },
    methods:{
       initialize () {
        
        apiGetFeaturedProducts().then(({data}) => {
          this.products = data
          console.log(data,'products')
        })
        apiGetAllClients().then(({data}) => {
          data = data.map(({ id, name, phone }) => ({ value: id, text: name, phone: phone }));
          this.options = data
          console.log(this.options,'clients')
        })
      },
      addToPurchase(val){
        console.log(val)
        
        const isExist = this.productExists(val)
        const index = this.purchase.findIndex(purchase => purchase.id===val.id);
        if(isExist){
          if( this.purchase[index].qty >= val.stocks){
            return
          }
         
          this.purchase[index].qty ++
          this.purchase[index].subtotal = val.price * this.purchase[index].qty
          this.computeTotal()
        }else{
        // if (!this.selected_variant) {
        //   alert('please select product variant')
        //   return
        // }
          let qty=1
          this.purchase.push({
            id : val.id,
            img : val.product.img,
            name : val.product.name+' ('+val.size+'-'+val.color+')',
            price : val.price,
            qty : 1,
            stocks : val.stocks,
            subtotal : (qty * val.price),
          })
        }
          this.computeTotal()
          this.selected_variant=''
      },
      
      decrement(val){
        if(val.qty <= 1){
          this.purchase.splice(this.purchase.indexOf(val), 1)
        }
        val.qty--
        val.subtotal = val.price * val.qty
        this.computeTotal()
      },
      computeSubtoal(val){
        val.subtotal = val.price * val.qty
        this.computeTotal()
      },
      computeTotal(){
        this.total=0
        this.purchase.forEach(element => {
          this.total = this.total + (element.subtotal);
        });
        return this.total;
      },
      productExists(val) {
        return this.purchase.some(function(el) {
          const isExist = el.id === val.id
        return isExist;
        }); 
      },
      
      reset(){
        this.purchase=[]
        this.total=0
        this.item= {
          value: '',
          name: '',
          phone: '',
          amount: 0,
          purchase:[],
        }
      },
      save(){
        this.$validator.validateAll().then(result => {
          if (result){
            this.paymentDialog=false
            this.loader=true
            this.item.cash = parseInt(this.cash)
            this.change = this.cash - this.total
            this.item.amount = this.total
            apiCreateTransaction(this.item).then(() => {
              this.snackbar=true
              this.text ="Transaction Successfully saved!"
              this.showSelectClient=false,
              this.reset()
              this.initialize()
              this.dialogx = true
              this.$refs.form.reset()
              this.$store.commit('change', Date())
              this.$forceUpdate();
            }).finally(data =>{
              this.loader=false
              this.item.value=""
              console.log(data)
            })
          }
        });
      },
      searchProduct(){
        apiSearchProduct(this.search).then(({data})=>{
          this.products = data
          console.log(data)
        })
      },
      searchBarcode(){
        if (this.barcode.length==10) {
          apiSearchBarcode(this.barcode).then(({data})=>{
            //  let qty=1
            // this.purchase.push({
            //   id : data[0].id,
            //   img : data[0].img,
            //   name : data[0].name,
            //   price : data[0].price,
            //   qty : 1,
            //   subtotal : (qty * data[0].price),
            // })
            //   this.computeTotal()

            this.addToPurchase(data[0])
              this.barcode=''
              console.log(data[0])
          })
        }
      },
      justCreateNew(){
        this.showSelectClient=false,
        this.item = {
            value: '',
            name: '',
            phone: '',
            amount: '',
            purchase:[],
          }
          this.$validator.reset()
      },
      checkPaymentDialog(){
        this.$validator.reset()
        if (this.total>0) {
          this.paymentDialog = true
        }
      },
      
  },
  components: {
    ModelSelect
  }
}
</script>
<style scoped>
 body {

    background: rgb(129, 129, 129); 
    background-color: rgb(196, 192, 192); 
}
.slide-fade-enter-active {
  transition: all .4s ease;
}

.slide-fade-enter
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(150px);
  opacity: 0;
}
#cards{
   transition: all .3s ease; 
}
#cards:hover{
   transition: all .3s ease;
   transform: translateY(-5px);
}
.dotdot{
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>