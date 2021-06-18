<style scoped>

</style>
<template>
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
        routeName: '',
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
        // console.log('row is :')
        // console.log(this.row)
        this.routeName = this.$route.name
        this.getProblemList()
      },
      getProblemList () {
          this.problemList = this.row.data
        //   console.log(this.problemList)
          if (this.isAuthenticated) {
            this.addStatusColumn(this.problemTableColumns, this.problemList)
          }
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