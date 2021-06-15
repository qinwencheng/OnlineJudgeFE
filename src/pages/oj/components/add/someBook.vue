<template>
  <!-- <div style="overflow:hidden; height: 100%" ref="wrapdiv" >
    <button @click="sendmessage">发送数据</button>
    <div>子页面给父页面的数据:{{sondata}}</div> -->
    <iframe
      ref="iframe"
      id="iframe"
      scrolling="yes"
      width="100%"
      height="830px"
      frameborder="0"
      :src="url"
    />
  <!-- </div> -->
</template>
<script>
export default {
  props: {
      url: {
        type: String,
        default: ''
      }
  },
  data () {
    return {
      message: '首页',
      url: '',
      iframeWin: {},
      sondata: ' ',
      height: ''
    }
  },
  mounted () {
    // this.url = '../../../../../static/html/t.html'
    let _this = this
    // 获取到了iframe的对象
    // console.log(this.$refs.iframe)
    // 获取到了iframe的window对象
    // 赋值
    this.iframeWin = this.$refs.iframe.contentWindow
    this.height = document.documentElement.clientHeight
  }
}
</script>