<template>
    <div style='position: relative;height:100%;padding:10px;'>
        <Row type="flex" justify="space-between" align="middle" class="code-row-bg" style='margin-bottom:10px;'>
            <Col span="6">
            <h2 style="margin: 6px 0 0 20px">产品管理</h2>
            </Col>
            <Col span="3" style='text-align:right;margin-right:5px;'>
            <Button type="primary" @click="newCreate" style="    position: absolute;top: 0px;right: 200px;">新建
            </Button>
            <Input v-model="labelname" icon="ios-search" search placeholder="请搜索..." style=" width:170px;"
                   @on-change='searchChange'/>
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

    export default {
        inject: ['reload'],
        data () {
            return {
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
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '10px'
                                    },
                                    on: {
                                        click: () => {
                                            Cookies.set('now_index', this.page.pageIndex);
                                            this.$router.push({
                                                name: 'check_product',
                                                query: {
                                                    id: JSON.stringify(this.data6[params.index].id),
                                                }
                                            });
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
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
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {

                                            this.product_delete(this.data6[params.index].id);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                data6: []
            };
        },
        created () {
            if (Cookies.get('now_index')) {
                this.page.pageIndex = Number(Cookies.get('now_index'));
                Cookies.remove('now_index');
            }

            this.init();
        },
        methods: {
            searchChange () {
                this.init();
            },
            newCreate () {
                this.$router.push({name: 'new_product'});
            },
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
            },
            init () {
                this.$axios({
                    method: 'post',
                    url: api.product_list(),
                    data: {
                        keyword: this.labelname,
                        desc: true,
                        currentPage: this.page.pageIndex,
                        pageSize: this.page.pageSize
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        if (res.data.data == null) {
                            this.$axios({
                                method: 'post',
                                url: api.product_list(),
                                data: {
                                    keyword: this.labelname,
                                    desc: true,
                                    currentPage: res.data.page.totalPages,
                                    pageSize: res.data.page.pageSize
                                }
                            }).then(res => {
                                if (res.data.code == 200) {
                                    this.data6 = res.data.data;
                                    this.dataCount = res.data.page.totalRecords;
                                } else {
                                    this.data6 = [];
                                }
                            });
                        } else {
                            this.data6 = res.data.data;
                            this.dataCount = res.data.page.totalRecords;
                        }

                    } else {
                        this.data6 = [];
                        this.$Message.info(res.data.msg);
                    }
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

        }
    };
</script>
