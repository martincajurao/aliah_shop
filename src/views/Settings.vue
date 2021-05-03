<template>
    <div>
       
          <v-form   ref="form" lazy-validation0 @submit.prevent="save" > 
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
                  <v-col cols="8" >
                    <v-text-field
                      label="Name"
                      v-validate="'required'"  
                    ></v-text-field>
                    <v-text-field
                      label="Title"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="info" :loading="loader" @click="save" >Update</v-btn>
            </v-card-actions>
          </v-form>
        
        
    </div>
</template>
<script>
import ImagePreviewMixin from "@/mixins/ImagePreviewMixin";
import FormatHelper from "@/mixins/FormatHelper"
export default {
     mixins: [ImagePreviewMixin,FormatHelper],
    data() {
        return {
            
        }
    },
}
</script>