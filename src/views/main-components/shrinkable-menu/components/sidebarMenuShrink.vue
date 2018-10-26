<template>
    <div>
        <template>
            <div style="text-align: center;" key="grala">
                <Dropdown transfer  placement="right-start" :key="1" @on-click="changeMenu">
                    <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <Icon type="ionic" :size='20' color="#fff"></Icon>
                    </Button>
                    <DropdownMenu style="width: 200px;" slot="list">
                        <DropdownItem name="home_list" key="1-1"><span style="padding-left:10px;">一级分类</span></DropdownItem>
                        <DropdownItem name="typeSecond_two" key="1-2"><span style="padding-left:10px;">二级分类</span></DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown transfer  placement="right-start" :key="4" @on-click="changeMenu">
                    <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <!-- <Icon :size="20" :color="iconColor" :type="item.icon"></Icon> -->
                        <Icon type="android-radio-button-on" :size='20' color="#fff"></Icon>
                    </Button>
                    <DropdownMenu style="width: 200px;" slot="list">
                        <DropdownItem name="SourcePage" key="4-1"><span style="padding-left:10px;">源数据</span></DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown transfer  placement="right-start" :key="2" @on-click="changeMenu">
                    <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <!-- <Icon :size="20" :color="iconColor" :type="item.icon"></Icon> -->
                        <Icon type="pricetags" :size='20' color="#fff"></Icon>
                    </Button>
                    <DropdownMenu style="width: 200px;" slot="list">
                        <DropdownItem name="Tab_management_list" key="2-1"><span style="padding-left:10px;">标签管理</span></DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown transfer  placement="right-start" :key="3" @on-click="changeMenu">
                    <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <!-- <Icon :size="20" :color="iconColor" :type="item.icon"></Icon> -->
                        <Icon type="filing" :size='20' color="#fff"></Icon>
                    </Button>
                    <DropdownMenu style="width: 200px;" slot="list">
                        <DropdownItem name="product_management_list" key="3-1"><span style="padding-left:10px;">产品管理</span></DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'sidebarMenuShrink',
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
