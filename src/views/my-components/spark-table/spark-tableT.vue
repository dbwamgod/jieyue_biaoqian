<template>
    <div>
        <form  id='form' action="http://jy2tehdp03:9011/login" method="post">
            <input type="hidden" name="email" value="1578326883@qq.com"><input type="hidden" name="password" value="111111">
        </form>
    </div>
</template>

<script>
    import api from "@/api";


    export default {
        name: 'spark-tableT',
        data() {
            return {}
        },
        methods() {
            console.log(from)
            form.submit();

        }
    };
</script>

<style scoped>
    .workbench{
        width: 100%;
        height: 100%;
    }
    iframe{
        width: 100%;
        height: 100%;
    }
</style>