<template>
  <Row type="flex" :gutter="18">
    <Col :span=24>
    <Panel shadow>
      <div slot="title">{{$t('成长之路')}}</div>
      <!--<div slot="extra">
         <ul class="filter">
          <li>
            <Dropdown @on-click="filterByDifficulty">
              <span>{{query.difficulty === '' ? this.$i18n.t('m.Difficulty') : this.$i18n.t('m.' + query.difficulty)}}
                <Icon type="arrow-down-b"></Icon>
              </span>
              <Dropdown-menu slot="list">
                <Dropdown-item name="">{{$t('m.All')}}</Dropdown-item>
                <Dropdown-item name="Low">{{$t('m.Low')}}</Dropdown-item>
                <Dropdown-item name="Mid" >{{$t('m.Mid')}}</Dropdown-item>
                <Dropdown-item name="High">{{$t('m.High')}}</Dropdown-item>
              </Dropdown-menu>
            </Dropdown>
          </li>
          <li>
            <i-switch size="large" @on-change="handleTagsVisible">
              <span slot="open">{{$t('m.Tags')}}</span>
              <span slot="close">{{$t('m.Tags')}}</span>
            </i-switch>
          </li>
          <li>
            <Input v-model="query.keyword"
                   @on-enter="filterByKeyword"
                   @on-click="filterByKeyword"
                   placeholder="keyword"
                   icon="ios-search-strong"/>
          </li>
          <li>
            <Button type="info" @click="onReset">
              <Icon type="refresh"></Icon>
              {{$t('m.Reset')}}
            </Button>
          </li>
        </ul> 
      </div>-->

      <Table style="width: 100%; font-size: 16px;"
             :columns="problemTableColumns"
             :data="problemList"
             :loading="loadings.table"
             disabled-hover></Table>
        
    </Panel>
    <!-- <Pagination
      :total="total" :page-size.sync="query.limit" @on-change="pushRouter" @on-page-size-change="pushRouter" :current.sync="query.page" :show-sizer="true"></Pagination> -->

    </Col>

    <!-- <Col :span="5">
    <Panel :padding="10">
      <div slot="title" class="taglist-title">{{$t('m.Tags')}}</div>
      <Button v-for="tag in tagList"
              :key="tag.name"
              @click="filterByTag(tag.name)"
              type="ghost"
              :disabled="query.tag === tag.name"
              shape="circle"
              class="tag-btn">{{tag.name}}
      </Button>

      <Button long id="pick-one" @click="pickone">
        <Icon type="shuffle"></Icon>
        {{$t('m.Pick_One')}}
      </Button>
    </Panel>
    <Spin v-if="loadings.tag" fix size="large"></Spin>
    </Col> -->
    </Row>
</template>

<script>
  import { mapGetters } from 'vuex'
  import api from '@oj/api'
  import utils from '@/utils/utils'
  import { RoadMixin } from '@oj/components/mixins'
  import Pagination from '@oj/components/Pagination'
  
  export default {
    name: 'ProblemList',
    mixins: [RoadMixin],
    components: {
      Pagination
    },
    data () {
      return {
        value1: '1',
        tagList: [],
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
        total: 0,
        loadings: {
          table: true,
          tag: true
        },
        routeName: '',
        query: {
          keyword: '',
          difficulty: '',
          tag: '',
          page: 1,
          limit: 100
        }
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init (simulate = false) {
        this.routeName = this.$route.name
        let query = this.$route.query
        this.query.tag = 'L1'
        this.query.difficulty = query.difficulty || ''
        this.query.keyword = query.keyword || ''
        this.query.page = parseInt(query.page) || 1
        if (this.query.page < 1) {
          this.query.page = 1
        }
        this.query.limit = parseInt(query.limit) || 100
        // if (!simulate) {
        //   this.getTagList()
        // }
        this.getProblemList()
        // this.filterByTag('NOIP提高组')
      },
      pushRouter () {
        this.$router.push({
          name: 'road-list',
          query: utils.filterEmptyValue(this.query)
        })
      },
      getProblemList () {
        let offset = (this.query.page - 1) * this.query.limit
        console.log(this.query)
        this.loadings.table = true
        api.getProblemList(offset, this.limit, this.query).then(res => {
          this.loadings.table = false
          // this.total = res.data.data.total
        //   console.log(res)
          this.problemList = this.filterByAccpet(res.data.data.results)
        //   console.log(this.problemList)
          if (this.isAuthenticated) {
            this.addStatusColumn(this.problemTableColumns, this.problemList)
          }
        }, res => {
          this.loadings.table = false
        })
      },
      getTagList () {
        api.getProblemTagList().then(res => {
          this.tagList = res.data.data
          this.loadings.tag = false
        }, res => {
          this.loadings.tag = false
        })
      },
      filterByTag (tagName) {
        this.query.tag = tagName
        this.query.page = 1
        this.pushRouter()
      },
      filterByDifficulty (difficulty) {
        this.query.difficulty = difficulty
        this.query.page = 1
        this.pushRouter()
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
      },
      filterByKeyword () {
        this.query.page = 1
        this.pushRouter()
      },
      handleTagsVisible (value) {
        if (value) {
          this.problemTableColumns.push(
            {
              title: this.$i18n.t('m.Tags'),
              align: 'center',
              render: (h, params) => {
                let tags = []
                params.row.tags.forEach(tag => {
                  tags.push(h('Tag', {}, tag))
                })
                return h('div', {
                  style: {
                    margin: '8px 0'
                  }
                }, tags)
              }
            })
        } else {
          this.problemTableColumns.splice(this.problemTableColumns.length - 1, 1)
        }
      },
      onReset () {
        this.$router.push({name: 'road-list'})
      },
      pickone () {
        api.pickone().then(res => {
          this.$success('Good Luck')
          this.$router.push({name: 'road-details', params: {problemID: res.data.data}})
        })
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

<style scoped lang="less">
  .taglist-title {
    margin-left: -10px;
    margin-bottom: -10px;
  }

  .tag-btn {
    margin-right: 5px;
    margin-bottom: 10px;
  }

  #pick-one {
    margin-top: 10px;
  }
</style>
