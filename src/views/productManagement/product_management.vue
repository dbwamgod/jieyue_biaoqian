<template>
    <div class="all_box">
        <Row type="flex" justify="space-between" align="middle" class="code-row-bg">
            <Col span="6">
            <h2 class="header-title">产品管理</h2>
            </Col>
            <Col span="6" class="search-add">
            <Button type="primary" @click="newCreate" style="margin-right: 4%;" v-if="adds">新建
            </Button>
            <Input v-model="labelname" icon="ios-search" placeholder="请搜索..." style="width: 40%;"/>
            <Button type="primary" @click="searchChange">搜索</Button>
            </Col>
        </Row>
        <Table border :columns="columns7" :data="data6"></Table>
        <Page :total="dataCount" show-total :page-size="page.pageSize" :current="page.pageIndex" class="paging"
              @on-change="changepage"/>
    </div>
</template>

<style scoped>
    .paging {
        float: right;
        margin: 10px 20px 0 0;
    }
</style>
<script>

    import api from '@/api';
    import Cookies from 'js-cookie';
    import util from '@/libs/util.js';

    export default {
        inject: ['reload'],
        data () {
            return {
                flag:0,
                lineTest:false,
                adds: false,//新增权限
                operation: {
                    edit: false,
                    del: false,
                    binding: false,
                    edit_del: false,
                    edit_binding: false,
                    del_binding: false,
                    edit_del_binding: false,
                    findLabel:false,
                    findLabelPage:false,
                },//权限校验的数据
                labelname: '',
                dataCount: 0,
                page: {
                    pageIndex: 1,
                    pageSize: 10
                },
                columns7: [
                    {
                        title: '序号',
                        key: 'id',
                    },
                    {
                        title: '名称',
                        key: 'productName'
                    },
                    {
                        title: '类别',
                        key: 'categoryName'
                    },
                    {
                        title: '时间',
                        key: 'modifyTime'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 350,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                this.operation.binding|| this.operation.edit_binding || this.operation.del_binding || this.operation.edit_del_binding ?     h('Button', {props: {
                                        type: 'success',
                                        size: 'small'
                                    }, style: {
                                        marginRight: '10px'
                                    }, on: {
                                        click: () => {
                                            Cookies.set('now_index', this.page.pageIndex);
                                            this.$router.push({
                                                name: 'check_product',
                                                query: {
                                                    id: JSON.stringify(this.data6[params.index].id),
                                                    findLabel:this.operation.findLabel,
                                                    findLabelPage:this.operation.findLabelPage,
                                                }
                                            });
                                        }
                                    }}, '查看'):"",
                              this.operation.edit || this.operation.edit_del || this.operation.edit_binding || this.operation.edit_del_binding ?  h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    }, style: {
                                        marginRight: '10px'
                                    },
                                    on: {
                                        click: () => {
                                            Cookies.set('now_index', this.page.pageIndex);
                                            this.edit(this.data6[params.index]);
                                        }
                                    }
                                }, '编辑'):"",
                                this.operation.del|| this.operation.edit_del || this.operation.edit_binding || this.operation.edit_del_binding ?    h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.product_delete(this.data6[params.index].id);
                                        }
                                    }
                                }, '删除'):""
                            ]);
                        }
                    }
                ],
                data6: [],
                searchInfo: false,
                keyword: ''
            };
        },
        created () {
            util.labelJurisdiction(this.columns7,this, 'PRO-ADD', 'PRO-UPDATE', 'PRO-DEL', "" ,'PRO-DETAIL', 'PRO-DETAIL-PO_LIST', 'PRO-DETAIL-PO_EXCEL');


            if (Cookies.get('now_index')) {
                this.page.pageIndex = Number(Cookies.get('now_index'));
                Cookies.remove('now_index');
            }
            this.labelname = this.$store.state.app.productSearch;
            this.init();
        },
        methods: {
            searchChange () {
                /* if (this.data6 || this.labelname) {
                     this.page.pageIndex = 1;
                     this.init();
                 } else {
                     this.$Message.info('请输入搜索词');
                 }*/

                this.keyword = this.labelname;
                this.$store.commit('SearchFunction', this.keyword);
                this.page.pageIndex = 1;
                this.init();
            },
            newCreate () {
                this.$router.push({name: 'new_product'});
                this.$store.commit('SearchFunction');

            },
            //分页
            changepage (index) {
                this.page.pageIndex = index;
                this.init();
            },
            edit (index) {
                this.$router.push({
                    name: 'edit_product',
                    query: {
                        data6: JSON.stringify(index)
                    },
                });
                this.reload();
            },
            init () {

                this.$axios({
                    method: 'post',
                    url: api.product_list(),
                    data: {
                        keyword: this.$store.state.app.productSearch.replace(/\s/g, '') || this.keyword.replace(/\s/g, ''),
                        desc: true,
                        currentPage: this.page.pageIndex /*=== 0 ? 1 : this.page.pageIndex*/,
                        pageSize: this.page.pageSize
                    }
                }).then(res => {
                        if (res.data.code == 200) {
                            this.data6 = res.data.data || [];
                            this.dataCount = res.data.page.totalRecords;
                            // }
                            if (res.data.data == null || res.data.data == []) {
                                if (res.data.page.totalRecords != 0) {
                                    this.page.pageIndex =
                                        this.page.pageIndex != 0
                                            ? this.page.pageIndex - 1
                                            : this.page.pageIndex;
                                    this.init();
                                }

                            }

                        } else {
                            this.data6 = [];
                            this.$Message.info(res.data.msg);
                        }
                    },
                    err => {
                        this.$Message.warning('服务器错误');
                    });
            },
            product_delete (index) {
                this.$Modal.confirm({
                    title: '删除警告',
                    content: '<p>您确定要删除该用户吗</p>',
                    loading: true,
                    onOk: () => {
                        setTimeout(() => {

                            this.$axios({
                                method: 'post',
                                url: api.product_delete(index),
                                headers: {
                                    Authorization: Cookies.get('token'),

                                }
                            }).then(res => {
                                if (res.data.code == 200) {
                                    this.$Message.info('已删除');
                                    if (this.data6.length < 2 && !this.keyword) {
                                        this.page.pageIndex--;
                                    }
                                    this.init();
                                    this.$Modal.remove();
                                } else {
                                    this.$Modal.remove();
                                    this.$Message.info(res.data.msg);
                                }
                            });
                        }, 0);
                    }
                });
            },
        },
        beforeDestroy(){
            this.$store.commit('SearchFunction');
        }
    };
</script>
