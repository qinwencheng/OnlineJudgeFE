<template>
    <Table :columns="columns10" :data="mdata"></Table>
</template>
<script>
    import expandRow from './table-expand.vue'
    import problemlist from './testdata.json'

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
                      key: 'problemListName'
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
            data9: problemlist
            }
        },
        mounted () {
          this.init()
        },
        methods: {
          init () {
            var k = []
            problemlist.forEach(element => {
              this.mdata.push(element)
            })
          }
        }
    }
</script>

