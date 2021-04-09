<template>
<div class="container mx-3">
  <v-card-title>
      <h3>Expenses</h3>
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
          <v-form  ref="form" lazy-validation0 @submit.prevent="save"> 
            <v-card-title class="mb-0" >
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text class="my-0 py-0">
              <v-container class="my-0 py-0">
                <v-row class="my-0 py-0">
                  <v-col cols="12" >
                    <v-text-field
                      v-model="editedItem.subject"
                      label="Subject"
                      v-validate="'required'"  
                      :error-messages="errors.collect('Subject')"
                      data-vv-name="Subject"
                    ></v-text-field>
                    <v-text-field
                      v-model="editedItem.amount"
                      label="Amount"
                      v-validate="'required|numeric'"  
                      :error-messages="errors.collect('Amount')"
                      data-vv-name="Amount"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" outlined text @click="close"> Cancel</v-btn>
              <v-btn :loading="loader" color="info" @click="save" >Save</v-btn>
            </v-card-actions>
          </v-form>
          </v-card>
        </v-dialog>
    </v-card-title>

  <v-data-table
    :headers="headers"
    :items="expenses"
    :search="search"
    sort-by="name"
    class="elevation-1"
    :loading="tblLoader"
    loading-text="Loading... Please wait"
  >
    <template v-slot:item.amount="{ item }">
              {{ formatMoney(item.amount) }}
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2 info--text" @click="editItem(item)">
        mdi-pencil
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
import {apiUpdateExpenses, apiGetAllExpenses,apiCreateExpenses} from "@/api/expenses.api";
import FormatHelper from "@/mixins/FormatHelper"

  export default {
    mixins:[FormatHelper],
    data: () => ({
      snackbar:false,
      loader:false,
      text:'Successfully Saved!',
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: 'Subject', value: 'subject' },
        { text: 'Amount', value: 'amount' },
        { text: 'Actions', value: 'actions', sortable: false },

      ],
      expenses: [],
      editedIndex: -1,
      editedItem: {
        index: null,
        subject: null,
        amount:null,
      },
      defaultItem: {
        index: null,
        subject: null,
        amount: null,
      },
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Expense' : 'Update Expense'
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
        await apiGetAllExpenses().then(({data}) => {
              this.expenses = data
              this.tblLoader=false
                console.log(data)
        })
      },
      editItem (item) {
        this.editedIndex = this.expenses.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
 
      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
 
      save () {
        if (this.editedIndex > -1) {
          apiUpdateExpenses(this.editedItem,this.editedItem.id).then(() => {
            this.text ="Updated Successfully!"
            this.snackbar=true
            this.loader=false
            this.$refs.form.reset()
            this.$store.commit('change', Date())
            this.close()
            this.initialize()
          })
        } else {
          this.$validator.validateAll().then(result => {
            if (result){
                  this.loader=true
                    apiCreateExpenses(this.editedItem).then(() => {
                    this.snackbar=true
                    this.text ="Record saved Successfully!"
                    this.loader=false
                    this.$refs.form.reset()
                    this.$store.commit('change', Date())
                    this.close()
                    this.initialize()
                    })
                }
            });
        }
        
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