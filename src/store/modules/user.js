import Cookies from 'js-cookie';

const user = {

    mutations: {
        logout (state, vm) {

            let keys= Object.keys(Cookies());
            keys.map(r=>{
                Cookies.remove(r);
            });


            // Cookies.remove('userB');
            // Cookies.remove('password');
            // Cookies.remove('token');
            // Cookies.remove('userId');
            // Cookies.remove('access');
            // Cookies.remove('pages');
            // Cookies.remove('del');
            // Cookies.remove('flag');
            // Cookies.remove('categoryId');
            sessionStorage.removeItem("pages")
            // 恢复默认样式
            let themeLink = document.querySelector('link[name="theme"]');
            themeLink.setAttribute('href', '');
            // 清空打开的页面等数据，但是保存主题数据
            let theme = '', Jurisdiction = '', child = '';
            if (localStorage.Jurisdiction) {
                Jurisdiction = localStorage.Jurisdiction;
            }
            if (localStorage.child) {
                child = localStorage.child;
            }
            if (localStorage.theme) {
                theme = localStorage.theme;
            }
            localStorage.clear();
            if (theme) {
                localStorage.theme = theme;
            }
            if (Jurisdiction) {
                localStorage.Jurisdiction = Jurisdiction;
            }
            if (child) {
                localStorage.child = child;
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
