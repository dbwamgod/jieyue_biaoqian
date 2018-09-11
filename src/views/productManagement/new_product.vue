<template>
    <div ref="container_box" id="container_box">
        <Row style="position: fixed;width: 10%;">
            <Col class="Col_product_new">
            <Tree :data="data3" :load-data="loadData" class="menu_product_list"></Tree>
            </Col>
        </Row>
        <div  style="margin-left: 150px">
            <Row >
                <Col  offset="1" >
                <div class="new_product_fir">
                    <p class="new_text">新建</p>
                    <Form :model="formValidate"
                          style="flex: 5;padding-top: 10px;    padding-left: 6.6%;">
                        <FormItem label="产品名称" prop="product_id" style="float: left;width: 360px;">
                            <Input v-model="formValidate.productName" placeholder="请输入产品名称"
                                   style="width: 230px;"></Input>
                        </FormItem>
                        <FormItem label="产品类别" prop="product_type" style="float: left;width: 270px;">
                            <Select v-model="formValidate_list.id" placeholder="请选择产品类型" style="width: 180px;">
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
                <Col  span="3" offset="1">
                <span class="rules_text">新建规则</span>
                </Col>
                <Col span="2" >
                <Form style="display:inline-block">
                    <Input v-model="formValidate.queryParam" type="textarea" :autosize="{minRows: 4,maxRows: 5}"
                           placeholder="Enter something..." style="width: 279px;"></Input>
                </Form>
                </Col>
            </Row>

            <Row style="margin-top: 40px">
                <Col span="3" offset="1">
                <p style="font-size: 23px;">查询输出</p>
                </Col>
                <Col span="2" >
                <div class="container_label" ref="container_label">
                    <Tag v-for="(item,index) in title" :key="index" :name="item.title" closable
                         @on-close="handleClose2" style=" background: #dddee1;height: 40px;line-height: 40px;padding: 0 15px;">{{ item.title}}
                    </Tag>
                </div>
                </Col>

            </Row>
            <Row style="margin-top: 40px">
                <Col  span="3" offset="6">
                <Button type="primary" @click="submit" >保存</Button>
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

                theme2: 'light',
                formValidate: {
                    productName: '',
                    categoryName: '',
                    queryParam: '',
                },
                data3: [{}],
                title: [],
                out: [],
                select: [],
                style_active:{
                    color:"#495060",
                    cursor:'pointer',
                    display: 'inline-block',
                    maxWidth: '110px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    lineHeight:'14px'
                },
                formValidate_list:{},

            };
        },
        created () {
            this.init();
            this.product_First_list();
        },
        methods: {
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
                            if (res.data.data.length !== 0) {
                                const data = res.data.data.map((item, index) => {
                                    return {
                                        title: item.categoryName || '',
                                        id: item.parentId || '',
                                        type: 2,
                                        loading: false,
                                        children: [],
                                        render:(h,params)=>{

                                            return h('span',{
                                                style:{  cursor: 'pointer',
                                                    display: 'inline-block',
                                                    maxWidth: '110px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    lineHeight:'14px'},
                                                on :{
                                                    click:()=>{
                                                        this.treeHandClick(params)
                                                    }
                                                }
                                            },item.categoryName)
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
                                        title: item.labelName || '',
                                        id: item.id || '',
                                        type: 3,
                                        render: (h, params) => {
                                            return h('span', {
                                                style:this.style_active,
                                                on: {
                                                    click: (ev) => {
                                                        ev.path[0].style.color='#9ea7b4'

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
                                const data = res.data.data.map((item, index) => {
                                    return {
                                        title: item.labelName || '',
                                        id: item.id || '',
                                        type: 2,
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
                    url: api.product_getDetail_name_list(),
                }).then(res => {

                    this.formValidate_list = res.data.data;

                });
            },
            //页面fenlei列表
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
                                title: item.categoryName,
                                id: item.id,
                                loading: false,
                                children: [],
                                type: 1,
                                render:(h,params)=>{
                                    return h('span',{
                                        style:{
                                            cursor: 'pointer',
                                            display: 'inline-block',
                                            maxWidth: '110px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            lineHeight:'14px'
                                        },
                                        on :{
                                            click:()=>{
                                                this.treeHandClick(params)
                                            }
                                        }
                                    },item.categoryName)
                                }
                            };
                        });
                        this.data3 = result;
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
                        this.out=[]
                        this.$router.back(-1);

                    } else {
                        this.out=[]
                        this.$Message.info(res.data.msg);
                    }
                });

            },
            handleClose2 (event, name) {
                let myError
                if (!myError) {
                    let index;
                    this.title.map((r, m) => {
                        if (r.title === name) {
                            index = m;

                        }
                    });
                    this.title.splice(index, 1);
                    this.style_active = {};
                }
            }
        }
    };
</script>

<style scoped>
    .menu_product_list {
        margin-top: 25%;
        margin-left: 15%;
    }
    .new_product_fir {
        display: flex;
        margin: 30px 0 20px 0;
    }
    .new_text {
        font-size: 23px;
    }

    .container_label {
        padding-left: 2px;
        margin-right: 30px   ;
        overflow-y: scroll;
        width: 479px;
        height: 115px;
        border: 1px solid #dddee1;
        border-radius: 4px;
    }

    .rules_container {
        margin: 0 auto;
    }

    .rules_text {

        font-size: 23px;

    }
</style>