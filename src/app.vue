<template>
    <div id="main" class="app-main">
        <router-view v-if="bock"></router-view>
    </div>
</template>

<script>
    import Cookies from "js-cookie"

    export default {
        //局部重新加载(dom)和请除所有cookies
        provide () {
            return {
                reload: this.reload,
                out:this.out
            };
        },
        data () {
            return {
                bock: true,
                theme: this.$store.state.app.themeColor
            };
        },
        created () {
            Array.prototype.remove = function (val) {
                let index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            };
        },
        methods: {
            reload () {
                this.bock = false;
                this.$nextTick(function () {
                    this.bock = true;
                });
            },
            out(){
                let keys= Object.keys(Cookies());
                keys.map(r=>{
                    Cookies.remove(r);
                });
            }
        }
    };
</script>

<style>
    html,body {
        width: 100%;
        height: 100%;
        background: #f0f0f0;
        overflow: hidden;
    }
    .app-main {
        width: 100%;
        height: 100%;
    }
</style>
