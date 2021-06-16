<style scoped>
    /* .expand-row{
        margin-bottom: 16px;
    } */
</style>
<template>
    <!-- <div>
        <Row class="expand-row">
            <Col span="24">
                <span class="expand-key">t: </span>
                <span class="expand-value">{{ row.title }}</span>
            </Col>
        </Row>
    </div> -->
    <Table style="width: 100%; font-size: 16px;"
             :columns="problemTableColumns"
             :data="this.problemList"
             disabled-hover></Table>
</template>
<script>
  import { mapGetters } from 'vuex'
  import api from '@oj/api'
  import utils from '@/utils/utils'
  import { RoadMixin } from '@oj/components/mixins'
  export default {
    name: 'ProblemList',
    mixins: [RoadMixin],
    props: {
        row: Object
    },
    data () {
      return {
        problemTableColumns: [
          {
            title: '#',
            key: '_id',
            width: 80,
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'large'
                },
                on: {
                  click: () => {
                    this.$router.push({name: 'road-details', params: {roadID: window.btoa(params.row._id)}})
                  }
                },
                style: {
                  padding: '2px 0'
                }
              }, params.row._id)
            }
          },
          {
            title: this.$i18n.t('m.Title'),
            width: 400,
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'large'
                },
                on: {
                  click: () => {
                    this.$router.push({name: 'road-details', params: {roadID: window.btoa(params.row._id)}})
                  }
                },
                style: {
                  padding: '2px 0',
                  overflowX: 'auto',
                  textAlign: 'left',
                  width: '100%'
                }
              }, params.row.title)
            }
          }
        ],
        problemList: [],
        limit: 100,
        routeName: '',
        query: {
          keyword: '',
          difficulty: '',
          tag: '',
          page: 1,
          limit: 100
        },
        loadings: {
          table: true,
          tag: true
        }
      }
    },
    mounted () {
        this.init()
    },
    methods: {
      init () {
        // console.log(this.row)
        this.routeName = this.$route.name
        let query = this.$route.query
        // console.log(this.row)
        this.query.tag = this.row.problemListTag
        this.query.difficulty = query.difficulty || ''
        this.query.keyword = query.keyword || ''
        this.getProblemList()
        // console.log(this.problemList)
      },
      pushRouter () {
        this.$router.push({
          name: 'road-list',
          query: utils.filterEmptyValue(this.query)
        })
      },
      getProblemList () {
        let offset = (this.query.page - 1) * this.query.limit
        this.loadings.table = true
        api.getProblemList(offset, this.limit, this.query).then(res => {
          this.loadings.table = false
          // this.total = res.data.data.total
        //   console.log(res)
          this.problemList = this.filterByAccpet(res.data.data.results)
          console.log(this.problemList)
          if (this.isAuthenticated) {
            this.addStatusColumn(this.problemTableColumns, this.problemList)
          }
        }, res => {
          this.loadings.table = false
        })
      },
      filterByAccpet (results) {
        var ans = []
        var preS = 0
        var endFlag = 0
        results.forEach(element => {
          if (element.my_status === 0 && endFlag === 0) {
            preS = element.my_status
            ans.push(element)
          }
          if (preS === 0 && element.my_status === null && endFlag === 0) {
            ans.push(element)
            endFlag = 1
          }
        })
        // console.log(ans)
        return ans
      }
    },
    computed: {
      ...mapGetters(['isAuthenticated'])
    },
    watch: {
      '$route' (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.init(true)
        }
      },
      'isAuthenticated' (newVal) {
        if (newVal === true) {
          this.init()
        }
      }
    }
  }
</script>

