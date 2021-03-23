<template >
    <div id="app" >
        <v-container style="background-color:white;">
          <v-row >
             <v-col md="8" >
              <h3>Recent Purchase</h3>
              
               <v-row>
                <v-card id="cards" v-for="item in products" :key="item.id"  class="mx-2 my-2"  max-width="181">
                  <v-img
                  height="158"
                  :style="{backgroundSize: 'cover', backgroundPosition: 'center' }"                  
                  :src="`http://127.0.0.1:8000/images/${item.img}`"
                  ></v-img>
                 <h4 class="ml-3 mt-2">{{item.name}}</h4> 
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
              <v-card style="height:75vh;" class="mt-9 px-3 ">
                <v-simple-table height="382">
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
                        <td colspan="2" class="text-left pl-0">{{ item.name }}</td>
                        <td class="text-right">{{ formatMoney(item.price) }}</td>
                        <td class="text-right">
                          <div style="width:60px;">
                            <button @click="decrement(item)" class="py-0 px-1 btn btn-info" style="border: 1px solid #f2f2f2; background-color: #f2f2f2; ">-</button>
                            <input readonly @change="computeSubtoal(item)" style="width:20px; text-align:center; border: 1px solid #f2f2f2;" v-model="item.qty">
                            <button @click="increment(item)" class="py-0 px-1" style="border: 1px solid #f2f2f2; background-color:#f2f2f2;">+</button>
                          </div>
                        </td>
                        <td class="text-right">{{ formatMoney(item.subtotal) }}</td>
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
                    <v-dialog
                      transition="dialog-bottom-transition"
                      max-width="500"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="success"
                          v-bind="attrs"
                          v-on="on"
                          style="width:100%;"
                        >
                        <v-icon class="mr-1">mdi-credit-card-check </v-icon>
                          accept payment
                        </v-btn>
                      </template>
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
                                      v-validate="'required|digits:11'"  
                                      :error-messages="errors.collect('phone')"
                                      data-vv-name="phone"
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
                              :loading="loader"
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
import {apiGetAllProducts} from "@/api/product.api";
import {apiGetAllClients} from "@/api/client.api";
import {apiCreateTransaction} from "@/api/transaction.api";
import { ModelSelect } from 'vue-search-select'
import 'vue-search-select/dist/VueSearchSelect.css'

export default {
    data: () => ({
      loader:false,
      text:'',
      isNewClient:true,
      snackbar:false,
      showSelectClient:false,
      total:0,
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
        console.log(val)
      }
    },
    methods:{
       initialize () {
        apiGetAllProducts().then(({data}) => {
          this.products = data
          console.log(data,'products')
        })
        apiGetAllClients().then(({data}) => {
          data = data.map(({ id, name, phone }) => ({ value: id, text: name, phone: phone }));
          this.options = data
          console.log(this.options,'options')
        })
      },
      addToPurchase(val){
        const isExist = this.productExists(val)
        const index = this.purchase.findIndex(purchase => purchase.id===val.id);
        if(isExist){
          this.purchase[index].qty ++
          this.purchase[index].subtotal = val.price * this.purchase[index].qty
          this.computeTotal()
        }else{
          let qty=1
          this.purchase.push({
            id : val.id,
            img : val.img,
            name : val.name,
            price : val.price,
            qty : 1,
            subtotal : (qty * val.price),
          })
        }
          this.computeTotal()
      },
      increment(val){
        val.qty++
        val.subtotal = val.price * val.qty
        this.computeTotal()
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
    formatMoney(n) {
    return "₱" + (Math.round(n * 100) / 100).toLocaleString();
    },
    reset(){
      this.purchase=[]
      this.total=0
    },
    save(){
  
      this.$validator.validateAll().then(result => {
        if (result){
          this.loader=true
          this.item.cash = parseInt(this.cash)
          apiCreateTransaction(this.item).then(() => {
            this.$refs.closeDialog.$el.click()
            this.snackbar=true
            this.showSelectClient=false,
            this.cash='',
            this.justCreateNew()
            this.reset()
            this.text ="Transaction Successfully saved!"
            this.initialize()
          }).finally(data =>{
            this.loader=false
            console.log(data)
          })
        }
      });
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
    }
      
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

</style>