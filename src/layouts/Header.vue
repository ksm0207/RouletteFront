<template>
  <div class="wrapper">
    <el-header>
      <div class="flex-grow" />
      <el-menu class="el-menu-demo" :default-active="$route.path" mode="horizontal">
        <el-menu-item index="/" route="Home">
          <router-link to="/">Home</router-link>
        </el-menu-item>
        <el-menu-item index="/guestBook">
          <router-link to="/guestBook">Guest Book</router-link>
        </el-menu-item>
      </el-menu>
      <div class="flex-grow" />
    </el-header>
  </div>
</template>

<script>
export default {
  name: 'Layout'
}
</script>
