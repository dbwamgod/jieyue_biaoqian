<template>
    <div class="all_box">
        <Row type="flex" justify="space-between" align="middle" class="code-row-bg">
            <Col span="6">
            <h2 class="header-title">数据源配置</h2>
            </Col>
            <Col span="8" class="search-add">
            <Button type="primary" @click="edit_add('new')">新建</Button>
            <Input v-model="searchName" icon="ios-search" search placeholder="请搜索..." class="sea-name"/>
            <Button type="primary" @click="searchChange">搜索</Button>
            </Col>
        </Row>

        <Table border :columns="columns7" :data="data6"></Table>
        <Page :total="dataCount" show-total :page-size="page.pageSize" :current="page.pageIndex" class="paging"
              @on-change="changepage"/>


        <Modal
                v-model="dataModal"
                :title="addAndEditTitle"
                :closable="false"
                :footer-hide='true'
                class="sourceModal">
            <!--类名在main.less中-->
            <Form ref="formData" :model="formData" :rules="ruleInline">
                <FormItem prop="connectName" label="名称：" label-position="right">
                    <Input v-model="formData.connectName" placeholder="请输入名称"/>
                </FormItem>
                <FormItem prop="url" label="连接串：" label-position="right">
                    <Input v-model="formData.url" placeholder="请输入连接串"/>
                </FormItem>
                <FormItem prop="typeNo" label="类型：" label-position="right">
                    <Cascader :data="cascaderForm" v-model="formData.typeNo"></Cascader>
                </FormItem>

                <FormItem prop="userName" label="用户名：" label-position="right">
                    <Input v-model="formData.userName" placeholder="请输入用户名"/>
                </FormItem>
                <FormItem prop="pswd" label="密码：" label-position="right">
                    <Input type="password" v-model="formData.pswd" placeholder="请输入密码"/>
                </FormItem>

                <div style='text-align: right;'>
                    <Button type="primary" @click="test" style="float: left;">连接测试</Button>
                    <Button type="primary" @click='ok' style=" margin-right:10px;">保存</Button>
                    <Button @click='cancel'>取消</Button>
                </div>

            </Form>
        </Modal>


    </div>
</template>

<script>
    import api from '@/api';

    export default {
        name: 'data_source',
        data () {
            return {
                cascaderForm: [
                    {
                        label: 'hive',
                        value: '0'
                    },
                    {
                        label: 'mysql',
                        value: '1'
                    },
                    {
                        label: 'oracle',
                        value: '2'
                    },
                ],
                formData: {
                    connectName: '',
                    pswd: '',
                    typeNo: [''],
                    url: '',
                    userName: '',
                },
                ruleInline: {
                    connectName: [{required: true, message: '请输入名称', trigger: 'blur'}],
                    pswd: [{required: true, message: '请输入密码', trigger: 'blur'}],
                    typeNo: [{required: true, type: 'array', message: '请输入类型', trigger: 'blur'}],
                    url: [{required: true, message: '请输入连接串', trigger: 'blur'}],
                    userName: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                },
                addAndEditTitle: '',
                dataModal: false,
                columns7: [
                    {
                        title: '名称',
                        key: 'connectName'
                    }, {
                        title: '用户名',
                        key: 'userName'
                    }, {
                        title: '类型',
                        key: 'typeNo',
                        render: (h, params) => {
                            return h('div', [h('p', this.cascaderForm[params.row.typeNo].label)]);
                        }
                    }, {
                        title: '连接串',
                        key: 'url'
                    }, {
                        title: '密码',
                        key: 'pswd'
                    }, {
                        title: '操作',
                        key: 'active',
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
                                            this.edit_add('edit', params.row);
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index, params.row.id);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                data6: [],
                searchName: '',
                dataCount: 0,
                page: {
                    pageSize: 10,
                    pageIndex: 1
                }
            };
        },
        created () {

            this.dataList();
        },
        methods: {
            test () {
                this.$refs.formData.validate(valid => {
                    if (valid) {
                        this.$axios({
                            method: 'post',
                            url: api.checkDataSource(),
                            data: {
                                'connectName': this.formData.connectName,
                                'id': this.formData.id,
                                'pswd': this.formData.pswd,
                                'typeNo': this.formData.typeNo[0][0],
                                'url': this.formData.url,
                                'userName': this.formData.userName
                            }
                        }).then(res=>{
                            if(res.data.code==200){
                                this.$Message.success("连接测试成功")
                            }else{
                                this.$Message.error(res.data.msg)
                            }
                        });

                    } else {
                        this.$Message.error('你的信息输入有误');

                    }
                })
            },
            dataList () {
                this.$axios({
                    method: 'post',
                    url: api.queryDataSourcePage(),
                    data: {
                        'pageIndex': this.page.pageIndex,
                        'pageSize': this.page.pageSize,
                        'form': this.searchName,
                    }
                }).then(res => {
                    if (res.data.code === 200) {
                        this.data6 = res.data.data.map(r => {
                            r.typeNo = [r.typeNo];
                            return r;
                        });
                        this.dataCount = res.data.page.totalRecords;
                        if (res.data.data.length == 0 || res.data.data == []) {
                            if (res.data.page.totalRecords != 0) {
                                this.page.pageIndex =
                                    this.page.pageIndex != 0
                                        ? this.page.pageIndex - 1
                                        : this.page.pageIndex;
                                this.dataList();
                            }
                        }
                    }
                });
            },
            searchChange () {
                this.page.pageIndex = 1;
                this.dataList();
            },
            changepage () {
                this.page.pageIndex = index;
                this.dataList();
            },
            remove (i, id) {
                this.$axios({
                    method: 'get',
                    url: api.removeDataSource(id)
                }).then(res => {
                    if (res.data.code === 200) {
                        this.dataList();
                        this.$Message.success('删除成功');
                    } else {
                        this.$Message.error(res.data.msg);
                    }
                });
            },
            edit_add (info, row) {
                this.dataModal = true;
                this.addAndEditTitle = info === 'new' ? '新建数据源' : '修改数据源';
                if (info === 'edit') {
                    let a = JSON.parse(JSON.stringify(row));
                    this.formData.connectName = a.connectName;
                    this.formData.pswd = a.pswd;
                    this.formData.typeNo = [String(a.typeNo[0])];
                    this.formData.url = a.url;
                    this.formData.userName = a.userName;
                    this.formData.id = a.id;

                } else {
                    this.formData = {};
                }
            },
            ok (e) {
                this.formData.typeNo = [this.formData.typeNo];
                this.$refs.formData.validate(valid => {
                    if (valid) {
                        if (this.addAndEditTitle === '新建数据源') {
                            this.$axios({
                                method: 'post',
                                url: api.saveDataSource(),
                                data: {
                                    'connectName': this.formData.connectName,
                                    'pswd': this.formData.pswd,
                                    typeNo: this.formData.typeNo[0][0],
                                    'url': this.formData.url,
                                    'userName': this.formData.userName
                                }
                            }).then(res => {
                                if (res.data.code == 200) {

                                    this.dataModal = false;
                                    this.formData = {};
                                    this.$Message.success('新建成功');
                                    this.dataList();
                                } else {
                                    this.$Message.error(res.data.msg);
                                }
                            });

                        } else {
                            this.$axios({
                                method: 'post',
                                url: api.updateDataSource(),
                                data: {
                                    'connectName': this.formData.connectName,
                                    'pswd': this.formData.pswd,
                                    'typeNo': this.formData.typeNo[0][0],
                                    'url': this.formData.url,
                                    'userName': this.formData.userName,
                                    id: this.formData.id
                                }
                            }).then(res => {
                                if (res.data.code == 200) {

                                    this.dataModal = false;
                                    this.formData = {};
                                    this.$Message.success('修改成功');
                                    this.dataList();
                                } else {
                                    this.$Message.error(res.data.msg);
                                }
                            });
                        }
                    } else {
                        this.$Message.error('你的信息输入有误');
                    }
                });

            },
            cancel () {
                this.dataModal = false;
                this.formData = {};
                this.$refs.formData.resetFields();
            },
        }
    };
</script>

<style scoped>
    .paging {
        float: right;
        margin-top: 10px;
    }
</style>