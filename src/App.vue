<template>
  <div id="app">
    <transition name="fade-transform" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
}
#app {
  background-color: #f0f2f5;
  font-family: PingFangSC-Medium;
}
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.65s;
}

.fade-transform-enter {
  opacity: 0;
  transform: scale(0.5);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: scale(1);
}
/* 滚动条美化 */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
/*外层轨道。可以用display:none让其不显示，也可以添加背景图片，颜色改变显示效果*/
::-webkit-scrollbar-track {
  width: 8px;
  background-color: rgba(255, 255, 255, 0);
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
/*滚动条的设置*/
::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  background-clip: padding-box;
  min-height: 28px;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
/*滚动条移上去的背景*/
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
