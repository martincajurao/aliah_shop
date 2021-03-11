
<template>
  <v-layout>
    <v-row class="mt-2">
      <v-col cols="12" md="12">
        <v-card  class="ml-5 mr-5">
          <v-app-bar
          dark
          color="#2C3A47"
          >
          <v-btn icon>
            <v-icon>mdi-home</v-icon>
          </v-btn>
          <v-toolbar-title>Dashboard</v-toolbar-title>
          </v-app-bar>
        <v-container>
          <v-row>
            <v-col cols="12" sm="4">
              <v-hover
        v-slot:default="{ hover }"
        open-delay="200"
      >
       <v-card
       :elevation="hover ? 16 : 2"
        class="mx-auto"
        max-width="344"
        outlined

    >
    <v-list-item three-line color="success">
      <v-list-item-content>
        <v-list-item-title class="headline mb-1">Products</v-list-item-title>

      </v-list-item-content>

      <v-list-item-avatar
        tile
        size="80"
       color="red darken-2"
      >
        <v-icon dark>fas fa-box-open</v-icon>
      </v-list-item-avatar>
    </v-list-item>
    <v-divider></v-divider>
    <v-card-actions>
      <v-icon flab color="red darken-2">local_offer</v-icon>
      <v-btn text>40,664</v-btn>
      <v-spacer></v-spacer>
      <v-icon flab color="#2C3A47">mdi-chevron-right</v-icon>
    </v-card-actions>
  </v-card>
      </v-hover>
          </v-col>
          <v-col cols="12" sm="4">
        <v-hover
        v-slot:default="{ hover }"
        open-delay="200"
      >
       <v-card
       :elevation="hover ? 16 : 2"
        class="mx-auto"
        max-width="344"
        outlined

      >
    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title class="headline mb-1">Revenue</v-list-item-title>

      </v-list-item-content>

      <v-list-item-avatar
        tile
        size="80"
       color="#009432"
      >
        <v-icon dark>mdi-currency-usd-off</v-icon>
      </v-list-item-avatar>
    </v-list-item>
    <v-divider></v-divider>
    <v-card-actions>
      <v-icon flab color="#009432">directions_walk</v-icon>
      <v-btn text>40,664</v-btn>
      <v-spacer></v-spacer>
      <v-icon flab color="#2C3A47">mdi-chevron-right</v-icon>

    </v-card-actions>
  </v-card>
      </v-hover>

            </v-col>
             <v-col cols="12" sm="4">
              <v-hover
        v-slot:default="{ hover }"
        open-delay="200"
      >
       <v-card
       :elevation="hover ? 16 : 2"
        class="mx-auto"
        max-width="344"
        outlined

  >
    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title class="headline mb-1">Orders</v-list-item-title>

      </v-list-item-content>

      <v-list-item-avatar
        tile
        size="80"
       color="#F79F1F"
      >
        <v-icon dark>fas fa-user</v-icon>
      </v-list-item-avatar>
    </v-list-item>
    <v-divider></v-divider>
    <v-card-actions>
      <v-icon flab color="#F79F1F">description</v-icon>
      <v-btn text>300k</v-btn>
      <v-spacer></v-spacer>
      <v-icon flab color="#2C3A47">mdi-chevron-right</v-icon>

    </v-card-actions>
  </v-card>
      </v-hover>

            </v-col>
          </v-row>
        </v-container>
        </v-card>
      </v-col>
      <v-col cols="10" sm="12">
    <v-card class="px-4">
        <h3 class="py-3">Latest Transactions</h3>
        <v-data-table
          dense
          items-per-page="7"
          :headers="headers"
          :items="desserts"
          item-key="name"
        ></v-data-table>
    </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
  export default {
    data: () => ({
      desserts: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '1%',
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: '1%',
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: '7%',
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: '8%',
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: '16%',
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: '0%',
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: '2%',
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: '45%',
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: '22%',
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: '6%',
        },
      ],
      headers: [
        {
          text: 'Dessert (100g serving)',
          sortable: false,
          value: 'name',
        },
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Iron (%)', value: 'iron' },
      ],
    }),
  }
</script>