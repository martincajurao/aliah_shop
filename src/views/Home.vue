
<template>
<div class="mb-0">
  <v-layout class="mr-5">
    <v-row row wrap class="">
      <v-container style="max-height: 280px; overflow-y: hidden;" grid-list-md class='content ml-3  mt-5 '>
        <v-layout row wrap>
            <v-flex  xs6>
                <apexchart ref="areachart"  height="270" width="100%" :options="salesOption" :series="series"></apexchart>
            </v-flex>
            <v-flex  xs6>
                <apexchart ref="barchart"  height="270" width="100%" :options="salesOption2" :series="series2"></apexchart>
            </v-flex>
        </v-layout>
      </v-container>
      <v-col cols="10" sm="12" >
        <v-card class="pb-0 ml-4" style="width:99%; margin-bottom:0px; ">
            <h3 class="py-3">Recent Transactions</h3>
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

import {
  apiGetAllTransactions, 
  apiSearchTransaction, 
  apiGenerateRecieptPdf, 
  apiPrintReciept,
  getBarsData
} from "@/api/transaction.api";
import {getChartData } from "@/api/chart.api";
import FormatHelper from "@/mixins/FormatHelper"
import PdfPreview from '@/components/features/PrintPreviewPdf'

  export default {
    mixins:[FormatHelper],
    data: () => ({
      loader:false,
      previewDialogStatus:false,
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
                reset: true | '<img src="/static/icons/reset.png" width="20">',
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
            },
            labels: {
              formatter: function (num) {
              return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
              }
            },
    },
          dataLabels: {
              enabled: false
          },
          title: {
            text: 'Sales Graph',
            align: 'left'
          },
          tooltip: 
          {
              y: {
                  formatter: function (num) {
                  return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
                  }
              }
          }
       },


      series2: [],

      salesOption2: {
          chart: 
          {
              type: 'bar',
              height: 270
          },
          plotOptions: 
          {
              bar: {
                  horizontal: false,
                  columnWidth: '50%',
                  endingShape: 'rounded'
              },
          },
          dataLabels: 
          {
              enabled: true,
              formatter: function (num) {
                  return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
              }
          },
          stroke: 
          {
              show: true,
              width: 2,
              colors: ['transparent']
          },
          xaxis: 
          {
              categories: [''],
          },
          yaxis: 
          {
              title: {
                  text: 'Statistics'
              },
              labels: {
                formatter: function (num) {
                return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
              }
            },
          },
          fill: 
          {
              opacity: 1
          },
          tooltip: 
          {
              y: {
                  formatter: function (num) {
                  return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
                  }
              }
          }
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
        this.$forceUpdate();
        this.initialize()
      }
    },
    methods:{
      refreshpage(){
        window.location.reload()
      },
      initialize () {
        getChartData().then(({data}) => {
            const map1 = data.map(function (arr) { return [arr.date, arr.sales]})
            // this.series[0].data = map1
            this.$refs.areachart.updateSeries([{
              data: map1
            }], Animation);
        })
        getBarsData().then(({data}) => {
     
            this.$refs.barchart.updateSeries([
                {
                    name: 'Total Sales',
                    data: [data[1][0].total_sales]
                }, 
                {
                    name: 'Remaining Assets',
                    data: [data[0][0].total_assets]
                }, 
                {
                    name: 'Total Expenses',
                    data: [data[2][0].total_expenses]
                }
            ], Animation);
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
        this.loader = true
        apiPrintReciept(({id:item.id})).then(response => {
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
      }
    

    },
    components:{
     PdfPreview,
    }
  }
</script>

