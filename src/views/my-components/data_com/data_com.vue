<template>
    <div>
        <Table border :columns="columns7" :data="data6"></Table>
        <Page :total="dataCount" :page-size="page.pageSize" :current="page.pageIndex" show-total class="paging" @on-change="changepage"></Page>

    </div>
</template>

<script>
    import api from '@/api';
    import Cookies from 'js-cookie';

    export default {
        data () {
            return {
                dataCount:0,
                page:{
                    pageSize:10,
                    pageIndex:1
                },
                columns7: [
                    {
                        title: '表名',
                        key: 'tableName',
                    },
                    {
                        title: '列名',
                        key: 'columnName'
                    },
                    {
                        title: '类型',
                        key: 'operation'
                    }, {
                        title: '改后的类型',
                        key: 'columnType',
                    },
                    {
                        title: '创建时间',
                        key: 'createTime'
                    }, {
                        title: '处理',
                        key: 'valid'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.$axios({
                                                method:"post",
                                                url:api.modifyMeta(),
                                                data:{
                                                    pageSize:"10",
                                                    pageIndex:"1",
                                                    id:this.data6[params.index].id,
                                                },
                                                headers:{
                                                    Authorization:Cookies.get("token"),
                                                    'Content-Type': 'application/json;charset=UTF-8'
                                                }
                                            }).then(res=>{
                                                if(res.data.code==200){
                                                    this.data6[params.index].valid=1
                                                }
                                            })
                                        }
                                    }
                                }, '已处理'),
                            ]);
                        }
                    }
                ],
                data6: []
            };
        },
        name: 'data_com',
        created () {
            this.com_data();
        },
        methods: {
            changepage(index) {
                this.page.pageIndex=index;
                this.com_data();
            },

            com_data () {
                this.$axios({
                    method: 'post',
                    url: api.com_Data(),
                    data: {
                        id: 1,
                        pageSize:this.page.pageSize,
                        pageIndex:this.page.pageIndex,
                    },
                    headers:{
                        Authorization:Cookies.get("token"),
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(res => {

                    if(res.data.code==200){

                        res.data.data.forEach((item,index)=>{

                            if(item.operation==="MODIFY"){
                                item.columType="列编辑"
                            }else if(item.operation==="ADD"){
                                item.columType="列增加"
                            }else{
                                item.columType="列删除"
                            }
                            this.data6=res.data.data;

                            this.data6[index].columnType=res.data.data[index].columType
                        });
                        this.dataCount=res.data.page.totalRecords

                    }
                });

            },

        }
    };
</script>

<style scoped>
    .paging {
        float: right;
        margin-top: 10px;

    }
</style>