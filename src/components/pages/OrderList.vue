<template>
  <div>
    <Loading :active.sync="isLoading"></Loading>
    <table class="table mt-4">
    <thead>
        <tr>
            <th>購買時間</th>
            <th>Email</th>
            <th>購買款項</th>
            <th>應付金額</th>
            <th>是否付款</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(item, key) in sortOrderList" :key="key" :class="{'text-secondary': !item.is_paid}">
            <td>{{ item.create_at | date }}</td>
            <td><span v-text="item.user.email" v-if="item.user"></span></td>
            <td>
                <ul class="list-unstyled">
                    <li v-for="(product, i) in item.products" :key="i">
                        {{ product.product.title }} 數量: {{ product.qty }}
                        {{ product.product.unit }}
                    </li>
                </ul>
            </td>
            <td>{{ item.total | currency }}</td>
            <td>
                <strong v-if="item.is_paid" class="text-success">已付款</strong>
                <span v-else class="text-muted">尚未啟用</span>
            </td>
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
            orderlist: {},
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
            console.log(response);
            vm.isLoading = false;
        });
      },  
    },
    computed: {
        sortOrderList() {
            const vm = this;
            let newOrderList = [];
            if(vm.orderlist.length) {
                newOrderList = vm.orderlist.sort((a, b) =>{
                    const aisPaid = a.is_paid ? 1 : 0;
                    const bisPaid = b.is_paid ? 1 : 0;
                    return bisPaid - aisPaid;
                });
            }
            return newOrderList;
        }
    },
    created() {
        this.getOrderList();
    },
};
</script>