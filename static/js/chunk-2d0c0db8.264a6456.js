(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0c0db8"],{4424:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("vxe-table",{ref:"xTable2",attrs:{border:"",data:e.tableData,"checkbox-config":{checkMethod:e.checCheckboxkMethod2}}},[a("vxe-table-column",{attrs:{type:"checkbox",title:"All"}}),e._v(" "),a("vxe-table-column",{attrs:{field:"sex",title:"Sex"}}),e._v(" "),a("vxe-table-column",{attrs:{field:"age",title:"Age"}}),e._v(" "),a("vxe-table-column",{attrs:{field:"address",title:"Address","show-overflow":""}})],1)],1)},o=[],n={name:"",components:{},data:function(){return{tableData:[{id:10001,name:"Test1",role:"Develop",sex:"Man",age:28,address:"test abc"},{id:10002,name:"Test2",role:"Test",sex:"Women",age:22,address:"Guangzhou"},{id:10003,name:"Test3",role:"PM",sex:"Man",age:32,address:"Shanghai"},{id:10004,name:"Test4",role:"Designer",sex:"Women ",age:23,address:"test abc"},{id:10005,name:"Test5",role:"Develop",sex:"Women ",age:30,address:"Shanghai"}]}},mounted:function(){this.setDefaultCheckedRow()},methods:{setDefaultCheckedRow:function(){this.$refs.xTable2.setCheckboxRow(this.tableData[1],!0),this.tableData[1].disabled=!0},checCheckboxkMethod2:function(e){var t=e.row;return!t.disabled}}},l=n,d=a("2877"),c=Object(d["a"])(l,s,o,!1,null,"6ef379f4",null);t["default"]=c.exports}}]);