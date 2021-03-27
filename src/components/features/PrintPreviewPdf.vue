<template>
   
    <v-navigation-drawer  v-model="previewDialogStatus" 
        absolute temporary right
        width="100%"
        height="91vh"
        class="right-sidebar-wrapper">
        <v-btn @click="$emit('closePdfPreview')" class="closePreviewBtn" fab color="error">
            <v-icon>mdi-close</v-icon>
        </v-btn>
        <webview v-if="previewDialogStatus" plugins  :src="`${getPreviewPdfUrl()}/${filename}`" style="height:90vh;" ></webview>
    </v-navigation-drawer>

</template>
<script>
import {PDF_FILE_PATH} from '@/global/variables'
export default {
    data () {
        return {
            previewDialogStatus:false
        }
    },
    props:['dialog','filename'],
    watch:{
        dialog: {
            handler(val) {
                this.previewDialogStatus = val
            },
            immediate:true
        }
    },
    methods:{
    getPreviewPdfUrl(){
            return PDF_FILE_PATH
      },
    }
}
</script>
<style scoped>
.closePreviewBtn{
    position: absolute;
    top: 40%;
    left: 5%;
}

</style>