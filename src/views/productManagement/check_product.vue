<template>
    <div>
        <Row class="treeData">
            <Col class="Col_product_new">
            <Tree :data="data3" :load-data="loadData" class="menu_product_list" on-select-change="loadData"></Tree>
            </Col>
        </Row>
        <div class="checkInfo_table">
            <Row class="checkProduct-container">
                <Col span="2">
                <span>产品名称:</span>
                </Col>
                <Col span="3" class="productNames">
                <span class="check_container_product">{{defaultRules.productName}}</span>
                </Col>
            </Row>
            <Row class="checkProduct-container">
                <Col span="2">
                <span>产品类别:</span>
                </Col>
                <Col span="3" class="check-productType">
                <span class="check_container_list">{{defaultRules.categoryName}}</span>
                </Col>
            </Row>
            <Row class="checkProduct-container">
                <Col span="2">
                <p class="Default_rule">预设规则:</p>
                </Col>
                <Col span="18" class="prophesy-rule">
                <span class="prophesy-rule-text">{{defaultRules.queryParam}}</span>
                </Col>
            </Row>
            <Row class="checkProduct-container">
                <Col span="2">
                <p class="check_inpout">查询输出:</p>
                </Col>
                <Col span="18">
                <div class="container_label_check" ref="container_label_check">
                    <Tag v-for="(item,index) in defaultRules.labelVos" :key="index" :name="item.labelName"
                         @on-close="handleClose2" class="container_label_check_tag">{{ item.labelName }}
                    </Tag>
                </div>
                </Col>
            </Row>
            <Row class="checkProduct-container-operation">
                <Col span="12" offset="8">
                <Button type="primary" @click="checkInfo" class="handle" v-if="queryFindLabel">查询</Button>
                <Button type="primary" @click="comeout" class="handle" v-if="queryFindLabel">导出</Button>
                <Button @click="canel">返回</Button>
                </Col>
            </Row>
            <Row class="check-result">
                <Col span="2">
                <p class="detail_list">查询结果:</p>
                </Col>
                <Col span="18">
                <Table border :columns="columns1" :data="data2"></Table>
                </Col>
            </Row>
            <Row class="checkProduct-page">
                <Col class="page-list">
                <Page :total="dataCount" show-total :page-size="page.pageSize" :current="page.pageIndex"
                      @on-change="changepage"/>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
    import api from '@/api';
    import Cookies from 'js-cookie';

    export default {
        inject: ['reload'],
        name: 'check_product',
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
                title: [],
                defaultFlag: [],
                check_out: [],
                check_out_flag: false,
                queryFindLabel:false,
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
            this.product_First_list();
            this.queryFindLabel=JSON.parse(this.$route.query.findLabel)
        },
        methods: {
            canel () {
                this.data2 = [];
                this.$router.back(-1);
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
                                                    style: {
                                                        cursor: 'pointer',
                                                        display: 'inline-block',
                                                        maxWidth: '110px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        lineHeight: '14px'
                                                    },
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
                                                    style: this.check_out_flag || this.defaultFlag.find(r => params.data.id === r) ? {
                                                        color: '#9ea7b4', display: 'inline-block',
                                                        maxWidth: '90px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        lineHeight: '14px',
                                                    } : {
                                                        cursor: 'pointer',
                                                        display: 'inline-block',
                                                        maxWidth: '90px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        lineHeight: '14px',
                                                    },
                                                    on: {
                                                        click: ev => {
                                                            ev.path[0].style.color = '#9ea7b4';

                                                            let flag = this.title.find(r => r.labelId === params.data.id);

                                                            if (!flag) {
                                                                if (this.title.filter(r => r.labelId === params.data.id)[0]) {
                                                                } else {
                                                                    this.title.push(params.data);
                                                                    this.check_out.push(ev.path[0]);
                                                                    // this.big_container.push(ev.path[0])
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
                                            style: {
                                                cursor: 'pointer',
                                                display: 'inline-block',
                                                maxWidth: '100px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                lineHeight: '14px',
                                                whiteSpace: 'nowrap'
                                            },
                                            on: {
                                                click: () => this.treeHandClick(params)
                                            }
                                        },
                                        item.categoryName
                                    );
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
            comeout () {
                new Promise((res, rej) => {
                    res(this.product_productOutput_list(1));
                }).then(res => {
                    window.open(api.product_out(encodeURIComponent(this.defaultRules.queryParam),encodeURIComponent(this.check_list.join(","))), '_blank')
                }).catch(res => {
                    this.reload();
                });

            },
            changepage (index) {
                this.page.pageIndex = index;
                this.product_productOutput_list();
            },
            //获取输出列表
            product_productOutput_list (arg) {

                // this.check_list = this.defaultRules.labelNameVoList;

                this.defaultRules.labelVos.forEach(r => {
                    this.check_list.push(r.labelId);
                });
                this.$axios({
                    method: 'POST',
                    url: api.product_productOutput_list(),
                    data: {
                        'queryParam': this.defaultRules.queryParam,
                        'codeIds': this.check_list,
                        'pageSize': this.page.pageSize,
                        'pageIndex': this.page.pageIndex - 1
                    },
                }).then(res => {
                    this.check_list = [];
                    if (res.data.code == 200) {
                        if (arg) {

                        } else if (res.data.data.length !== 0) {
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
    .treeData {
        position: fixed;
        width: 160px;
        height: 100%;
        background: #585b6d;
        color: #dddee1;
        opacity: .7;
        .menu_product_list {
            margin-top: 15%;
            margin-left: 10%;

        }
    }

    /*查询信息列表*/
    .checkInfo_table {
        margin-left: 160px;
        padding-top: 35px;
        padding-left: 4.6%;

        .productNames {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 300px;
        }
        .checkProduct-container {
            margin-top: 20px;
            .check-productType {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
        }

        .prophesy-rule {
            border: 1px solid #dddee1;
            min-width: 300px;
            min-height: 40px;
            padding: 10px;
            .prophesy-rule-text {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                display: block;
            }

        }
        .check_inpout {
            border-radius: 5px;
        }
        .container_label_check {
            overflow-y: auto;
            max-height: 145px;
            min-height: 48px;
            border: 1px solid #dddee1;
            border-radius: 4px;

            .container_label_check_tag {
                height: 35px;
                line-height: 35px;
                padding: 0 15px;
                background: #e1e1e1;
                margin: 5px 2.5px 2.5px 5px;
            }
        }
        .checkProduct-container-operation {
            margin-top: 40px;
            .handle {
                margin-right: 20px;
            }
        }

        .check-result {
            margin-top: 40px;
        }
        .checkProduct-page {
            margin-top: 30px;
            .page-list {
                margin-left: 43%;
                width: 40%;
                text-align: right;
            }
        }

    }

    .check_container_product {
        color: #515a6e;
    }

    .check_container_list {
        color: #515a6e;

    }


</style>