<template>
    <div ref="container_box" id="container_box">
        <Row class="edit_treeData">
            <Col class="Col_product_new">
            <Tree :data="data3" :load-data="loadData" class="menu_product_list" on-select-change="loadData"></Tree>
            </Col>
        </Row>
        <div class="edit_productList">
            <Row>
                <Col>
                <div class="new_product_fir">
                    <Form ref="formValidate" :model="formValidate" class="form-productList">
                        <FormItem label="产品名称" prop="product_id" class="edit-productName">
                            <Input v-model="formValidate.productName" placeholder="请输入产品名称"
                                   class="edit-productName-input"></Input>
                        </FormItem>
                        <FormItem label="产品类别" prop="product_type" style="float: left;width: 360px;">

                            <Select v-model="formValidate.categoryId"
                                    placeholder="请输入产品类别"
                                    style="width: 230px;margin-left: 14%;">
                                <Option v-for="(item,index) in formValidate_list" :key="index"
                                        :value="item.id">
                                    {{item.categoryName || ''}}
                                </Option>
                            </Select>
                        </FormItem>
                    </Form>
                </div>
                </Col>
            </Row>
            <Row>
                <Col offset="1" class="edit_checkRule">
                <span class="edit_checkRule_text">查询规则</span>
                </Col>
                <Col span="18" class="edit_checkRule_container">
                <Form class="edit_checkRule_input">
                    <Input v-model="formValidate.queryParam" type="textarea" :autosize="{minRows: 4,maxRows: 5}"
                           placeholder="请输入查询规则"></Input>
                </Form>

                </Col>

            </Row>
            <Row class="active-info">
                <Col offset="1" class="edit_checkRule">
                <p class="edit_checkRule_text">输出标签</p>
                </Col>
                <Col span="18" class="edit_checkRule_container">
                <div class="container_label" ref="container_label">
                    {{title.length?'':'没有输出标签'}}
                    <Tag v-for="(item,index) in title" :key="index" :name="item.labelName||item.title"
                         closable @on-close="handleClose2"
                         class="edit_tag">
                        {{item.labelName?item.labelName:item.title}}
                    </Tag>
                </div>
                </Col>
            </Row>
            <Row class="active-info">
                <Col span="12" offset="6">
                <Button type="primary" @click="submit">保存</Button>
                <Button @click="oncanel" class="canel">取消</Button>
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
                active: {
                    color: '#9ea7b4',
                    display: 'inline-block',
                    maxWidth: '90px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    lineHeight: '14px',
                },
                view: {
                    cursor: 'pointer',
                    display: 'inline-block',
                    maxWidth: '110px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    lineHeight: '14px'
                },
                defaultFlag: [],
                formValidate: {
                    productName: '',
                    categoryName: JSON.parse(this.$route.query.data6).categoryName,
                    categoryId: Cookies.get('categoryId') || '',
                },
                data3: [{}],
                title: [],
                out: [],
                formValidate_list: {},
                find_id: {},
                check_out: [],
                check_out_flag: false,
            };
        },
        created () {
            this.find_id = JSON.parse(this.$route.query.data6);

            this.init();
        },
        watch: {
            '$route.query.data6.id' (to, form) {
                if (to.query.data6.id) {
                    this.detail_type_list(to.query.data6.id);
                }
            }
        },
        beforeDestroy () {
            Cookies.remove('categoryId');
        },
        methods: {
            oncanel () {
                this.$router.back(-1);
            },
            //编辑的当前数据
            detail_type_list (id) {
                this.$axios({
                    method: 'post',
                    url: api.product_productOutput_find(this.find_id.id || id),
                }).then(res => {
                    if (res.data.code == 200) {
                        if (res.data.data.outputParamList) {
                            this.title = res.data.data.outputParamList;
                            this.title.map(r => {
                                r && this.defaultFlag.push(r.labelId);
                            });
                            this.check_out.push(res.data.data.outputParamList);
                        }
                        this.formValidate = res.data.data;
                        Cookies.set('categoryId', res.data.data.categoryId);
                    } else {
                        this.$Message.info(res.data.msg);
                    }
                });
            },
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
                                        title: item.categoryName || '',
                                        id: item.id || '',
                                        type: 2,
                                        loading: false,
                                        expand: false,
                                        children: [],
                                        render: (h, params) => {
                                            return h(
                                                'span',
                                                {
                                                    style: this.view,
                                                    on: {
                                                        click: () => this.treeHandClick(params)
                                                    }
                                                },
                                                item.categoryName
                                            );
                                        }
                                    };
                                });
                                callback(data);
                            } else {
                                const data = res.data.data.map((item, index) => {
                                    return {
                                        title: item.categoryName || '',
                                        id: item.parentId || '',
                                        type: 2
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
                        url: api.product_queryLabels(item.id),
                    }).then(res => {
                        if (res.data.code == 200) {
                            if (res.data.data.length !== 0) {

                                const data = res.data.data.map((item, index) => {
                                    return {
                                        title: item.labelName,
                                        id: item.id,
                                        type: 3,
                                        disabled: true,
                                        render: (h, params) => {
                                            return h(
                                                'span',
                                                {
                                                    style: this.check_out_flag || this.title.find(r => params.data.id === r.id || params.data.id === r.labelId) ? this.active : this.view,
                                                    on: {
                                                        click: ev => {
                                                            ev.path[0].style.color = '#9ea7b4';
                                                            let flag = this.title.find(r => (r.labelId || r.id) === params.data.id);
                                                            if (!flag) {
                                                                if (this.title.filter(r => r.Id === params.data.id)[0]) {
                                                                } else {
                                                                    this.title.push(params.data);
                                                                    this.check_out.push(ev.path[0]);
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                item.labelName
                                            );
                                        }
                                    };
                                });

                                callback(data);
                            } else {
                                const data = res.data.data.map((item, index) => {
                                    return {
                                        title: item.labelName || '',
                                        id: item.id || '',
                                        type: 3
                                    };
                                });
                                callback(data);
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
                    url: api.product_getDetail_name_list()
                }).then(res => {
                    this.formValidate_list = res.data.data;
                    this.detail_type_list();
                    this.product_First_list();

                });
            },
            //分类页面列表
            product_First_list () {
                this.$axios({
                    method: 'get',
                    url: api.product_First_list(),
                }).then(res => {
                    if (res.data.code == 200) {

                        let result = res.data.data.map((item, index) => {
                            return {
                                title: item.categoryName,
                                id: item.id,
                                loading: false,
                                children: [],
                                expand: false,
                                type: 1,
                                render: (h, params) => {
                                    return h(
                                        'span',
                                        {
                                            style: this.view,
                                            on: {
                                                click: () => this.treeHandClick(params)
                                            }
                                        },
                                        item.categoryName
                                    );
                                }
                            };
                        });

                        this.data3 = result && result;
                    }
                });
            },
            treeHandClick (params) {
                if (params.data.children.length == 0) {
                    this.loadData(params.data, data => {
                        if (data.length == 0 || JSON.stringify(data) === '[]') {
                            return params.data.expand = false;
                        }
                        params.data.children = data;
                        params.data.expand = true;
                    });
                } else {
                    params.data.expand = !params.data.expand;
                }
            },
            //保存
            submit () {
                //保存的接口
                this.title.map((item, index) => {
                    return this.out.push(item.labelId || item.id);
                });
                this.out = [...new Set(this.out)];
                if (!Cookies.get('userId')) {
                    this.$axios({
                        method: 'get',
                        url: api.userId(),
                        headers: {
                            'content-Type': 'application/x-www-form-urlencoded',
                        },
                    }).then(res => {
                        Cookies.set('userId', res.data.principal.id);
                        this.$axios({
                            method: 'post',
                            url: api.product_to_update(),
                            data: {
                                productName: this.formValidate.productName, //产品名称
                                queryParam: this.formValidate.queryParam, //查询参数(规则)
                                categoryId: this.formValidate.categoryId || Cookies.get('categoryId'), //产品类别ID
                                id: this.formValidate.id,
                                outputParamIdList: this.out, //输出参数id列表(数组)
                                userId: Cookies.get('userId') //用户ID
                            }
                        }).then(res => {
                            Cookies.remove('categoryId');
                            if (res.data.code == 200) {
                                this.out = [];
                                this.$router.back(-1);

                            } else {
                                this.out = [];
                                this.$Message.info(res.data.msg);
                            }
                        });
                    });
                } else {
                    this.$axios({
                        method: 'post',
                        url: api.product_to_update(),
                        data: {
                            productName: this.formValidate.productName, //产品名称
                            queryParam: this.formValidate.queryParam, //查询参数(规则)
                            categoryId: this.formValidate.categoryId || Cookies.get('categoryId'), //产品类别ID
                            id: this.formValidate.id,
                            outputParamIdList: this.out, //输出参数id列表(数组)
                            userId: Cookies.get('userId') //用户ID
                        }
                    }).then(res => {
                        Cookies.remove('categoryId');
                        if (res.data.code == 200) {
                            this.out = [];
                            this.$router.back(-1);

                        } else {
                            this.out = [];
                            this.$Message.info(res.data.msg);
                        }
                    });
                }

            },
            handleClose2 (event, name) {
                let myError;
                if (!myError) {
                    let index;
                    let designation;
                    this.title.map((r, m) => {

                        let nameTitle = r.title || r.labelName;
                        if (nameTitle === name) {
                            index = m;
                            designation = name;
                        }
                    });

                    if (this.check_out.length) {
                        this.check_out.forEach((r, i) => {
                            if (r.textContent === designation) {
                                if (this.title) {
                                    this.check_out[i].style.color = '#dddee1';
                                }
                            }
                        });
                    }
                    this.title.splice(index, 1);
                }
            }
        }
    };
</script>

<style scoped lang="less">

    .ivu-select-dropdown {
        /*width: 100% !important;*/
    }

    /*编辑产品树*/
    .edit_treeData {
        position: fixed;
        width: 160px;
        height: 100%;
        background: #585b6d;
        color: #dddee1;
        opacity: .7;
    }

    /*编辑产品列表*/
    .edit_productList {
        margin-left: 160px;
        .new_product_fir {
            display: flex;
            margin: 30px 0 20px 0;
            .form-productList {
                flex: 0;
                padding-top: 10px;
                padding-left: 4.6%;
                .edit-productName {
                    float: left;
                    width: 360px;
                    .edit-productName-input {
                        width: 230px;
                        margin-left: 14%;
                    }
                }
                .edit-productType {
                    float: left;
                    width: 360px;
                    .edit-productType-select {
                        width: 230px;
                        margin-left: 14%;
                    }
                }
            }
        }

        .edit_checkRule {
            float: left;
            width: 71px;
            .edit_checkRule_text {
                padding: 7px;
            }
        }
        .edit_checkRule_container {
            margin-left: 3%;
            .edit_checkRule_input {
                display: inline-block;
                width: 100%;
            }
        }

        .active-info {
            margin-top: 40px;
            .container_label {
                padding-left: 2px;
                overflow-y: auto;
                height: 115px;
                max-height: 200px;
                border: 1px solid #dddee1;
                border-radius: 4px;
                .edit_tag {
                    background: #dddee1;
                    height: 40px;
                    line-height: 40px;
                    padding: 0 15px;
                }
            }
        }
        .canel {
            margin-left: 3%;
        }

    }

    .menu_product_list {
        margin-top: 15%;
        margin-left: 10%;

    }


</style>
