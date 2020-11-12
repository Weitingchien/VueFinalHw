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
                <p>{{ item.products }} 數量: {{ item.products.qty }}</p>
            </td>
            <td class="text-right">{{ item.total }}</td>
            <td class="text-right"></td>
        </tr>
    </tbody>
    </table>
    </div>
</template>


<script>
export default {
    data() {
        return {
            orderlist: [],
            isLoading: false,
        }
    },
    methods: {
      getOrderList(page = 1) {
        const vm = this;
        const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/orders?page=${page}`;
        vm.isLoading = true;
        this.$http.get(url).then((response) => {
            console.log(response.data);
            vm.orderlist = response.data.orders;
            vm.isLoading = false;
        });
      },  
    },
    created() {
        this.getOrderList();
    },
}
</script>