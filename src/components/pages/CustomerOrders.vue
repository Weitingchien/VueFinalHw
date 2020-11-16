<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
          <div
            style="height: 150px; background-size: cover; background-position: center"
            :style="{ backgroundImage: `url(${item.imageUrl})` }"
          ></div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{
              item.category
            }}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{ item.title }}</a>
            </h5>
            <p class="card-text">{{ item.content }}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h5" v-if="!item.price">
                {{ item.origin_price }} 元
              </div>
              <!--顯示僅有原價的-->
              <del class="h6" v-if="item.price"
                >原價 {{ item.origin_price }} 元</del
              ><!--顯示僅有原價+優惠價-->
              <div class="h5" v-if="item.price">
                現在只要 {{ item.price }} 元
              </div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              @click.prevent="getProduct(item.id)"
            >
              <font-awesome-icon
                icon="spinner"
                spin
                v-if="status.loadingItem === item.id"
              />
              查看更多
            </button>
            <button
              type="button"
              class="btn btn-outline-danger btn-sm ml-auto"
              @click.prevent="addtoCart(item.id)"
            >
              <font-awesome-icon
                icon="spinner"
                spin
                v-if="status.loadingItem === item.id"
              />
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <table class="table">
      <thead>
        <th></th>
        <th>品名</th>
        <th>數量</th>
        <th>單價</th>
      </thead>
      <tbody>
        <tr v-for="list in customercart.carts" :key="list.id">
          <td class="align-middle">
            <button type="button" class="btn btn-outline-danger btn-sm">
              <font-awesome-icon
                icon="trash-alt"
                @click.prevent="removeCartItem(list.id)"
              />
            </button>
          </td>
          <td class="align-middle">
            {{ list.product.title }}
            <div class="text-success" v-if="list.coupon">
              已套用優惠券
            </div>
          </td>
          <td class="align-middle">{{ list.qty }}/{{ list.product.unit }}</td>
          <td class="align-middle text-right">{{ list.final_total }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" class="text-right">總計</td>
          <td class="text-right">{{ customercart.total }}</td>
        </tr>
        <tr v-if="customercart.total !== customercart.final_total">
          <td colspan="3" class="text-right text-success">折扣價</td>
          <td class="text-right text-success">
            {{ customercart.final_total }}
          </td>
        </tr>
      </tfoot>
    </table>
    <div class="input-group mb-3 input-group-sm">
      <input
        type="text"
        class="form-control"
        v-model="coupon_code"
        placeholder="請輸入優惠碼"
      />
      <div class="input-group-append">
        <button
          class="btn btn-outline-secondary"
          type="button"
          @click="addCouponCode"
        >
          套用優惠碼
        </button>
      </div>
    </div>
<div class="my-5 row justify-content-center">
  <!-- validation-observer 驗證整體表單 -->
  <validation-observer class="col-md-6" v-slot="{ invalid }">
<form @submit.prevent="creteOrder">
    <!--v-slot 稱為插槽，可把外部元件的data傳到裡面slot的內容、此input規則為required:必填欄位、email:格式為Email，可加入多個驗證規則-->
    <validation-provider rules="required|email" v-slot="{ errors, classes }">
  <div class="form-group">
      <label for="email">Email</label>
      <input type="text" class="form-control"  id="email" required v-model="form.user.email" :class="classes">
        <!-- 錯誤訊息 -->
      <span class="invalid-feedback">{{ errors[0] }}</span><!--invalid-feedback為bootstrap的錯誤訊息回饋-->
  </div>
    </validation-provider>

    <validation-provider rules="required" v-slot="{ errors, classes }">
  <div class="form-group">
      <label for="name">收件人姓名</label>
      <input type="text" class="form-control" id="name" required v-model="form.user.name" :class="classes">
      <span class="invalid-feedback">{{ errors[0] }}</span>
  </div>
    </validation-provider>

    <validation-provider rules="required|numeric|min:10" v-slot="{ errors, classes }">
  <div class="form-group">
      <label for="telephone">收件人電話</label>
      <input type="text" class="form-control" id="telephone" required v-model="form.user.tel" :class="classes">
      <span class="invalid-feedback">{{ errors[0] }}</span>
  </div>
      </validation-provider>

    <validation-provider rules="required|min:9|max:30" v-slot="{ errors, classes }">
  <div class="form-group">
      <label for="Address">收件人地址</label>
      <input type="text" class="form-control" id="Address" required v-model="form.user.address" :class="classes">
      <span class="invalid-feedback">{{ errors[0] }}</span>
  </div>
      </validation-provider>

  <div class="form-group">
    <label for="exampleFormControlTextarea1">留言</label>
    <textarea class="form-control" id="FormControlTextarea1" col="30" rows="10" v-model="form.message"></textarea>
</div>
  <div class="text-right">
    <button class="btn btn-danger" @click="creteOrder" :disabled="invalid">送出訂單</button><!--沒有驗證成功的情況下，表單的按鈕無法按-->
  </div>
</form>
</validation-observer>
</div>
    <!-- modal -->
    <div class="modal" tabindex="-1" role="dialog" id="productModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ product.title }}</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="product.imageUrl" class="img-fluid" alt />
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{ product.content }}</p>
              <footer class="blockquote-footer text-right">
                {{ product.description }}
              </footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h5" v-if="!product.price">
                {{ product.origin_price }} 元
              </div>
              <del class="h6" v-if="product.price"
                >原價 {{ product.origin_price }} 元</del
              >
              <div class="h5" v-if="product.price">
                現在只要 {{ product.price }} 元
              </div>
            </div>
            <select name class="form-control mt-3" v-model="product.num">
              <option :value="num" v-for="num in 10" :key="num">
                選購 {{ num }} {{ product.unit }}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計
              <strong>{{ product.num * product.price }}</strong> 元
            </div>
            <button
              type="button"
              class="btn btn-primary"
              @click="addtoCart(product.id, product.num)"
            >
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      products: [],
      product: {},
      customercart: [],
      status: {
        loadingItem: ""
      },
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: ''
        },
        message: ''
      },
      isLoading: false,
      coupon_code: ""
    };
  },
  methods: {
    getProducts() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products/?page=:page`; //取得商品列表API
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        vm.products = response.data.products;
        console.log(response);
        vm.isLoading = false;
      });
    },
    getProduct(id) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`; //單一商品細節API
      vm.status.loadingItem = id;
      this.$http.get(api).then(response => {
        vm.product = response.data.product;
        $("#productModal").modal("show");
        console.log(response);
        vm.status.loadingItem = "";
      });
    },
    addtoCart(id, qty = 1) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`; //加入購物車API
      vm.status.loadingItem = id;
      const cart = {
        //定義資料結構
        product_id: id,
        qty
      };
      this.$http.post(api, { data: cart }).then(response => {
        console.log(response);
        vm.status.loadingItem = "";
        vm.getCart();
        $("#productModal").modal("hide");
      });
    },
    getCart() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        vm.customercart = response.data.data;
        console.log(vm.customercart, response.data.data.carts);
        vm.isLoading = false;
      });
    },
    removeCartItem(id) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
      vm.isLoading = true;
      this.$http.delete(api).then(() => {
        vm.getCart();
        vm.isLoading = false;
      });
    },
    addCouponCode() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
      const coupon = {
        code: vm.coupon_code
      };
      vm.isLoading = true;
      this.$http.post(api, { data: coupon }).then(response => {
        console.log(response);
        vm.getCart();
        vm.isLoading = false;
      });
    },
    creteOrder() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`;
      const order = vm.form;
      //vm.isLoading = true;
          this.$http.post(api, { data: order }).then(response => {
          console.log('訂單已建立',response);
          vm.isLoading = false;
       });
    },
  },
  created() {
    this.getProducts();
    this.getCart();
  }
};
</script>
