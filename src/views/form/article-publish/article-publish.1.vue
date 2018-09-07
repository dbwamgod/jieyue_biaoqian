
<template>
      <div class="tissue">


         <div class="tissue_header" >
            <div class="jurisdiction_top" style="display:flex;justify-content: space-between;">
                 <h2>新增权限</h2>
                 <!-- <div class="tissue_search">
                  <Input  placeholder="可按权限、机构、及用户查询" v-model="searchText" class="search_ipt"></Input>
                  <Button type="primary" icon="ios-search" class="tissue_btn"></Button>
                </div> -->
            </div>
            <div class="jurisdiction_bottom" style="display:flex;justify-content: space-around;">
                <div class="username">
                    <span>用户名</span>
                    <Select v-model="user"  style="width:140px">
                       <Option v-for="item in cityList" :value="item.value" :key="item.value" >{{ item.label }}</Option>
                    </Select>
                </div>
                 <div class="library_name">
                    <span>库名</span>
                    <Select v-model="dbName" style="width:140px" @on-change="search">
                       <Option v-for="item in cityList1" :value="item.dbName" :key="item.dbName">{{ item.dbName }}</Option>
                    </Select>
                </div>
                   <div class="table_name">
                    <span>表名</span>
                   <Input v-model="tableName" placeholder="可根据表名进行查询"  style="width: 140px" @on-keyup="search"></Input>
                </div>
                <div class="all">
                    <Checkbox v-model="all" @on-change="changeStatusAll">all</Checkbox> 
                </div>
                <div class="query">
                    <Checkbox v-model="query" @on-change="changeStatusSelect">全库查询</Checkbox>  
                </div>
                <div class="add">
                     <Checkbox v-model="add" @on-change="changeStatusInsert">全库添加</Checkbox>  
                </div>
                <div class="edit">
                    <Checkbox v-model="edit" @on-change="changeStatusUpdate">全库修改</Checkbox>  
                </div>
                <div class="del">
                    <Checkbox v-model="del" @on-change="changeStatusDelete">全库删除</Checkbox>  
                </div>
                <div class="submit">
                     <Button type="success" @click="submit">提交</Button>
                </div>
            </div>
         <!-- <div class="adduser">
             <Button type="success" style="margin-top:10px;margin-right:5px" @click="modal7 = true">+</Button>
          </div> -->
         </div>
         <div class="tissue_cont">
              <Table width="100%"  border :columns="columns2" :data="data3"></Table>
              <!-- <table border="1">
                 <tr v-for="item in data3">
                   <td>
                     {{item.tableName}}
                   </td>
                   <td v-if="">
                      {{item.updateStatus}}
                   </td>
                   <td>

                   </td>
                   <td>
                     {{item.insertStatus}}
                   </td>
                   <td>
                     {{item.modifier}}
                   </td>
                   <td>
                     {{item.deletetStatus}}
                   </td>
                 </tr>
              </table> -->
         </div>
     <div class="tissue_footer">
           <Page :total="dataCount"  :page-size="pageSize" :current="pageIndex"  @on-change="handlePage" @on-page-size-change="handlePageSize" show-elevator class="paging"></Page>
      </div>
      </div>
    
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      all: false,
      user: "test",
      checked: false,
      checked1: true,
      tableName: "",
      dataCount: 19,
      pageSize: 6,
      pageIndex: 1,
      modal7: false,
      cityList: [
        {
          value: "test",
          label: "test"
        }
      ],
      cityList1: [],
      columns2: [
        {
          title: "表名",
          key: "tableName",
          align: "center"
        },
        {
          title: "ALL",
          key: "allStatus",
          align: "center",
          render: (val, params) => {
            let rowIndex = params.index;
            let value =
              parseInt(params.row.insertStatus) +
                parseInt(params.row.selectStatus) +
                parseInt(params.row.updateStatus) +
                parseInt(params.row.deleteStatus) ==
              4;
            let _self = this;
            return val("Checkbox", {
              props: {
                type: "Checkbox",
                size: "small",
                value: value,
                rowIndex: rowIndex,
                disabled: params.row.allStatusDisabled
              },
              on: {
                "on-change"(event) {
                  const aimVal = event ? 1 : 0;
                  _self.data3[rowIndex].insertStatus = aimVal;
                  _self.data3[rowIndex].updateStatus = aimVal;
                  _self.data3[rowIndex].selectStatus = aimVal;
                  _self.data3[rowIndex].deleteStatus = aimVal;
                }
              }
            });
          }
        },
        {
          title: "查询",
          key: "selectStatus",
          align: "center",
          render: (val, params) => {
            let rowIndex = params.index;
            let _self = this;
            return val("Checkbox", {
              props: {
                type: "Checkbox",
                size: "small",
                value: parseInt(params.row.selectStatus) == 1,
                disabled: params.row.selectStatusStatusDisabled
              },
              on: {
                "on-change"(event) {
                  this.data3[rowIndex].selectStatus = event ? 1 : 0;
                }
              }
            });
          }
        },
        {
          title: "添加",
          key: "insertStatus",
          align: "center",
          render: (val, params) => {
            let rowIndex = params.index;
            let _self = this;
            return val("Checkbox", {
              props: {
                type: "Checkbox",
                size: "small",
                value: parseInt(params.row.insertStatus) == 1,
                disabled: params.row.insertStatusStatusDisabled
              },
              on: {
                "on-change"(event) {
                  _self.data3[rowIndex].insertStatus = event ? 1 : 0;
                }
              }
            });
          }
        },
        {
          title: "修改",
          key: "updateStatus",
          align: "center",
          render: (val, params) => {
            let rowIndex = params.index;
            let _self = this;
            return val("Checkbox", {
              props: {
                type: "Checkbox",
                size: "small",
                value: parseInt(params.row.updateStatus) == 1,
                disabled: params.row.updateStatusDisabled
              },
              on: {
                "on-change"(event) {
                  _self.data3[rowIndex].updateStatus = event ? 1 : 0;
                }
              }
            });
          }
        },
        {
          title: "删除",
          key: "deleteStatus",
          align: "center",
          render: (val, params) => {
            let rowIndex = params.index;
            let _self = this;
            return val("Checkbox", {
              props: {
                type: "Checkbox",
                size: "small",
                value: parseInt(params.row.deleteStatus) == 1,
                disabled: params.row.deleteStatusDisabled
              },
              on: {
                "on-change"(event) {
                  _self.data3[rowIndex].deleteStatus = event ? 1 : 0;
                }
              }
            });
          }
        },
        {
          title: "xxx",
          key: "xxx",
          align: "center",
          
        }
      ],
      data3: [
        {
          tableName: "",
          updateStatus: "",
          insertStatus: "",
          selectStatus: "",
          deletetStatus: ""
        }
      ],
      dataDefault: [],
      dbName:"",
    };
  },
  created() {

  },
  mounted() {
    let _left=this;
        this.$axios
      .get("http://192.168.34.159:10120/galaxy/privilege/queryAllDbs")
      .then(res => {
        this.cityList1 = res.data.data;
         this.dbName=this.cityList1[0].dbName;
        
         
      });
    
          
       

  
  },

  methods: {
    // 表名查询
      search() {
    // alert(11111)
     this.handlePage(1)
   
  },
    // 分页器
  handlePage(value) {

    // alert(111)
    let _self = this;
    const url =
      "http://192.168.34.159:10120/galaxy/privilege/queryTbPrivilegePage/";
    this.$axios({
      method: "post",
      url: url,
      data: {
        userName: this.user,
        dbName: this.dbName,
        tableName:this.tableName,
        pageIndex: value,
        pageSize: this.pageSize
      },
        headers:{
            Authorization:Cookies.get("token"),
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }).then(res => {
      // let _self=this;
      if(res.data.code==200){ this.dataCount = res.data.page.totalRecords;
          this.data3 = res.data.data;
          this.dataDefault= res.data.data;
          // this.data3[0].deletetStatus=1
          this.pageIndex=value;}else{this.$Message.info(res.data.msg);}

    });
 
  },
    // all 全选跟反选
    changeStatusAll(event) {
      this.changeAllRowsStatus(
        ["insertStatus", "selectStatus", "updateStatus", "deleteStatus"],
        [
          "updateStatusDisabled",
          "deleteStatusDisabled",
          "insertStatusStatusDisabled",
          "selectStatusStatusDisabled",
          "allStatusDisabled"
        ],
        event
      );
    },
    changeStatusSelect(event) {
      this.changeAllRowsStatus(
        ["selectStatus"],
        ["selectStatusStatusDisabled"],
        event
      );
    },
    changeStatusInsert(event) {
      this.changeAllRowsStatus(
        ["insertStatus"],
        ["insertStatusStatusDisabled"],
        event
      );
    },
    changeStatusUpdate(event) {
      this.changeAllRowsStatus(
        ["updateStatus"],
        ["updateStatusDisabled"],
        event
      );
    },
    changeStatusDelete(event) {
      this.changeAllRowsStatus(
        ["deleteStatus"],
        ["deleteStatusDisabled"],
        event
      );
    },
    changeAllRowsStatus(statusNames, disabledNames, event) {
      const selfStatusNames = statusNames;
      const aimVal = event ? 1 : 0;
      this.data3.forEach(element => {
        selfStatusNames.forEach(name => {
          element[name] = aimVal;
        });
        disabledNames.forEach(name => {
          element[name] = event;
        });
      });
    }
  },

  // 提交
  submit(event) {
    if (
      this.changeAllRowsStatus(
        ["insertStatus", "selectStatus", "updateStatus", "deleteStatus"],
        event ? 1 : 1
      )
    ) {
      const url =
        "http://192.168.34.159:10120/galaxy/privilege/changeUsePrivilege/";
      this.$axios({
        method: "post",
        url: url,
        data: [
          {
            userName: "qiyctest15",
            dbName: "ods",
            tableName: "",
            operate: "all",
            flag: "-1"
          }
        ]
      }).then(res => {
      });
    }
  },
  //表名查询

  

  ok() {
    this.$Message.info("Clicked ok");
  },
  cancel() {
    this.$Message.info("Clicked cancel");
  }
};
//   checkFunction(val,param){
//  if (parseInt(val) == 1) {
//               return val(
//                 "Button",
//                 {
//                   props: {
//                     type: "Checkbox",
//                     size: "small"
//                   }
//                 },
//                 "了解详情"
//               );
//             } else {
//               return val(
//                 "Checkbox",
//                 {
//                   props: {
//                     type: "Checkbox",
//                     size: "small"
//                   }
//                 },
//                 "xxx"
//               );
//             }
//   }
// };
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
.tissue {
  overflow: hidden;
}
.tissue_header {
  width: 100%;
  height: 100px;
  background-color: rgb(220, 241, 255);
  text-align: justify;
}
.tissue_header h2 {
  line-height: 50px;
  padding-left: 5px;
}
.search_ipt {
  width: 300px;
  line-height: 50px;
}
.tissue_search {
  position: relative;
  /* padding-right: 5px; */
  margin-right: 18px;
}
.tissue_btn {
  position: absolute;
  top: 10px;
  right: 0;
  /* line-height: 50px; */
}
.tissue_footer {
  width: 100%;
  height: 40px;
  /* background: red; */
  position: absolute;
  left: 0;
  bottom: 10px;
}
.tissue_footer .paging {
  text-align: center;
  line-height: 40px;
}
/* 角色授权
  */
.role_authorization {
  width: 100%;
  height: 400px;
}
.role_header ul li {
  width: 150px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border: 1px solid #e7e7ee;
  float: left;
}
.role_tree {
  width: 150px;
  height: 94%;
  border: 1px solid #e7e7ee;
}
.jurisdiction_bottom {
  height: 50px;
  line-height: 50px;
  margin-left: 75px;
}
.jurisdiction_bottom .username span {
  font-size: 14px;
  font-weight: bold;
}
.library_name span {
  font-size: 14px;
  font-weight: bold;
}
.table_name span {
  font-size: 14px;
  font-weight: bold;
}
</style>




