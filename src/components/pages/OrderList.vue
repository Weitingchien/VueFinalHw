<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <table class="table mt-4">
    <thead>
        <tr>
            <th width="120">購買時間</th>
            <th>Email</th>
            <th width="120">購買款項</th>
            <th width="120">應付金額</th>
            <th width="100">是否付款</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for=" (item, key) in orderlist" :key="key">
            <td>{{ item.create_at | date }}</td>
            <td>{{ item.user.email }}</td>
            <td class="text-right">
                <ul class="list-unstyled">
                    <li v-for="{product, i} in item.products" :key="i">
                        {{ product.product.title }} 數量: {{ product.qty }}
                        {{ product.product.unit }}
                    </li>
                </ul>
            </td>
            <td>{{ item.total | currency }}</td>
            <td></td>
        </tr>
    </tbody>
    </table>
    <Page :pageArr="pagination" @emit="getOrderList"></Page>
   </div>
</template>


<script>
import Page from '../Pagination';

export default {
    data() {
        return {
            orderlist: [],
            pagination: {},
            isLoading: false,
        }
    },
    components: {
        Page,
    },
    methods: {
      getOrderList(page = 1) {
        const vm = this;
        const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/orders?page=${page}`;
        vm.isLoading = true;
        this.$http.get(api).then((response) => {
            console.log(response.data.orders);
            vm.orderlist = response.data.orders;
            vm.pagination = response.data.pagination;
            console.log(vm.pagination);
            vm.isLoading = false;
        });
      },  
    },
    created() {
        this.getOrderList();
    },
}
</script>