<template >
    <div id="app" v-bind:style="{ backgroundColor: red}">
        <v-container style="background-color:white;">
          <v-row align-content-sm>
             <v-col md="8" >
              <h3>Recent Purchase</h3>
               <v-row>
                <v-card v-for="item in products" :key="item.id"  class="mx-2 my-4"  max-width="181">
                  <v-img
                  height="157"
                  :style="{backgroundSize: 'cover', backgroundPosition: 'center' }"                  
                  :src="`http://127.0.0.1:8000/images/${item.img}`"
                  ></v-img>
                 <h4 class="ml-4 mt-2">{{item.name}}</h4> 
                <div class="ml-4">
                  $ {{item.price}}
                </div>
                  <v-card-actions>
                    <v-btn @click="addToPurchase(item)" tile color="info" width="100%">
                    <v-icon>mdi-cart-arrow-right</v-icon>
                      buy
                    </v-btn>
                  </v-card-actions>
                </v-card>
               </v-row>
             </v-col>
             <v-col md="4" >
              <v-card style="height:77vh;" class="mt-11 px-3">
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <!-- <th class="text-left" style="width:50px;"></th> -->
                        <th class="text-left pl-0">Product</th>
                        <th class="text-right">Price</th>
                        <th class="text-right">Qty</th>
                        <th class="text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody style="height:60vh;">
                      <tr
                       class="ml-0 pl-0"
                        v-for="item in purchase"
                        :key="item.name"
                      >
                        <!-- <td class="pl-0" >
                          <v-img
                            height="33"
                            width="33"
                            :style="{backgroundSize: 'cover', backgroundPosition: 'center' }"                  
                            :src="`http://127.0.0.1:8000/images/${item.img}`"
                            ></v-img>
                             
                        </td> -->
                        <td class="text-left pl-0">{{ item.name }}</td>
                        <td class="text-right">{{ item.price }}</td>
                        <td class="text-right">
                          <button @click="decrement(item)" class="py-0 px-1 btn btn-info" style="border: 1px solid #f2f2f2; background-color: #f2f2f2; ">-</button>
                          <input @change="computeSubtoal(item)" style="width:20px; text-align:center; border: 1px solid #f2f2f2;" v-model="item.qty">
                          <button @click="increment(item)" class="py-0 px-1" style="border: 1px solid #f2f2f2; background-color:#f2f2f2;">+</button>
                        </td>
                        <td class="text-right">{{ item.subtotal }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <div style="width:347px;">
                  
                  <span>Total Tax:</span>
                  <h3 style="color:red">TOTAL: {{total}}</h3>
                  <v-btn tile color="warning" width="100%">
                    <v-icon>mdi-check</v-icon>
                      continue
                  </v-btn>
                </div>
              </v-card>
             </v-col>
          </v-row>
          <v-row>
          </v-row>
        </v-container>
    </div>
</template>
<script>
import {apiGetAllProducts} from "@/api/product.api";

export default {
     data: () => ({
       total:0,
       products:[],
       purchase:[],
        headers: [
        // { text: "Image", value: "img", sortable: false },
        { text: 'Product', value: 'name' },
        { text: 'Qty', value: 1 },
        { text: 'Price', value: 'price' },
      ],
     }),
    mounted () {
      this.initialize()
    },
    methods:{
       initialize () {
        apiGetAllProducts().then(({data}) => {
          this.products = data
          console.log(data)
        })
      },
      addToPurchase(val){
        let qty=1
        this.purchase.push({
          img : val.img,
          name : val.name,
          price : val.price,
          qty : 1,
          subtotal : (qty * val.price),
          })

          this.computeTotal(val.price)
      },
      increment(val){
        val.qty++
        val.subtotal = val.price * val.qty
        this.computeTotal(val.subtotal)
      },
      decrement(val){
        if(val.qty <= 1){
          this.purchase.splice(this.purchase.indexOf(val), 1)
        }
        val.qty--
        val.subtotal = val.price * val.qty
        this.computeTotal(val.subtotal)
      },
      computeSubtoal(val){
        val.subtotal = val.price * val.qty
      },
      computeTotal(val){
        this.total = this.total + val
      }
      
    }
}
</script>
<style scoped>
 body {

    background: rgb(129, 129, 129); 
    background-color: rgb(196, 192, 192); 
}

</style>