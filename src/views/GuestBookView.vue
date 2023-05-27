<template>
  <div>
    <h1>Guestbook View</h1>
    <el-card>
      <el-form>
        <el-form-item label="Message">
          <el-input type="textarea" v-model="message"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">저장</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-for="(entry, index) in this.displayedEntries" :key="index">
      <h3>{{ entry.name }}</h3>
      <p>{{ entry.message }}</p>
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
export default {
  data() {
    return {
      name: '',
      message: '',
      guestbookEntries: [],
      currentPage: 1,
      pageSize: 5
    };
  },
  computed: {
    displayedEntries() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.guestbookEntries.slice(startIndex, endIndex);
    }
  },
  methods: {
    submit() {
      // Handle form submission here
      const newEntry = {
        name: this.name,
        message: this.message
      };
      this.guestbookEntries.push(newEntry);
      this.name = '';
      this.message = '';
    },
    deleteEntry(index) {
      this.guestbookEntries.splice(index, 1);
    },
    handlePageChange(page) {
      this.currentPage = page;
    }
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
