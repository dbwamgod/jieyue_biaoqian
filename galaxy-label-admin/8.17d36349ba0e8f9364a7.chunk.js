webpackJsonp([8],{267:function(t,e,a){"use strict";function n(t){r||a(335)}Object.defineProperty(e,"__esModule",{value:!0});var i=a(283),o=a.n(i);for(var s in i)"default"!==s&&function(t){a.d(e,t,function(){return i[t]})}(s);var l=a(337),c=a.n(l),r=!1,d=a(0),u=n,p=d(o.a,c.a,!1,u,"data-v-0ab2cdea",null);p.options.__file="src\\views\\productManagement\\check_product.vue",e.default=p.exports},283:function(t,e,a){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=a(31),o=n(i),s=a(99),l=n(s),c=a(3);n(c);e.default={name:"check_product",data:function(){return{content:"",dataCount:0,page:{pageSize:10,pageIndex:1},columns1:[],defaultRules:{},data2:[],data3:[{}],check_list:[]}},watch:{$route:function(t,e){t.query.id&&this.product_getDetail(t.query.id)}},created:function(){this.product_getDetail(this.$route.query.id),this.content=this.defaultRules.queryParam},methods:{comeout:function(){this.check_list.length?0!==this.data2.length?(window.open(l.default.product_out(encodeURIComponent((0,o.default)({queryParam:this.defaultRules.queryParam,outputVos:this.check_list,pageSize:0,pageIndex:0}))),"_blank"),window.open(l.default.product_out(encodeURIComponent((0,o.default)({queryParam:this.defaultRules.queryParam,outputVos:this.check_list,pageSize:0,pageIndex:0}))),"_blank")):this.$Message.error("没有数据,不能导出"):this.$Message.info("请先点击查询")},changepage:function(t){this.page.pageIndex=t,this.product_productOutput_list()},product_productOutput_list:function(){var t=this;this.check_list=this.defaultRules.labelNameVoList,this.$axios({method:"post",url:l.default.product_productOutput_list(),data:{queryParam:this.defaultRules.queryParam,outputVos:this.check_list,pageSize:this.page.pageSize,pageIndex:this.page.pageIndex-1}}).then(function(e){200==e.data.code?0!==e.data.data.length?(t.data2=e.data.data,t.dataCount=e.data.page.totalRecords):t.$Message.error("标签内容没有数据!"):t.$Message.info(e.data.msg)})},product_getDetail:function(t){var e=this;this.$axios({method:"get",url:l.default.product_getDetail(t)}).then(function(t){if(200==t.data.code)null!==t.data.data?(e.defaultRules=t.data.data,e.columns1=e.defaultRules.labelNameVoList.map(function(t,e){return{title:t.labelName,key:t.labelCode}})):e.$Message.info(t.data.msg);else{e.$Message.info(t.data.msg+",没有数据");var a=setTimeout(function(){e.$router.back(-1),clearTimeout(a)},1700)}})},checkInfo:function(){this.product_productOutput_list()},handleClose2:function(t,e){var a=this.count.indexOf(e);this.count.splice(a,1)}}}},335:function(t,e,a){var n=a(336);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);a(9)("72d889da",n,!1)},336:function(t,e,a){e=t.exports=a(8)(!1),e.push([t.i,"\n.check_container[data-v-0ab2cdea] {\n    padding: 4% 5% 0 5%;\n}\n.check_container_product[data-v-0ab2cdea] {\n    font-size: 22px;\n    color: #515a6e;\n}\n.check_container_list[data-v-0ab2cdea] {\n    font-size: 19px;\n    color: #515a6e;\n}\n.Default_rule[data-v-0ab2cdea] {\n    font-size: 21px;\n    font-weight: 600;\n}\n.check_inpout[data-v-0ab2cdea] {\n    font-size: 21px;\n    font-weight: 600;\n    border-radius: 5px;\n}\n.detail_list[data-v-0ab2cdea] {\n\n    font-size: 21px;\n    font-weight: 600;\n}\n.container_label_check[data-v-0ab2cdea] {\n\n    overflow-y: scroll;\n\n    max-height: 145px;\n    border: 1px solid #dddee1;\n    border-radius: 4px;\n}\n\n",""])},337:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"check_container"},[a("Row",{staticStyle:{margin:"0"}},[a("Col",{attrs:{span:"3"}},[a("h3",{staticStyle:{display:"inline-block","font-size":"23px"}},[t._v("产品:")])]),t._v(" "),a("Col",{staticStyle:{overflow:"hidden","text-overflow":"ellipsis","white-space":"nowrap",width:"300px"},attrs:{span:"3"}},[a("span",{staticClass:"check_container_product"},[t._v(t._s(t.defaultRules.productName))])])],1),t._v(" "),a("Row",{staticStyle:{margin:"20px 0 0 0"}},[a("Col",{attrs:{span:"3"}},[a("h3",{staticStyle:{display:"inline-block","font-size":"22px"}},[t._v("类别:")])]),t._v(" "),a("Col",{staticStyle:{"text-overflow":"ellipsis",overflow:"hidden","white-space":"nowrap"},attrs:{span:"3"}},[a("span",{staticClass:"check_container_list"},[t._v(t._s(t.defaultRules.categoryName))])])],1),t._v(" "),a("Row",{staticStyle:{"margin-top":"40px"}},[a("Col",{attrs:{span:"3"}},[a("p",{staticClass:"Default_rule"},[t._v("预设规则:")])]),t._v(" "),a("Col",{staticStyle:{border:"1px solid #dddee1","min-width":"300px","min-height":"40px",padding:"10px"},attrs:{span:"18"}},[a("span",{staticStyle:{"text-overflow":"ellipsis",overflow:"hidden","white-space":"nowrap",display:"block"}},[t._v(t._s(t.defaultRules.queryParam))])])],1),t._v(" "),a("Row",{staticStyle:{"margin-top":"40px"}},[a("Col",{attrs:{span:"3"}},[a("p",{staticClass:"check_inpout"},[t._v("查询输出:")])]),t._v(" "),a("Col",{attrs:{span:"18"}},[a("div",{ref:"container_label_check",staticClass:"container_label_check"},t._l(t.defaultRules.labelNameVoList,function(e,n){return a("Tag",{key:n,staticStyle:{height:"35px","line-height":"35px",padding:"0 15px",background:"#e1e1e1",margin:"5px 2.5px 2.5px 5px"},attrs:{name:e.labelName},on:{"on-close":t.handleClose2}},[t._v(t._s(e.labelName)+"\n                ")])}))])],1),t._v(" "),a("Row",{staticStyle:{"margin-top":"40px"}},[a("Col",{attrs:{span:"6",offset:"8"}},[a("Button",{staticStyle:{"margin-right":"40px"},attrs:{type:"primary"},on:{click:t.checkInfo}},[t._v("查询")]),t._v(" "),a("Button",{attrs:{type:"primary"},on:{click:t.comeout}},[t._v("导出")])],1)],1),t._v(" "),a("Row",{staticStyle:{"margin-top":"50px"}},[a("Col",{attrs:{span:"3"}},[a("p",{staticClass:"detail_list"},[t._v("查询结果:")])]),t._v(" "),a("Col",{attrs:{span:"18"}},[a("Table",{attrs:{columns:t.columns1,data:t.data2}})],1)],1),t._v(" "),a("Row",{staticStyle:{"margin-top":"30px"}},[a("Col",{staticStyle:{"margin-left":"52%",width:"31%","text-align":"right"}},[a("Page",{attrs:{total:t.dataCount,"show-total":"","page-size":t.page.pageSize,current:t.page.pageIndex},on:{"on-change":t.changepage}})],1)],1)],1)},i=[];n._withStripped=!0;var o={render:n,staticRenderFns:i};e.default=o}});