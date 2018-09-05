<template>
    <div>
        <Form :model="formItem" :label-width="60">
            <Row type="flex" justify="start" class="code-row-bg" style='margin:10px 0;'>

                <Col span="8">

                <Form-item label="用户名：" style="margin-left:40px;">
                    <Input v-model="userName" placeholder="请输入"></Input>
                </Form-item>
                </Col>
                <Col span='4' style="text-align:center;">
                <Button type="primary" @click='submit'>搜索</Button>
                </Col>

            </Row>
        </Form>
        <Table :columns="historyColumns" :data="historyData"></Table>
        <Page :total="dataCount" :page-size="page.pageSize" :current="page.pageIndex" show-total class="paging"
              @on-change="changepage"></Page>

    </div>
</template>
<style scoped>
    .paging {
        float: right;
        margin-top: 10px;
    }
</style>
<script>
    import Cookies from 'js-cookie';

    import api from '@/api';

    export default {
        data () {
            return {
                ajaxHistoryData: [],
                // 初始化信息总条数
                dataCount: 0,
                // 每页显示多少条8
                page: {
                    pageIndex: 1,
                    pageSize: 10
                },
                userName: '',
                SpinType: false,
                historyColumns: [
                    {
                        title: '用户名',
                        key: 'userName'
                    },
                    {
                        title: '操作',
                        key: 'actionDesc'
                    },
                    {
                        title: '任务id',
                        key: ' taskId'
                    },
                    {
                        title: '任务提交状态',
                        key: 'taskCommitSuccess'
                    },
                    {
                        title: '入参',
                        key: 'inParam',
                        width: '140px',

                        render: (h, params) => {
                            return h('Tooltip', {
                                style: {
                                    width: '85px',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden'
                                },
                                props: {placement: 'bottom'}
                            }, [
                                params.row.inParam,
                                h('span', {
                                    slot: 'content',
                                    style: {whiteSpace: 'normal', wordBreak: 'break-all'}
                                }, params.row.inParam)
                            ]);
                        }
                    },

                    {
                        title: '出参',
                        key: 'outParam',
                        width: '140px',
                        render: (h, params) => {
                            return h('Tooltip', {
                                style: {
                                    width: '85px',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden'
                                },
                                props: {placement: 'bottom'}
                            }, [
                                params.row.outParam,
                                h('span', {
                                    slot: 'content',
                                    style: {whiteSpace: 'normal', wordBreak: 'break-all'}
                                }, params.row.outParam)
                            ]);
                        }
                    },
                    {
                        title: '创建人id',
                        key: 'creator'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime'
                    }
                ],
                historyData: [],
                historyOldData: [],
                resModal: false,
                resModalList: [],
                formItem: {}
            };
        },
        created () {
            this.init();
        },
        methods: {
            init () {
                this.$axios({
                    //库名
                    method: 'post',
                    url: api.queryUserBehaviorPage(),
                    data: {
                        form: {
                            userName: this.userName,
                            taskCommitSuccess: ''
                        },
                        sort: 'create_time',
                        order: 'desc',
                        pageIndex: this.page.pageIndex,
                        pageSize: 10
                    },
                    headers: {
                        Authorization: Cookies.get('token'),
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        console.log(res);
                        this.historyData = res.data.data;
                        console.log(this.historyData, 111111111111111111111111);
                        this.dataCount = res.data.page.totalRecords;

                    }
                });
            },
            changepage (index) {
                this.page.pageIndex = index;
                this.init();
            },
            submit () {
                this.init();
            }
        }
    };
</script>
<style>

    .ivu-tooltip-rel {
        width: 80px;

    }
</style>



