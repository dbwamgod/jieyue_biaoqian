<template>
    <div class="check_container">
    <Tree :data="data3" class="menu_product_list" :load-data="loadData" ref="data3"></Tree>


        <Row>
            <Col span="3">
            <span class="check_container_product">产品</span>
            </Col>
            <Col span="3">
            <span class="check_container_list">分类</span>
            </Col>
        </Row>
        <Row>
            <Col span="3">
            <p class="Default_rule">预设规则</p>
            </Col>
        </Row>
        <Row style="margin-top: 30px;">

            <Col span="6">
            <span>{{defaultRules.id}}</span>
            </Col>
            <Col span="6">
            <span>{{defaultRules.modifier}}</span>
            </Col>
            <Col span="6">
            <span>{{defaultRules.creator}}</span>
            </Col>
            <Col span="6">
            <span>{{defaultRules.categoryId}}</span>
            </Col>
        </Row>
        <Row>
            <Col span="3">
            <p class="check_inpout">查询输出</p>
            </Col>
        </Row>
        <Row style="margin-top: 10px;">

            <Col span="4" offset="7">
            <div class="container_label_check" ref="container_label_check">
                <Tag v-for="item in count" :key="item" :name="item" closable @on-close="handleClose2">标签{{ item + 1 }}
                </Tag>
            </div>
            </Col>
        </Row>
        <Row style="margin-top: 141px;">
            <Col span="4" offset="12">
            <Button type="primary" @click="checkInfo">查询</Button>
            </Col>
        </Row>
        <Row>
            <Col span="3">
            <p class="detail_list">详情列表</p>
            </Col>
        </Row>

        <Row style="margin-top: 30px;">
            <Col span="24">
            <Table :columns="columns1" :data="data2"></Table>
            </Col>
        </Row>
    </div>
</template>

<script>
    import api from '@/api';
    import Cookies from 'js-cookie';

    export default {
        name: 'check_product'
        ,
        data () {
            return {
                columns1: [
                    {
                        title: 'Name',
                        key: 'name'
                    },
                    {
                        title: 'Age',
                        key: 'age'
                    },
                    {
                        title: 'Address',
                        key: 'address'
                    }
                ],
                defaultRules: {},
                data2: [],
                data3: [{}],
                flag: 1,
                count: [0, 1, 2]
            };
        },
        created () {
            this.product_First_list();
            this.product_productOutput_list();
            this.product_getDetail();
        },
        methods: {
            //获取输出列表
            product_productOutput_list () {
                this.$axios({
                    method: 'get',
                    url: api.product_productOutput_list()
                }).then(res => {
                });
            },
            loadData (item, callback) {

                setTimeout(() => {

                    if (this.flag === 1) {
                        this.$axios({
                            method: 'post',
                            url: api.product_Second_list(),
                            data: {
                                form: {
                                    parentId: item.id
                                },
                                pageIndex: 0,
                                pageSize: 0
                            }

                        }).then(res => {
                            if (res.data.code == 200) {
                                this.flag = 2;
                                if (res.data.data.length !== 0) {
                                    const data = res.data.data.map((item, index) => {
                                        return {
                                            title: item.categoryName || '',
                                            id: item.id || '',
                                            loading: false,
                                            children: []
                                        };
                                    });

                                    callback(data);
                                } else {
                                    this.$Message.info('没有数据');
                                }
                            }
                        });
                    } else if (this.flag === 2) {
                        this.$axios({
                            method: 'post',
                            url: api.queryLabels(),
                            data: {
                                'form': {
                                    'parentId': item.id,
                                },
                                'pageIndex': 0,
                                'pageSize': 0,
                            }
                        }).then(res => {
                            if (res.data.code == 200) {
                                this.flag === 1;
                                if (res.data.data.length !== 0) {
                                    const data = res.data.data.map((item, index) => {
                                        return {
                                            title: item.labelName || '',
                                            id: item.id || '',
                                            loading: false,
                                            /*  render:(h, params) => {
                                                  console.log(params);
                                                  on: {
                                                      click: () => {
                                                          console.log(1);
                                                      }
                                                  }
                                                  return h('span', {
                                                      style: {
                                                          display: 'inline-block',
                                                          width: '100%'
                                                      }
                                                  })
                                              }*/
                                        };
                                    });
                                    callback(data);
                                } else {
                                    this.$Message.info('没有数据');
                                }
                            }
                        });
                    }

                }, 1000);
            },
            product_First_list () {
                this.$axios({
                    method: 'post',
                    url: api.product_First_list(),
                    data: {
                        form: {},
                        pageIndex: 0,
                        pageSize: 0
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        let result = res.data.data.map((item, index) => {
                            return {
                                title: item.categoryName || '',
                                id: item.id || '',
                                loading: false,
                                children: []
                            };
                        });
                        this.data3 = result;

                    }
                });
            },
            product_getDetail () {
                this.$axios({
                    method: 'get',
                    url: api.product_getDetail(this.$route.query.id),
                }).then(res => {
                    this.defaultRules = res.data.data;
                });
            },
            //关闭标签
            handleClose2 (event, name) {
                const index = this.count.indexOf(name);
                this.count.splice(index, 1);
            },
            //查询
            checkInfo(){
                if (this.count.length) {
                    this.count.push(this.count[this.count.length - 1] + 1);
                } else {
                    this.count.push(0);
                }
            }
        }
    };
</script>

<style scoped>
    .check_container {
        padding: 40px 32px 0 170px;
    }

    .check_container_product {
        font-size: 22px;
    }

    .check_container_list {
        font-size: 22px;
    }

    .Default_rule {
        margin-top: 40px;
        font-size: 22px;
    }

    .check_inpout {
        margin-top: 40px;
        font-size: 22px;
    }

    .detail_list {
        margin-top: 40px;
        font-size: 22px;
    }

    .menu_product_list {
        position: absolute;
        top: 40%;
        left: 25px;
    }
    .container_label_check {
        position: absolute;
        top: 35%;
        left: -100%;
        width: 479px;
        height: 115px;
        border: 1px solid #dddee1;
        border-radius: 4px;
    }

</style>