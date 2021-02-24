<template>
    <div>
        <v-card>
          <v-form  ref="form" lazy-validation0> 
            <v-card-title class="" >
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <div>
                      <img :src="previewImage" class="uploading-image" />
                      <input type="file" accept="image/jpeg" @change="uploadImage">
                    </div>
                    <!-- <img
                    v-if="imagePreviewURL"
                    :src="imagePreviewURL"
                    alt=""
                    style="max-width: 100%;width: 250px; object-fit: cover"
                    />
                    <v-file-input
                    v-model="avatarImage"

                    label="Image"
                    required
                    @change="onFileChange"
                  ></v-file-input> -->
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.name"
                      label="Product name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.desc"
                      label="Description"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.price"
                      label="Price"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.stocks"
                      label="Stocks"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.status"
                      label="Status"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <!-- <v-divider></v-divider> -->
            </v-card-text>

            <v-card-actions>
              
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                outlined
                text
                @click="close"
                
              >
                Cancel
              </v-btn>
           
              <v-btn
                color="info"
                @click="save"
                
              >
                Save
              </v-btn>
              
            </v-card-actions>
          </v-form>
          </v-card>
    </div>
</template>
<script>
export default {
    props:[
        formTitle,
        previewImage
        ]
}
</script>