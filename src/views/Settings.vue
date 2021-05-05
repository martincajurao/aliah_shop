<template>
    <div class="pt-1">

      <v-card>
       <h2 class="my-4">Store and Variant Settings</h2>
        <v-tabs vertical>
          <v-tab>
            <v-icon left>
              mdi-store
            </v-icon>
            Store
          </v-tab>
          <v-tab>
            <v-icon left>
              mdi-palette
            </v-icon>
            Colors
          </v-tab>
          <v-tab>
            <v-icon left>
              mdi-resize
            </v-icon>
            Sizes
          </v-tab>

          <v-tab-item>
            <v-card flat class="w-full">
              <v-card-text style="width: 69vw; height: 80vh;">
                <v-form class="w-full"   ref="form" lazy-validation0 @submit.prevent="save" > 
                  <v-card-title class="mb-0" >
                    <span class="headline">Store Settings</span>
                  </v-card-title>
            
                  <v-card-text class="my-0 py-0">
                    <v-container class="my-0 py-0">
                      <v-row no-gutters class="my-0 py-0">
                        <v-col cols="4" >
                          <v-card  flat>
                            <h3>Image Preview</h3>
                            <v-card-text>
                              <img 
                              :src="previewImage" 
                              class="uploading-image mt-0 "
                              height="170px"
                              width="170px" 
                              />
                              <input
                              hide-details="auto"
                              class="mt-2 pt-1" 
                              width="150px"
                              type="file" 
                              accept="image/jpeg" 
                              @change="uploadImage">
                            </v-card-text>
                          </v-card>
                        </v-col>
                        <v-col cols="4" class="mt-10" >
                          <v-text-field
                            label="Name"
                            v-validate="'required'" 
                            v-model="store.name" 
                          ></v-text-field>
                          <v-text-field
                            label="Title"
                            v-model="store.title"
                          ></v-text-field>
                          <v-spacer></v-spacer>
                            <v-btn color="info" :loading="loader" @click="update" >Update</v-btn>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text style="width: 69vw; height: 80vh;">
                <Color/>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text style="width: 69vw; height: 80vh;">
               <Size/>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-card>

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
    </div>
</template>
<script>
import ImagePreviewMixin from "@/mixins/ImagePreviewMixin";
import FormatHelper from "@/mixins/FormatHelper"
import { apiGetStoreSettings, apiUpdateStore} from '@/api/auth.api'
import Color from '@/views/Color'
import Size from '@/views/Size'

export default {
     mixins: [ImagePreviewMixin,FormatHelper],
    components:{
        Color,
        Size,
    },
    data() {
        return {
          text:'sdasd',
          snackbar:false,
          store:[],
          previewImage:'http://127.0.0.1:8000/images/default.jpg',
        }
    },
    mounted(){
      apiGetStoreSettings().then(({data}) => {
            console.log(data[0],'store')
            this.store = data[0]
            this.previewImage = 'http://127.0.0.1:8000/images/'+data[0].img
      })
    },
    methods:{
      uploadImage(e){
        const image = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = e =>{
          this.previewImage = e.target.result;
          this.store.image = image
          this.store.img = image.name
        };
      },

      update(){
          const formData = new FormData
          formData.set('image', this.store.image)
          formData.set('img', this.store.img)
          formData.set('name', this.store.name)
          formData.set('title', this.store.title)
          formData.append('_method', 'patch');
          apiUpdateStore(formData, 1).then(({data}) => {
            this.snackbar=true
            this.text ="Store Successfully Updated!"
            console.log(data[0],'storeupdated')
            this.$store.commit('change', Date())
            this. apiGetStoreSettings()
          })
      }
    },
}
</script>