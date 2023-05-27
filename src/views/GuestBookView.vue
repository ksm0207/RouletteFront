<template>
  <div>
    <h1>Guestbook View</h1>
    <el-card>
      <el-form>
        <el-form-item label="Message">
          <el-input type="textarea" v-model="message"></el-input>
        </el-form-item>

        <el-form-item label="비밀번호">
          <el-input type="password"
                    size="small"
                    :style="{ width: '50px', margin: '0 10px' }"
                    v-model="passwd">
          </el-input>

          <el-checkbox v-model="secretYn" style="margin-left: 10px;">공개여부</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submit">저장</el-button>
        </el-form-item>


      </el-form>
    </el-card>
    <el-card v-for="(item, index) in this.displayedEntries" :key="index">
      <p>{{ item.message }}</p>
      <p>
        Likes: {{item.like_count}}
        <el-icon name="el-icon-like" v-for="n in item.like_count" :key="n"></el-icon>
      </p> <!-- Display the likes as icons -->
      <el-button type="danger" @click="deleteEntry(index)">Delete</el-button>
    </el-card>
    <el-pagination
      layout="prev, pager, next"
      :total="guestbookEntries.length"
      :page-size="pageSize"
      @current-change="handlePageChange"
    ></el-pagination>
  </div>
</template>

<script>

import axios from 'axios'
export default {

  data() {
    return {
      isViewOn : true,  // 화면진입 Y
      message: null,    // Msg
      passwd : null,    // Pwd
      secretYn : false, // 방명록 공개여부
      likes : null,     // 좋아요 수
      guestbookEntries: [], // 방명록 리스트
      currentPage: 1,       // 현재페이지 1
      pageSize: 5           // 페이지 수
    };
  },
  computed: {
    displayedEntries() {
      const startIndex = (this.currentPage - 1) * this.pageSize; // 시작Index
      const endIndex = startIndex + this.pageSize;               // 마지막 Index
      return this.guestbookEntries.slice(startIndex, endIndex);  // 시작 / 마지막
    }
  },
  methods: {
    // 저장하기
    async submit() {
      // 서버 전송용 데이터 세팅
      const newGuestBookData = {
        'message': this.message,
        'passwd' : this.passwd,
        'secretYn' : this.secretYn
      };
      await axios.post('/guestBook/submit',newGuestBookData)
        .then(response => {
          if(response.status === 200 )
            this.currentViewOnCheck()
        })
        .catch(error =>{

      })

      this.name = '';
      this.message = '';
    },
    // 삭제하기 (미구현)
    deleteEntry(index) {
      this.guestbookEntries.splice(index, 1);
    },
    // 페이징네이션
    handlePageChange(page) {
      this.currentPage = page;
    },
    // 전체리스트 가져오기
    async currentViewOnCheck() {
      await axios.post('/guestBook/getGuestBookAllList')
        .then(response =>{
          this.guestbookEntries = response.data;
        })
        .catch(error =>{
          console.log("/guestBook/getGuestBookAllList Error" , error)
        })
    }
  },
  mounted() {
    this.currentViewOnCheck()
  }
}
</script>

<style scoped>


.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
