import Cookies from 'js-cookie';

const user = {

    mutations: {
        logout (state, vm) {
            Cookies.remove('user');
            Cookies.remove('password');
            Cookies.remove('token');
            Cookies.remove('userId');
            Cookies.remove('access');
            Cookies.remove('pages');
            Cookies.remove('del');
            Cookies.remove('flag');
            Cookies.remove('categoryId');

            // 恢复默认样式
            let themeLink = document.querySelector('link[name="theme"]');
            themeLink.setAttribute('href', '');
            // 清空打开的页面等数据，但是保存主题数据
            let theme = '';
            if (localStorage.theme) {
                theme = localStorage.theme;
            }
            localStorage.clear();
            if (theme) {
                localStorage.theme = theme;
            }
        },
        setUser (state, {user_name, user_token}) {
            // 在这里把用户名和token保存起来
            localStorage.setItem("currentUser_name", user_name);
            localStorage.setItem("currentUser_token", user_token);
        },

    }
};

export default user;
