<template>
    <div style='position: relative;height:100%;padding:10px;'>
        <Row type="flex" justify="space-between" align="middle" class="code-row-bg" style='margin-bottom:10px;'>
            <Col span="6">
            <h2 style="margin: 6px 0 0 20px">分类列表</h2>
            </Col>
            <Col span="6" style='text-align:right;margin-right:5px;'>
            <Button type="primary" @click="newCreate" style=" ">新建</Button>
                <Input v-model="labelname" icon="ios-search" search placeholder="请搜索..." style=" width:160px;" @on-change='searchChange'/>
            </Col>
        </Row>
        <Table border :columns="columns7" :data="data6"></Table>
        <Page :total="dataCount" show-total :page-size="page.pageSize" :current="page.pageIndex" class="paging"
              @on-change="changepage"/>


        <Modal
        v-model="modal1"
        :title=" isEdit"
        :closable="false"
        :footer-hide='true'
        @on-cancel="cancel">
          <Form ref="formInline" :model="categoryDetails" :rules="ruleInline" inline>
            <FormItem prop="code" label="代码：" label-position="right" :label-width="100">
                    <Input v-model="categoryDetails.code" placeholder="请输入代码" style="width: 300px" />
            </FormItem>
            <FormItem prop="name" label="名称：" label-position="right" :label-width="100">
                    <Input v-model="categoryDetails.name" placeholder="请输入名称" style="width: 300px" />
            </FormItem>
            <FormItem prop="labelType" label="类型：" label-position="right" :label-width="100">
                        <Select v-model="categoryDetails.labelType" style="width:300px" >
                            <Option v-for="item in queryLabelDataTypesList" :value="item.id" :key="item.id">{{ item.typeName}}</Option>
                        </Select>
            </FormItem>
            <FormItem prop="precision" label="精度：" label-position="right" :label-width="100" v-show='categoryDetails.labelType==3'>
                    <Input v-model="categoryDetails.precision" placeholder="请输入名称" style="width: 300px" />
            </FormItem>
            <FormItem prop="classification" label="分类：" label-position="right" :label-width="100">
                        <Select v-model="categoryDetails.classification" style="width:300px" >
                            <Option v-for="item in categoryList" :value="item.id" :key="item.id">{{ item.categoryName}}</Option>
                        </Select>
            </FormItem>
            <FormItem prop="processing" label="重复加工：" label-position="right" :label-width="100">
                    <RadioGroup v-model="categoryDetails.processing" style="width:300px">
                        <Radio label="0">是</Radio>
                        <Radio label="1">否</Radio>
                    </RadioGroup>
            </FormItem>
            <FormItem prop="processingType" label="加工类型：" label-position="right" :label-width="100">
                    <RadioGroup v-model="categoryDetails.processingType" style="width:300px">
                        <Radio label="0">是</Radio>
                        <Radio label="1">否</Radio>
                    </RadioGroup>
            </FormItem>
              <FormItem prop="processingRules" label="加工规则：" label-position="right" :label-width="100">
                <Input v-model="categoryDetails.processingRules" type="textarea" class='tab_man_textarea'  :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入规则..." style=" width:300px;"></Input>
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
      modal2: false,
      labelname: "",
      queryLabelDataTypesList: [],
      categoryList: [],
      columns7: [
        {
          title: "序号",
          key: "id"
        },
        {
          title: "标签代码",
          key: "labelCode"
        },
        {
          title: "名称",
          key: "labelName"
        },
        {
          title: "字段类型",
          key: "dataType",
          render: (h, params) => {
            return h("span", this.filterWordType(params.row.dataType));
          }
        },
        {
          title: "精度",
          key: "accuracy"
        },
        {
          title: "分类",
          key: "categoryId",
          render: (h, params) => {
            return h("span", this.filterClassification(params.row.categoryId));
          }
        },
        {
          title: "操作",
          key: "action",
          width: 200,
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
                      this.show(params.row);
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
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      // this.remove(params.row.id, params.index);
                      this.modal2 = true;
                      this.paramsRowId = params.row.id;
                    }
                  }
                },
                "删除"
              ),
              h(
                "Button",
                {
                  props: {
                    //available 可用
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.available(params.row.id, params.row.available);
                    }
                  }
                },
                params.row.available == 0 ? "启用" : "停用"
              )
            ]);
          }
        }
      ],
      data6: [],
      isEdit: "新建",
      ruleInline: {
        code: [{ required: true, message: "请输入分类代码", trigger: "blur" }],
        labelType: [
          {
            type: "number",
            required: true,
            message: "请选择类型",
            trigger: "change"
          }
        ],
        classification: [
          {
            type: "number",
            required: true,
            message: "请选择分类",
            trigger: "change"
          }
        ],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        processingRules: [
          { required: true, message: "请输入规则", trigger: "blur" },
        ],
        precision: [
          { pattern: /[0-9]/, message: "请输入数字", trigger: "blur" },
        ]
      },
      categoryDetails: {
        code: "",
        name: "",
        labelType: "",
        classification: "",
        processing: 0,
        processingType: 0,
        precision: "",
        processingRules: "",
        id: "",
        available: ""
      }
    };
  },
  created() {
    this.$axios
      .all([this.getCategoryListSecondary(), this.queryLabelDataTypes()])
      .then(this.$axios.spread((acct, perms) => this.init()));
  },
  methods: {
    init() {
      this.$axios({
        method: "post",
        url: api.queryLabels(),
        data: {
          form: {
            labelName: this.labelname
          },
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize
        }
      }).then(
        r => {
          if (r.data.code == 200) {
            this.data6 = r.data.data;
            this.dataCount = r.data.page.totalRecords;
            if (r.data.data.length == 0 || r.data.data == []) {
              this.page.pageIndex =
                this.page.pageIndex != 0
                  ? this.page.pageIndex - 1
                  : this.page.pageIndex;
              this.init();
            }
          } else {
            this.$Message.warning("网络请求错误！请刷新");
          }
        },
        err => {
          this.$Message.warning("服务器错误");
        }
      );
    },
    searchChange() {
      this.init();
    },
    getCategoryListSecondary() {
      return this.$axios({
        method: "post",
        url: api.queryLabelCategorysT(),
        data: {
          form: {
            categoryName: ""
          },
          pageIndex: 0,
          pageSize: 0
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.categoryList = res.data.data;
        } else {
          this.$Message.info({
            content: res.data.msg,
            duration: 3
          });
        }
      });
    },
    filterClassification(id) {
      let aa = this.categoryList.filter(r => r.id === id)[0];
      return aa ? aa.categoryName : "无类型";
    },
    filterWordType(id) {
      let aa = this.queryLabelDataTypesList.filter(r => r.id === id)[0];
      return aa ? aa.typeName : "无类型";
    },
    queryLabelDataTypes() {
      return this.$axios({
        method: "get",
        url: api.queryLabelDataTypes()
      }).then(res => {
        if (res.data.code == 200) {
          this.queryLabelDataTypesList = res.data.data;
        } else {
          this.$Message.info({
            content: res.data.msg,
            duration: 3
          });
        }
      });
    },

    newCreate() {
      this.isEdit = "新建";
      this.modal1 = true;
    },

    show(data) {
          let info = data;
      this.isEdit = "编辑";
      this.modal1 = true;
      this.$axios({
        method: "get",
        url: api.queryLabelById(info.id)
      }).then(res => {
        if (res.data.code == 200) {
          console.log("编辑", res.data.data);
          this.categoryDetails.processingRules = res.data.data.rule;
          console.log(this.categoryDetails.processingRules)
          this.categoryDetails.code = info.labelCode;
          this.categoryDetails.name = info.labelName;
          this.categoryDetails.labelType = info.dataType;
          this.categoryDetails.classification = info.categoryId;
          this.categoryDetails.processing = info.oneTime;
          this.categoryDetails.processingType = info.processType;
          this.categoryDetails.precision = info.accuracy;
          this.categoryDetails.id = info.id;
          this.categoryDetails.available = info.available;
        } else {
          this.$Message.error({
            content: res.data.msg,
            duration: 3
          });
        }
      });
    },
    remove(id, index) {
      this.$axios({
        method: "post",
        url: api.removeLabelByIds(),
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
    available(id, available) {
      this.$axios({
        method: "post",
        url: api.changeLabelAvailable(),
        data: {
          id,
          available: Number(!available)
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.init();
          this.$Message.success({
            content: "操作成功",
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
          this.categoryDetails.precision =
            this.categoryDetails.labelType == 3
              ? this.categoryDetails.precision
              : "";
          if (this.isEdit == "新建") {
            this.$axios({
              method: "post",
              url: api.saveLabel(),
              data: {
                accuracy: Number(this.categoryDetails.precision),
                categoryId: this.categoryDetails.classification,
                dataType: this.categoryDetails.labelType,
                labelCode: this.categoryDetails.code,
                labelName: this.categoryDetails.name,
                processType: this.categoryDetails.processType,
                rule: this.categoryDetails.processingRules,
                oneTime: this.categoryDetails.processing
              }
            }).then(
              res => {
                if (res.data.code == 200) {
                  this.cancel();
                  this.init();
                  this.$Message.success("创建成功");
                } else {
                  this.$Message.info({
                    content: res.data.msg,
                    duration: 3
                  });
                }
              },
              err => {
                this.$Message.info({
                  content: "服务器错误",
                  duration: 3
                });
              }
            );
          } else {
            console.log(this.isEdit, "编辑");
            this.$axios({
              method: "post",
              url: api.updateLabelConfigById(),
              data: {
                accuracy: Number(this.categoryDetails.precision),
                categoryId: this.categoryDetails.classification,
                dataType: this.categoryDetails.labelType,
                labelCode: this.categoryDetails.code,
                labelName: this.categoryDetails.name,
                processType: this.categoryDetails.processType,
                rule: this.categoryDetails.processingRules,
                oneTime: this.categoryDetails.processing,
                id: this.categoryDetails.id
                // available: this.categoryDetails.available,
              }
            }).then(
              res => {
                if (res.data.code == 200) {
                  this.cancel();
                  this.init();
                  this.$Message.success("修改成功");
                } else {
                  this.$Message.info({
                    content: res.data.msg,
                    duration: 3
                  });
                }
              },
              err => {
                this.$Message.info({
                  content: "服务器错误",
                  duration: 3
                });
              }
            );
          }
        }
      });
    },
    cancel() {
      this.modal1 = false;
      this.$refs.formInline.resetFields();
      this.categoryDetails = {
        code: "",
        name: "",
        labelType: "",
        classification: "",
        processing: 0,
        processingType: 0,
        precision: ""
      };
    },
    okDelete() {
      this.remove(this.paramsRowId, "");
    },
    cancel2() {
      this.modal2 = false;
    }
  }
};
</script>

<style scoped>
.tab_man_textarea textarea {
  resize: vertical;
}
</style>