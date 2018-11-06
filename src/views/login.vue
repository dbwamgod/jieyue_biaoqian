<style lang="less">
    @import "./login.less";
</style>

<template>

    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form id="form_id" ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                            <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                            <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import md5 from 'js-md5';
    import api from '@/api';

    export default {
        data () {
            return {
                form: {
                    userName: '',
                    password: ''
                },
                rules: {
                    userName: [{required: true, message: '账号不能为空', trigger: 'blur'}],
                    password: [{required: true, message: '密码不能为空', trigger: 'blur'}]
                },
                codeCompare: {
                    TWO_CLASS: 'typeSecond_two',
                    ONE_CLASS: 'home_list',
                    CLASS_MANAGE: 'home_list',
                    DATA_SOURCE: 'SourcePage',//源数据
                    LABEL_MANAGE: 'Tab_management_list',//标签管理
                    PRO: 'product_management_list',//产品管理
                },
                disNay: [],
            };
        },
        methods: {
            handleSubmit () {

                let _self = this;
                this.$refs.loginForm.validate(valid => {
                    if (valid) {//登陆接口
                        let fd = new FormData();
                        fd.append('password', this.form.password);
                        fd.append('username', this.form.userName);
                        fd.append('client_id', 'browser');
                        fd.append('client_secret', 'abc');
                        fd.append('grant_type', 'password');
                        this.$axios({
                            method: 'post',
                            url: api.login(),
                            data: fd,
                            headers: {
                                'content-Type': 'application/x-www-form-urlencoded',
                            },
                        }).then(res => {
                            if (res.status === 200) {
                                Cookies.set('userB', this.form.userName);
                                Cookies.set('access', 1);
                                Cookies.set('token', res.data.access_token);
                                this.$store.commit('addOpenSubmenu', '2-1');
                                this.$store.commit('setAvator', require('@/images/u=3448484253,3685836170&fm=27&gp=0.jpg'));
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
                                        url: api.Resource_permissions(),
                                        data: {
                                            tenantCode: 'LABEL_SYSTEM',
                                            userId: Cookies.get('userId')
                                        }
                                    }).then(res => {
                                        if (res.data.code == 200) {
                                            if (res.data.data.length) {
                                                Cookies.set('galaxy_info', '1');
                                                let dataLen = [];
                                                res.data.data.map((r, i) => {
                                                    dataLen.push(r);
                                                });
                                                localStorage.setItem('label-Jurisdiction', JSON.stringify(dataLen));
                                                let set = new Set(JSON.parse(localStorage.getItem('label-Jurisdiction')));
                                                let resource = [...set];
                                                resource.forEach(r => {
                                                        r.child &&r.child.forEach(res => {
                                                            res.child?this.disNay.push(...res.child):this.disNay.push(res)
                                                            if(!res.menu &&r.child){
                                                                this.disNay.push(res)
                                                            }
                                                        });
                                                });
                                                this.disNay=new Set(this.disNay)
                                                localStorage.setItem('labelChild', JSON.stringify(this.disNay));
                                                let resourceCodes = resource.map(r => r.resourceCode);
                                                if (resourceCodes.includes('CLASS_MANAGE')) {
                                                    let typeMag = resource[0].resourceCode;
                                                    if (typeMag == 'ONE_CLASS' || 'TWO_CLASS') {
                                                        Cookies.set('label-defaultHome', this.codeCompare[typeMag]);
                                                        this.$router.push({
                                                            name: this.codeCompare[typeMag]
                                                        });
                                                    }
                                                } else {
                                                    for (var code in  resourceCodes) {
                                                        Cookies.set('label-defaultHome', this.codeCompare[resourceCodes[code]]);
                                                        this.$router.push({
                                                            name: this.codeCompare[resourceCodes[code]]
                                                        });
                                                        return;
                                                    }
                                                }
                                            } else {
                                                const title = '登录错误';
                                               let keys= Object.keys(Cookies());
                                                keys.map(r=>{
                                                    Cookies.remove(r);
                                                })
                                                this.$Modal.error({
                                                    title: title,
                                                    content: '您未开通系统权限, 请联系管理员',
                                                });
                                            }
                                        } else {
                                            const title = '资源错误';
                                            let keys= Object.keys(Cookies());
                                            keys.map(r=>{
                                                Cookies.remove(r);
                                            })
                                            this.$Modal.error({
                                                title: title,
                                                content: res.data.msg,
                                            });
                                        }

                                    });

                                });

                            } else {

                                this.$Message.error('登录失败！帐号或密码错误');
                            }
                        }, (err) => {
                            this.$Message.error('登录失败！帐号不存在');
                        });
                    } else {
                        this.$Message.info('请输入用户和密码');
                    }
                });
            }
        }
    };
</script>

<style>
</style>
