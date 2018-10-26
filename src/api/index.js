import Cookies from "js-cookie";
//标签
// const _baseUrlA='http://api.bdc.jieyue.com/api/galaxy-label-admin/label';
const _baseUrlA='http://172.18.101.118:10000/galaxy-label-admin/label';
//产品
const _baseUrlC = 'http://172.18.101.118:10000/galaxy-label-api';
// const _baseUrlC = 'http://api.bdc.jieyue.com/api/galaxy-label-api';

export default {
    login() {
        // return 'http://api.bdc.jieyue.com/api/platform-user-oauth2/oauth/token';
        return 'http://172.18.101.118:10000/platform-user-oauth2/oauth/token';
    },
    //获取userID
    userId() {
        // return 'http://api.bdc.jieyue.com/api/platform-user-oauth2/user?'+"access_token="+Cookies.get('token');
        return 'http://172.18.101.118:10000/platform-user-oauth2/user?'+"access_token="+Cookies.get('token');
    },
    //获取一级分类
    product_First_list() {
        return _baseUrlA+'/category/queryUsefulLabelCategorys';
    },
    //获取二级分类
    product_Second_list(id) {
        return _baseUrlA+'/secondaryCategory/queryUsefulLabelCategorys/'+id;
    },
    product_queryLabels(id){
        return _baseUrlA + '/manage/queryUsefulLabels/'+id;
    },
    /**/
    //导出
    product_out(json) {
        return _baseUrlC+'/galaxy/api/productOutput/excel/'+ json;
    },
    //获取产品列表
    product_list() {
        return _baseUrlC+'/galaxy/api/product/list';
    },

    //编辑产品
    product_to_update() {
        return _baseUrlC+'/galaxy/api/product/to_update';
    },
    //删除产品
    product_delete(id) {
        return _baseUrlC+'/galaxy/api/product/delete/'+id;
    },
    //添加产品
    product_add() {
        return _baseUrlC+'/galaxy/api/product/add';
    },
    //产品详情
    product_getDetail(id) {
        return _baseUrlC+'/galaxy/api/product/detail/'+id
    },
    /*产品类别管理*/
    //获取类别列表
    product_getDetail_list() {
        return _baseUrlC+'/galaxy/api/productCategory/list'
    },
    //获取类别名称列表
    product_getDetail_name_list() {
        return _baseUrlC+'/galaxy/api/productCategory/name_list'
    },

    /*产品输出管理*/
    //获取产品输出列表
    product_productOutput_list() {
        return _baseUrlC+'/galaxy/api/productOutput/list'
    },
    //编辑获取产品输出列表
    product_productOutput_find(id) {
        return _baseUrlC+'/galaxy/api/product/find/'+id
    },
    /*标签管理*/
    queryLabelCategorys() {// 一级分类标签列表
        return _baseUrlA + '/category/queryLabelCategorys';
    },
    saveLabelCategory() {// 一级分类新建
        return _baseUrlA + '/category/saveLabelCategory';
    },
    updateLabelCategory() {// 一级分类修改
        return _baseUrlA + '/category/updateLabelCategory';
    },
    removeLabelCategoryByIds() {// 一级分类删除
        return _baseUrlA + '/category/removeLabelCategoryByIds';
    },
    queryLabelCategorysT() {// 二级分类列表
        return _baseUrlA + '/secondaryCategory/queryLabelCategorys';
    },
    removeLabelCategoryByIdsT() {// 二级分类删除
        return _baseUrlA + '/secondaryCategory/removeLabelCategoryByIds';
    },
    saveLabelCategoryT() {// 二级分类新建
        return _baseUrlA + '/secondaryCategory/saveLabelCategory';
    },
    updateLabelCategoryT() {// 二级分类修改
        return _baseUrlA + '/secondaryCategory/updateLabelCategory';
    },
    //博哥
    // queryLabels() {// 标签列表
    //     return _baseUrlA + '/manage/queryLabels';
    // },

    //冯更更
    queryLabels(id) {// 标签列表
        return _baseUrlA + '/manage/queryUsefulLabels/'+id;
    },
    queryGroupsLabels() {// 标签列表
        return _baseUrlA + '/manage/queryLabelGroupPage'
    },
    queryLabelDataTypes() {// 查询标签数据类型
        return _baseUrlA + '/labelDataType/queryLabelDataTypes';
    },
    saveLabel() {// 保存标签
        return _baseUrlA + '/manage/saveLabelGroup';
    },
    removeLabelByIds(i) {// 删除标签
        return _baseUrlA + '/manage/removeLabelGroupById/'+i;
    },
    updateLabelConfigById() {// 修改标签
        return _baseUrlA + '/manage/updateLabelGroupById';
    },
    changeLabelAvailable() {//启用停用
        return _baseUrlA + '/manage/changeLabelGroupAvailable';
    },
    queryLabelById(id) {//获取规则
        return _baseUrlA + '/manage/queryLabelById/' + id;
    },
/*数据源*/
    //数据源配置
    //数据源
    queryAllDataSources() {//标签管理的数据源接口
        return _baseUrlA + '/dataSource/queryAllDataSources';
    },
    //数据源
    queryDataSourcePage() {//数据源列表(list)
        return _baseUrlA + '/dataSource/queryDataSourcePage';
    },
    //数据源
    removeDataSource(id) {//删除
        return _baseUrlA + '/dataSource/removeDataSource/' + id;
    },
    //数据源
    saveDataSource() {//保存||新增
        return _baseUrlA + '/dataSource/saveDataSource';
    },
    //数据源
    updateDataSource() {//修改
        return _baseUrlA + '/dataSource/updateDataSource';
    },
    checkDataSource () {//连接测试
        return _baseUrlA + '/dataSource/checkDataSource';
    },





}




