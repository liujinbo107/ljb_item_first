<template>
  <div id="app">

    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    // 在页面加载时读取sessionStorage
    if (window.localStorage.getItem('store')) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(window.localStorage.getItem('store'))))
      //window.localStorage.removeItem('store')
    }
    //在页面刷新时将store保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      window.localStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    color: #2c3e50;
    /*  margin-top: 60px;*/
  }
  html,body,#app{
    height: 100%;
    width: 100%;
  }
</style>
