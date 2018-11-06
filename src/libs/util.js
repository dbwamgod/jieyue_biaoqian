import axios from 'axios';
import env from '../../build/env';
import semver from 'semver';
import packjson from '../../package.json';

let util = {};
util.title = function (title, vm) {
    let iTitle = '';
    if (title) {
        iTitle += '' + (title.i18n ? vm.$t(title.i18n) : title);
    }
    window.document.title = iTitle;
};

const ajaxUrl = env === 'development'
    ? 'http://127.0.0.1:8888'
    : env === 'production'
        ? 'https://www.url.com'
        : 'https://debug.url.com';

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});

util.inOf = function (arr, targetArr) {
    let res = true;
    arr.forEach(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.showThisRoute = function (itAccess, currentAccess) {
    if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
        return util.oneOf(currentAccess, itAccess);
    } else {
        return itAccess === currentAccess;
    }
};

util.getRouterObjByName = function (routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }

    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = util.getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

util.handleTitle = function (vm, item) {
    if (typeof item.title === 'object') {
        return vm.$t(item.title.i18n);
    } else {
        return item.title;
    }
};

util.setCurrentPath = function (vm, name) {
    let title = '';
    let isOtherRouter = false;
    vm.$store.state.app.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = util.handleTitle(vm, item);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = util.handleTitle(vm, child);
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    let currentPathArr = [];
    if (name === 'home_list') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_list')),
                path: '',
                name: 'home_list'
            }
        ];
    } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_list') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_list')),
                path: '/home',
                name: 'home_list'
            },
            {
                title: title,
                path: '',
                name: name
            }
        ];
    } else {
        let currentPathObj = vm.$store.state.app.routers.filter(item => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
            currentPathArr = [
                {
                    title: '标签平台',
                    path: '',
                    name: 'home_list'
                }
            ];
        } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
            currentPathArr = [
                // {
                //     title: '标签平台',
                //     path: '/home',
                //     name: 'home_index'
                // },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: name
                }
            ];
        } else {
            let childObj = currentPathObj.children.filter((child) => {
                return child.name === name;
            })[0];
            currentPathArr = [
                // {
                //     title: '标签平台',
                //     path: '/home',
                //     name: 'home_index'
                // },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: currentPathObj.name
                },
                {
                    title: childObj.title,
                    path: currentPathObj.path + '/' + childObj.path,
                    name: name
                }
            ];
        }
    }
    vm.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
    let pageOpenedList = vm.$store.state.app.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) { // 页面已经打开
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        let tag = vm.$store.state.app.tagsList.filter((item) => {
            if (item.children) {
                return name === item.children[0].name;
            } else {
                return name === item.name;
            }
        });
        tag = tag[0];
        if (tag) {
            tag = tag.children ? tag.children[0] : tag;
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            vm.$store.commit('increateTag', tag);
        }
    }
    vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

util.fullscreenEvent = function (vm) {
    vm.$store.commit('initCachepage');
    // 权限菜单过滤相关
    vm.$store.commit('updateMenulist');
    // 全屏相关
};

util.checkUpdate = function (vm) {
    // axios.get('https://api.github.com/repos/iview/iview-admin/releases/latest').then(res => {
    //     let version = res.data.tag_name;
    //     vm.$Notice.config({
    //         duration: 0
    //     });
    //     if (semver.lt(packjson.version, version)) {
    //         vm.$Notice.info({
    //             title: 'iview-admin更新啦',
    //             desc: '<p>iView-admin更新到了' + version + '了，去看看有哪些变化吧</p><a style="font-size:13px;" href="https://github.com/iview/iview-admin/releases" target="_blank">前往github查看</a>'
    //         });
    //     }
    // });
};

util.getStringTime = function (date) {
    const newDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    return newDate;
};

util.Http = function (options) {

    let Domain;

    class Http {

        constructor () {
            Domain = 'http://172.18.101.118:10000/galaxy-label-admin/label';
        }

        require (options) {
            if (!options.api) throw new Error('api 不能为空');
            if (!options.param) {
                options.param = {};
            }
            if (!options.methods) {
                options.methods = 'POST';
            }
            //不传递方法默认为POST
            return new Promise((resolve, reject) => {
                return axios({
                    method: options.methods,
                    url: options.api,
                    baseURL: Domain,
                    data: options.param
                }).then(response => {
                    if (response.data.code === 200) { //请求成功
                        return resolve(response.data);
                    } else {
                        console.log(response.data.msg);
                        return reject(response.data);
                    }
                }, error => {
                    Indicator.close();
                    console.log(error);
                    return reject();
                });
            });
        }
    }

    return Http;
};

/*
* 权限校验
* 参数:a,b,c,d,e;为权限名字
* vm:this
* */
util.labelJurisdiction = function (vm, b, c, d, a, e, f, g) {
    if (JSON.parse(localStorage.getItem('labelChild'))) {
        JSON.parse(localStorage.getItem('labelChild')).forEach(r => {
            if (r.resourceCode == a) {
                vm.lineTest = true;
            } else if (r.resourceCode == b) {
                vm.adds = true;
            } else if (r.resourceCode == c) {
                vm.operation.edit = true;
                vm.flag = 1;
            } else if (r.resourceCode == d) {
                vm.del = true;
                if (vm.flag === 1) {
                    vm.operation.edit_del = true;
                    vm.flag = 2;
                } else {
                    vm.del = true;
                    vm.flag = 3;
                }
            } else if (r.resourceCode == e) {
                if (vm.flag === 2) {
                    vm.operation.edit_del_binding = true;
                } else if (vm.flag === 0) {
                    vm.operation.binding = true;
                } else if (vm.flag === 3) {
                    vm.operation.del_binding = true;
                } else if (vm.flag === 1) {
                    vm.operation.edit_binding = true;
                }
            }
            if (r.resourceCode == f) {
                vm.operation.findLabel = true;
            }
            if (r.resourceCode == g) {
                vm.operation.findLabelPage = true;
            }
            // console.log(vm.operation, 489498494);
        });
    } else {
        if (Cookies.get('access')) {
            vm.$Message.error('无法检测到你的权限');
            vm.$store.commit('logout', vm);
            vm.$store.commit('clearOpenedSubmenu');
            vm.$router.push({
                name: 'login'
            });
        }

    }
};

export default util;
