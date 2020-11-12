<template>
  <div id="app">
    <router-view/><!--router-view是呈現router/index.js裡面的元件，App.vue則是網站的首頁-->
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style lang="scss">
@import "./assets/all";
</style>
