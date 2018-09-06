import Cookies from "js-cookie";
//标签
const _baseUrlA='http://172.18.101.118:10099/galaxy-label-admin/label';
//产品
const _baseUrlC = 'http://172.18.101.118:10099/galaxy-label-api';

export default {
    // 登录
    login() {
        return 'http://172.18.101.118:10099/user-oauth2/oauth/token';
    },
    //获取userID
    userId() {
        return 'http://172.18.101.118:10099/user-oauth2/user?'+"access_token="+Cookies.get('token');
    },
    //获取一级分类
    product_First_list() {
        return _baseUrlA+'/category/queryLabelCategorys';
    },
    //获取二级分类
    product_Second_list() {
        return _baseUrlA+'/secondaryCategory/queryLabelCategorys';
    },
    /**/
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
        return _baseUrlC+'/galaxy/api/product/detail/'+id;
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
    queryLabels() {// 标签列表
        return _baseUrlA + '/manage/queryLabels';
    },
    queryLabelDataTypes() {// 查询标签数据类型
        return _baseUrlA + '/labelDataType/queryLabelDataTypes';
    },
    saveLabel() {// 保存标签
        return _baseUrlA + '/manage/saveLabel';
    },
    removeLabelByIds() {// 删除标签
        return _baseUrlA + '/manage/removeLabelByIds';
    },
    updateLabelConfigById() {// 修改标签
        return _baseUrlA + '/manage/updateLabelConfigById';
    },
    changeLabelAvailable() {//启用停用
        return _baseUrlA + '/manage/changeLabelAvailable';
    },
    queryLabelById(id) {//获取规则
        return _baseUrlA + '/manage/queryLabelById/' + id;
    },

} 