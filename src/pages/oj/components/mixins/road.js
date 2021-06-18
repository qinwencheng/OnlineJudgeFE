import utils from '@/utils/utils'

export default {
  data () {
    return {
      statusColumn: false,
      nowProblemIcon: ''
    }
  },
  methods: {
    getACRate (ACCount, TotalCount) {
      return utils.getACRate(ACCount, TotalCount)
    },
    addStatusColumn (tableColumns, dataProblems) {
      // 已添加过直接返回
      if (this.statusColumn) return
      // 只在有做题记录时才添加column
    //   let needAdd = dataProblems.some((item, index) => {
    //     if (item.my_status !== null && item.my_status !== undefined) {
    //       return true
    //     }
    //   })
    //   if (!needAdd) {
    //     return
    //   }
      tableColumns.splice(0, 0, {
        width: 60,
        title: ' ',
        render: (h, params) => {
          let status = params.row.my_status
          let iconType = ''
          let iconColor = ''
          // if (status === null || status === undefined) {
          //   return undefined
          // }
          if (status === 0) {
            iconType = 'star'
            iconColor = '#F6DC8D'
          } else if (status === null || status === undefined) {
            iconType = 'ios-star-outline'
            iconColor = '#5C6B77'
          } else {
            iconType = 'ios-star-half'
            iconColor = '#5C6B77'
          }
          return h('Icon', {
            props: {
              type: iconType,
              size: '16'
            },
            style: {
              color: iconColor
            }
          })
        }
      })
      this.statusColumn = true
    }
  }
}
