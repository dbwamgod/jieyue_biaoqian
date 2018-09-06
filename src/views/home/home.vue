<template>
    <div style='position: relative;height:100%;padding:10px;'>
        <Row type="flex" justify="space-between" align="middle" class="code-row-bg" style='margin-bottom:10px;'>
            <Col span="6">
            <h2 style="margin: 6px 0 0 20px">一级分类列表</h2>
            </Col>
            <Col span="3" style='text-align:right;margin-right:5px;'>
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
                <FormItem prop="content" label="一级分类：" label-position="right" :label-width="100">
                <Input v-model="categoryDetails.content" placeholder="请输入分类名称" style="width: 300px" />
                </FormItem>
     
        </Form>
        <div style='text-align: right;'>
            <Button @click='cancel' style=" margin-right:10px;">取消</Button>
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

export default {
  data() {
    return {
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
      },
      columns7: [
        {
          title: "序号",
          key: "id"
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
              h(
                "Button",
                {
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
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                     this.modal2=true;
                     this.paramsRowId=params.row.id;
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      categoryList: [],
      categoryDetailsList: [],
      categoryDetails: {
        id: "",
        content: ""
      },
      isEdit: '新建分类'
    };
  },
  created() {
    this.init();
  },
  methods: {
    newCreate() {
      this.modal1 = true;
      this.isEdit = '新建分类';
    },
    init() {
      this.$axios({
        method: "post",
        url: api.queryLabelCategorys(),
        data: {
          form: {
            categoryName: ""
          },
          order: "1",
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize,
          sort: "id"
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.categoryList = res.data.data;
          this.dataCount = res.data.page.totalRecords;
          if(res.data.data.length==0 || res.data.data==[]){
              this.page.pageIndex= this.page.pageIndex!=0?this.page.pageIndex-1:this.page.pageIndex;
              this.init(); 
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
      this.isEdit = '编辑分类';
      this.categoryDetails = Object.assign({}, {id:data.id,content: data.categoryName})
    },
    remove(index, id) {
      this.$axios({
        method: "post",
        url: api.removeLabelCategoryByIds(),
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
            if(this.isEdit==='新建分类'){
               
                this.$axios({
                  method: "post",
                  url: api.saveLabelCategory(),
                  data: {
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
            }else {
                 this.$axios({
                  method: "post",
                  url: api.updateLabelCategory(),
                  data: {
                    id:this.categoryDetails.id,
                    categoryName: this.categoryDetails.content.replace(/(^\s+)|(\s+$)|\s+/g,''),
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
<style>
</style>





