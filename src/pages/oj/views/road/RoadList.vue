<template>
    <Table :columns="columns10" :data="mdata" 
    :loading="loadings"></Table>
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
                tempdata: [],
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
                      title: '段位',
                      key: 'listName'
                    },
                    {
                        title: '完成进度',
                        // key: 'listTag',
                        // width: 10,
                        render: (h, params) => {
                          let AC = params.row.acPercent
                          let acNumber = params.row.acNumber
                          let problemLength = params.row.problemLength
                          // if (AC === 100) {
                          //   Nowstatus = 'success'
                          // } else if (AC < 31) {
                          //   Nowstatus = 'wrong'
                          // } else {
                          //   Nowstatus = 'normal'
                          // }
                          let str = acNumber + '/' + problemLength
                          return h('i-progress', {
                            props: {
                              percent: AC,
                              size: 60,
                              // status: Nowstatus,
                              'hide-info': false
                            },
                            style: {
                              // overflowX: 'auto',
                              // textAlign: 'left',
                              // width: '100%'
                            }
                          }, str)
                        }
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
                query: {
                  keyword: '',
                  difficulty: '',
                  tag: '',
                  page: 1,
                  limit: 250
                },
                loadings: true
                // pl: problemlist
            }
        },
        mounted () {
          this.init()
        },
        methods: {
          init () {
            this.initListInfo()
          },
          initListInfo () {
            async function fn (query, tempdata) {
              let offset = 0
              let len = problemlist.length
              for (var i = 0; i < len; i++) {
                await (function () {
                  return new Promise(function (resolve, reject) {
                    query.tag = problemlist[i].listTag
                    api.getProblemList(offset, query.limit, query).then(res => {
                      var pld = problemlist[i]
                      pld.data = (res.data.data.results)
                      tempdata.push(pld)
                      resolve()
                    })
                  })
                }())
              }
            }
            fn(this.query, this.tempdata).then(res => {
              // this.loadings = true
              this.mdata = this.tempdata
              // console.log(this.mdata)
              this.getListProblemStatus()
              this.getAcPercent()
              this.loadings = false
              console.log(this.mdata)
            })
          },
          getListProblemStatus () {
            // this.mdata[0]._expanded = false
            this.mdata[0]._disableExpand = false
            var len = this.mdata.length
            var preStatus = false
            for (var i = 1; i < len; i++) {
              if (preStatus === true) {
                this.mdata[i]._disableExpand = true
                continue
              } else {
                var tempList = this.filterByAccpet(this.mdata[i - 1].data)
                if (tempList.length !== this.mdata[i - 1].data.length) {
                  this.mdata[i]._disableExpand = true
                  preStatus = true
                  continue
                } else {
                  this.mdata[i]._disableExpand = false
                  preStatus = false
                }
              }
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
          },
          getAcPercent () {
            var len = this.mdata.length
            var problemLength = 0
            var acNumber = 0
            var acPercent = 0
            for (var i = 0; i < len; i++) {
              problemLength = this.mdata[i].data.length
              acNumber = this.filterByAccpet(this.mdata[i].data).length
              acPercent = acNumber * 100 / problemLength
              acPercent = Math.round(acPercent)
              this.mdata[i].acNumber = acNumber
              this.mdata[i].acPercent = acPercent
              this.mdata[i].problemLength = problemLength
            }
          }
        }
    }
</script>
