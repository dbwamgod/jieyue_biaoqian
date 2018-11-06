<style lang="less">
    @import "../styles/menu.less";
</style>

<template>
    <Menu ref="sideMenu" :active-name="activeName" :open-names="['0']" :theme="menuTheme" width="auto"
          @on-select="menuSelect" :accordion="false">
        <Submenu name="1" v-if="dropdown.FAStype">
            <template slot="title">
                <Icon type="ios-analytics"></Icon>
                分类管理
            </template>
            <MenuItem name="1-1" class="levelType" v-if="menuDisplay.first_type">
                <router-link tag="li" to="/typeFirst/index" class="typeHow">一级分类</router-link>
            </MenuItem>
            <MenuItem name="1-2" class="levelType" v-if="menuDisplay.second_type">
                <router-link tag="li" to="/typeFirst/second" class="typeHow">二级分类</router-link>
            </MenuItem>
        </Submenu>
        <MenuItem name="4" class="MenuB" v-if="menuDisplay.data_source">
            <div class="menuContainer">
                <router-link tag="li" to="/queryDataSourcePage/index" class="menuRouter">
                    <Icon type="android-radio-button-on" class="MenuIcon"></Icon>
                    数据源
                </router-link>
            </div>
        </MenuItem>
        <MenuItem name="2" class="MenuB" v-if="menuDisplay.tabManagement">
            <div class="menuContainer">
                <router-link tag="li" to="/Tab_management/index" class="menuRouter">
                    <Icon type="pricetags" class="MenuIcon"></Icon>
                    标签管理
                </router-link>
            </div>
        </MenuItem>
        <MenuItem name="3" class="MenuB" v-if="menuDisplay.proManagement">
            <div class="menuContainer">
                <router-link tag="li" to="/product_management/index" class="menuRouter">
                    <Icon type="filing" class="MenuIcon"></Icon>
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
                menuDisplay: {
                    first_type: false,
                    second_type: false,
                    tabManagement: false,
                    proManagement: false,
                    data_source: false,
                },
                menuListDisplay: [],
                activeName: '1-1',
                accordion: true,
                dropdown: {
                    FAStype: false,//一级分类和二级分类的下拉菜单
                },
                pathNameObj: {
                    'home_list': '1-1',
                    'SourcePage': '4-1',
                    "typeSecond_two":"1-2",
                    'Tab_management_list': '2-1',
                    'product_management_list': '3-1',
                },
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
                    home_list: '1-1', typeSecond_two: '1-2', SourcePage: '4', Tab_management_list: '2',
                    product_management_list: '3'
                };
                this.activeName = pathNameObj[to.name] || pathNameObj[form.name];
                pathNameObj[to.name] && sessionStorage.setItem('pages', pathNameObj[to.name]);
            }
        },
        created () {
            let localQ = JSON.parse(localStorage.getItem('label-Jurisdiction'));
            if (localQ.length !== 0) {
                localQ.forEach(r => {
                    r.resourceCode == 'CLASS_MANAGE' ? r.child.forEach(t => this.menuListDisplay.push(t.resourceCode)) : this.menuListDisplay.push(r.resourceCode);
                });
                let FAStype = 0;
                for (var variable of this.menuListDisplay) {
                    if (variable == 'ONE_CLASS') {
                        FAStype++;
                        this.menuDisplay.first_type = true;
                    } else if (variable == 'TWO_CLASS') {
                        FAStype++;
                        this.menuDisplay.second_type = true;
                    } else if (variable == 'LABEL_MANAGE') {
                        this.menuDisplay.tabManagement = true;
                    } else if (variable == 'PRO') {
                        this.menuDisplay.proManagement = true;
                    } else if (variable == 'DATA_SOURCE') {
                        this.menuDisplay.data_source = true;
                    }
                }

                this.dropdown.FAStype = FAStype >= 1;
            }
            this.activeName = sessionStorage.getItem(`pages`) ? sessionStorage.getItem(`pages`) : this.pathNameObj[this.$store.state.app.currentPageName];
        },

        methods: {
            menuSelect (name) {
                sessionStorage.setItem('pages', name);
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

