(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-eeac9d26"],{"7d6d":function(e,t,a){},"8b62":function(e,t,a){"use strict";a.r(t);var l=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("vxe-table",{ref:"xTree",attrs:{resizable:"",border:"inner","tree-config":{children:"childs"},data:e.tableData}},[a("vxe-table-column",{attrs:{field:"",title:"",align:"center",width:"60"},scopedSlots:e._u([{key:"default",fn:function(e){e.row;return[a("i",{staticClass:"vxe-icon--menu drag-btn"})]}}])}),e._v(" "),a("vxe-table-column",{attrs:{field:"name",title:"label","tree-node":""}}),e._v(" "),a("vxe-table-column",{attrs:{field:"size",title:"Size"}}),e._v(" "),a("vxe-table-column",{attrs:{field:"type",title:"Type"}}),e._v(" "),a("vxe-table-column",{attrs:{field:"date",title:"Date"}})],1),e._v(" "),e._m(0),e._v(" "),e._m(1)],1)},n=[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("table",[a("thead",[a("tr",[a("th",[e._v("Column 1")]),e._v(" "),a("th",[e._v("Column 2")])])]),e._v(" "),a("tbody",[a("tr",[a("td",{staticStyle:{width:"30%"}},[e._v("Row 1, Cell 1")]),e._v(" "),a("td",[e._v("Row 1, Cell 2")])]),e._v(" "),a("tr",[a("td",[e._v("Row 2, Cell 1")]),e._v(" "),a("td",[e._v("Row 2, Cell 2")])]),e._v(" "),a("tr",[a("td",[e._v("Row 3, Cell 1")]),e._v(" "),a("td",[e._v("Row 3, Cell 2")])]),e._v(" "),a("tr",{staticClass:"last-row"},[a("td",{attrs:{colspan:"2"}},[e._v("Row 4, Combined Cell")])])])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("table",[a("thead",[a("tr",[a("th",[e._v("Column 1")]),e._v(" "),a("th",[e._v("Column 2")])])]),e._v(" "),a("tbody",[a("tr",[a("td",{staticStyle:{width:"300px"}},[e._v("Row 1, Cell 1")]),e._v(" "),a("td",[e._v("Row 1, Cell 2 - Cell 1")])]),e._v(" "),a("tr",[a("td",{attrs:{rowspan:"2"}},[e._v("Row 1, Cell 1")]),e._v(" "),a("td",[e._v("Row 1, Cell 2 - Cell 1")])]),e._v(" "),a("tr",[a("td",[e._v("Row 1, Cell 2 - Cell 2")])]),e._v(" "),a("tr",{staticClass:"merge-row"},[a("td",{attrs:{colspan:"2"}},[e._v("Row 2, Combined Cell")])])])])}],d=a("aa47"),i={name:"",components:{},data:function(){return{tableData:[{id:1e3,name:"test abc1",type:"mp3",size:1024,date:"2020-08-01"},{id:1005,name:"Test2",type:"mp4",size:null,date:"2021-04-01",childs:[{id:24300,name:"Test2",type:"avi",size:1024,date:"2020-03-01"},{id:20045,name:"test abc4",type:"html",size:600,date:"2021-04-01"},{id:10053,name:"test abc96",type:"avi",size:null,date:"2021-04-01",childs:[{id:24330,name:"test abc5",type:"txt",size:25,date:"2021-10-01"},{id:21011,name:"Test6",type:"pdf",size:512,date:"2020-01-01"},{id:22200,name:"Test7",type:"js",size:1024,date:"2021-06-01"}]}]},{id:1006,name:"Test3",type:"mp4",size:null,date:"2021-04-01",childs:[{id:243001,name:"Test3",type:"avi",size:1024,date:"2020-03-01"},{id:200451,name:"test abc4",type:"html",size:600,date:"2021-04-01"},{id:100531,name:"test abc96",type:"avi",size:null,date:"2021-04-01",childs:[{id:243301,name:"test abc5",type:"txt",size:25,date:"2021-10-01"},{id:210111,name:"Test6",type:"pdf",size:512,date:"2020-01-01"},{id:222001,name:"Test7",type:"js",size:1024,date:"2021-06-01"}]}]},{id:23666,name:"Test8",type:"xlsx",size:2048,date:"2020-11-01"},{id:24555,name:"test abc9",type:"avi",size:224,date:"2020-10-01"}]}},mounted:function(){document.body.ondrop=function(e){e.preventDefault(),e.stopPropagation()},this.rowDrop()},methods:{rowDrop:function(){var e=document.querySelector(".vxe-table--body tbody");d["a"].create(e,{handle:".drag-btn",onEnd:function(e){console.log(e);e.newIndex,e.oldIndex}})}}},s=i,o=(a("8f58"),a("2877")),r=Object(o["a"])(s,l,n,!1,null,"d9b36046",null);t["default"]=r.exports},"8f58":function(e,t,a){"use strict";a("7d6d")}}]);