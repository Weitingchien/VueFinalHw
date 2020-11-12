<template>
  <div>
      <Navbar/>
      <Alert/>
    <div class="container-fluid">
      <div class="row">
           <Sidebar></Sidebar>
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4">
            <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Alert from './AlertMessage';

export default {
    components:{//因為html有<Navbar/>與<Sidebar/>，所以要輸出components給main.js知道那是組件
        Sidebar,
        Navbar,
        Alert
    },
    created() {
      const myCookie = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      this.$http.defaults.headers.common.Authorization = myCookie;
    },
};
</script>