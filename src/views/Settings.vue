<template>
    <div class="pt-5">
          <v-form class=""   ref="form" lazy-validation0 @submit.prevent="save" > 
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
                  <v-col cols="9" >
                    <v-text-field
                      label="Name"
                      v-validate="'required'" 
                      v-model="store.name" 
                    ></v-text-field>
                    <v-text-field
                      label="Title"
                      v-model="store.title"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="info" :loading="loader" @click="update" >Update</v-btn>
            </v-card-actions>
          </v-form>
        
        
    </div>
</template>
<script>
import ImagePreviewMixin from "@/mixins/ImagePreviewMixin";
import FormatHelper from "@/mixins/FormatHelper"
import { apiGetStoreSettings, apiUpdateStore} from '@/api/auth.api'

export default {
     mixins: [ImagePreviewMixin,FormatHelper],
    data() {
        return {
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
            console.log(data[0],'storeupdated')
            this.$store.commit('change', Date())
            alert('Updated')
            this. apiGetStoreSettings()
          })
      }
    },
}
</script>