<template>
    <div style='position: relative;height:100%;padding:10px;'>
      <div style="padding:5px 0 ; font-weight:700; font-size:18px;">任务预警</div>
        <Spin fix v-show="SpinType">
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
            </Spin>
     <Form :model="formItem" :label-width="60">
      <Row type="flex" justify="start" class="code-row-bg">
         
        <Col span="5">
        <Form-item label="任务号：">
           <Input v-model="formItem.appId" placeholder="请输入" ></Input>
        </Form-item>
        </Col>
        <Col span="5">
        <Form-item label="耗时：">
            <Input v-model="formItem.dur" placeholder="请输入" ></Input>
        </Form-item>
        </Col>
        <Col span="5">
        <Form-item label="状态：">
            <Select v-model="formItem.state" placeholder="请选择" @on-change='dbNameSelectChange'>
                 <Option v-for="item in cityList" :value="item.name" :key="item.key">{{ item.name}}</Option>
            </Select>
        </Form-item>
        </Col>
        <!-- <Col span='4' style="text-align:center;">
         <Button type="primary" @click='submit'>提交</Button>
        </Col> -->
    </Row>
    </Form>
      <Table :columns="historyColumns" :data="newArr" ></Table>
      <!-- <Page :total="dataCount" :page-size="page.pageSize" :current="page.pageIndex" show-total class="paging" @on-change="changepage"></Page> -->
      <Modal
        v-model="resModal"
        title="返回结果"
        @on-ok="modelOk"
        @on-cancel="modelOk">
          <div>  </div>
        <p v-for="item in resModalList">库名：{{item.dbName}},<br/>
            表名：{{item.tableName}},<br/>
            权限：{{item.operate}}, <br/>
            权限修改结果：{{item.secrityStatus==1?'成功':'失败'}} </p>
        
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
          title: "任务号",
          key: "id"
        },
        {
          title: "用户",
          key: "user"
        },
        {
          title: "任务名称",
          key: "name"
        },
        {
          title: "开始时间",
          key: "start"
        },
        {
          title: "耗时(分钟)",
          key: "elapsed"
        },
        {
          title: "队列",
          key: "queue"
        },
        {
          title: "状态",
          key: "statusMsg"
        },
        {
          title: "日志",
          key: "updateStatus",
          render: (row, column, index) => {
            return row(
              "Button",
              {
                props: {
                  type: "text",
                  size: "small"
                },
                on: {
                  click: (event, data) => {
                    this.clickToLog(column.row.id);
                  }
                }
              },
              "查看"
            );
          }
        },
        {
          title: "操作",
          key: "deletetStatus",
          render: (row, column, index) => {
            return row(
              "Button",
              {
                props: {
                  type: "text",
                  size: "small"
                },
                style:{
                  color:'blue',
                },
                on: {
                  click: (event, data) => {
                    this.$axios({
                      method: "get",
                      url: api.killJob(column.row.id),
                        headers:{
                            Authorization:Cookies.get("token"),
                            'Content-Type': 'application/json;charset=UTF-8'
                        }
                    }).then(res => {
                      if(res.data.code==200){
                        this.$Message.success("提交成功", 3);
                      }else{
                         this.$Message.error("提交成功", 3);
                      }
                      
                    });
                  }
                }
              },
              "停止"
            );
          }
        }
      ],
      historyData: [],
      historyOldData: [],
      resModal: false,
      resModalList: [],
      cityList: [
        {name: "全部",key:-1},
        { name: "良好", key: 0 },
        { name: "轻微", key: 1 },
        { name: "中度", key: 2 },
        { name: "严重", key: 3 },
        { name: "预警", key: 4 },
      ],
      formItem: {
        appId: "",
        dur: "",
        state: '全部'
      },
      isNumber: true,
    };
  },
  computed: { 
    newArr: function(type) {
      if (this.formItem.state!=='全部' || this.formItem.appId || this.formItem.dur) {
        if(this.formItem.state!=='全部'&& this.formItem.appId && this.formItem.dur){
          return this.historyData.filter(
              r => r.statusMsg == this.formItem.state && r.id == this.formItem.appId && r.elapsed == this.formItem.dur
            );
          }
        if(this.formItem.state!=='全部'&& this.formItem.appId){
          return this.historyData.filter(
              r => r.statusMsg == this.formItem.state && r.id == this.formItem.appId
            );
          }
         if(this.formItem.appId && this.formItem.dur){
          return this.historyData.filter(
              r => r.id == this.formItem.appId && r.elapsed == this.formItem.dur
            );
          }
         if(this.formItem.state!=='全部' && this.formItem.dur){
          return this.historyData.filter(
              r => r.statusMsg == this.formItem.state  && r.elapsed == this.formItem.dur
            );
          }
        return this.historyData.filter(
           r => r.statusMsg == this.formItem.state || r.id == this.formItem.appId || r.elapsed == this.formItem.dur
         );
      } else {
        return this.historyData;
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$axios({
        method: "post",
        url: api.getWarnList(),
        data: {
          pageSize: this.page.pageSize,
          pageIndex: this.page.pageIndex
        },
          headers:{
              Authorization:Cookies.get("token"),
              'Content-Type': 'application/json;charset=UTF-8'
          }
      }).then(res => {
        if (res.data.code == 200) {
            if(res.data.data  instanceof Array){
                this.historyData = res.data.data
            }else{
                this.historyData = [];
            }

          this.SpinType = false;
        }
      });
    },
    onHandChange(data) {},
    changepage(index) {
      this.page.pageIndex = index;
      this.init();
    },
    submit() {
      if (this.formItem.dur.match(/^\d+$/) || !this.formItem.dur) {
        this.SpinType = true;
        this.init();
      } else {
        this.$Message.error("请填写整数", 3);
      }
    },
    initList() {
      this.SpinType = true;
    },
    dbNameSelectChange() {
      // this.init();
    },
    modelOk() {
      this.resModal = false;
      this.resModalList = [];
    },
    clickToLog(id) {
     this.$axios({
        method: "get",
        url: api.getMonitorLog(id),
         headers:{
             Authorization:Cookies.get("token"),
             'Content-Type': 'application/json;charset=UTF-8'
         }
      }).then(res => {
        if (res.data.code == 200) {
          let url=res.data.data.amContainerLogs;
          if(url){
           window.open(`${url}`, '_blank');
          }else{
             this.$Message.error("暂无数据", 3);
          }
        } 
      });
    }
  }
};
</script>
<style >
.aa {
}
</style>



