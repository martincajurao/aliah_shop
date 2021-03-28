
<template>
<div>
  <v-layout>
    <v-row row wrap>
      <v-container style="max-height: 280px; overflow-y: hidden;" grid-list-md class='content ml-3 mr-2 '>
        <v-layout row wrap>
            <v-flex  xs6>
                <apexchart  height="270" width="100%" :options="salesOption" :series="series"></apexchart>
            </v-flex>
            <v-flex  xs6 class="">
                <apexchart type="bar" height="270"  width="93%" :options="InvoiceChartOptions" :series="invoiceSeries"></apexchart>
            </v-flex>
        </v-layout>
      </v-container>
      <v-col cols="10" sm="12" >
        <v-card class="pb-0 ml-4" style="width:97%; margin-bottom:0px; ">
            <h3 class="py-3">Latest Transactions</h3>
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search"
              solo
              flat
              dense
              @input="searchProduct"
              class="my-0 py-0"
              style="position:absolute; top:1.5%; left:17%; width:46%;"
            ></v-text-field>
            <v-data-table
              dense
              :items-per-page="itemsPerPage"
              :headers="headers"
              :items="transactions"
              item-key="name"
              style="font-size:12px;"
            >
            <template v-slot:item.created_at="{ item }">
              {{ format_date(item.created_at) }}
            </template>
            <template v-slot:item.amount="{ item }">
              {{ formatMoney(item.amount) }}
            </template>

            <template v-slot:item.client="{ item }">
              <v-row class="pa-0 ma-0">
                <v-col md="2" class="pa-0 ma-0">
                  <img
                    width="35px"
                    height="35px"
                    class="ma-0 mt-1"
                    :style="{
                      backgroundSize: 'cover', 
                      backgroundPosition: 'center',
                      border: '2px solid #D3D3D3', 
                      borderRadius: '50px', 
                      padding: '1px', 
                      backgroundPosition: 'center' 
                      }"
                    :src="`http://127.0.0.1:8000/avatar/${item.client.img}`"
                    >
                </v-col>
                <v-col md="6" class="mx-0 pl-1">
                  <b>{{ item.client.name }}</b>
                </v-col>
              </v-row>
            </template>

            <template v-slot:item.actions="{ item }">
              
              <v-icon  class="mr-2 primary--text" @click="print(item)">
                mdi-printer
              </v-icon>
              <v-icon  @click="exportPdf(item)" class=" primary--text">
                mdi-file-download
              </v-icon>
            </template>
            </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
  <pdf-preview style="z-index:999;" :filename="filename" :dialog="previewDialogStatus" @closePdfPreview="previewDialogStatus=false"> </pdf-preview>
  </div>
</template>

<script>

import {
  apiGetAllTransactions, 
  apiSearchTransaction, 
  apiGenerateRecieptPdf, 
  apiPrintReciept
} from "@/api/transaction.api";
import {getChartData } from "@/api/chart.api";
import FormatHelper from "@/mixins/FormatHelper"
import PdfPreview from '@/components/features/PrintPreviewPdf'

  export default {
    mixins:[FormatHelper],
    data: () => ({
      previewDialogStatus: false,
      filename:'',
      itemsPerPage: 5,
      search:'',
      transactions: [],
      headers: [
        { text: 'Customer',sortable: false, value: 'client', },
        { text: 'Invoice #',sortable: false, value: 'invoice_no',},
        { text: 'Phone #', sortable: false, value: 'client.phone' },
        { text: 'Amount', sortable: false, value: 'amount' },
        { text: 'Created at', sortable: false, value: 'created_at' },
        { text: 'Actions',sortable: false, value: 'actions' },
      ],

      invoiceSeries: [
                {
                    name: 'Paid',
                    data: [280]
                }, 
                {
                    name: 'Total',
                    data: [100]
                }, 
                {
                    name: 'Partially Paid',
                    data: [320]
                },
                {
                    name: 'Unpaid',
                    data: [150]
                }
            ],
            InvoiceChartOptions: {
                chart: 
                {
                    type: 'bar',
                    height: 280
                },
                plotOptions: 
                {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        endingShape: 'rounded'
                    },
                },
                dataLabels: 
                {
                    enabled: true
                },
                stroke: 
                {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                },
                xaxis: 
                {
                    categories: ['2021'],
                },
                yaxis: 
                {
                    title: {
                        text: 'Invoice Count'
                    }
                },
                fill: 
                {
                    opacity: 1
                },
                
            },


        series: [{
          name: 'sales',
          data: []
        }],
        salesOption:{
          chart: {
            type: 'area',
            stacked: false,
            zoom: {
              type: 'x',
              enabled: true,
              autoScaleYaxis: true
            },
            toolbar: {
              tools: {
                download: true,
                selection: false,
                zoom: false,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: false | '<img src="/static/icons/reset.png" width="20">',
                customIcons: []
              },
            },
          },
          xaxis: {
            type: 'datetime',
            tickAmount: 4,
          },
          yaxis: {
            title: {
                text: 'Sales Amount'
            }
          },
          dataLabels: {
              enabled: false
          },
          title: {
            text: 'Sales Graph',
            align: 'left'
          },
        },
        
        
    }),

    mounted(){
      this.initialize()
    },
    computed: {
      trigger() {
        return this.$store.getters.flavor
      }
    },
    watch:{
      trigger() {
        this.initialize()
      }
    },
    methods:{
      refreshpage(){
        window.location.reload()
      },
      initialize () {
        this.previewDialogStatus=false
        getChartData().then(({data}) => {
            const map1 = data.map(function (arr) { return [arr.date, arr.sales]})
            this.series[0].data = map1
            // console.log(this.series[0].data,'depota')
        })
         apiGetAllTransactions().then(({data}) => {
            this.transactions = data
        })
      },
      searchProduct(){
        apiSearchTransaction(this.search).then(({data})=>{
          this.transactions = data
        })
      },
      
      exportPdf(item) {
        apiGenerateRecieptPdf({id:item.id}).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'reciept.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
            this.errorMessage = ''
        }).catch(data=>{
            this.errorMessage = 'Something went wrong while generating PDF file!.'
            console.log(data)
        }).finally(data=>{
            console.log(data)
        })
      },
      print(item){
        apiPrintReciept(({id:item.id})).then(response => {
            this.filename = 'preview.pdf'
            this.previewDialogStatus=true
            this.errorMessage = ''
            console.log(response)
        }).catch(data=>{
            console.log(data)
        }).finally(data=>{
            console.log(data)
        })
      }
    

    },
    components:{
     PdfPreview,
    }
  }
</script>

