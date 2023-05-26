<template>
    <div style="margin-top:50px">
        <table v-for="item in resultAllList">
            <thead>
                <tr>
                    <th>사용자</th>
                    <th>입력 항목</th>
                    <th>룰렛 결과</th>
                    <th>시작 시간</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>{{item.name}}</td>
                    <td>{{item.item_list}}</td>
                    <td>{{item.item_result}}</td>
                    <td>{{item.start_date}}</td>
                </tr>
            </tbody>
        </table>
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