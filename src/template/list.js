module.exports = 
`<template>
  <div class="">
    <ly-table
      ref="lyTable"
      :data="tableData"
      :option="tableOpt"
      :table-loading="loading"
      :page="page"
      :page-size="per_page"
      :total="total"
      @searchChange="searchChange"
      @sizeChange="handleSizeChange"
      @sortChange="handleSortChange"
      @currentChange="handleCurrentChange"
      @selectionChange="handleSelectionChange"
    >
      <!-- 功能区插槽 -->
      <template #handler>
        <el-button type="primary">新增</el-button>
      </template>
      <!-- 列插槽 -->
      <template #="{ row }">
        
      </template>
      <!-- 操作列插槽 -->
      <template #operation="{ row }">
        <el-button type="text" size="small">删除</el-button>
      </template>
    </ly-table>
  </div>
</template>
<script>
import lyTable from '@/components/mixins/ly-table.js'
import { listApi } from './http.js'
export default {
  mixins: [lyTable],
  data () {
    return {
      COMM_HTTP: listApi
    }
  },
  computed: {
    tableOpt () {
      return {
        column: [
          {
            label: '',
            prop: ''
          }
        ]
      }
    }
  },
  mounted () {
    
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>

</style>
`