
<script>
import moment from 'moment'
export default {
    data () {
      return{
        
      }
    },
    methods:{
        format_date(value){
         if (value) {
           return moment(String(value)).format('MM/DD/YYYY hh:mm A')
          }
        },
        formatMoney(n) {
          return "₱ " + (Math.round(n * 100) / 100).toLocaleString();
        },
        random(min,max){
            return Math.floor(Math.random()*(max-min+1)+min);
        }
       
      }
}
</script>