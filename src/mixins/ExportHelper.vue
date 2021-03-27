<script>

export default {
    data() {
        return {
            errorMessage:'',
            previewDialogStatus: false,
            filename:'',
            loader:null
        }
    },
    methods:{
         _generatePdf( filename, type = 'post', data = {}, extension = 'pdf') {
            let final_filename = `${filename}_${new Date().toJSON().slice(0,10).replace(/-/g,'/')}`
            this.loader = this.$loading.show({container: this.$refs.formContainer,})

            this.pdfGeneratorApi(data).then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', final_filename+'.'+extension);
                document.body.appendChild(link);
                link.click();
                link.remove();
                this.errorMessage = ''
            }).catch(data=>{
                this.errorMessage = 'Something went wrong while generating PDF file!.'
            }).finally(data=>{
                this.loader.hide()
            })
        },
         _generateCsv(filename, type = 'post', data = {}, extension = 'csv') {
            let final_filename = `${filename}_${new Date().toJSON().slice(0,10).replace(/-/g,'/')}`
            this.loader = this.$loading.show({container: this.$refs.formContainer,})

            this.csvGeneratorApi(data).then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', final_filename+'.'+extension);
                document.body.appendChild(link);
                link.click();
                link.remove();
                this.errorMessage = ''
            }).catch(data=>{
                this.errorMessage = 'Something went wrong while generating CSV file!.'
            }).finally(data=>{
                this.loader.hide()
            })
        
        },
        _generatePrint( filename, type = 'get', data = {}, extension = '') {
            let final_filename = `${filename}_${new Date().toJSON().slice(0,10).replace(/-/g,'/')}`
            this.loader = this.$loading.show({container: this.$refs.formContainer,})
            this.previewDialogStatus=false

            this.printGeneratorApi(data).then(response => {
                this.filename = 'preview.pdf'
                this.previewDialogStatus=true
                this.errorMessage = ''
            }).catch(data=>{
                this.errorMessage = 'Something went wrong while generating print preview!.'
            }).finally(data=>{
                this.loader.hide()
            })
        },
       
    }
}
</script>
