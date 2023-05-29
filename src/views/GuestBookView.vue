<template>
  <div>
    <h1>Guestbook View</h1>
    <el-card>
      <el-form>
        <el-form-item label="Message">
          <el-input type="textarea" v-model="message"></el-input>
        </el-form-item>

        <el-row>
          <el-col :span="6" v-if="secretYn">
            <el-form-item label="Password">
              <el-input
                type="password"
                size="small"
                :style="{ width: '200px', margin: '0 10px' }"
                v-model="passwd"
              ></el-input>
            </el-form-item>
          </el-col>
            <el-checkbox v-model="secretYn" style="margin-left: 1px;">비공개</el-checkbox>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="submit">저장</el-button>
        </el-form-item>

      </el-form>
    </el-card>
    <el-card v-for="(item, index) in this.displayedEntries" :key="index">
      <p class="isSecretText" v-if="item.secretYn === 'true'" @click="isSecretItem(item)">
        비밀 글 입니다
      </p>
      <p v-else>
        {{ item.message }}
      </p>
      <p><i class="fa fa-thumbs-up"></i> {{item.like_count}}</p>
      <div class="entry-info">
        <el-button type="danger" @click="deleteEntry(index)">Delete</el-button>
        <p class="created-time">작성시간 : {{ item.insert_date }}</p>
      </div>
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
import Swal from 'sweetalert2'


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
      pageSize: 3,           // 페이지 수
      currentSecretItem : null, // 현재 비밀글 처리중인 아이템
      modalVisible : false, // Modal 표시 여부
      secretPasswd : null,   // 비밀 글 입력번호,
      secretData : null,
      isCheck : false
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
          if(response.status === 200 ){
            this.currentViewOnCheck()
            this.passwd = null
            this.secretYn = false
          }
        })
        .catch(error =>{

      })

      this.name = '';
      this.message = '';
    },
    // 삭제하기 (미구현)
    deleteEntry(index) {
      if(this.isCheck) {
        this.guestbookEntries.splice(index, 1);
      }
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
    },
    // 비밀 글 Modal 처리
    isSecretItem (item) {
      this.currentSecretItem = item.guest_seq;
      Swal.fire({
        title : '비밀번호 확인',
        input : 'password',
        inputAttributes : {autocapitalize : 'off'},
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText : '취소',
        showLoaderOnConfirm: true,
        preConfirm : async (data) => {

          const passwd = data
          const secretIndex = this.currentSecretItem
          const getSecretGuestBook = {
            'passwd'    : passwd,
            'guest_seq' : secretIndex
          }
          try {
            await axios.post('/guestBook/secretGuestBook' , getSecretGuestBook)
              .then(response =>{

                if(response.data !== '') {
                  Swal.fire({title : '비밀번호 검증성공 '})
                  this.secretData = response.data
                  console.log("검증결과 : " , this.secretData)
                  this.isCheck = true;

                  this.changeEntry(this.secretData.guest_seq);
                }else{
                  Swal.fire({title : '비밀번호 검증실패 '})
                }
              })
              .catch(error =>{
                console.log("비밀번호 찾기 API 에러: ", error);
              })
          }catch (error){
            throw new Error('서버요청 에러')
          }
        }
      // }).then(result =>{
      //   console.log("비밀번호 검증완료" , result.value , this.secretData.passwd)
      })
    },
    changeEntry (seq) {
      const entry = this.guestbookEntries.find(e => e.guest_seq == seq);
      if(entry) {
        entry.secretYn = false;
      }
    }


  },
  mounted() {
    this.currentViewOnCheck()
  },
  watch : {
    secretYn () {
      console.log("secretYn " , this.secretYn)
    }
  }
}
</script>

<style scoped>

.isSecretText {
  text-align: center;
  cursor: pointer;
}

.entry-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

.created-time {
  margin-left: 10px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
