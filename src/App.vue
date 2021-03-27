<template>
  <v-app style="-webkit-app-region: drag">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      permanent
     color="#2C3A47"
     dark
      app
    >
    <v-list-item class="px-2 pt-1">
        <v-list-item-avatar>
            <v-img src="./assets/watch.png" alt="admin" class="mx-auto" />
        </v-list-item-avatar>
        <v-list-item-title class="ml-4 text-capitalize">Aliah Shop</v-list-item-title>
    </v-list-item>
      <v-list shaped  class="clickable">
        <template v-for="item in items">
          <v-list-group
            v-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item['icon-ctr']"
            :append-icon="item.model ? item.icon : item['icon-alt']"
            active-class="orange--text"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title >
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              route :to="child.route"
                active-class="orange--text"
            >
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :key="item.text"
                active-class="orange--text"
             route :to="item.route"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>  
    
      </v-list>

    </v-navigation-drawer>
    <v-app-bar

      app
      color="#2C3A47"
      dark
    >
      <v-app-bar-nav-icon @click.stop="mini = !mini"  class="clickable"/>
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-4"
      >
        <span class="hidden-sm-and-down">Inventory System</span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon   class="clickable">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container
       class="scroll-y"
       fluid
      >
       <v-row align="center" justify="center">
         <transition name="slide-fade">
           <router-view ></router-view>
         </transition>
       </v-row>
      </v-container>
    </v-main>
   
    <v-btn
    v-scroll="onScroll"
    bottom
    color="pink"
    dark
    fab
    fixed
    right
    @click="toTop"
    class="clickable"
    >
    <v-icon>mdi-chevron-up</v-icon>
    </v-btn>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          bottom
          color="success"
          dark
          v-on="on"
          v-bind="attrs"
          fab
          fixed
          right
          @click="triggerInit"
          style="bottom:11%"
          >
          <v-icon>mdi-cart</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-toolbar
          dark
          color="info"
        >
        <v-icon>mdi-cart</v-icon>
          <v-toolbar-title> Purchase Product</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            icon
            dark
            right
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
          <Pos ref="init"  />
      </v-card>
    </v-dialog>
  </v-row>

  </v-app>
</template>

<script>
//import * as auth from '../services/auth_service'
import Pos from '@/views/Pos'
  export default {
    props: {
      source: String,
    },
    data: () => ({
    dialog: false,
    drawer: null,
      mini: false,
      fab: false,
      items: [
        { icon: 'mdi-view-dashboard', text: 'Dashboard' , route:'/'},
        {
          icon: 'mdi-chevron-up',
          'icon-alt': 'mdi-chevron-down',
          'icon-ctr': 'mdi-cart-arrow-right',
          text: 'Inventory',
          model: false,
          children: [
        { icon: 'style', text: 'Products', route:'/products' },
        { icon: 'atm', text: 'Category', route:'/category' },
          ],
        },
        {
          icon: 'mdi-chevron-up',
          'icon-alt': 'mdi-chevron-down',
          'icon-ctr': 'mdi-account-group',
          text: 'Users',
          model: false,
          children: [
        { icon: 'mdi-account-multiple', text: 'Clients', route:'/clients'},
        { icon: 'mdi-account-multiple-outline', text: 'Employee', route:'/employee' },
          ],
        },
        { icon: 'mdi-finance', text: 'Revenue', route:'/revenue' },
        { icon: 'mdi-chart-pie', text: 'Analytics', route:'/chart' },
        { icon: 'mdi-magnify', text: 'Search', route:'/recherches' },
      ],
    }),
  
    mounted(){
    },
    methods: {

      onScroll (e) {
        if (typeof window === 'undefined') return
        const top = window.pageYOffset || e.target.scrollTop || 0
        this.fab = top > 20
      },
      toTop () {
        this.$vuetify.goTo(0)
      },
      triggerInit() {
        this.$refs.init.initialize()
      }
    },
    components:{
      Pos,
    }
    
  }
</script>

<style >
*{
margin: 0;
padding: 0;
}
*{
    -webkit-app-region: no-drag;
}
::-webkit-scrollbar {
  width: 12px;
}
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
}
.slide-fade-enter-active {
  transition: all .4s ease;
}

.slide-fade-enter
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(150px);
  opacity: 0;
}
</style>