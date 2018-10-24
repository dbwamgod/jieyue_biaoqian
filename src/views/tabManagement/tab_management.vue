<template>
    <div style='position: relative;height:100%;padding:10px;'>
        <Row type="flex" justify="space-between" align="middle" class="code-row-bg" style='margin-bottom:10px;'>
            <Col span="6">
            <h2 style="margin: 6px 0 0 20px">标签列表</h2>
            </Col>
            <Col span="8" style='text-align:right;margin-right:5px;'>
            <Button type="primary" @click="newCreate" style=" ">新建</Button>
            <Input v-model="labelname" icon="ios-search" search placeholder="请搜索..." style=" width:160px;"/>
            <Button type="primary" @click="searchChange">搜索</Button>
            </Col>
        </Row>
        <Table border :columns="columns7" :data="data6"></Table>
        <!--<Button type="primary" @click="$router.push({name:'new_create'})">新建</Button>-->
        <Page :total="dataCount" show-total :page-size="page.pageSize" :current="page.pageIndex" class="paging"
              @on-change="changepage"/>
        <Modal
                v-model="modal1"
                width="1200px"
                :title=" isEdit"
                :closable="false"
                :footer-hide='true'
                @on-cancel="cancel">
            <div>
                <Form ref="formInline" :model="categoryDetails" :rules="ruleInline" inline>
                    <FormItem prop="groupName" label="组名：" label-position="right" :label-width="100" style="width:97%">
                        <Input v-model="categoryDetails.groupName" placeholder="请输入组名" style="width: 97%"/>
                    </FormItem>
                    <FormItem prop="classification" label="分类：" placeholder="请选择" label-position="right"
                              :label-width="100"
                              style="width: 97%;">
                        <Select v-model="categoryDetails.classification" style="width:97%">
                            <!--<Option  value=" " >请选择</Option>-->
                            <Option v-for="item in categoryList" :value="item.id" :key="item.id">{{item.parentName +'-'+
                                item.categoryName}}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="processingType" label="加工类型：" label-position="right" :label-width="100 "
                              style="width: 97%;">
                        <RadioGroup v-model="categoryDetails.processingType" style="width:10%"
                                    v-for="(item,index) in procesing_type" :key="index">
                            <Radio :label="index">{{item}}</Radio>

                        </RadioGroup>
                    </FormItem>
                    <FormItem prop="labels" label="标签：" label-position="right" :label-width="80" style="    width: 92.8%;
">
                        <Table border :columns="labels" :data="editInlineAndCellData" height="200px"></Table>
                    </FormItem>


                    <FormItem prop="processing" label="重复加工：" label-position="right" :label-width="100">
                        <RadioGroup v-model="categoryDetails.processing" style="width:800px">
                            <Radio label="0">否</Radio>
                            <Radio label="1">是</Radio>

                        </RadioGroup>
                    </FormItem>
                    <FormItem prop="dataSourceId" label="数据源：" label-position="right" :label-width="100 "
                              style="width: 97%;">

                        <Cascader :data="dataScourseTypes" v-model="categoryDetails.dataSourceId"></Cascader>
                    </FormItem>

                    <FormItem prop="processingRules" label="sql：" label-position="right" :label-width="100">
                        <Input v-model="categoryDetails.processingRules" type="textarea" class='tab_man_textarea'
                               :autosize="{minRows: 2,maxRows: 15}" placeholder="请输入sql..."></Input>
                    </FormItem>


                </Form>
            </div>

            <div style='text-align: right;'>
                <Button type="primary" @click='ok' style=" margin-right:10px;">确定</Button>
                <Button @click='cancel'>取消</Button>
            </div>

        </Modal>
        <Modal
                v-model="modal2"
                title="删除标签"
                @on-ok="okDelete"
                :closable="false"
                @on-cancel="cancel2">
            <p>确定要删除此标签么？</p>
        </Modal>
    </div>
</template>
<script>
    import api from '@/api';
    import Cookies from 'js-cookie';
    import canEditTable from '@/views/my-components/editTable/canEditTable.vue';

    export default {
        components: {
            canEditTable
        },
        data () {
            return {

                dataScourseTypes: [],
                indexList: [
                    {
                        value: 'true',
                        name: '是'
                    }, {
                        value: 'false',
                        name: '否'
                    }
                ],
                DataTypesList: [],
                queryLabelDataTypesList: [],
                index: true,
                edit_t: [],
                editInlineAndCellData: [
                    {
                        labelCode: '',
                        labelName: '',
                        dataType: '',
                        defaultVal: '',
                        indexStatus: '',
                        rule: ''
                    }
                ],
                procesing_type: ['java', 'sql', 'javascript', 'spark', 'groovy'],
                labels: [
                    {
                        title: '代码',
                        key: 'labelCode',
                        align: 'center',
                        render: (h, params) => {
                            let _this = this;
                            return h('Input', {
                                props: {
                                    type: 'text',
                                    value: this.editInlineAndCellData[params.index].labelCode
                                },
                                style: {},
                                on: {
                                    'on-blur' (event) {
                                        _this.edit_t[params.index].labelCode = event.srcElement.value || event.target.value;
                                        _this.delBlurBad(event, params);
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: '名称',
                        key: 'labelName',
                        align: 'center',
                        render: (h, params) => {
                            let _this = this;
                            return h('Input', {
                                props: {
                                    type: 'text',
                                    value: this.editInlineAndCellData[params.index].labelName
                                }, style: {},
                                on: {
                                    'on-blur' (event) {

                                        _this.edit_t[params.index].labelName = event.srcElement.value || event.target.value;
                                        _this.delBlurBad(event, params);

                                    }
                                }
                            });
                        }

                    },
                    {
                        title: '数据类型',
                        key: 'dataType',
                        align: 'center',
                        render: (h, params) => {
                            let _this = this;
                            return h('Select', {
                                    props: {
                                        value: this.editInlineAndCellData[params.index].dataType
                                    },
                                    on: {
                                        'on-change': (event) => {
                                            _this.edit_t[params.index].dataType = event;
                                        }
                                    },
                                },
                                this.DataTypesList.map((item) => {
                                    return h('Option', {
                                        props: {
                                            value: item.value,
                                            label: item.name
                                        }
                                    });
                                })
                            );
                        }
                    },
                    {
                        title: '默认值',
                        key: 'defaultVal',
                        align: 'center',
                        render: (h, params) => {
                            let _this = this;
                            return h('Input', {
                                props: {
                                    type: 'text',
                                    value: this.editInlineAndCellData[params.index].defaultVal
                                }, style: {},
                                on: {
                                    'on-blur' (event) {
                                        _this.edit_t[params.index].defaultVal = event.srcElement.value || event.target.value;
                                        _this.delBlurBad(event, params);

                                    }
                                }
                            });
                        }
                    },
                    {
                        title: '是否创建索引',
                        key: 'iletxStatus',
                        align: 'center',
                        render: (h, params) => {
                            let _this = this;
                            return h('Select', {
                                    props: {
                                        value: this.editInlineAndCellData[params.index].indexStatus
                                    },
                                    on: {
                                        'on-change': (event) => {
                                            _this.edit_t[params.index].indexStatus = event;
                                        }
                                    },
                                },
                                this.indexList.map((item) => {
                                    return h('Option', {
                                        props: {
                                            value: item.value,
                                            label: item.name
                                        }
                                    });
                                })
                            );
                        }
                    },
                    {
                        title: '规则内容',
                        key: 'rule',
                        align: 'center',
                        render: (h, params) => {
                            let _this = this;

                            return h('Input', {
                                props: {
                                    type: 'text',
                                    value: this.editInlineAndCellData[params.index].rule
                                },
                                on: {
                                    'on-blur' (event) {
                                        _this.edit_t[params.index].rule = event.srcElement.value || event.target.value;
                                        _this.delBlurBad(event, params);
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: '操作',
                        key: 'actions',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            if (this.index) {
                                                this.editInlineAndCellData = this.edit_t;
                                                this.editInlineAndCellData.splice(params.index + 1, 0, {
                                                    labelCode: '',
                                                    labelName: '',
                                                    dataType: '',
                                                    defaultVal: '',
                                                    indexStatus: '',
                                                    rule: '',
                                                });
                                            } else {
                                                this.index = true;
                                            }
                                        },

                                    }
                                }, '添加'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            if (this.index) {
                                                if (this.editInlineAndCellData.length === 1) {
                                                    return;
                                                }
                                                this.editInlineAndCellData.splice(params.index, 1);

                                            } else {
                                                this.index = true;
                                            }
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    },
                ],
                dataCount: 0,
                page: {
                    pageIndex: 1,
                    pageSize: 10
                },
                modal1: false,
                modal2: false,
                labelname: '',
                categoryList: [],
                columns7: [
                    {
                        title: '序号',
                        key: 'id'
                    },
                    {
                        title: '标签组名',
                        key: 'groupName'
                    },
                    {
                        title: '分类',
                        key: 'categoryId',
                        render: (h, params) => {
                            return h('span', this.filterClassification(params.row.categoryId));
                        }
                    },
                    {
                        title: '加工类型',
                        key: 'processType',
                        render: (h, params) => {

                            return h('div', [
                                h('p', {
                                    style: {
                                        marginRight: '5px'
                                    },
                                }, this.procesing_type[params.row.processType]),
                            ]);
                        }
                    },
                    {
                        title: '重复加工',
                        key: 'oneTime',
                        render: (h, params) => {
                            return h('div', [
                                h('p', {
                                    style: {
                                        marginRight: '5px'
                                    },
                                }, params.row.oneTime == 0 ? '否' : '是'),
                            ]);
                        }
                    },
                    {
                        title: '数据源',
                        key: 'dataSourceId',
                        render: (h, params) => {

                            let scource=this.dataScourseTypes&&this.dataScourseTypes.map(r => {
                                if (r.value === params.row.dataSourceId) {
                                    return r.label
                                }
                            });
                            return h('div', [
                                h('p', {
                                    style: {
                                        marginRight: '5px'
                                    },
                                }, scource),
                            ]);
                        }
                    },
                    {
                        title: '标签',
                        key: 'labels',
                        render: (h, params) => {
                            let b;
                            let a = params.row.labels && params.row.labels.map((r) => {
                                return r.labelCode + ':' + r.labelName;
                            });
                            let pList = a&&a.map(item=>{
                               return  h('p', {
                                    style: {
                                        marginRight: '5px'
                                    },
                                }, item+',')
                            });
                            return h('div', pList);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 200,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h(
                                    'Button',
                                    {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.show(params.row);
                                            }
                                        }
                                    },
                                    '编辑'
                                ),
                                h(
                                    'Button',
                                    {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                // this.remove(params.row.id, params.index);
                                                this.modal2 = true;
                                                this.paramsRowId = params.row.id;
                                            }
                                        }
                                    },
                                    '删除'
                                ),
                                h(
                                    'Button',
                                    {
                                        props: {
                                            //available 可用
                                            type: params.row.available == 0 ? 'primary' : 'error',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.available(params.row.id, params.row.available);
                                            }
                                        }
                                    },
                                    params.row.available == 0 ? '启用' : '停用'
                                )
                            ]);
                        }
                    }
                ],
                data6: [],
                isEdit: '新建',
                ruleInline: {
                    groupName: [{required: true, message: '请输入组名', trigger: 'blur'}],
                    code: [{required: true, message: '请输入分类代码', trigger: 'blur'}],
                    labels: [{required: false, message: '请输入完整的标签', trigger: 'blur'}],
                    labelType: [
                        {
                            type: 'number',
                            required: true,
                            message: '请选择类型',
                            trigger: 'change'
                        }
                    ],
                    classification: [
                        {
                            type: 'number',
                            required: true,
                            message: '请选择分类',
                            trigger: 'change'
                        }
                    ],
                    name: [{required: true, message: '请输入名称', trigger: 'blur'}],
                    processingRules: [
                        {required: true, message: '请输入sql', trigger: 'blur'},
                    ],
                    precision: [
                        {pattern: /^[0-9]{0,5}$/, message: '请输入数字最多五位', trigger: 'blur'},
                    ]
                },
                categoryDetails: {
                    groupName: '',
                    code: '',
                    name: '',
                    labelType: '',
                    classification: '',
                    processing: '',
                    processingType: '',
                    precision: '',
                    processingRules: '',
                    id: '',
                    available: '',
                    dataSourceId: []
                },
            };
        },
        created () {

            this.dataScourseType();

            this.edit_t = JSON.parse(JSON.stringify(this.editInlineAndCellData));
            this.$axios
                .all([this.getCategoryListSecondary(), this.queryLabelDataTypes()])
                .then(this.$axios.spread((acct, perms) => this.init()));

        },
        methods: {

            //数据源类型
            dataScourseType () {
                this.$axios({
                    method: 'get',
                    url: api.queryAllDataSources()
                }).then(res => {
                    if (res.data.code == 200) {
                        this.dataScourseTypes = res.data.data.map(r => {
                            // console.log(r);
                            return {
                                label: r.connectName,
                                value: r.id
                            };
                        });

                    }
                });
            },

            delBlurBad (e, params) {
                let event = e || event;
                if (event.relatedTarget) {

                    if (event.relatedTarget.firstElementChild) {
                        // console.log(event.relatedTarget.firstElementChild.innerText,);
                        if (event.relatedTarget.firstElementChild.innerText == '添加') {
                            this.index = false;
                            this.editInlineAndCellData = this.edit_t;
                            this.editInlineAndCellData.splice(params.index + 1, 0, {
                                labelCode: '',
                                labelName: '',
                                dataType: '',
                                defaultVal: '',
                                indexStatus: '',
                                rule: '',
                            });
                        } else if (event.relatedTarget.firstElementChild.innerText == '删除') {
                            if (this.editInlineAndCellData.length === 1) {
                                return;
                            }
                            this.editInlineAndCellData.splice(params.index, 1);
                        }
                    }
                }
            },

            init () {
                this.$axios({
                    method: 'post',
                    url: api.queryGroupsLabels(),
                    data: {
                        form: {
                            groupName: this.labelname
                        },
                        pageIndex: this.page.pageIndex,
                        pageSize: this.page.pageSize
                    }
                }).then(
                    r => {
                        if (r.data.code == 200) {
                            this.data6 = r.data.data;
                            this.dataCount = r.data.page.totalRecords;
                            if (r.data.data.length == 0 || r.data.data == []) {
                                if (r.data.page.totalRecords != 0) {
                                    this.page.pageIndex =
                                        this.page.pageIndex != 0
                                            ? this.page.pageIndex - 1
                                            : this.page.pageIndex;
                                    this.init();
                                }

                            }
                        } else {
                            this.$Message.warning('网络请求错误！请刷新');
                        }
                    },
                    err => {
                        this.$Message.warning('服务器错误');
                    }
                );
            },
            searchChange () {
                this.page.pageIndex = 1;
                this.init();
            },
            getCategoryListSecondary () {
                return this.$axios({
                    method: 'post',
                    url: api.queryLabelCategorysT(),
                    data: {
                        form: {
                            categoryName: ''
                        },
                        pageIndex: 0,
                        pageSize: 0
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        this.categoryList = res.data.data;
                    } else {
                        this.$Message.info({
                            content: res.data.msg,
                            duration: 3
                        });
                    }
                });
            },
            filterClassification (id) {
                let aa = this.categoryList.filter(r => r.id === id)[0];
                return aa ? aa.parentName + '-' + aa.categoryName : '无类型';
            },
            filterWordType (id) {
                let aa = this.queryLabelDataTypesList.filter(r => r.id === id)[0];
                return aa ? aa.typeName : '无类型';
            },
            queryLabelDataTypes () {
                return this.$axios({
                    method: 'get',
                    url: api.queryLabelDataTypes()
                }).then(res => {
                    if (res.data.code == 200) {
                        this.queryLabelDataTypesList = res.data.data;

                        this.DataTypesList = this.queryLabelDataTypesList.map(r => {
                            return {
                                value: r.id || 0,
                                name: r.typeName || string
                            };
                        });
                    } else {
                        this.$Message.info({
                            content: res.data.msg,
                            duration: 3
                        });
                    }
                });
            },
            newCreate () {
                this.isEdit = '新建';
                this.modal1 = true;
                this.categoryDetails.processing = 0;
                this.categoryDetails.processingType = 0;
                this.categoryDetails.dataSourceId = [0];
            },
            show (data) {
                this.isEdit = '编辑';
                this.modal1 = true;
                this.$axios({
                    method: 'get',
                    url: api.queryLabelById(data.id)
                }).then(res => {
                    if (res.data.code == 200) {
                        let info = res.data.data;
                        info.labels.forEach(r => {
                            r.indexStatus += '';
                        });
                        this.categoryDetails.processingRules = res.data.data.sql;
                        this.categoryDetails.groupName = info.groupName;
                        this.categoryDetails.name = info.labelName;
                        this.categoryDetails.labelType = info.dataType;
                        this.categoryDetails.classification = this.filterClassification(info.categoryId)=='无类型'?'':info.classification||1;
                        this.categoryDetails.dataSourceId = [info.dataSourceId];
                        this.categoryDetails.processing = Number(info.oneTime);
                        this.categoryDetails.processingType = Number(info.processType);
                        this.categoryDetails.precision = info.accuracy;
                        this.categoryDetails.id = info.id;
                        this.categoryDetails.available = info.available;
                        this.editInlineAndCellData = info.labels;
                        this.edit_t = info.labels;
                    } else {
                        this.$Message.error({
                            content: res.data.msg,
                            duration: 3
                        });
                    }
                });
            },
            remove (id, index) {
                this.$axios({
                    method: 'get',
                    url: api.removeLabelByIds(id),
                }).then(res => {
                    if (res.data.code == 200) {
                        this.init();
                        this.$Message.success({
                            content: '删除成功',
                            duration: 3
                        });
                    } else {
                        this.$Message.error({
                            content: res.data.msg,
                            duration: 3
                        });
                    }
                });
            },
            available (id, available) {
                this.$axios({
                    method: 'post',
                    url: api.changeLabelAvailable(),
                    data: {
                        id,
                        available: Boolean(!available)
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        this.init();
                        this.$Message.success({
                            content: '操作成功',
                            duration: 3
                        });
                    } else {
                        this.$Message.error({
                            content: res.data.msg,
                            duration: 3
                        });
                    }
                });
            },
            changepage (index) {
                this.labelname = '';
                this.page.pageIndex = index;
                this.init();
            },
            ok () {
                this.$refs.formInline.validate(valid => {
                    if (valid) {

                        this.categoryDetails.precision =
                            this.categoryDetails.labelType == 3
                                ? this.categoryDetails.precision
                                : '';
                        if (this.isEdit == '新建') {
                            this.$axios({
                                method: 'post',
                                url: api.saveLabel(),
                                data: {
                                    'categoryId': this.categoryDetails.classification,
                                    'processType': String(this.categoryDetails.processingType),
                                    'oneTime': Boolean(this.categoryDetails.processing),
                                    'groupName': this.categoryDetails.groupName,
                                    'labels': this.edit_t,
                                    'dataSourceId': this.categoryDetails.dataSourceId[0],
                                    'sql': this.categoryDetails.processingRules,

                                }
                            }).then(
                                res => {

                                    if (res.data.code == 200) {
                                        this.edit_t = [{
                                            labelCode: '',
                                            labelName: '',
                                            dataType: '',
                                            defaultVal: '',
                                            indexStatus: '',
                                            rule: '',
                                        }];
                                        this.editInlineAndCellData = [{
                                            labelCode: '',
                                            labelName: '',
                                            dataType: '',
                                            defaultVal: '',
                                            indexStatus: '',
                                            rule: '',
                                        }];

                                        this.cancel();
                                        this.init();
                                        this.$Message.success('创建成功');
                                    } else {
                                        this.$Message.info({
                                            content: res.data.msg,
                                            duration: 3
                                        });
                                    }
                                },
                                err => {
                                    this.$Message.info({
                                        content: '服务器错误',
                                        duration: 3
                                    });
                                }
                            );
                        } else {
                            this.$axios({
                                method: 'post',
                                url: api.updateLabelConfigById(),
                                data: {
                                    id: this.categoryDetails.id,
                                    categoryId: this.categoryDetails.classification,
                                    processType: String(this.categoryDetails.processingType),
                                    oneTime: Boolean(this.categoryDetails.processing),
                                    'groupName': this.categoryDetails.groupName,
                                    'labels': this.editInlineAndCellData,
                                    'sql': this.categoryDetails.processingRules,
                                    'dataSourceId': this.categoryDetails.dataSourceId[0]
                                }
                            }).then(
                                res => {
                                    if (res.data.code == 200) {
                                        this.cancel();
                                        this.init();
                                        this.$Message.success('修改成功');
                                    } else {
                                        this.$Message.info({
                                            content: res.data.msg,
                                            duration: 3
                                        });
                                    }
                                },
                                err => {
                                    this.$Message.info({
                                        content: '服务器错误',
                                        duration: 3
                                    });
                                }
                            );
                        }
                    }
                });
            },
            cancel () {
                this.editInlineAndCellData = [{
                    labelCode: '',
                    labelName: '',
                    dataType: '',
                    defaultVal: '',
                    indexStatus: '',
                    rule: '',
                }];
                this.edit_t = [{
                    labelCode: '',
                    labelName: '',
                    dataType: '',
                    defaultVal: '',
                    indexStatus: '',
                    rule: '',
                }];
                this.modal1 = false;
                this.$refs.formInline.resetFields();
                this.categoryDetails = {
                    code: '',
                    name: '',
                    labelType: '',
                    classification: '',
                    processing: 0,
                    processingType: 0,
                    dataSourceId: [0],
                    precision: ''
                };
            },
            okDelete () {
                this.remove(this.paramsRowId, '');
            },
            cancel2 () {
                this.modal2 = false;
            }
        }
    };
</script>

<style scoped>
    .tab_man_textarea textarea {
        resize: vertical;

    }

    .tab_man_textarea {
        width: 1000px;
    }

    .paging {
        float: right;
        margin-top: 10px;
    }
</style>
