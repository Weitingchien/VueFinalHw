<template>
    <div>
      <loading :active.sync="isLoading"></loading>
    <div class="text-right mt-4">
        <button class="btn btn-primary" @click="openModal(true)">建立新的產品</button>
    </div>
    <table class="table mt-4">
    <thead>
        <tr>
            <th width="120">分類</th>
            <th>產品名稱</th>
            <th width="120">原價</th>
            <th width="120">售價</th>
            <th width="100">是否啟用</th>
            <th width="80">編輯</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(item) in products" :key="item.id">
            <td>{{ item.category }}</td>
            <td>{{ item.title }}</td>
            <td class="text-right">
                {{ item.origin_price | currency }}
            </td>
            <td class="text-right">
                {{ item.price | currency }}
            </td>
            <td class="text-right">
                <span v-if="item.is_enabled" class="text-success">啟用</span>
                <span v-else>未啟用</span>
            </td>
            <td>
                <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">編輯</button>
                <button class="btn btn-sm deleteModal" @click.prevent="opendeleteModal(item)">刪除</button>
            </td>
        </tr>
    </tbody>
    </table>
    <!--分頁-->
    <Page :pageArr="pagination" @emit="getProducts"></Page>
    <!-- Modal -->
<div class="modal fade" id="productModal" tabindex="-1" role="dialog"
  aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 class="modal-title" id="exampleModalLabel">
          <span>新增產品</span>
        </h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-4">
            <div class="form-group">
              <label for="image">輸入圖片網址</label>
              <input type="text" class="form-control" id="image"
                placeholder="請輸入圖片連結" v-model="tempProduct.imageUrl">
            </div>
            <div class="form-group">
              <label for="customFile">或 上傳圖片
                <font-awesome-icon icon="spinner" spin v-if="status.fileUploading"/>
              </label>
              <input type="file" id="customFile" class="form-control"
                ref="files" @change="uploadFile">
            </div>
            <img img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
              class="img-fluid" alt="#" :src="tempProduct.imageUrl">
          </div>
          <div class="col-sm-8">
            <div class="form-group">
              <label for="title">標題</label>
              <input type="text" class="form-control" id="title"
                placeholder="請輸入標題" v-model="tempProduct.title">
            </div>

            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="category">分類</label>
                <input type="text" class="form-control" id="category"
                  placeholder="請輸入分類" v-model="tempProduct.category">
              </div>
              <div class="form-group col-md-6">
                <label for="price">單位</label>
                <input type="unit" class="form-control" id="unit"
                  placeholder="請輸入單位" v-model="tempProduct.unit">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-md-6">
              <label for="origin_price">原價</label>
                <input type="number" class="form-control" id="origin_price"
                  placeholder="請輸入原價" v-model="tempProduct.origin_price">
              </div>
              <div class="form-group col-md-6">
                <label for="price">售價</label>
                <input type="number" class="form-control" id="price"
                  placeholder="請輸入售價" v-model="tempProduct.price">
              </div>
            </div>
            <hr>

            <div class="form-group">
              <label for="description">產品描述</label>
              <textarea type="text" class="form-control" id="description"
                placeholder="請輸入產品描述" v-model="tempProduct.description"></textarea>
            </div>
            <div class="form-group">
              <label for="content">說明內容</label>
              <textarea type="text" class="form-control" id="content"
                placeholder="請輸入產品說明內容" v-model="tempProduct.content"></textarea>
            </div>
            <div class="form-group">
              <div class="form-check">
                <input class="form-check-input" type="checkbox"
                  id="is_enabled" v-model="tempProduct.is_enabled" :true-value="1" :false-value="0">
                <label class="form-check-label" for="is_enabled">
                  是否啟用
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
        <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
  aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content border-0">
      <div class="modal-header bg-danger text-white">
        <h5 class="modal-title" id="exampleModalLabel">
          <span>刪除產品</span>
        </h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" id="repeatdelete">
        是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary btncancel" data-dismiss="modal">取消</button>
        <button type="button" class="btn btn-danger" data-dismiss="modal" @click="repeatdeleteModal">確認刪除</button>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script>
import $ from 'jquery';//如果有使用到jQuery語法卻沒使用jQuery的引入，電腦自然無法判斷$字號是什麼意思，因此需要添加jQuery的引入。
//(全域註冊的方法，需要在main.js添加以下程式碼)
//import jquery from 'jquery';
// 將 jQuey 以 $ 字號方式，掛載到 window 下
//window.$ = jquery;
import Page from '../Pagination';
export default {
    data() {
        return {
            products: [],
            tempProduct: {},//新增一個物件用來取得使用者填的各個欄位的資料
            isNew: false,
            rem: false,
            isLoading: false,
            pagination: {},
            status:{
              fileUploading: false,
            }
        };
    },
    components: {
      Page
    },
    methods: {
        getProducts(page = 1) {//這邊使用ES6參數預設值處理 ，假設沒帶數值會使用第一頁 
            const api= `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/products?page=${page}`;//'http://vue-course-api.hexschool.io/api/ting384839/products';
            const vm = this;
            console.log(process.env.APIPATH, process.env.CUSTOMPATH);
            vm.isLoading = true;
            this.$http.get(api).then((response) => {
            console.log(response.data);
            vm.isLoading = false;
            vm.products = response.data.products;
            vm.pagination = response.data.pagination;
        });
      },
      openModal(isNew, item) {
          if (isNew) {//按下建立新的產品按鈕時，觸發if(isNew)等同(isNew== true)
              this.tempProduct = {};//把欄位清空，以免裡面存留上次編輯時的資料內容
              this.isNew = true;//區分編輯與新增內容時的狀態，目的是要用來切換$http[httpMethod]的狀態是(商品建立)的post還是(修改產品)的put
          } else {
              this.tempProduct = Object.assign({}, item);
              //編輯產品時，因為都是指向temProduct這個空物件，又因每次所選的編輯產品都不同，所以要使用Object.assign，再建立一個空物件，並將item加進這個空物件來避免傳參考的特性
              this.isNew = false;
          }
          $('#productModal').modal('show');//打開模板
      },
      opendeleteModal(item) {//item為目前點選的產品資料
          $(document).on('click' ,'.deleteModal', function (){//在第一次點擊之後，dom沒有重新加載的解決辦法
              $(this).addClass('btndelete');//幫刪除按鈕新增一個class="btndelete"
          });
          $('#delProductModal').modal('show');
          this.tempProduct = item;//暫存的產品欄位的值
      },
      repeatdeleteModal(){
          const vm = this;
          $('#repeatdelete').modal('show');
           if(!vm.rem){
                let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;//vm.tempProduct.id目前點選產品資料的id
                let httpMethod = 'delete';
                this.$http[httpMethod](api).then((response) => {
                    console.log(response.data);
                    if(response.data.success){//如果刪除成功
                        $('#delProductModal').modal('hide');
                        $('.modal-backdrop').addClass('modal-hide');//新增一個modal-hide的class，讓點擊刪除後出現灰色的畫面隱藏
                        vm.getProducts();
                    }else {
                        $('#delProductModal').modal('hide');
                        vm.getProducts();
                        console.log('刪除失敗');
                    }
                });
            }
      },
      updateProduct () {
            //(商品建立-post)
            let api= `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product`;
            let httpMethod = 'post';
            const vm = this;
            //(修改產品-put)
            if(!vm.isNew){//!代表否定的意思(等同於vm.isNew = false狀態下)
                api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
                httpMethod = 'put';
           }
            console.log(process.env.APIPATH, process.env.CUSTOMPATH);
            this.$http[httpMethod](api, { data: vm.tempProduct }).then((response) => {
            console.log(response.data);
            if (response.data.success) {//如果新增成功
                $('#productModal').modal('hide');
                vm.getProducts();//重新取得遠端資料
            }else {
                $('#productModal').modal('hide');
                vm.getProducts();
                console.log('新增失敗');
            }
            //vm.products = response.data.products;
        });
      },
      uploadFile(){//透過@change觸發uploadFile這個函式，並把資料傳送到後端
        const uploadedFile = this.$refs.files.files[0];//取得圖片路徑
        const id = this.$refs.files.id;//取得input id
        const vm = this;
        const formData = new FormData();//使用FormData建立一個表單，<from></form>對應這行
        formData.append('file-to-upload', uploadedFile);//使用append將欄位新增進去，'file-to-upload'對應<input type="file" name="file-to-upload">
        const url=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/upload`;
        vm.status.fileUploading = true;
        this.$http.post(url, formData,{
          headers:{//請求頭部，如果要設定不同的提交方法，在這邊設定(這段發送是使用表單格式，而不是JSON，行為上是後端決定的)
            'Content-Type': 'multipart/form-data'//Content-type是用來設定不同的提交方式
          }
        }).then((response) => {
          console.log(response.data);
          vm.status.fileUploading = false;
          if (response.data.success) {
            // vm.tempProduct.imageUrl = response.data.imageUrl;
            vm.$set(vm.tempProduct, 'imageUrl', response.data.imageUrl);//使用set將imageUrl這個欄位強制寫入在vm.tempProduct，因為imageUrl並沒包含getter和seter(也就是沒有雙向綁定)
            document.getElementById(id).value = '';//圖片上傳成功時清空這個input
          } else{
            this.$bus.$emit('message:push', response.data.message, 'danger');
          }
        });
      },
   },
   created() {
       this.getProducts();
   },
};

</script>
