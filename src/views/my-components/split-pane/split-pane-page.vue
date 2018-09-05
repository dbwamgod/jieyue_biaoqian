<template>
    <div style='position: relative;height:100%;padding:10px;'>
      <Row type="flex" justify="space-between" align="middle" class="code-row-bg" style='margin-bottom:10px;'>
        <Col span="6"><div style="padding:5px 0 ; font-weight:700; font-size:18px;">接入管理系统</div></Col>
        <Col span="3" style='text-align:right;margin-right:5px;'><Button type="primary">新增用户</Button></Col>
    </Row>
      
        <Spin fix v-show="SpinType">
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
            </Spin>
  
      <Table :columns="historyColumns" :data="historyData" ></Table>
      <!-- <Page :total="dataCount" :page-size="page.pageSize" :current="page.pageIndex" show-total class="paging" @on-change="changepage"></Page> -->
      <Modal
        v-model="resModal"
        title="绑定角色"
        @on-ok="modelOk"
        @on-cancel="modelOk">
        <p v-for='item in roleList'>
          
        <Checkbox label="item.name" :value='item.key==1' @on-change="onHandChange(item)">
          <span style="padding:0 5px;">{{item.name}}</span>
        </Checkbox>
        </p>
        
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
          title: "账号",
          key: "id"
        },
        {
          title: "用户名",
          key: "user"
        },
        {
          title: "手机号",
          key: "name"
        },
        {
          title: "组织机构",
          key: "start"
        },
        {
          title: "状态",
          key: "elapsed"
        },
        {
          title: "操作",
          key: "deletetStatus",
          render: (row, column, index) => {
            return row('div',[
              row(
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
                  console.log('点击')
                  }
                }
              },
              "修改"
            ),
            row(
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
                  console.log('点击')
                  }
                }
              },
              "删除"
            ),
            row(
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
                  console.log('点击')
                  }
                }
              },
              "锁定"
            ),
            row(
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
                  console.log('点击')
                  }
                }
              },
              "绑定角色"
            ),
            ])
          }
        }
      ],
      historyData: [{id:1}],
      roleList: [
        {name:'22222220',key:0},
        {name:'普惠业务管理员',key:1},
        {name:'普惠业务管理员',key:2},
        {name:'普惠业务管理员',key:3},
        {name:'普惠业务管理员',key:4},
        {name:'仲裁',key:5},
        {name:'总裁',key:6},
        
        ],
      resModal: true,
      resModalList: [],
      isNumber: true
    };
  },
  computed: { 
   
  },
  created() {
    // this.init();
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
          this.historyData = res.data.data;
          this.SpinType = false;
        }
      });
    },
    onHandChange(data) {
      console.log(data)
      data.key!=data.key;
      console.log(this.roleList,'ddd')
    },
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



