<template>
    <div ref="container_box" id="container_box">
        <Row>
            <Col class="Col_product_new">

            <Tree :data="data3" :load-data="loadData" class="menu_product_list"></Tree>
            </Col>
            <div class="new_product_fir">
                <p class="new_text" @click="tititi">新建</p>
                <Form ref="formValidate" :model="formValidate"
                      style="flex: 5;padding-top: 10px;    padding-left: 86px;">
                    <FormItem label="产品名称" prop="product_id" style="float: left;width: 360px;">
                        <Input v-model="default_pro.productName" placeholder="请输入产品名称" style="width: 230px;"></Input>
                    </FormItem>
                    <FormItem label="产品类别" prop="product_type" style="float: left;width: 270px;">
                        <Select v-model="default_pro.categoryName" placeholder="请选择产品类型" style="width: 180px;">
                            <Option v-for="(item,index) in formValidate" :key="index"
                                    :value="item.categoryName?item.categoryName:default_pro.categoryName">
                                {{item.categoryName}}
                            </Option>
                        </Select>
                    </FormItem>
                </Form>
            </div>
            <div class="rules_container">

                <span class="rules_text">新建规则</span>
                <Form style="position: absolute;top: 0;left: -255px; ">
                    <Input v-model="default_pro.queryParam" type="textarea" :autosize="{minRows: 4,maxRows: 5}"
                           placeholder="Enter something..." style="width: 279px;"></Input>
                </Form>
            </div>
            <div>
                <p style="position: absolute;top: 264px;left: 424px;font-size: 23px;">查询输出</p>
                <div class="container_label" ref="container_label">
                    <Tag v-for="(item,index) in title" :key="index" :name="item.title" closable
                         @on-close="handleClose2">{{ item.title
                        }}
                    </Tag>
                </div>
            </div>
            <Button type="primary" @click="submit" style="    position: absolute;left: 50%;top: 50%;">保存</Button>
        </Row>
    </div>

</template>

<script>
    import api from '@/api';
    import Cookies from 'js-cookie';

    export default {
        name: 'new_product',
        data () {
            return {
                ruleValidate: {},
                theme2: 'light',
                formValidate: {
                    queryParam: '',
                    productName: '',
                    categoryName: [],
                },
                data3: [{}],
                flag: 1,
                count: [0, 1, 2],
                default_pro: this.$route.query.data6,
                title: [],
                out: []
            };
        },
        created () {
            this.init();
            this.default_pro = this.$route.query.data6;
            this.detail_type_list();
            this.product_First_list();

        },
        mounted () {

        },
        methods: {
            //编辑的当前数据
            detail_type_list () {
                this.$axios({
                    method: 'post',
                    url: api.product_productOutput_find(this.$route.query.data6.id),
                }).then(res => {
                    this.formValidate = Object.assign({}, res.data.data);
                });
            },
            tititi () {
                console.log(this.default_pro);
            },
            loadData (item, callback) {
                if (item.type === 1) {
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
                                        id: item.parentId || '',
                                        loading: false,
                                        children: [],
                                        type: 2
                                    };
                                });
                                callback(data);
                            } else {
                                this.$Message.info('没有数据');
                            }
                        }
                    });
                } else if (item.type === 2) {
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

                            if (res.data.data.length !== 0) {
                                const data = res.data.data.map((item, index) => {
                                    return {
                                        title: item.labelName,
                                        id: item.id,
                                        // loading: false,
                                        children: [],
                                        type: 3,
                                        render: (h, params) => {

                                            return h('span', {
                                                on: {
                                                    click: () => {

                                                        // console.log(this.title.filter(r=> r.id==params.data.id)[0],params.data.id)
                                                        if (this.title.filter(r => r.id == params.data.id)[0]) {
                                                        } else {
                                                            this.title.push(params.data);
                                                        }

                                                    }
                                                }
                                            }, item.labelName);
                                        }
                                    };
                                });
                                callback(data);
                            } else {
                                this.$Message.info('没有数据');
                            }
                        }
                    });
                }
            },
            init () {
                //类型
                this.$axios({
                    method: 'get',
                    url: api.product_getDetail_name_list(),
                }).then(res => {
                    this.formValidate = Object.assign({}, res.data.data);

                });

            },

            //分类页面列表
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
                                children: [],
                                type: 1
                            };
                        });
                        this.data3 = result;
                    }
                });
            },

            handleAdd () {

            },
            //保存
            submit () {

                //保存的接口
                this.title.map((item, index) => {
                    return this.out.push(item.id);
                });
                this.$axios({
                    method: 'post',
                    url: api.product_add(),
                    data: {
                        productName: this.default_pro.productName,//产品名称
                        queryParam: this.default_pro.queryParam,//查询参数(规则)
                        categoryId: this.default_pro.id,//产品类别ID
                        outputParamIdList: this.out,//输出参数id列表(数组)
                        userId: Cookies.get('userId'),//用户ID
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        this.$router.back(-1);

                    } else {
                        this.$Message.info(res.data.msg);
                    }
                });

            },
            handleClose2 (event, name) {
                const index = this.title.indexOf(name);
                this.title.splice(index, 1);
            }
        }
    };
</script>

<style scoped>
    .Col_product_new {
        width: 240px;
        height: 883px;
        float: left;
        background: #eee;
    }

    .menu_product_list {
        margin-top: 128%;
    }

    .new_product_fir {
        display: flex;
        margin: 30px 0 20px 0;
    }

    .new_text {
        text-align: right;
        font-size: 23px;
        flex: 1;
    }

    .container_label {
        position: absolute;
        top: 35%;
        left: 33%;
        width: 479px;
        height: 115px;
        border: 1px solid #dddee1;
        border-radius: 4px;
    }

    .rules_container {
        position: absolute;
        width: 400px;
        top: 126px;
        bottom: 0;
        left: 350px;
        right: 0;
        margin: 0 auto;
    }

    .rules_text {
        position: absolute;
        top: -15px;
        font-size: 23px;
        left: -406px;
    }
</style>