<template>
  <div style="margin-top: 50px">
    <el-table :data="resultAllList" style="width: 100%">
      <el-table-column prop="name" label="User"></el-table-column>
      <el-table-column prop="item_list" label="입력 항목"></el-table-column>
      <el-table-column prop="item_result" label="룰렛 결과"></el-table-column>
      <el-table-column prop="start_date" label="시작 시간"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
    props : {
        resultAllList : Object
    },
}
</script>

<style scoped>
 table {
    width: 100%;
    border: 1px solid #444444;
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid #444444;
    padding: 10px;
  }
</style>
