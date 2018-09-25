<style lang="less">
    @import "../styles/menu.less";
</style>

<template>
    <Menu ref="sideMenu" :active-name="activeName" :open-names="['0']" :theme="menuTheme" width="auto"
          @on-select="menuSelect"  :accordion="false">
        <Submenu name="1" style='margin-top: 10px;'>
            <template slot="title">
                <Icon type="ios-analytics"></Icon>
                <router-link tag="span" to="/typeFirst">分类管理</router-link>
            </template>

            <MenuItem name="1-1" style="padding: 0">

                <router-link tag="li" to="/typeFirst"
                             style="width:100%;height: 50px;text-align: center;line-height: 50px;">一级分类
                </router-link>

            </MenuItem>
            <MenuItem name="1-2" style="padding: 0">

                <router-link tag="li" to="/typeSecond/index"
                             style="width:100%;height: 50px;text-align: center; line-height: 50px;">二级分类
                </router-link>

            </MenuItem>
        </Submenu>
        <MenuItem name="2" style="padding: 0; margin:0;">
            <div style="margin: 0 24px;">
                <router-link tag="li" to="/Tab_management/index"
                             style="width:100%;  height: 50px;line-height: 50px; font-size:14px; ">
                        <Icon type="pricetags" style='margin-right:8px;'></Icon>
                    标签管理

                </router-link>
            </div>
        </MenuItem>
        <MenuItem name="3" style="padding: 0;font-weight: 100;">
            <div style="margin: 0 24px;">
                <router-link tag="li" to="/product_management/index"
                             style="width:100%; height: 50px; line-height: 50px; ">

                    <Icon type="filing" style='margin-right:8px;'></Icon>
                    产品管理
                </router-link>
            </div>
        </MenuItem>
    </Menu>
</template>

<script>
    import Cookies from 'js-cookie';

    export default {
        data () {
            return {
                activeName: '1-1',
                accordion: true
            };
        },
        name: 'sidebarMenu',
        props: {
            menuList: Array,
            iconSize: Number,
            menuTheme: {
                type: String,
                default: 'dark'
            },
            openNames: {
                type: Array
            }
        },
        watch: {
            '$route' (to, form) {
                const pathNameObj = {
                    home_index: '1-1', typeSecond_index: '1-2', Tab_management_index: '2',
                    product_management_index: '3'
                };
                if (pathNameObj[to.name]) {
                    this.activeName = pathNameObj[to.name];
                    Cookies.set("pages",pathNameObj[to.name])
                }
            }
        },
        created () {
            this.activeName = Cookies.get('pages') || '1-1';
        },


        methods: {
            menuSelect (name) {
                Cookies.set('pages', name);
                this.$store.commit('addOpenSubmenu', name);
            }
        },
        updated () {
            this.$nextTick(() => {
                if (this.$refs.sideMenu) {
                    this.$refs.sideMenu.updateOpened();
                }
            });
        }
    };
</script>
<style>
    router-link {
        color: white;
    }
</style>

