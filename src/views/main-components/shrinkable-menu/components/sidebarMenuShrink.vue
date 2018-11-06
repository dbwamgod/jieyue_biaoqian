<template>
    <div>
        <template>
            <div class="downContainer" key="grala">
                <Dropdown transfer placement="right-start" :key="1" @on-click="changeMenu" v-if="dropdown.FAStype">
                    <Button class="levelTypeButton" type="text">
                        <Icon type="ionic" :size='20' color="#fff"></Icon>
                    </Button>
                    <DropdownMenu class="downMenu" slot="list">
                        <DropdownItem name="home_list" key="1-1" v-if="menuDisplay.first_type"><span class="downText">一级分类</span></DropdownItem>
                        <DropdownItem name="typeSecond_two" key="1-2" v-if="menuDisplay.second_type"><span class="downText">二级分类</span></DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown transfer placement="right-start" :key="4" @on-click="changeMenu" v-if="menuDisplay.data_source">
                    <Button class="levelTypeButton" type="text">
                        <Icon type="android-radio-button-on" :size='20' color="#fff"></Icon>
                    </Button>
                    <DropdownMenu class="downMenu" slot="list">
                        <DropdownItem name="SourcePage" key="4-1">
                            <span class="downText">源数据</span>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown transfer placement="right-start" :key="2" @on-click="changeMenu" v-if="menuDisplay.tabManagement">
                    <Button class="levelTypeButton" type="text">
                        <Icon type="pricetags" :size='20' color="#fff"></Icon>
                    </Button>
                    <DropdownMenu class="downMenu" slot="list">
                        <DropdownItem name="Tab_management_list" key="2-1">
                            <span class="downText">标签管理</span>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown transfer placement="right-start" :key="3" @on-click="changeMenu" v-if="menuDisplay.proManagement">
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
                    first_type: false,
                    second_type: false,
                    tabManagement: false,
                    proManagement: false,
                    data_source: false,
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
                default: 'darck'
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
                this.dropdown.FAStype = FAStype >=1;
            }
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