<template>
    <div class="all_box">
        <Row type="flex" justify="space-between" align="middle" class="code-row-bg">
            <Col span="6">
            <h2 class="header-title">二级分类列表</h2>
            </Col>
            <Col span="3" class="search-add">
            <Button type="primary" @click="newCreate">新建</Button>
            </Col>
        </Row>
     <Table border :columns="columns7" :data="categoryList"></Table>
        <Page :total="dataCount" show-total :page-size="page.pageSize" :current="page.pageIndex" class="paging"
              @on-change="changepage"/>
        <Modal
        v-model="modal1"
        :title=" isEdit"
        :closable="false"
        :footer-hide='true'
        @on-cancel="cancel">
          <Form ref="formInline" :model="categoryDetails" :rules="ruleInline" inline>
              <FormItem prop="parentId" label="一级分类：" label-position="right" :label-width="100">
                    <!-- <Input v-model="categoryDetails.parentName" placeholder="请选择一级分类名称" style="width: 300px" /> -->
                        <Select v-model="categoryDetails.parentId" style="width:300px" ><!--:disabled="this.isEdit !== '新建分类'" -->
                            <Option v-for="item in categoryListSelect" :value="item.id" :key="item.id">{{ item.categoryName}}</Option>
                        </Select>
                </FormItem>

                <FormItem prop="content" label="二级分类：" label-position="right" :label-width="100">
                    <Input v-model="categoryDetails.content" placeholder="请输入二分类名称" style="width: 300px" />
                </FormItem>

        </Form>
        <div style='text-align: right;' class="button-active" >
            <Button @click='cancel' style=" margin-right:10px;" class="cancel" >取消</Button>
            <Button type="primary" @click='ok'>确定</Button>
        </div>

    </Modal>
     <Modal
        v-model="modal2"
        title="删除分类"
        @on-ok="okDelete"
        :closable="false"
        @on-cancel="cancel2">
        <p>确定要删除此分类么？</p>
    </Modal>
    </div>
</template>
<style scoped>

.paging {
  float: right;
  margin-top: 10px;
}
</style>
<script>
import api from "@/api";
import Cookies from "js-cookie";
import util from '@/libs/util.js';

export default {
  data() {
    return {
        flag:0,
        adds: false,//新增权限
        operation: {
            edit: false,
            del: false,
            edit_del: false,
        },//权限校验的数据
      dataCount: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      modal1: false,
      modal2:false,
      paramsRowId:'',
      ruleInline: {
        content: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ],
        parentId: [
          {  type:'number', required: true, message: "请选择分类名称", trigger: "change" }
        ]
      },
      columns7: [
        {
          title: "序号",
          key: "id"
        },
        {
          title: "一级分类名称",
          key: "parentName"
        },
        {
          title: "分类名称",
          key: "categoryName"
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
                this.operation.edit || this.operation.edit_del ?h("Button", {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.show(params.index, params.row);
                    }
                  }
                }, "编辑"):"",
               this.operation.del || this.operation.edit_del ?  h("Button", {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      // this.remove(params.index, params.row.id);
                      this.modal2=true;
                     this.paramsRowId=params.row.id;
                    }
                  }
                }, "删除"):""
            ]);
          }
        }
      ],
      categoryList: [],
      categoryDetailsList: [],
      categoryListSelect:[],
      categoryDetails: {
        id: "",
        content: "",
        parentId:'',
      },
      isEdit: "新建分类"
    };
  },
  created() {

      //权限
      util.labelJurisdiction(this.columns7,this, 'TWO_CLASS-ADD', 'TWO_CLASS-UPDATE', 'TWO_CLASS-DEL');

    this.init();
    this.oneCategoruList();
  },
  methods: {
    newCreate() {
      this.modal1 = true;
      this.isEdit = "新建分类";
    },
    oneCategoruList() {
        this.$axios({
        method: "post",
        url: api.queryLabelCategorys(),
        data: {
          form: {
            categoryName: ""
          },
          pageIndex: 0,
          pageSize:0,
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.categoryListSelect = res.data.data;
        } else {
          this.$Message.info({
            content: res.data.msg+' 请刷新',
            duration: 3
          });
        }
      });
    },
    init() {
      this.$axios({
        method: "post",
        url: api.queryLabelCategorysT(),
        data: {
          form: {
            categoryName: ""
          },
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.categoryList = res.data.data;
          this.dataCount = res.data.page.totalRecords;
          if(res.data.data.length==0 || res.data.data==[]){
              if(res.data.page.totalRecords!=0){
                  this.page.pageIndex= this.page.pageIndex!=0?this.page.pageIndex-1:this.page.pageIndex;
                  this.init();
              }

            }
        } else {
          this.$Message.info({
            content: res.data.msg,
            duration: 3
          });
        }
      });
    },

    show(index, data) {
      this.modal1 = true;
      this.isEdit = "编辑分类";
      this.categoryDetails = Object.assign(
        {},
        { id: data.id, content: data.categoryName , parentId: data.parentId}
      );
    },
    remove(index, id) {
      this.$axios({
        method: "post",
        url: api.removeLabelCategoryByIdsT(),
        data: {
          datas: [id]
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.init();
          this.$Message.success({
            content: "删除成功",
            duration: 3
          });
        } else {
          this.$Message.error({
            content: res.data.msg,
            duration: 3
          });
        }
      });
    },
    changepage(index) {
      this.page.pageIndex = index;
      this.init();
    },
    ok() {
      this.$refs.formInline.validate(valid => {
        if (valid) {
          if (this.isEdit === "新建分类") {
            this.$axios({
              method: "post",
              url: api.saveLabelCategoryT(),
              data: {
                parentId:this.categoryDetails.parentId,
                categoryName: this.categoryDetails.content.replace(/(^\s+)|(\s+$)|\s+/g,'')
              }
            }).then(res => {
              if (res.data.code == 200) {
                this.init();
                this.modal1 = false;
                this.$Message.success({
                  content: "新建成功",
                  duration: 3
                });
                this.$refs.formInline.resetFields();
              } else {
                this.$Message.error({
                  content: res.data.msg,
                  duration: 3
                });
              }
            });
          } else {
            this.$axios({
              method: "post",
              url: api.updateLabelCategoryT(),
              data: {
                id: this.categoryDetails.id,
                categoryName: this.categoryDetails.content.replace(/(^\s+)|(\s+$)|\s+/g,'')
              }
            }).then(res => {
              if (res.data.code == 200) {
                this.init();
                this.modal1 = false;
                this.$Message.success({
                  content: "修改成功",
                  duration: 3
                });
                this.$refs.formInline.resetFields();
              } else {
                this.$Message.error({
                  content: res.data.msg,
                  duration: 3
                });
              }
            });
          }
        }
      });
    },
    cancel() {
      this.modal1 = false;
      this.$refs.formInline.resetFields();
      this.categoryDetails.parentId = '',
       this.categoryDetails.content = ''
    },
    okDelete() {
       this.remove('', this.paramsRowId);
    },
    cancel2() {
      this.modal2 = false;
    }
  }
};
</script>
