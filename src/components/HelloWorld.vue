<template>
<div class="hello">
  <a href="#" @click.prevent="signout">登出</a>
</div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    signout () {
    const vm = this;
    const api= `${process.env.APIPATH}/logout`;
    this.$http.post(api).then((response) => {
      console.log(response.data);
        vm.$router.push('/login');
    });
 }
}}
</script>

<style lang="scss" scoped> /*樣式想封裝在特定元件內要用scoped */
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>