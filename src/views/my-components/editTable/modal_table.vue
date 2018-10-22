<template>
    <div>
        <Form ref="formInline" :model="categoryDetails" :rules="ruleInline" inline>
            <FormItem prop="groupName" label="组名：" label-position="right" :label-width="100" style="width:97%">
                <Input v-model="categoryDetails.groupName" placeholder="请输入组名" style="width: 97%"/>
            </FormItem>
            <FormItem prop="classification" label="分类：" placeholder="请选择" label-position="right" :label-width="100"
                      style="width: 97%;">
                <Select v-model="categoryDetails.classification" style="width:97%">
                    <!--<Option  value=" " >请选择</Option>-->
                    <Option v-for="item in categoryList" :value="item.id" :key="item.id">{{item.parentName +'-'+
                        item.categoryName}}
                    </Option>
                </Select>
            </FormItem>
            <FormItem prop="processingType" label="加工类型：" label-position="right" :label-width="100">
                <RadioGroup v-model="categoryDetails.processingType" style="width:300px">
                    <Radio label="0">java</Radio>
                    <Radio label="1">sql</Radio>
                    <Radio label="3">javascript</Radio>
                    <Radio label="4">spark</Radio>
                    <Radio label="5">groovy</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem prop="labels" label="标签：" label-position="right" :label-width="100">
                <Table border :columns="labels" :data="editInlineAndCellData" height="200"
                       style="width: 1000px;"></Table>
            </FormItem>


            <FormItem prop="processing" label="重复加工：" label-position="right" :label-width="100">
                <RadioGroup v-model="categoryDetails.processing" style="width:800px">
                    <Radio label="0">是</Radio>
                    <Radio label="1">否</Radio>
                </RadioGroup>
            </FormItem>

            <FormItem prop="processingRules" label="sql：" label-position="right" :label-width="100">
                <Input v-model="categoryDetails.processingRules" type="textarea" class='tab_man_textarea'
                       :autosize="{minRows: 2,maxRows: 15}" placeholder="请输入sql..."></Input>
            </FormItem>


        </Form>
        <div style='text-align: right;'>
            <Button @click='cancel' style=" margin-right:10px;">取消</Button>
            <Button type="primary" @click='ok'>确定</Button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'modal_table'
        ,
        data () {
            return {
                data_type: [
                    {
                        value: 'string',
                        name: 'string'
                    },
                    {
                        value: 'bool',
                        name: 'bool'
                    },
                    {
                        value: 'int',
                        name: 'int'
                    },
                    {
                        value: 'double',
                        name: 'double'
                    },
                ],
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
                                },
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
                        /* render: (h, params) => {
                             let _this = this;
                             return h('Input', {
                                 props: {
                                     type: 'text',
                                     value: this.editInlineAndCellData[params.index].dataType
                                 },
                                 on: {
                                     'on-blur' (event) {
                                         _this.edit_t[params.index].dataType = event.srcElement.value || event.target.value;
                                         _this.delBlurBad(event, params);

                                     }
                                 }
                             });
                         },*/
                        render: (h, params) => {

                            return h('Select', {
                                    props: {},
                                    on: {
                                        'on-change': (event) => {
                                            this.data_type[params.index].dataType = event;
                                        }
                                    },
                                },
                                this.data_type.map((item) => {
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
                                },
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
                        key: 'indexStatus',
                        align: 'center',
                        render: (h, params) => {
                            let _this = this;
                            return h('Input', {
                                props: {
                                    type: 'text',
                                    value: String(this.editInlineAndCellData[params.index].indexStatus)
                                },
                                on: {
                                    'on-blur' (event) {
                                        _this.edit_t[params.index].indexStatus = event.srcElement.value || event.target.value;
                                        _this.delBlurBad(event, params);

                                    }
                                }
                            });
                        }

                    },
                    {
                        title: '规则内容',
                        key: 'rule',
                        align: 'center',
                        render: (h, params) => {
                            let _this = this;
                            // console.log(window);

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
                        width: '200px',
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
                    available: ''
                }
            };
        },
        method: {
            ok () {
                this.$refs.formInline.validate(valid => {
                    if (valid) {
                        // console.log(this.edit_t);
                        this.categoryDetails.precision =
                            this.categoryDetails.labelType == 3
                                ? this.categoryDetails.precision
                                : '';
                        if (this.isEdit == '新建') {
                            console.log(this.categoryDetails);
                            this.$axios({
                                method: 'post',
                                url: api.saveLabel(),
                                data: {
                                    categoryId: this.categoryDetails.classification,
                                    processType: String(this.categoryDetails.processingType),
                                    oneTime: Boolean(this.categoryDetails.processing),
                                    'groupName': this.categoryDetails.groupName,
                                    'labels': this.edit_t,
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
                                    // accuracy: Number(this.categoryDetails.precision),
                                    // categoryId: this.categoryDetails.classification,
                                    // dataType: this.categoryDetails.labelType,
                                    // labelCode: this.categoryDetails.code,
                                    // labelName: this.categoryDetails.name,
                                    // processType: this.categoryDetails.processingType,
                                    // rule: this.categoryDetails.processingRules,
                                    // oneTime: this.categoryDetails.processing,
                                    id: this.categoryDetails.id,
                                    categoryId: this.categoryDetails.classification,
                                    processType: String(this.categoryDetails.processingType),
                                    oneTime: Boolean(this.categoryDetails.processing),
                                    'groupName': this.categoryDetails.groupName,
                                    'labels': this.editInlineAndCellData,
                                    'sql': this.categoryDetails.processingRules,

                                    // available: this.categoryDetails.available,
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
                    precision: ''
                };
            },
        }
    };
</script>

<style scoped>

</style>