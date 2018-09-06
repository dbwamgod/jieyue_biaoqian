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
            <!--<Button type="primary" @click="Out">导出</Button>-->
            </Col>
        </Row>
        <Row>
            <Col span="3">
            <p class="detail_list">详情列表</p>
            </Col>
        </Row>

        <Row style="margin-top: 30px;">
            <Col span="18">
            <Table :columns="columns1" :data="data2"></Table>
            </Col>
        </Row>
        <Row style="margin-top: 30px;">
            <Col span="12" offset="12">
            <Page :total="dataCount" show-total :page-size="page.pageSize" :current="page.pageIndex" class="paging"
                  @on-change="changepage"/>
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
                dataCount: 0,
                page: {
                    pageSize: 10,
                    pageIndex: 1
                },
                columns1: [],
                defaultRules: {},
                data2: [],
                data3: [{}],
                check_list: [],

            };
        },
        created () {

            this.product_getDetail();
        },
        methods: {

            changepage (index) {
                this.page.pageIndex = index;
                this.product_productOutput_list();
            },
            //获取输出列表
            product_productOutput_list () {

                this.check_list = this.defaultRules.labelNameVoList;
                this.$axios({
                    method: 'post',
                    url: api.product_productOutput_list(),
                    data: {
                        'queryParam': this.defaultRules.queryParam,//"q=*%3A*&wt=json&indent=true&fl=id", encodeURIComponent(
                        'outputVos': this.check_list,//{"labelCode":"name"},{"labelCode":"tel"},{"labelCode":"addr"},{"labelCode":"phone"},{"labelCode":"age"},{"labelCode":"empt"}
                        'pageSize': this.page.pageSize,
                        'pageIndex': this.page.pageIndex-1
                    }
                    /*  {
                        outputVos: {
                            labelCode: [
                                this.check_list
                            ]
                        },
                        'pageIndex': 1,
                        'pageSize': 3,
                        'productId': this.defaultRules.id,
                        'queryParam': this.defaultRules.queryParam
                    }*/
                }).then(res => {
                    if (res.data.code == 200) {
                        this.data2 = res.data.data;
                        this.dataCount = res.data.page.totalRecords;
                    } else {
                        this.$Message.info(res.data.msg);
                    }
                });
            },

            product_getDetail () {
                this.$axios({
                    method: 'get',
                    url: api.product_getDetail(this.$route.query.id),
                }).then(res => {
                    if (res.data.code == 200) {
                        if(res.data.data!==null){
                            this.defaultRules = res.data.data;
                            this.columns1 = this.defaultRules.labelNameVoList.map((item, index) => {
                                return {
                                    title: item.labelName,
                                    key: item.labelCode
                                };
                            });
                        }else{
                            this.$Message.info(res.data.msg)
                        }
                    } else {
                        this.$Message.info(res.data.msg+",没有数据");
                        let a=setTimeout(()=>{
                            this.$router.back(-1)
                            clearTimeout(a)
                        },1700)
                    }
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