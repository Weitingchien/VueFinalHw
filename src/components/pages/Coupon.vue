<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="text-right mt-4">
        <button class="btn btn-primary" @click="openModal(true)">建立新的優惠券</button>
    </div>
    <table class="table mt-4">
    <thead>
        <tr>
            <th width="120">名稱</th>
            <th>折扣百分比</th>
            <th width="120">到期日</th>
            <th width="120">是否啟用</th>
            <th width="100">編輯</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(item, key) in couponGet" :key="key">
            <td>{{ item.title }}</td>
            <td>{{ item.percent }}%</td>
            <td>{{ item.due_date }}</td>
            <td>
                <span class="text-success" v-if="item.is_enabled === 1">啟用</span>
                <span class="text-muted" v-else >未啟用</span>
            </td>
            <td>
                <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">編輯</button>
                <button class="btn btn-sm deleteModal" @click="deleteCoupon(item.id)">刪除</button>
            </td>
        </tr>
    </tbody>
    </table>
    <!--分頁-->
    <Page :pageArr="pagination" @emit="getCoupon"></Page>
<!-- Modal -->
<div class="modal" id="productModal" tabindex="-1" role="dialog"
  aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content border-0">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">
          <span>新增優惠券</span>
        </h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row justify-content-center">
          <div class="col">
            <div class="form-group">
              <label for="title">標題</label>
              <input type="text" class="form-control" id="title"
                placeholder="請輸入標題" v-model="couponAdminProduct.title">
            </div>
              <div class="form-group">
                <label for="category">優惠碼</label>
                <input type="text" class="form-control" id="category"
                  placeholder="請輸入優惠碼" v-model="couponAdminProduct.code">
              </div>
              <div class="form-group">
                <label for="unit">到期日</label>
                <input type="date" class="form-control" id="unit"
                  placeholder="請輸入到期日，例如:2020/11/13" v-model="couponAdminProduct.due_date">
              </div>
              <div class="form-group">
              <label for="origin_price">折扣百分比</label>
                <input type="number" class="form-control" id="origin_price"
                  placeholder="請輸入折扣百分比" v-model="couponAdminProduct.percent">
              </div>
            <hr>
            <div class="form-group">
              <div class="form-check">
                <input class="form-check-input" type="checkbox"
                  id="is_enabled" v-model="couponAdminProduct.is_enabled" :true-value="1" :false-value="0">
                <label class="form-check-label" for="is_enabled">
                  是否啟用
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" @click="updateCoupon">確認</button>
      </div>
    </div>
  </div>
</div>
  </div>
</template>

<script>
import $ from 'jquery';
import Page from '../Pagination';

export default {
    data() {
        return {
            isLoading: false,
            isNew: false,
            pagination: {},
            couponGet: {},
            couponAdminProduct: {
                title: '',
                is_enabled: 0,
                percent: 100,
                due_date: 0,
                code: '',
            },
        }
    },
    components: {
        Page
    },
    methods: {
        getCoupon(page = 1) {//取得優惠券列表
            const vm = this;
            vm.isLoading = true;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`;
            this.$http.get(api).then((response) => {
                vm.couponGet = response.data.coupons;
                vm.pagination = response.data.pagination;
                console.log(response);
                vm.isLoading = false;
            })
        },
        openModal(isNew, item) {//打開模板
            if(isNew){
                this.couponAdminProduct = {};//建立優惠券時清空輸入欄位
                this.isNew = true;
            }else{
                this.couponAdminProduct = Object.assign({}, item);//編輯時避免傳參考
                this.isNew = false;
            }
            $('#productModal').modal('show');
        },
        updateCoupon() {//建立優惠券與修改優惠券
            const vm = this;
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
            let httpMethod = 'post';
            if(!vm.isNew){
                httpMethod = 'put';
                api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.couponAdminProduct.id}`;
            }
                this.$http[httpMethod](api, { data: vm.couponAdminProduct }).then((response) =>{
                $('#productModal').modal('hide');
                 vm.getCoupon();
            });
        },
        deleteCoupon(id) {//刪除優惠券
            const vm = this;
            vm.isLoading = true;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${id}`;
            this.$http.delete(api).then((response) => {
                vm.getCoupon();
                vm.isLoading = false;
            });
        },
    },
    created() {
        this.getCoupon();
    },

}
</script>