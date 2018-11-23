import Cookies from 'js-cookie';
//标签dev1.0.0
// const _baseUrl = 'http://stg.bdc.jieyue.com/api';    //准生产环境
// const _baseUrl = 'http://api.bdc.jieyue.com/api';    //生产环境
const _baseUrl = 'http://172.18.101.118:10000';    //开发环境
// const _baseUrl = 'http://10.50.170.110:10000';    //开发环境
const _baseUrlA = _baseUrl + '/galaxy-label-admin/label';
//产品
const _baseUrlC = _baseUrl + '/galaxy-label-api';

//token
function cookies_con () {
    let cookies_cons;
    cookies_cons = 'access_token=' + Cookies.get('token');
    return cookies_cons;
}

export default {
    //获取资源权限
    /**
     * @return {string}
     */
    Resource_permissions: function () {
        return `${_baseUrl}/platform-user-admin/user/find/auth/?${cookies_con()}`;
    },
    login () {
        // return 'http://api.bdc.jieyue.com/api/platform-user-oauth2/oauth/token';
        return _baseUrl+'/platform-user-oauth2/oauth/token';
    },
    //获取userID
    userId () {
        // return 'http://api.bdc.jieyue.com/api/platform-user-oauth2/user?'+"access_token="+Cookies.get('token');
        return _baseUrl+ '/platform-user-oauth2/user?' + cookies_con();
    },
    //获取一级分类
    product_First_list () {
        return _baseUrlA + '/category/queryUsefulLabelCategorys' + '?' + cookies_con();
    },
    //获取二级分类
    product_Second_list (id) {
        return _baseUrlA + '/secondaryCategory/queryUsefulLabelCategorys/' + id + '?' + cookies_con();
    },
    product_queryLabels (id) {
        return _baseUrlA + '/manage/queryUsefulLabels/' + id + '?' + cookies_con();
    },
    //导出
    product_out (queryParam, codeIdsStr) {
        return _baseUrlC + `/galaxy/api/productOutput/excel/${queryParam + '/' + codeIdsStr}` + '?' + cookies_con();
    },
    //获取产品列表
    product_list () {
        return _baseUrlC + '/galaxy/api/product/list' + '?' + cookies_con();
    },
    //编辑产品
    product_to_update () {
        return _baseUrlC + '/galaxy/api/product/to_update' + '?' + cookies_con();
    },
    //删除产品
    product_delete (id) {
        return _baseUrlC + '/galaxy/api/product/delete/' + id + '?' + cookies_con();
    },
    //添加产品
    product_add () {
        return _baseUrlC + '/galaxy/api/product/add' + '?' + cookies_con();
    },
    //产品详情
    product_getDetail (id) {
        return _baseUrlC + '/galaxy/api/product/detail/' + id + '?' + cookies_con();
    },
    /*产品类别管理*/
    //获取类别列表
    product_getDetail_list () {
        return _baseUrlC + '/galaxy/api/productCategory/list' + '?' + cookies_con();
    },
    //获取类别名称列表
    product_getDetail_name_list () {
        return _baseUrlC + '/galaxy/api/productCategory/name_list' + '?' + cookies_con();
    },

    /*产品输出管理*/
    //获取产品输出列表
    product_productOutput_list () {
        return _baseUrlC + '/galaxy/api/productOutput/list' + '?' + cookies_con();
    },
    //编辑获取产品输出列表
    product_productOutput_find (id) {
        return _baseUrlC + '/galaxy/api/product/find/' + id + '?' + cookies_con();
    },
    /*标签管理*/
    queryLabelCategorys () {// 一级分类标签列表
        return _baseUrlA + '/category/queryLabelCategorys' + '?' + cookies_con();
    },
    saveLabelCategory () {// 一级分类新建
        return _baseUrlA + '/category/saveLabelCategory' + '?' + cookies_con();
    },
    updateLabelCategory () {// 一级分类修改
        return _baseUrlA + '/category/updateLabelCategory' + '?' + cookies_con();
    },
    removeLabelCategoryByIds () {// 一级分类删除
        return _baseUrlA + '/category/removeLabelCategoryByIds' + '?' + cookies_con();
    },
    queryLabelCategorysT () {// 二级分类列表
        return _baseUrlA + '/secondaryCategory/queryLabelCategorys' + '?' + cookies_con();
    },
    removeLabelCategoryByIdsT () {// 二级分类删除
        return _baseUrlA + '/secondaryCategory/removeLabelCategoryByIds' + '?' + cookies_con();
    },
    saveLabelCategoryT () {// 二级分类新建
        return _baseUrlA + '/secondaryCategory/saveLabelCategory' + '?' + cookies_con();
    },
    updateLabelCategoryT () {// 二级分类修改
        return _baseUrlA + '/secondaryCategory/updateLabelCategory' + '?' + cookies_con();
    },
    //冯更更
    queryLabels (id) {// 标签列表
        return _baseUrlA + '/manage/queryUsefulLabels/' + id + '?' + cookies_con();
    },
    queryGroupsLabels () {// 标签列表
        return _baseUrlA + '/manage/queryLabelGroupPage' + '?' + cookies_con();
    },
    queryLabelDataTypes () {// 查询标签数据类型
        return _baseUrlA + '/labelDataType/queryLabelDataTypes' + '?' + cookies_con();
    },
    saveLabel () {// 保存标签
        return _baseUrlA + '/manage/saveLabelGroup' + '?' + cookies_con();
    },
    removeLabelByIds (i) {// 删除标签
        return _baseUrlA + '/manage/removeLabelGroupById/' + i + '?' + cookies_con();
    },
    updateLabelConfigById () {// 修改标签
        return _baseUrlA + '/manage/updateLabelGroupById' + '?' + cookies_con();
    },
    changeLabelAvailable () {//启用停用
        return _baseUrlA + '/manage/changeLabelGroupAvailable' + '?' + cookies_con();
    },
    queryLabelById (id) {//获取规则
        return _baseUrlA + '/manage/queryLabelById/' + id + '?' + cookies_con();
    },
    /*数据源*/
    //数据源配置
    //数据源
    queryAllDataSources () {//标签管理的数据源接口
        return _baseUrlA + '/dataSource/queryAllDataSources' + '?' + cookies_con();
    },
    //数据源
    queryDataSourcePage () {//数据源列表(list)
        return _baseUrlA + '/dataSource/queryDataSourcePage' + '?' + cookies_con();
    },
    //数据源
    removeDataSource (id) {//删除
        return _baseUrlA + '/dataSource/removeDataSource/' + id + '?' + cookies_con();
    },
    //数据源
    saveDataSource () {//保存||新增
        return _baseUrlA + '/dataSource/saveDataSource' + '?' + cookies_con();
    },
    //数据源
    updateDataSource () {//修改
        return _baseUrlA + '/dataSource/updateDataSource' + '?' + cookies_con();
    },
    checkDataSource () {//连接测试
        return _baseUrlA + '/dataSource/checkDataSource' + '?' + cookies_con();
    },

};




