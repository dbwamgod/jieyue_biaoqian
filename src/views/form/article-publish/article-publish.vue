<template>
    <div style='position: relative;height:100%;padding:10px;'>
        <Spin fix v-show="SpinType">
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
            </Spin>
         <Row type="flex" justify="start" class="code-row-bg" style='margin:10px 0;' :gutter='5'>
              <Col span="8">
              <Input v-model="formItem.tableName" placeholder="请输入表明" ></Input>
              </Col>
              <Col span="4">
              <Button type="primary" @click='initList'>搜索</Button>
              </Col>
         </Row>
     <Form :model="formItem" :label-width="60">
      <Row type="flex" justify="start" class="code-row-bg">
         
        <Col span="5">
        <Form-item label="用户名：">
            <Select v-model="formItem.select" placeholder="请选择">
                 <Option v-for="(item, index) in cityList" :value="item.dbName||''" :key="item.dbName+index">{{ item.dbName}}</Option>
            </Select>
        </Form-item>
        </Col>
        <Col span="5">
        <Form-item label="库名：">
            <Select v-model="formItem.dbName" placeholder="请选择" @on-change='dbNameSelectChange'>
                 <Option v-for="item in cityList" :value="item.dbName||''" :key="item.dbName">{{ item.dbName}}</Option>
            </Select>
        </Form-item>
        </Col>
        <Col span="8">
         <Form-item label="">
            <Checkbox-group v-model="formItem.checkbox" @on-change='onHandChange' >
                <Checkbox v-for="item in queryDbPrivilegeList" :label="item.key"  >{{item.name}}</Checkbox>
                <!-- <Checkbox label="全库添加"></Checkbox>
                <Checkbox label="全库修改"></Checkbox>
                <Checkbox label="全库删除"></Checkbox> -->
            </Checkbox-group>
        </Form-item>
        </Col>
        <Col span='4'>
         <Button type="primary" @click='submit'>提交</Button>
        </Col>
    </Row>
    </Form>
      <Table :columns="historyColumns" :data="historyData" ></Table>
      <Page :total="dataCount" :page-size="page.pageSize" :current="page.pageIndex" show-total class="paging" @on-change="changepage"></Page>
      <Modal
        v-model="resModal"
        title="返回结果"
        @on-ok="modelOk"
        @on-cancel="modelOk">
        <p v-for="item in resModalList">库名：{{item.dbName}},表名：{{item.tableName}},权限：{{item.operate}}, 权限修改是否成功：{{item.secrityStatus==1?'成功':'失败'}} </p>
        
    </Modal>
    </div>
</template>
<style scoped>
.paging {
  float: right;
  margin-top: 10px;
}
</style>
<script>    import Cookies from 'js-cookie';

import api from "@/api";
export default {
  data() {
    return {
      ajaxHistoryData: [],
      // 初始化信息总条数
      dataCount: 0,
      // 每页显示多少条
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      SpinType: false,
      historyColumns: [
        {
          title: "表明",
          key: "tableName"
        },
        {
          title: "其他",
          key: "organiseName"
        },
        {
          title: "查询",
          key: "selectStatus",
          render: (row, column, index) => {
            let value = column.row.selectStatus == 1;
            return row("Checkbox", {
              props: {
                type: "Checkbox",
                size: "small",
                rowIndex: column.index,
                disabled: column.row.allStatusDisableds,
                value
              },
              on: {
                "on-change": (event, data) => {
                  this.historyData[column.index].selectStatus =
                    column.row.selectStatus == 1 ? 0 : 1;
                  column.row.selectStatus =
                    column.row.selectStatus == 1 ? 0 : 1;
                }
              }
            });
          }
        },
        {
          title: "添加",
          key: "insertStatus",
          render: (row, column, index) => {
            let value = column.row.insertStatus == 1;
            return row("Checkbox", {
              props: {
                type: "Checkbox",
                size: "small",
                rowIndex: column.index,
                disabled: column.row.allStatusDisableds,
                value
              },
              on: {
                "on-change": (event, data) => {
                  this.historyData[column.index].insertStatus =
                    column.row.insertStatus == 1 ? 0 : 1;
                  column.row.insertStatus =
                    column.row.insertStatus == 1 ? 0 : 1;
                }
              }
            });
          }
        },
        {
          title: "修改",
          key: "updateStatus",
          render: (row, column, index) => {
            let value = column.row.updateStatus == 1;
            return row("Checkbox", {
              props: {
                type: "Checkbox",
                size: "small",
                rowIndex: column.index,
                disabled: column.row.allStatusDisableds,
                value
              },
              on: {
                "on-change": (event, data) => {
                  this.historyData[column.index].updateStatus =
                    column.row.updateStatus == 1 ? 0 : 1;
                  column.row.updateStatus =
                    column.row.updateStatus == 1 ? 0 : 1;
                }
              }
            });
          }
        },
        {
          title: "删除",
          key: "deletetStatus",
          render: (row, column, index) => {
            let value = column.row.deletetStatus == 1;
            return row("Checkbox", {
              props: {
                type: "Checkbox",
                size: "small",
                rowIndex: column.index,
                disabled: column.row.allStatusDisableds,
                value
              },
              on: {
                "on-change": (event, data) => {
                  this.historyData[column.index].deletetStatus =
                    column.row.deletetStatus == 1 ? 0 : 1;
                  column.row.deletetStatus =
                    column.row.deletetStatus == 1 ? 0 : 1;
                }
              }
            });
          }
        }
      ],
      historyData: [],
      historyOldData: [],
      resModal: false,
      resModalList: [],
      cityList: [{}],
      formItem: {
        input: "",
        select: "stg",
        radio: "male",
        checkbox: [],
        switch: true,
        date: "",
        time: "",
        slider: [20, 50],
        textarea: "",
        dbName: "",
        tableName: ""
      },
      queryDbPrivilegeList: [
        { name: "全库添加", key: "insertStatus", flag: 0 },
        { name: "全库修改", key: "updateStatus", flag: 0 },
        { name: "全库删除", key: "deletetStatus", flag: 0 },
        { name: "全库查询", key: "selectStatus", flag: 0 }
      ],
      queryDbPrivilegeOldList: {}
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$axios({
        //库名
        method: "get",
        url: api.queryAllDbs(),
          headers:{
              Authorization:Cookies.get("token"),
              'Content-Type': 'application/json;charset=UTF-8'
          }
      }).then(res => {
        if (res.data.code == 200) {
          this.cityList = res.data.data;
          this.formItem.dbName = res.data.data[0].dbName;
          this.initList(); //要传入tableName
        }else{this.$Message.info(res.data.msg);}
      });
    },
    onHandChange(data) {
      this.SpinType = true;
      let params = [];
      this.queryDbPrivilegeList.map(item => {
        if (data.indexOf(item.key) > -1) {
          item.flag = 1;
        } else {
          item.flag = 0;
        }
      });

      this.queryDbPrivilegeList.map(item => {
        //这里做操作 跟下面一样
        if (item.flag != this.queryDbPrivilegeOldList[item.key]) {

          params.push({
            dbName: this.formItem.dbName, //this.formItem.dbName,
            flag: item.flag,
            operate: this.conversion(item.key),
            tableName: "",
            userName: "qiyctest2" //this.formItem.select
          });
        }
      });

      this.$axios({
        method: "post",
        url: api.changeUsePrivilege(),
        data: params,
          headers:{
              Authorization:Cookies.get("token"),
              'Content-Type': 'application/json;charset=UTF-8'
          }
      }).then(res => {
        if (res.data.code == 200) {
          this.resModalList = res.data.data;
          this.resModal = true;
          this.SpinType = false;
          this.initList();
        } else {
          this.SpinType = false;
          this.$Message.error("网络请求错误！请刷新", 3);
        }
      });
    },
    changepage(index) {
      this.page.pageIndex = index;
      this.initList();
    },
    submit() {
      this.SpinType = true;
      let isType = [
        "deletetStatus",
        "insertStatus",
        "selectStatus",
        "updateStatus"
      ];
      let params = [];
      this.historyData.map((item, index) => {
        let data = [];
        for (let info in item) {
          if (
            this.historyOldData[index][info] != item[info] &&
            isType.indexOf(info) > -1
          ) {
            data.push({
              dbName: item.dbName,
              flag: item[info] == 1 ? "1" : "0",
              operate: this.conversion(info),
              tableName: item.tableName,
              userName: item.userName
            });
          }
        }
        params.push(...data);
      });
      this.$axios({
        method: "post",
        url: api.changeUsePrivilege(),
        data: params,
          headers:{
              Authorization:Cookies.get("token"),
              'Content-Type': 'application/json;charset=UTF-8'
          }
      }).then(res => {
        if (res.data.code == 200) {
          this.resModalList = res.data.data;
          this.resModal = true;
          this.SpinType = false;
          this.initList();
        }else{this.$Message.info(res.data.msg);}
      });
    },
    initList() {
      this.SpinType = true;
      this.$axios({
        //列表
        method: "post",
        url: api.queryTbPrivilegePage(),
        data: {
          userName: "qiyctest2",
          dbName: this.formItem.dbName,
          tableName: this.formItem.tableName,
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize
        },
          headers:{
              Authorization:Cookies.get("token"),
              'Content-Type': 'application/json;charset=UTF-8'
          }
      }).then(res => {
        if (res.data.code == 200) {
          this.historyData = res.data.data;
          this.dataCount = res.data.page.totalRecords;
          this.historyOldData = JSON.parse(JSON.stringify(res.data.data));
          this.SpinType = false;
        }else{this.$Message.info(res.data.msg);}
      });
      this.$axios({
        //是否全选
        method: "post",
        url: api.queryDbPrivilege(),
        data: {
          userName: "qiyctest2",
          dbName: this.formItem.dbName
        },
          headers:{
              Authorization:Cookies.get("token"),
              'Content-Type': 'application/json;charset=UTF-8'
          }
      }).then(res => {
        if (res.data.code == 200) {
          this.formItem.checkbox = [];
          this.queryDbPrivilegeOldList = res.data.data;
          if (res.data.data.deletetStatus == 1) {
            this.formItem.checkbox.push("deletetStatus");
            this.queryDbPrivilegeList[2].flag = 1;
          }
          if (res.data.data.insertStatus == 1) {
            this.formItem.checkbox.push("insertStatus");
            this.queryDbPrivilegeList[0].flag = 1;
          }
          if (res.data.data.selectStatus == 1) {
            this.formItem.checkbox.push("selectStatus");
            this.queryDbPrivilegeList[3].flag = 1;
          }
          if (res.data.data.updateStatus == 1) {
            this.formItem.checkbox.push("updateStatus");
            this.queryDbPrivilegeList[1].flag = 1;
          }
        }else{this.$Message.info(res.data.msg);}
      });
    },
    dbNameSelectChange() {
      this.formItem.tableName = "";
      this.initList();
    },
    modelOk() {
      this.resModal = false;
      this.resModalList = [];
    },
    conversion(info) {
      switch (info) {
        case "deletetStatus":
          return "delete";
          break;
        case "insertStatus":
          return "insert";
          break;
        case "selectStatus":
          return "select";
          break;
        case "updateStatus":
          return "update";
          break;
        default:
      }
    }
  }
};
</script>
<style >
</style>



