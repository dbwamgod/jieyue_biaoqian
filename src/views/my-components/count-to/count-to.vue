
<template>
      <div class="tissue">
 <!-- //修改 -->
   <Modal
        width="800"
        title="新增资源"
        v-model="modal7"
        :closable="false">
        <p>Content of dialog</p>
        <p>Content of dialog</p>
        <p>Content of dialog</p>
    </Modal>

         <div class="tissue_header" style="display:flex;justify-content:space-between">
 
          <h2>资源管理</h2>
          <div class="tissue_search">
            <Input  placeholder="可按权限、机构、及用户查询" v-model="searchText" class="search_ipt"></Input>
            <Button type="primary" icon="ios-search" class="tissue_btn"></Button>
          </div>
             <div class="adduser">
             <Button type="success" style="margin-top:10px;margin-right:5px" @click="modal7 = true">+</Button>
          </div>
         </div>
         <div class="tissue_cont">
              <Table width="100%"  border :columns="columns2" :data="data3"></Table>
         </div>
     <div class="tissue_footer">
           <Page :total="100" show-elevator class="paging"></Page>
      </div>
      </div>
    
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      searchText:'',
         modal7: false,
      columns2: [
        {
          title: "资源编码",
          key: "resource_code",
          align:"center",
          fixed: "left"
        },
        {
          title: "所属系统",
          key: "network",
           align:"center",
        },
        {
          title: "上级资源",
          key: "superior_resource",
           align:"center",
        },
  
        {
          title: "操作",
          key: "action",
           align:"center",
          fixed: "right",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",  
                    icon:"edit",
                    shape:"circle"
                  },
                  style:{
                     
                     color:"white",
                     marginRight:"10px"
                  },
                 on:{
                      click:()=>{
                        
                    }
                  }
                },
                
              ),
              h(
                "Button",
                   
                {
                    // title: 'User Info',
                  props: {
                    type: "error",
                    size: "small",
                     shape:"circle",
                     icon:'trash-b',

                  },
                  style:{
                     color:"white"
                  },
                  on:{
                      click:()=>{
                        alert(11111)
                      }
                  }
                },
               
              )
            ]);
          }
        }
      ],
      data3: [
        {
         resource_code:'MC-001',
         network:'大数据中心1',
         superior_resource:'432232'
        },
            {
         resource_code:'MC-002',
         network:'大数据中心2',
         superior_resource:'432232'
        },
            {
         resource_code:'MC-003',
         network:'大数据中心3',
         superior_resource:'432232'
        },
            {
         resource_code:'MC-004',
         network:'大数据中心4',
         superior_resource:'432232'
        }
      ]
    };
  },
  methods:{
          ok () {
                this.$Message.info('Clicked ok');
            },
            cancel () {
                this.$Message.info('Clicked cancel');
            }
  }
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
 
}
.tissue{
    overflow: hidden;
}
.tissue_header {
  width: 100%;
  height: 50px;
  background-color: rgb(220, 241, 255);
  text-align: justify;
}
.tissue_header h2 {
  line-height: 50px;
  padding-left: 5px;
}
.search_ipt {
  width: 300px;
  line-height: 40px;
}
.tissue_search {
  position: relative;
  padding-right: 5px;
  margin-top: 5px;
}
.tissue_btn {
  position: absolute;
  top: 4px;
  right: 5px;
}
.tissue_footer{
    width: 100%;
    height: 40px;
    /* background: red; */
    position: absolute;
    left: 0;
    bottom: 10px;
}
.tissue_footer .paging{
  text-align: center;
  line-height: 40px;
}
</style>


