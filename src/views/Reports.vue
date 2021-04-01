<template  >
<div>
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
                            <v-icon  class="mr-2 primary--text" @click="print()">
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
                <v-tab-item>
                    <v-card flat>
                    <v-card-text>
                        <p>
                        Morbi nec metus. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Nunc sed turpis.
                        </p>

                        <p>
                        Suspendisse feugiat. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In hac habitasse platea dictumst. Fusce ac felis sit amet ligula pharetra condimentum.
                        </p>

                        <p>
                        Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Nam commodo suscipit quam. In consectetuer turpis ut velit. Sed cursus turpis vitae tortor. Aliquam eu nunc.
                        </p>

                        <p>
                        Etiam ut purus mattis mauris sodales aliquam. Ut varius tincidunt libero. Aenean viverra rhoncus pede. Duis leo. Fusce fermentum odio nec arcu.
                        </p>

                        <p class="mb-0">
                        Donec venenatis vulputate lorem. Aenean viverra rhoncus pede. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. Fusce commodo aliquam arcu. Suspendisse enim turpis, dictum sed, iaculis a, condimentum nec, nisi.
                        </p>
                    </v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item>
                    <v-card flat>
                    <v-card-text>
                        <p>
                        Fusce a quam. Phasellus nec sem in justo pellentesque facilisis. Nam eget dui. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In dui magna, posuere eget, vestibulum et, tempor auctor, justo.
                        </p>

                        <p class="mb-0">
                        Cras sagittis. Phasellus nec sem in justo pellentesque facilisis. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nam at tortor in tellus interdum sagittis.
                        </p>
                    </v-card-text>
                    </v-card>
                </v-tab-item>
                </v-tabs>

        </v-card>
    </div>
</div>
</template>
<script>
import {apiGetAllTransactions, apiPrintSalesReport, apiSearchSalesReport} from "@/api/transaction.api";
import FormatHelper from "@/mixins/FormatHelper"
import PdfPreview from '@/components/features/PrintPreviewPdf'

  export default {
    mixins:[FormatHelper],
    data: () => ({
    previewDialogStatus: false,
    filename:'',
    fromDateMenu: false,
    toDateMenu: false,
    fromDateVal: null,
    toDateVal: null,
    minDate: "2021-03-04",
    maxDate: new Date().toISOString().slice(0, 10),
    total:0,
    transactions:[],
    headers: [
        { text: 'Invoice #',sortable: false, value: 'invoice_no',},
        { text: 'Customer',sortable: false, value: 'client.name', },
        // { text: 'Phone #', sortable: false, value: 'client.phone' },
        { text: 'Amount', sortable: false, value: 'amount' },
        { text: 'Created at', sortable: false, value: 'created_at' },
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
        print(){
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
            })
        },

    },
    components:{
     PdfPreview,
    }
  }
</script>
