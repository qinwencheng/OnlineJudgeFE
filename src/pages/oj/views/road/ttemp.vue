<template>
    <Table :columns="columns10" :data="mdata"></Table>
</template>
<script>
import emitter from '../../components/mixins/emitter'
    import expandRow from './table-expand.vue'
    import problemlist from './testdata2.json'
    import api from '@oj/api'

    export default {
        components: { expandRow },
        data () {
            return {
                mdata: [],
                columns10: [
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row
                                }
                            })
                        }
                    },
                    {
                      title: '关卡',
                      key: 'listName'
                    }
                    // {
                    //   title: '#',
                    //   key: '_id',
                    //   width: 80,
                    //   render: (h, params) => {
                    //     return h('Button', {
                    //       props: {
                    //       type: 'text',
                    //       size: 'large'
                    //       },
                    //       on: {
                    //         click: () => {
                    //           this.$router.push({name: 'road-details', params: {roadID: window.btoa(params.row._id)}})
                    //           }
                    //         },
                    //         style: {
                    //           padding: '2px 0'
                    //         }
                    //       }, params.row._id)
                    //     }
                    // }
                    // {
                    //   title: this.$i18n.t('m.Title'),
                    //   width: 400,
                    //   render: (h, params) => {
                    //   return h('Button', {
                    //       props: {
                    //         type: 'text',
                    //         size: 'large'
                    //       },
                    //       on: {
                    //         click: () => {
                    //           this.$router.push({name: 'road-details', params: {roadID: window.btoa(params.row._id)}})
                    //         }
                    //       },
                    //       style: {
                    //       padding: '2px 0',
                    //       overflowX: 'auto',
                    //       textAlign: 'left',
                    //       width: '100%'
                    //       }
                    //     }, params.row.title)
                    //   }
                    // }
                ],
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
                    // if (this.limit === 20) {
                    //   this.$error(this.$i18n.t('m.Code_can_not_be_empty'))
                    //   return
                    // }
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
                data9: problemlist,
                query: {
                  tag: 'L2'
                }
                // pl: problemlist
            }
        },
        mounted () {
          this.init()
        },
        methods: {
          init () {
            // // this.pl[1].data = '9199'
            // console.log(this.pl)
            // var k = []
            let offset = 0
            let limit = 1000
            var pld = ''
            var i = 1
            api.getProblemList(offset, limit, this.query).then(res => {
                console.log(res)
                // console.log(res.data.data.results.length)
                pld.data = this.filterByAccpet(res.data.data.results)
                // if (this.isAuthenticated) {
                //   this.addStatusColumn(this.columns10, pld.data)
                // }
                this.mdata.push(pld)
            })

            // problemlist.forEach(element => {
            //   console.log(i + ' 1')
            //   pld = element
            //   let offset = 0
            //   let limit = 1000
            //   this.query.tag = element.listTag
            //   api.getProblemList(offset, limit, this.query).then(res => {
            //     console.log(i + ' 2')
            //     // console.log(res.data.data.results.length)
            //     pld.data = this.filterByAccpet(res.data.data.results)
            //     // if (this.isAuthenticated) {
            //     //   this.addStatusColumn(this.columns10, pld.data)
            //     // }
            //     // console.log(pld)
            //     this.mdata.push(pld)
            //   })
            //   console.log(i + ' 3')
            // })
            // console.log(i + ' 4')
            // i = i + 1
            // // console.log(this.mdata)
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
        }
    }
</script>

