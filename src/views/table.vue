<template>
  <div>
    <i class="fa fa-search my-fe-search-icon"></i>
    <i class="fa fa-search my-fe-search-icon"></i>
    <p>
        <select-table v-model="testValue" @getRow="getRow" :tableColumn='tableColumn'></select-table>
      </p>
    <i class="fa fa-search my-fe-search-icon"></i>
    <i class="fa fa-search my-fe-search-icon"></i>
 <div style="margin-top:50px" ref="table_">
        <vxe-table
          size="mini"
          resizable
          ref="table"
          border
          :tree-config="{children: 'children'}"
          :data="tableData"
          :edit-config="{trigger: 'click', mode: 'row', icon: 'fa fa-pencil', showStatus: true }"
          :checkbox-config="{labelField: 'id', highlight: true}"
          @checkbox-change="selectChangeEvent">
          <vxe-table-column type="checkbox" show-overflow title="ID" width="280" fixed="left" tree-node></vxe-table-column>
          <vxe-table-column min-width="200" field="name" title="Name"
           :filters="[{data: {vals: [], sVal: '', fMenu: '', f1Type:'', f1Val: '', fMode: 'and', f2Type: '', f2Val: ''}}]"
           :filter-render="{name: 'FilterExcel'}">
          </vxe-table-column>
          <vxe-table-column min-width="200" field="size" title="Size"></vxe-table-column>
          <vxe-table-column min-width="200" field="type" title="Type"></vxe-table-column>
          <vxe-table-column min-width="200" field="date" title="Date"></vxe-table-column>
          <vxe-table-column class="qwqw" min-width="200" field="role" title="Role" :edit-render="{}">
            <template slot="edit" slot-scope="{ row }">
              <vxe-input type="text" v-model="row.role"></vxe-input>
              <vxe-input type="date" v-model="row.date"></vxe-input>
              <!-- {{row.date}} -->
            </template>
            <template slot="default" slot-scope="{ row }">
              <span>{{row.role}}..{{row.date}}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column min-width="200" field="date1" title="Date" :filters="[{data: {vals: [], sVal: '', fMenu: '', f1Type:'', f1Val: '', fMode: 'and', f2Type: '', f2Val: ''}}]" :filter-render="{name: 'FilterExcel1'}"></vxe-table-column>
          <vxe-table-column min-width="200" field="date2" title="Date"></vxe-table-column>
          <vxe-table-column min-width="200" field="date3" title="Date"></vxe-table-column>
          <vxe-table-column min-width="200" field="date4" title="Date"></vxe-table-column>
          <vxe-table-column min-width="200" field="date5" title="Date"></vxe-table-column>
          <vxe-table-column min-width="200" title="操作" fixed="right">
            <template slot-scope="scope">
              <span v-if="!scope.row.text" @click="chakan(scope.row)">查看</span>
            </template>
          </vxe-table-column>
        </vxe-table>
        
      </div>
      <vxe-table
          border
          resizable
          :data="tableData1"
          :edit-config="{trigger: 'click', mode: 'cell'}">
          <vxe-column type="seq" width="60"></vxe-column>
          <vxe-column field="name" title="Name" :edit-render="{name: 'input', attrs: {type: 'input'}}"></vxe-column>
          <vxe-column field="nickname" title="Role" :edit-render="{}">
            <template slot="edit" slot-scope="{row}">
              <el-input type="textarea" v-model="row.nickname" autosize></el-input>
              <!-- <vxe-textarea v-model="row.nickname" placeholder="自适应文本高度" autosize></vxe-textarea> -->
            </template>
          </vxe-column>
          <vxe-column field="sex" title="Sex" :edit-render="{name: '$select', options: sexList}"></vxe-column>
          <vxe-column field="sex2" title="多选下拉" :edit-render="{name: '$select', options: sexList, props: {multiple: true}}"></vxe-column>
          <vxe-column field="num1" title="Amount" :edit-render="{name: '$input', props: {type: 'float', digits: 2}}"></vxe-column>
          <vxe-column field="date12" title="Date" :edit-render="{name: '$input', props: {type: 'date', placeholder: '请选择日期'}}"></vxe-column>
          <vxe-column field="date13" title="Week" :edit-render="{name: '$input', props: {type: 'week', placeholder: '请选择日期'}}"></vxe-column>
        </vxe-table>
  </div>
</template>

<script>
// import XEUtils from 'xe-utils'
// import VXETable from 'vxe-table'
import SelectTable from '../components/SelectTable.vue';
export default {
  components:{
    SelectTable
  },
  watch:{
    testValue(data){
      console.log('data',data);
      console.log('this.testValue',this.testValue);
    }
  },
  data(){
    return{
      tableColumn:[
        { field: "name", title: "姓名", width:"40%" },
        { field: "role", title: "角色", width:"30%" },
        { field: "sex", title: "性别",  },
      ],
      testValue:"",
      tableData: [
                { id: 1000, name: 'vxe-table 从入门到放弃1', type: 'mp3', size: 1024, date: '2020-08-01' },
                {
                  id: 1005,
                  name: 'Test2',
                  type: 'mp4',
                  size: null,
                  date: '2021-04-01',
                  children: [
                    { id: 24300, name: 'Test3', type: 'avi', size: 1024, date: '2020-03-01' },
                    { id: 20045, name: 'vxe-table 从入门到放弃4', type: 'html', size: 600, date: '2021-04-01' },
                    {
                      id: 10053,
                      name: 'vxe-table 从入门到放弃96',
                      type: 'avi',
                      size: null,
                      date: '2021-04-01',
                      children: [
                        { id: 24330, name: 'vxe-table 从入门到放弃5', type: 'txt', size: 25, date: '2021-10-01' },
                        { id: 21011, name: 'Test6', type: 'pdf', size: 512, date: '2020-01-01' },
                        { id: 22200, name: 'Test7', type: 'js', size: 1024, date: '2021-06-01' }
                      ]
                    }
                  ]
                },
                {
                  id: 23666,
                  name: 'Test23',
                  type: 'mp4',
                  size: null,
                  date: '2021-01-02',
                  children: [
                    {
                      id: 27666,
                      name: 'vxe-table 从入门到放弃96',
                      type: 'avi',
                      size: null,
                      date: '2021-08-04',
                      children: [
                        { id: 29330, name: 'vxe-table 从入门到放弃5', type: 'txt', size: 25, date: '2021-10-03' },
                        { id: 29331, name: 'Test33', type: 'pdf', size: 512, date: '2020-03-01' }
                      ]
                    }
                  ]
                },
                { id: 24555, name: 'vxe-table 从入门到放弃9', type: 'avi', size: 224, date: '2020-10-01' }
              ],
              tableData1: [
                { id: 10001, name: 'Test1', nickname: 'T1', role: 'Develop', sex: '0', sex2: ['0'], num1: 40, age: 28, address: 'Shenzhen', date12: '', date13: '' },
                { id: 10002, name: 'Test2', nickname: 'T2', role: 'Designer', sex: '1', sex2: ['0', '1'], num1: 44, age: 22, address: 'Guangzhou', date12: '', date13: '2020-08-20' },
                { id: 10003, name: 'Test3', nickname: 'T3', role: 'Test', sex: '0', sex2: ['1'], num1: 200, age: 32, address: 'Shanghai', date12: '2020-09-10', date13: '' },
                { id: 10004, name: 'Test4', nickname: 'T4', role: 'Designer', sex: '1', sex2: ['1'], num1: 30, age: 23, address: 'Shenzhen', date12: '', date13: '2020-12-04' },
                { id: 10005, name: 'Test5', nickname: 'T5', role: 'Develop', sex: '0', sex2: ['1', '0'], num1: 20, age: 30, address: 'Shanghai', date12: '2020-09-20', date13: '' },
                { id: 10006, name: 'Test6', nickname: 'T6', role: 'Designer', sex: '1', sex2: ['0'], num1: 10, age: 21, address: 'Shenzhen', date12: '', date13: '' },
                { id: 10007, name: 'Test7', nickname: 'T7', role: 'Develop', sex: '0', sex2: ['0'], num1: 5, age: 29, address: 'Shenzhen', date12: '2020-01-02', date13: '2020-09-20' },
                { id: 10008, name: 'Test8', nickname: 'T8', role: 'PM', sex: '1', sex2: ['0'], num1: 2, age: 35, address: 'Shenzhen', date12: '', date13: '' }
              ],
              sexList: [
                { label: '', value: '' },
                { label: '男', value: '1' },
                { label: '女', value: '0' }
              ]
            }
    
  },
  methods:{
    selectChangeEvent ({ records }) {
      console.info(`勾选${records.length}个树形节点`, records)
    },
    chakan(row){
      console.log(row);
    },
    getRow(row){
      console.log('row',row);
    }
  }
}
</script>

<style>

</style>