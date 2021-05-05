<template  >
<div  >
  <pdf-preview style="z-index:999;" :filename="filename" :dialog="previewDialogStatus" @closePdfPreview="previewDialogStatus=false"> </pdf-preview>
    <div class="mx-3 pt-2" >
        <v-card>
            <v-toolbar
            color="#2C3A47"
            dark
            flat
            >
            <v-app-bar-nav-icon></v-app-bar-nav-icon>

            <v-toolbar-title>Reports Dashboard</v-toolbar-title>
            <v-spacer></v-spacer>
            </v-toolbar>
            <v-tabs >
                <v-tab>
                    <v-icon left>
                    mdi-file
                    </v-icon>
                    Sales
                </v-tab>
                <v-tab>
                    <v-icon left>
                    mdi-file
                    </v-icon>
                    Expenses
                </v-tab>
                <v-tab>
                    <v-icon left>
                    mdi-file
                    </v-icon>
                    Assets
                </v-tab>
                <v-tab>
                    <v-icon left>
                    mdi-file
                    </v-icon>
                    Inventory Sales
                </v-tab>

                <v-tab-item>
                    <v-card flat min-width="1090" >
                    <v-card-text  style="width:100%;">
                        <v-row class="pa-4">
                            <h2>Sales Report</h2>
                            <div style="width:230px; position:absolute; left:17%; top:2%;" >
                                <v-menu
                                v-model="fromDateMenu"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                max-width="290px"
                                min-width="290px"
                                >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                    label="From"
                                    prepend-icon="event"
                                    readonly
                                    v-model="fromDateVal"
                                    v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    locale="en-in"
                                    :min="minDate"
                                    :max="maxDate"
                                    v-model="fromDateVal"
                                    @input=" searchSale "
                                ></v-date-picker>
                                </v-menu>
                            </div>
                            <div style="width:230px; position:absolute; left:40%; top:2%;" >
                                <v-menu
                                v-model="toDateMenu"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                max-width="290px"
                                min-width="290px"
                                >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                    label="To"
                                    prepend-icon="event"
                                    readonly
                                    v-model="toDateVal"
                                    v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    locale="en-in"
                                    :min="fromDateVal"
                                    :max="maxDate"
                                    v-model="toDateVal"
                                    @input="searchSale"
                                ></v-date-picker>
                                </v-menu>
                            </div>
                            <v-spacer></v-spacer>
                            <h2 class="mr-5">Total Sales: <v-chip color="info">{{formatMoney(total)}}</v-chip> </h2>
                            <v-icon   class="mr-2 primary--text" @click="print()">
                                mdi-printer
                            </v-icon>
                            <v-icon  @click="exportPdf(item)" class=" primary--text">
                                mdi-file-download
                            </v-icon>
                        </v-row>
                        <v-data-table
                        :headers="headers"
                        dense
                        :items="transactions"
                        sort-by="name"
                        class="elevation-1"
                        >
                       <template v-slot:item.created_at="{ item }">
                        {{ format_date(item.created_at) }}
                        </template>
                        <template v-slot:item.amount="{ item }">
                        {{ formatMoney(item.amount) }}
                        </template>

                        </v-data-table>
                    </v-card-text>
                    </v-card>
                </v-tab-item>

                <!-- Expenses  ########################################## -->
                <v-tab-item>
                    <v-card flat min-width="1090" >
                    <v-card-text  style="width:100%;">
                        <v-row class="pa-4">
                            <h2>Expenses Report</h2>
                            <div style="width:230px; position:absolute; left:18%; top:1.8%;" >
                                <v-menu
                                v-model="fromDateMenu2"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                max-width="290px"
                                min-width="290px"
                                >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                    label="From"
                                    prepend-icon="event"
                                    readonly
                                    v-model="fromDateVal2"
                                    v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    locale="en-in"
                                    :min="minDate"
                                    :max="maxDate"
                                    v-model="fromDateVal2"
                                    @input="searchExpenses"

                                ></v-date-picker>
                                </v-menu>
                            </div>
                            <div style="width:230px; position:absolute; left:40%; top:2%;" >
                                <v-menu
                                v-model="toDateMenu2"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                max-width="290px"
                                min-width="290px"
                                >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                    label="To"
                                    prepend-icon="event"
                                    readonly
                                    v-model="toDateVal2"
                                    v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    locale="en-in"
                                    :min="fromDateVal2"
                                    :max="maxDate"
                                    v-model="toDateVal2"
                                    @input="searchExpenses"
                                ></v-date-picker>
                                </v-menu>
                            </div>
                            <v-spacer></v-spacer>
                            <h2 class="mr-5">Total Expenses: <v-chip color="info">{{formatMoney(total2)}}</v-chip> </h2>
                            <v-icon  class="mr-2 primary--text" @click="printExpenses()">
                                mdi-printer
                            </v-icon>
                            <v-icon  @click="exportPdf(item)" class=" primary--text">
                                mdi-file-download
                            </v-icon>
                        </v-row>
                        <v-data-table
                        :headers="headers2"
                        dense
                        :items="expenses"
                        sort-by="name"
                        class="elevation-1"
                        >
                       <template v-slot:item.created_at="{ item }">
                        {{ format_date(item.created_at) }}
                        </template>
                        <template v-slot:item.amount="{ item }">
                        {{ formatMoney(item.amount) }}
                        </template>

                        </v-data-table>
                    </v-card-text>
                    </v-card>
                </v-tab-item>

                <!-- Assets############################################################# -->
                <v-tab-item>
                    <v-card flat min-width="1090" >
                    <v-card-text  style="width:100%;">
                        <v-row class="pa-4">
                            <h2>Assets Inventory Report</h2>
                           
                            <v-spacer></v-spacer>
                            <h2 class="mr-5">Total Assets Amount: <v-chip color="info">{{formatMoney(total3)}}</v-chip> </h2>
                            <v-icon  class="mr-2 primary--text" @click="printAssets()">
                                mdi-printer
                            </v-icon>
                            <v-icon  @click="exportPdf(item)" class=" primary--text">
                                mdi-file-download
                            </v-icon>
                        </v-row>
                        <v-data-table
                        :headers="headers3"
                        dense
                        :items="assets"
                        sort-by="name"
                        class="elevation-1"
                        >
                         <template v-slot:item.stocks="{ item }">
                            <v-chip
                            small 
                            outlined
                            :color="getColor(item.stocks)" 
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
                        <template v-slot:item.subtotal="{ item }">
                        {{ formatMoney(item.price * item.stocks) }}
                        </template>

                        </v-data-table>
                    </v-card-text>
                    </v-card>
                </v-tab-item>
               
                <!-- Assets Sales############################################################# -->
                <v-tab-item>
                    <v-card flat min-width="1090" >
                    <v-card-text  style="width:100%;">
                        <v-row class="pa-4">
                            <h2>Sales Inventory</h2>
                           <div style="width:230px; position:absolute; left:18%; top:1.8%;" >
                                <v-menu
                                v-model="fromDateMenu3"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                max-width="290px"
                                min-width="290px"
                                >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                    label="From"
                                    prepend-icon="event"
                                    readonly
                                    v-model="fromDateVal3"
                                    v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    locale="en-in"
                                    :min="minDate"
                                    :max="maxDate"
                                    v-model="fromDateVal3"
                                    @input="searchAssetsSales"

                                ></v-date-picker>
                                </v-menu>
                            </div>
                            <div style="width:230px; position:absolute; left:40%; top:2%;" >
                                <v-menu
                                v-model="toDateMenu3"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                max-width="290px"
                                min-width="290px"
                                >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                    label="To"
                                    prepend-icon="event"
                                    readonly
                                    v-model="toDateVal3"
                                    v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    locale="en-in"
                                    :min="fromDateVal3"
                                    :max="maxDate"
                                    v-model="toDateVal3"
                                    @input="searchAssetsSales"
                                ></v-date-picker>
                                </v-menu>
                            </div>
                            <v-spacer></v-spacer>
                            <h2 class="mr-5">Total Sales: <v-chip color="info">{{formatMoney(total4)}}</v-chip> </h2>
                            <v-icon  class="mr-2 primary--text" @click="printAssetsSales()">
                                mdi-printer
                            </v-icon>
                            <v-icon  @click="exportPdf(item)" class=" primary--text">
                                mdi-file-download
                            </v-icon>
                        </v-row>
                        <v-data-table
                        :headers="headers4"
                        dense
                        :items="assetsSales"
                        sort-by="name"
                        class="elevation-1"
                        >
                       <template v-slot:item.created_at="{ item }">
                        {{ format_date(item.created_at) }}
                        </template>
                        <template v-slot:item.price="{ item }">
                        {{ formatMoney(item.price) }}
                        </template>
                        <template v-slot:item.subtotal="{ item }">
                        {{ formatMoney(item.price * item.qty) }}
                        </template>
                       

                        </v-data-table>
                    </v-card-text>
                    </v-card>
                </v-tab-item>
            </v-tabs>
        </v-card>
    </div>
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
              Loading please wait...
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
import {apiGetAllTransactions, apiPrintSalesReport, apiSearchSalesReport} from "@/api/transaction.api";
import {apiSearchExpensesReport,apiGetAllExpenses,apiPrintExpensesReport} from "@/api/expenses.api";
import {
    apiSearchAssetsReport,
    apiSearchAssetsSalesReport,
    apiGetAllAssets,
    apiPrintAssetsReport,
    apiPrintAssetsSalesReport,
    apiGetAllAssetsSales
} from "@/api/product.api";
import FormatHelper from "@/mixins/FormatHelper"
import PdfPreview from '@/components/features/PrintPreviewPdf'

  export default {
    mixins:[FormatHelper],
    data: () => ({
    loader:false,
    previewDialogStatus: false,
    filename:'',
    fromDateMenu: false,
    toDateMenu: false,
    fromDateVal: null,
    toDateVal: null,
    total:0,
    fromDateMenu2: false,
    toDateMenu2: false,
    fromDateVal2: null,
    toDateVal2: null,
    total2:0,
    fromDateMenu3: false,
    toDateMenu3: false,
    fromDateVal3: null,
    toDateVal3: null,
    total3:0,
    total4:0,
    minDate: "2021-03-04",
    maxDate: new Date().toISOString().slice(0, 10),
    transactions:[],
    expenses:[],
    assets:[],
    assetsSales:[],
    headers: [
        { text: 'Invoice #',sortable: false, value: 'invoice_no',},
        { text: 'Customer',sortable: false, value: 'client.name', },
        { text: 'Amount', sortable: false, value: 'amount' },
        { text: 'Created at', sortable: true, value: 'created_at' },
      ],
    headers2: [
        { text: 'Subject',sortable: false, value: 'subject',},
        { text: 'Amount', sortable: false, value: 'amount' },
        { text: 'Created at', sortable: false, value: 'created_at' },
      ],
    headers3: [
        { text: 'Product Name',sortable: false, value: 'product.name',},
        { text: 'Size', sortable: true, value: 'size' },
        { text: 'Color', sortable: true, value: 'color' },
        { text: 'Price', sortable: false, value: 'price' },
        { text: 'Stocks', sortable: true, value: 'stocks' },
        { text: 'Subtotal', sortable: false, value: 'subtotal' },
        { text: 'Created at', sortable: false, value: 'created_at' },
      ],
    headers4: [
        { text: 'Product w/ Variant',sortable: true, value: 'name',},
        { text: 'Price', sortable: false, value: 'price' },
        { text: 'Sold', sortable: false, value: 'qty' },
        { text: 'Subtotal', sortable: false, value: 'subtotal' },
      ],
    }),
    mounted(){
        this.initialize()
    },
    methods: {
        initialize(){
            apiGetAllTransactions().then(({data}) => {
                this.transactions = data
                data = data.map(x => {
                    return x.amount
                })
                const total = data.reduce((a, b) => a + b, 0)
                this.total = total
            })
            apiGetAllExpenses().then(({data}) => {
                this.expenses = data
                data = data.map(x => {
                    return x.amount
                })
                const total = data.reduce((a, b) => a + b, 0)
                this.total2 = total
            })
            apiGetAllAssets().then(({data}) => {
                this.assets = data
                data = data.map(x => {
                    return x.price * x.stocks
                })
                const total = data.reduce((a, b) => a + b, 0)
                this.total3 = total
            })
            apiGetAllAssetsSales().then(({data}) => {
                this.assetsSales = data
                data = data.map(x => {
                    return x.price * x.qty
                })
                const total = data.reduce((a, b) => a + b, 0)
                this.total4 = total
            })
        },
        searchSale(){
            this.fromDateMenu = false
            this.toDateMenu = false
            if (this.toDateVal == null) {
                this.toDateVal = new Date().toISOString().slice(0, 10)
            }
            apiSearchSalesReport(this.fromDateVal, this.toDateVal).then(({data}) => {
                this.transactions = data
                data = data.map(x => {
                    return x.amount
                })
                const total = data.reduce((a, b) => a + b, 0)
                this.total = total
            })
        },
        searchExpenses(){
            this.fromDateMenu2 = false
            this.toDateMenu2 = false
            if (this.toDateVal2 == null) {
                this.toDateVal2 = new Date().toISOString().slice(0, 10)
            }
            apiSearchExpensesReport(this.fromDateVal2, this.toDateVal2).then(({data}) => {
                this.expenses = data
                data = data.map(x => {
                    return x.amount
                })
                const total = data.reduce((a, b) => a + b, 0)
                this.total2 = total
            })
        },
        searchAssets(){
            this.fromDateMenu2 = false
            this.toDateMenu2 = false
            if (this.toDateVal2 == null) {
                this.toDateVal2 = new Date().toISOString().slice(0, 10)
            }
            apiSearchAssetsReport(this.fromDateVal2, this.toDateVal2).then(({data}) => {
                this.expenses = data
                data = data.map(x => {
                    return x.amount
                })
                const total = data.reduce((a, b) => a + b, 0)
                this.total2 = total
            })
        },
        searchAssetsSales(){
            this.fromDateMenu3 = false
            this.toDateMenu3 = false
            if (this.toDateVal3 == null) {
                this.toDateVal3 = new Date().toISOString().slice(0, 10)
            }
            apiSearchAssetsSalesReport(this.fromDateVal3, this.toDateVal3).then(({data}) => {
                this.assetsSales = data
                data = data.map(x => {
                    return x.price * x.qty
                })
                const total = data.reduce((a, b) => a + b, 0)
                this.total4 = total
            })
        },
        print(){
            this.loader = true
            apiPrintSalesReport((
                {
                    data:this.transactions, 
                    from:this.fromDateVal, 
                    to:this.toDateVal,
                    total:this.total
                }
                )).then(response => {
                this.filename = 'preview.pdf'
                this.previewDialogStatus=true
                this.errorMessage = ''
                console.log(response)
            }).catch(data=>{
                console.log(data)
            }).finally(data=>{
                console.log(data)
                this.loader = false
            })
        },
        printExpenses(){
            this.loader = true
            apiPrintExpensesReport((
                {
                    data:this.expenses, 
                    from:this.fromDateVal2, 
                    to:this.toDateVal2,
                    total:this.total2
                }
                )).then(response => {
                this.filename = 'preview.pdf'
                this.previewDialogStatus=true
                this.errorMessage = ''
                console.log(response)
            }).catch(data=>{
                console.log(data)
            }).finally(data=>{
                console.log(data)
                this.loader = false
            })
        },
        printAssets(){
            this.loader = true
            apiPrintAssetsReport(
                {
                    data:this.assets, 
                    from:this.fromDateVal3, 
                    to:this.toDateVal3,
                    total:this.total3
                }
                ).then(response => {
                this.filename = 'preview.pdf'
                this.previewDialogStatus=true
                this.errorMessage = ''
                console.log(response)
            }).catch(data=>{
                console.log(data)
            }).finally(data=>{
                console.log(data)
                this.loader = false
            })
        },
        printAssetsSales(){
            this.loader = true
            apiPrintAssetsSalesReport(
                {
                    data:this.assetsSales, 
                    from:this.fromDateVal3, 
                    to:this.toDateVal3,
                    total:this.total4
                }
                ).then(response => {
                this.filename = 'preview.pdf'
                this.previewDialogStatus=true
                this.errorMessage = ''
                console.log(response)
            }).catch(data=>{
                console.log(data)
            }).finally(data=>{
                console.log(data)
                this.loader = false
            })
        },
        getColor (val) {
            if (val < 1) return 'red'
            else if (val < 5) return 'orange'
            else return 'green'
        },

    },
    components:{
     PdfPreview,
    }
  }
</script>
