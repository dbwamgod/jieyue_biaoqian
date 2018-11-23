<template>
    <div>
        <template>
            <div class="downContainer" key="grala">
                <Dropdown transfer placement="right-start" :key="1" @on-click="changeMenu" v-if="dropdown.FAStype">
                    <Button class="levelTypeButton" type="text">
                        <Icon type="ionic" :size='20' color="#fff"></Icon>
                    </Button>
                    <DropdownMenu class="downMenu" slot="list">
                        <DropdownItem name="home_list" key="1-1" v-if="menuDisplay.ONE_CLASS"><span class="downText">一级分类</span>
                        </DropdownItem>
                        <DropdownItem name="typeSecond_two" key="1-2" v-if="menuDisplay.TWO_CLASS"><span
                                class="downText">二级分类</span></DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown transfer placement="right-start" :key="4" @on-click="changeMenu"
                          v-if="menuDisplay.DATA_SOURCE">
                    <Button class="levelTypeButton" type="text">
                        <Icon type="android-radio-button-on" :size='20' color="#fff"></Icon>
                    </Button>
                    <DropdownMenu class="downMenu" slot="list">
                        <DropdownItem name="SourcePage" key="4-1">
                            <span class="downText">源数据</span>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown transfer placement="right-start" :key="2" @on-click="changeMenu"
                          v-if="menuDisplay.LABEL_MANAGE">
                    <Button class="levelTypeButton" type="text">
                        <Icon type="pricetags" :size='20' color="#fff"></Icon>
                    </Button>
                    <DropdownMenu class="downMenu" slot="list">
                        <DropdownItem name="Tab_management_list" key="2-1">
                            <span class="downText">标签管理</span>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown transfer placement="right-start" :key="3" @on-click="changeMenu" v-if="menuDisplay.PRO">
                    <Button class="levelTypeButton" type="text">
                        <Icon type="filing" :size='20' color="#fff"></Icon>
                    </Button>
                    <DropdownMenu class="downMenu" slot="list">
                        <DropdownItem name="product_management_list" key="3-1">
                            <span class="downText">产品管理</span>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        name: 'sidebarMenuShrink',
        data () {
            return {
                menuDisplay: {
                    'ONE_CLASS': false,
                    'TWO_CLASS': false,
                    'LABEL_MANAGE': false,
                    'PRO': false,
                    'DATA_SOURCE': false,
                },
                dropdown: {
                    FAStype: false,
                },
                menuListDisplay: []
            };
        },
        props: {
            menuList: {
                type: Array
            },
            iconColor: {
                type: String,
                default: 'white'
            },
            menuTheme: {
                type: String,
                default: 'dark'
            }
        },
        created () {
            //判断下拉菜单是否显示
            let localQ = JSON.parse(localStorage.getItem('label-Jurisdiction'));
            localQ && localQ.length && localQ.forEach(r => {
                r.resourceCode == 'CLASS_MANAGE' ? r.child.forEach(t => this.menuListDisplay.push(t.resourceCode)) : this.menuListDisplay.push(r.resourceCode);
            });
            let FAStype = 0;
            this.menuListDisplay.length && this.menuListDisplay.map(r => {
                r == 'ONE_CLASS' || r == 'TWO_CLASS' ? FAStype++ : '';
                this.menuDisplay[r] = true;
            });
            this.dropdown.FAStype = FAStype >= 1;
        },
        methods: {
            changeMenu (active) {
                this.$emit('on-change', active);
            },
            itemTitle (item) {
                if (typeof item.title === 'object') {
                    return this.$t(item.title.i18n);
                } else {
                    return item.title;
                }
            }
        }
    };
</script>

<style scoped lang="less">
    .downContainer {
        text-align: center;
    }

    .levelTypeButton {
        width: 70px;
        margin-left: -5px;
        padding: 10px 0;
    }

    .downMenu {
        width: 200px;
        .downText {
            padding-left: 10px;
        }
    }

</style>
