<template>
    <div class="check_container">

        <Row style="margin: 0;">
            <Col span="3" >
            <h3 style="    display: inline-block;font-size: 23px">产品:</h3>

            </Col  >
            <Col span="3" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 300px;">
            <span class="check_container_product">{{defaultRules.productName}}</span>
            </Col>
        </Row>

        <Row style="margin: 20px 0 0 0 ;">
            <Col span="3">
            <h3 style="    display: inline-block;font-size: 22px">类别:</h3>
            </Col>
            <Col span="3" style="text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    ">
            <span class="check_container_list">{{defaultRules.categoryName}}</span>
            </Col>
        </Row>

        <Row style="margin-top: 40px;">
            <Col span="3" >
            <p class="Default_rule">预设规则:</p>
            </Col>
            <Col span="18" style="border: 1px solid #dddee1;min-width: 300px;min-height: 40px;padding: 10px;">
            <span style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;display: block;">{{defaultRules.queryParam}}</span>
            </Col>
        </Row>

        <Row style="margin-top: 40px">
            <Col span="3">
            <p class="check_inpout">查询输出:</p>
            </Col>
            <Col span="18">
            <div class="container_label_check" ref="container_label_check">
                <Tag v-for="(item,index) in defaultRules.labelVos" :key="index" :name="item.labelName"
                     @on-close="handleClose2" style="height: 35px;line-height: 35px; padding: 0 15px;background: #e1e1e1;     margin: 5px 2.5px 2.5px 5px;
">{{ item.labelName }}
                </Tag>
            </div>
            </Col>
        </Row>

        <Row style="margin-top: 40px;">
            <Col span="12" offset="8">
            <Button type="primary" @click="checkInfo" style="margin-right: 40px;">查询</Button>
            <Button type="primary" @click="comeout">导出</Button>
            </Col>
        </Row>
        <Row style=" margin-top: 50px;">
            <Col span="3" >
            <p class="detail_list">查询结果:</p>
            </Col>
            <Col span="18">
            <Table :columns="columns1" :data="data2"></Table>
            </Col>
        </Row>


        <Row style="margin-top: 30px;">
            <Col   style="margin-left: 52%;    width: 31%; text-align: right;">
            <Page :total="dataCount" show-total :page-size="page.pageSize" :current="page.pageIndex"
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
                content: '',
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
        watch: {
            '$route' (to, form) {
                if (to.query.id) {
                    this.product_getDetail(to.query.id);
                }
            }
        },
        created () {
            this.product_getDetail(this.$route.query.id);
            this.content = this.defaultRules.queryParam;
        },
        methods: {
            comeout () {
                if (this.check_list.length) {
                    if (this.data2.length !== 0) {
                        window.open(api.product_out(encodeURIComponent(JSON.stringify({
                            'queryParam': this.defaultRules.queryParam,
                            'outputVos': this.check_list,
                            'pageSize': 0,
                            'pageIndex': 0
                        }))), '_blank');
                        window.open(api.product_out(encodeURIComponent(JSON.stringify({
                            'queryParam': this.defaultRules.queryParam,
                            'outputVos': this.check_list,
                            'pageSize': 0,
                            'pageIndex': 0
                        }))), '_blank');
                    } else {
                        this.$Message.error('没有数据,不能导出');
                    }

                } else {
                    this.$Message.info('请先点击查询');
                }
            },
            changepage (index) {
                this.page.pageIndex = index;
                this.product_productOutput_list();
            },
            //获取输出列表
            product_productOutput_list () {

                // this.check_list = this.defaultRules.labelNameVoList;
                this.defaultRules.labelVos.forEach(r=>{
                    this.check_list.push(r.labelId)
                })
                this.$axios({
                    method: 'post',
                    url: api.product_productOutput_list(),
                    data: {
                        'queryParam': this.defaultRules.queryParam,//"q=*%3A*&wt=json&indent=true&fl=id", encodeURIComponent(
                        'codeIds': this.check_list,//{"labelCode":"name"},{"labelCode":"tel"},{"labelCode":"addr"},{"labelCode":"phone"},{"labelCode":"age"},{"labelCode":"empt"}
                        'pageSize': this.page.pageSize,
                        'pageIndex': this.page.pageIndex - 1
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
                        if (res.data.data.length !== 0) {
                            this.data2 = res.data.data;
                            this.dataCount = res.data.page.totalRecords;
                        } else {
                            this.$Message.error('标签内容没有数据!');
                        }

                    } else {
                        this.$Message.info(res.data.msg);
                    }
                });
            },

            product_getDetail (id) {
                this.$axios({
                    method: 'get',
                    url: api.product_getDetail(id),
                }).then(res => {

                    if (res.data.code == 200) {
                        if (res.data.data !== null) {
                            this.defaultRules = res.data.data;
                            this.columns1 = this.defaultRules.labelVos.map((item, index) => {
                                return {
                                    title: item.labelName,
                                    key: item.labelCode
                                };
                            });
                        } else {
                            this.$Message.info(res.data.msg);
                        }
                    } else {
                        this.$Message.info(res.data.msg + ',没有数据');
                        let a = setTimeout(() => {
                            this.$router.back(-1);
                            clearTimeout(a);
                        }, 1700);
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
        padding: 4% 5% 0 5%;
    }

    .check_container_product {
        font-size: 22px;
        color: #515a6e;
    }

    .check_container_list {
        font-size: 19px;
        color: #515a6e;

    }

    .Default_rule {
        font-size: 21px;
        font-weight: 600;
    }

    .check_inpout {
        font-size: 21px;
        font-weight: 600;
        border-radius: 5px;
    }

    .detail_list {

        font-size: 21px;
        font-weight: 600;
    }

    .container_label_check {

        overflow-y: scroll;

        max-height: 145px;
        border: 1px solid #dddee1;
        border-radius: 4px;
    }

</style>