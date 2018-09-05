<template>
    <div id="main" class="app-main">
        <router-view v-if="bock"></router-view>
    </div>
</template>

<script>
    export default {
        provide () {
            return {
                reload: this.reload
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
        mounted () {
        },
        beforeDestroy () {
        },
        methods: {
            reload () {
                this.bock = false;
                this.$nextTick(function () {
                    this.bock = true;
                });
            }
        }
    };
</script>

<style>
    html,
    body {
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
