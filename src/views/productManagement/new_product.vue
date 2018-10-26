<template>
    <div ref="container_box" id="container_box">
        <Row class="tree_data">
            <Col class="Col_product_new">
            <Tree :data="data3" :load-data="loadData" class="menu_product_list" on-select-change="loadData"></Tree>
            </Col>
        </Row>
        <div class="rule_product">
            <Row>
                <Col>
                <div class="new_product_fir">
                    <Form :model="formValidate" class="product_form">
                        <FormItem label="产品名称" prop="product_id" class="formItem_product">
                            <Input v-model="formValidate.productName" placeholder="请输入产品名称"
                                   style="width: 230px;"></Input>
                        </FormItem>
                        <FormItem label="产品类别" prop="product_type">
                            <Select v-model="formValidate_list.id" placeholder="请选择产品类型" class="product_type">
                                <Option v-for="(item,index) in formValidate_list" :key="index"
                                        :value="item.id?item.id:''">
                                    {{item.categoryName?item.categoryName:''}}
                                </Option>
                            </Select>
                        </FormItem>
                    </Form>
                </div>
                </Col>
            </Row>
            <Row>
                <Col class="checkRule-container" offset="1">
                <span style="" class="ruleCheck">查询规则</span>
                </Col>
                <Col span="18">
                <Form class="checkRule-input">
                    <Input v-model="formValidate.queryParam" type="textarea" :autosize="{minRows: 4,maxRows: 5}"
                           placeholder="请输入查询规则"></Input>
                </Form>
                </Col>
            </Row>
            <Row class="out-tag">
                <Col class="out-tag-col" offset="1">
                <p class="out-tag-text">输出标签</p>
                </Col>
                <Col span="18">
                <div class="container_label" ref="container_label">
                    <Tag v-for="(item,index) in title" :key="index" :name="item.id" closable @on-close="handleClose2"
                         class="out-tag-content">{{item.title}}
                    </Tag>
                </div>
                </Col>
            </Row>
            <Row class="preservationCanel-container">
                <Col span="12" offset="6">
                <Button type="primary" @click="submit">保存</Button>
                <Button class="canel" @click="oncanel">返回</Button>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
    import api from '@/api';
    import Cookies from 'js-cookie';

    export default {
        name: 'new_product',
        data () {
            return {
                formValidate: {
                    productName: '',
                    categoryName: '',
                    queryParam: '',
                },
                data3: [],
                title: [],
                out: [],
                style_active: {
                    cursor: 'pointer',
                    display: 'inline-block',
                    maxWidth: '110px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    lineHeight: '14px'
                },
                style_actives: {
                    display: 'inline-block',
                    maxWidth: '110px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    lineHeight: '14px',
                    color: '#9ea7b4',
                },
                formValidate_list: {},
                big_container: [],
                check_out: [],
                check_out_flag: false,
                intermediateVariable: []

            };
        },
        created () {
            this.init();
            this.product_First_list();
        },
        methods: {
            //取消
            oncanel () {
                this.$router.back(-1);
                this.formValidate = {};
                this.title = [];
                this.init();
                this.product_First_list();
            },
            //类别分类
            init () {
                //类型
                this.$axios({
                    method: 'get',
                    url: api.product_getDetail_name_list(),
                }).then(res => {
                    this.formValidate_list = res.data.data;
                });
            },
            //tree初始化页面列表
            product_First_list () {
                this.$axios({
                    method: 'get',
                    url: api.product_First_list(),
                }).then(res => {
                    if (res.data.code == 200) {
                        this.data3 = res.data.data.map((item, index) => {
                            return {
                                title: item.categoryName,
                                id: item.id,
                                loading: false,
                                children: [],
                                expand: false,
                                type: 1,
                                render: (h, params) => {
                                    return h('span', {
                                        style: this.style_active,
                                        on: {
                                            click: () => {
                                                this.treeHandClick(params);
                                            }
                                        }
                                    }, item.categoryName);
                                }
                            };
                        });

                    }
                });
            },
            treeHandClick (params) {
                if (params.data.children.length == 0) {
                    this.loadData(params.data, data => {
                        if (data) {
                            if (data.length == 0 || JSON.stringify(data) === '[]') {
                                return params.data.expand = false;
                            }
                            params.data.children = data;
                            params.data.expand = true;
                        }
                    });
                } else {
                    params.data.expand = !params.data.expand;
                }
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
                        productName: this.formValidate.productName,//产品名称
                        queryParam: this.formValidate.queryParam,//查询参数(规则)
                        categoryId: this.formValidate_list.id,//产品类别ID
                        outputParamIdList: this.out,//输出参数id列表(数组)
                        userId: Cookies.get('userId'),//用户ID
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        this.out = [];
                        this.formValidate = {};
                        this.title = [];
                        this.init();
                        this.product_First_list();
                        this.$router.back(-1);

                    } else {
                        this.out = [];
                        this.$Message.info(res.data.msg);
                    }
                });

            },
            //关闭tag标签
            handleClose2 (event, name) {
                let myError;
                if (!myError) {
                    let index;
                    let designation;
                    this.title.map((tr, tm) => {
                        if (tr.id === name) {
                            index = tm;
                            designation = name;
                        }
                        if (this.check_out.length) {
                            this.check_out.forEach((xr, xi) => {
                                if (xr.textContent === designation && tr.id === designation) {
                                    if (this.title) {
                                        this.check_out[xi].style.color = '#dddee1';
                                    }
                                }
                            });
                        }
                    });
                    this.title.splice(index, 1);
                    this.check_out_flag = false;
                }

            },
            //异步加载tree
            loadData (item, callback) {
                if (item.type === 1) {
                    this.$axios({
                        method: 'get',
                        url: api.product_Second_list(item.id),
                    }).then(res => {
                        if (res.data.code == 200) {
                            if (res.data.data.length !== 0) {
                                const data = res.data.data.map((item, index) => {
                                    return {
                                        title: item.categoryName || item.categoryName == 0 ? item.categoryName : '',
                                        id: item.id || '',
                                        type: 2,
                                        loading: false,
                                        expand: false,
                                        children: [],
                                        render: (h, params) => {

                                            return h('span', {
                                                style: this.style_active,
                                                on: {
                                                    click: () => {
                                                        this.treeHandClick(params);
                                                    }
                                                }
                                            }, item.categoryName);
                                        }
                                    };
                                });
                                callback(data);
                            } else {
                                const data = res.data.data.map((item, index) => {
                                    return {
                                        title: item.categoryName || '',
                                        id: item.parentId || '',
                                        type: 2,
                                    };
                                });
                                callback(data);
                                this.$Message.info('没有数据');
                            }
                        }
                    });
                } else if (item.type === 2) {
                    this.$axios({
                        method: 'get',
                        url: api.queryLabels(item.id),
                    }).then(res => {
                        if (res.data.code == 200) {
                            if (res.data.data.length !== 0) {
                                const data = res.data.data.map((item, index) => {
                                    return {
                                        title: item.labelName,
                                        id: item.id,
                                        type: 3,
                                        render: (h, params) => {
                                            return h('span', {
                                                style: this.check_out_flag || this.title.find(r => r.id === params.data.id) ? this.style_actives:this.style_active,
                                                on: {
                                                    click: (ev) => {

                                                        ev.path[0].style.color = '#9ea7b4';
                                                        let flag = this.title.find(r => {
                                                            return r.Id === params.data.id;
                                                        });
                                                        if (!flag) {
                                                            if (this.title.filter(r => r.id === params.data.id)[0]) {
                                                            } else {
                                                                this.title.push(params.data);

                                                                this.check_out.push(ev.path[0]);
                                                            }
                                                        }
                                                    }
                                                }
                                            }, item.labelName);
                                        }
                                    };
                                });
                                callback(data);
                            } else {
                                const data = res.data.data.map((item, index) => {
                                    return {
                                        title: item.labelName || '',
                                        id: item.id || '',
                                        type: 3,
                                    };
                                });
                                callback(data);
                                this.$Message.info('没有数据');
                            }
                        }
                    });
                }

            },
        }
    };
</script>

<style scoped lang="less">
/*产品信息*/
    .rule_product {
        margin-left: 165px;

        /*产品类别和产品名称*/
        .new_product_fir {
            display: flex;
            margin: 30px 0 20px 0;
            .product_form {
                flex: 0;
                padding-top: 10px;
                padding-left: 4.6%;
                .formItem_product {
                    float: left;
                    width: 360px;
                }
            }
            .product_type {
                width: 230px;
            }
        }
        /*//输出标签*/
        .out-tag {
            margin-top: 40px;
            .out-tag-col {
                float: left;
                width: 71px;
            }
            .out-tag-text {
                padding: 7px;
            }
            .out-tag-content {
                background: #dddee1;
                height: 40px;
                line-height: 40px;
                padding: 0 15px;
            }
            .container_label {
                padding-left: 2px;
                overflow-y: auto;
                height: 115px;
                max-height: 200px;
                border: 1px solid #dddee1;
                border-radius: 4px;
            }
        }
        /*保存和取消*/
        .preservationCanel-container {
            margin-top: 40px;
            .canel {
                margin-left: 10px
            }
        }
        /*查询规则*/
        .checkRule-container {
            float: left;
            width: 71px;
            .ruleCheck {
                padding: 7px;
            }
            .checkRule-input {
                display: inline-block;
                width: 100%;
            }
        }
    }
/*树*/
    .tree_data {
        position: fixed;
        width: 160px;
        min-width: 120px;
        height: 100%;
        background: #585b6d;
        color: #dddee1;
        opacity: .7;
        .menu_product_list {
            margin-top: 15%;
            margin-left: 10%;

        }

    }



</style>