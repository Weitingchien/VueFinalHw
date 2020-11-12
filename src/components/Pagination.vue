<template>
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{'disabled': !pageArr.has_pre }"><!--has_pre: false，預設值為false，但是要是true才會+上disabled-->
          <a class="page-link" href="#" aria-label="Previous"
            @click.prevent = "changePage(pageArr.current_page - 1)">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
      <li class="page-item" v-for="page in pageArr.total_pages" :key="page"
       :class="{'active': pageArr.current_page === page}">
        <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
      </li>
          <li class="page-item" :class="{'disabled': !pageArr.has_next }">
            <a class="page-link" href="#" aria-label="Next"
            @click.prevent = "changePage(pageArr.current_page + 1)">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
      </ul>
    </nav>
</template>

<script>
export default{
    name: 'Pagination',
    props: ['pageArr'],//接收Products.vue的pagination的陣列內容
    methods: {
        changePage(page) {
            this.$emit('emit', page);//傳送結果回Products.vue，再執行getProducts
        }
    },
}

</script>