<template>
  
      <iframe id="myframe" frameborder="0" scrolling="auto"  :src="iframeSrc" ></iframe>
   
</template>
<script>
//frameborder="0" scrolling="no"
import Cookies from "js-cookie";
    export default{
        data(){
            return {
                iframeSrc:'',
            }
        },
        created(){
         this.iframeSrc=Cookies.get('azkaban');
        
        },
        methods:{
       
       },
    }
</script>
<style>
 .workbench{
     width: 100%;
     height: 100%;
 }
 iframe{
     width: 100%;
     height: 100%;
 }
</style>

