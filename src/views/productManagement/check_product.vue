<template>
    <div class="check_container">

        <Row>
            <Col span="3">
            <span class="check_container_product">{{defaultRules.productName}}</span>
            </Col>
            <Col span="3">
            <span class="check_container_list">{{defaultRules.categoryName}}</span>
            </Col>
        </Row>
        <Row>
            <Col span="3">
            <p class="Default_rule">预设规则</p>
            </Col>
        </Row>
        <Row style="margin-top: 30px;">
            <Col span="24">
            <span>{{defaultRules.queryParam}}</span>
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
                <Tag v-for="(item,index) in defaultRules.labelNameVoList" :key="index" :name="item.labelName"
                     @on-close="handleClose2">{{ item.labelName }}
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
                check_list: []
            };
        },
        created () {

            this.product_getDetail();
        },
        methods: {
            //获取输出列表
            product_productOutput_list () {
                this.$axios({
                    method: 'post',
                    url: api.product_productOutput_list(),
                    data: {
                        outputVos: {
                            labelCode: [
                                this.check_list
                            ]
                        },
                        'pageIndex': 1,
                        'pageSize': 3,
                        'productId': this.defaultRules.id,
                        'queryParam': this.defaultRules.queryParam
                    }
                }).then(res => {

                });
            },

            product_getDetail () {
                this.$axios({
                    method: 'get',
                    url: api.product_getDetail(this.$route.query.id),
                }).then(res => {
                    this.defaultRules = res.data.data;


                    console.log(this.defaultRules,111111111111111111);
                });

            },

            //查询
            checkInfo () {
                this.product_productOutput_list();
            },
            handleClose2 (event, name) {
                const index = this.count.indexOf(name);
                this.count.splice(index, 1);
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