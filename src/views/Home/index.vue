<template>
  <div class="home-md" :style="isMenu ? '' : 'padding:0;'" v-loading="loading">
    <div class="left-menu" v-show="!htmlShow && isMenu">
      <el-input
        size="mini"
        v-model="value"
        clearable
        @input="getData"
        @clear="clear"
        style="width: 190px; margin: 10px 0 10px 5px"
        placeholder="请输入表名或表中文名搜索"
      ></el-input>
      <el-menu
        size="mini"
        :default-active="activeIdx"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="overflow-y: auto; height: calc(100vh - 48px); border-right: 0"
      >
        <el-menu-item
          v-for="item in menuList"
          :key="item.id"
          :index="item.id + ''"
          @click="handler(item)"
        >
          <div slot="title">
            <el-tooltip
              placement="right"
              :disabled="item.tableName.length + item.EnTableName.length < 16"
            >
              <div slot="content">
                中文表名：{{ item.tableName }}<br />英文表名：{{
                  item.EnTableName
                }}
              </div>

              <span
                class="name-box"
                style="
                  font-size: 12px;
                  overflow: hidden;
                  display: inline-block;
                  width: 170px;
                  text-overflow: ellipsis;
                "
                ><span class="name-zn">{{ item.tableName }}</span
                ><i style="margin-left: 5px">{{ item.EnTableName }}</i></span
              >
            </el-tooltip>
          </div>
        </el-menu-item>
      </el-menu>
    </div>
    <div
      :class="!htmlShow && isMenu ? 'right-main' : 'detail'"
      :style="isMenu ? '' : 'margin:0;width:calc(100vw)'"
    >
      <!-- <transition name="fade-transform" mode="out-in"> -->
      <div v-if="!htmlShow">
        <div class="main">
          <div class="flex">
            <i
              v-if="mobile"
              @click="isMenu = !isMenu"
              style="margin-right: 10px; z-index: 3"
              :class="isMenu ? 'el-icon-s-fold' : 'el-icon-s-unfold'"
            ></i>
            <el-button
              size="mini"
              icon="el-icon-refresh"
              style="margin-bottom: 20px; z-index: 3"
              @click="reload"
              plain
              >刷 新</el-button
            >
          </div>
          <p
            class="weather"
            v-if="showWeather"
            :style="
              showWeather === 'pc'
                ? 'top:24px;text-align:right;right:20px;width:400px;'
                : ''
            "
          >
            <span v-if="weather">{{
              `${weather.date}（${weather.week}）${weather.wea_day} ${weather.tem2} ~ ${weather.tem1} 上海市 空气质量${weather.air_level}`
            }}</span>
            <span
              class="weatherErr"
              v-if="weatherError && !weather"
              @click="weatherLoad"
              >{{ weatherError }}</span
            >
          </p>
          <el-table
            size="mini"
            :data="tableData"
            height="calc(100vh - 88px)"
            stripe
            border
            style="width: 100%"
          >
            <el-table-column
              prop="tableName"
              align="center"
              label="表中文名"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="EnTableName"
              align="center"
              label="表名"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="updateTime"
              label="更新日期"
              align="center"
              width="120"
            >
              <template v-slot:default="scope">
                <span>{{
                  moment(scope.row.updateTime).format('YYYY-MM-DD')
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              align="center"
              label="描述"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column width="100px" align="center" label="操作">
              <template v-slot:default="scope">
                <el-button
                  size="mini"
                  @click="toView(scope.row)"
                  icon="el-icon-search"
                  plain
                  >查 看</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- </transition> -->
      <!-- <transition name="fades-transform" mode="out-in"> -->
      <!-- <div > -->
      <div class="back" v-show="htmlShow">
        <el-button
          size="mini"
          class="btn-back"
          icon="el-icon-back"
          plain
          @click="back"
          >返 回</el-button
        >
        <h3>
          {{
            tableRow !== null &&
            tableRow.tableName + '（' + tableRow.EnTableName + '）'
          }}
        </h3>
      </div>

      <ViewUI v-if="htmlShow" :dataValue="viewData" />
      <!-- </div> -->
      <!-- </transition> -->
    </div>
  </div>
</template>

<script>
import ViewUI from './components/View.vue'
import { query } from '@/api'
import axios from 'axios'
// import { debounce } from "@/utils/index.js";
const moment = require('moment')
export default {
  components: {
    ViewUI,
  },
  data() {
    return {
      value: '',
      list: [],
      tableData: [],
      htmlShow: false,
      viewData: null,
      moment: moment,
      activeIdx: undefined,
      menuList: [],
      tableRow: null,
      isMenu: true,
      mobile: false,
      weather: null,
      weatherError: '',
      loading: false,
    }
  },
  computed: {
    showWeather() {
      let val = 0
      if (this.weather && !this.mobile) {
        val = 'pc'
      } else if (this.weather && this.mobile && !this.isMenu) {
        val = 'mobile'
      } else if (this.weather && this.mobile && this.isMenu) {
        val = 0
      }
      return val
    },
  },
  created() {
    if (document.documentElement.clientWidth < 450) {
      this.mobile = true
    } else {
      this.mobile = false
    }
    this.init()
    this.tianqi()
  },
  methods: {
    tianqi() {
      axios
        .get('https://www.tianqiapi.com/api/', {
          params: {
            appid: '25226183',
            appsecret: '7fyWJRBV',
            version: 'v1',
            style: '1001',
            city: '上海',
          },
        })
        .then((json) => {
          this.weather = json.data.data[0]
        })
        .catch(() => {
          this.weatherError = '天气查询异常，点我重试!'
        })
    },
    weatherLoad() {
      this.tianqi()
    },
    init() {
      this.query()
      this.getData()
    },
    add() {
      this.$refs.addDialog.title = '新增'
      this.$refs.addDialog.dialogShow = true
    },
    reload() {
      query({ tableName: this.value }).then((json) => {
        this.menuList = json.list
        this.tableData = json.list
        this.$message.success('更新成功!')
      })
    },
    getData() {
      query({ tableName: this.value }).then((json) => {
        this.menuList = json.list
        if (!this.value) {
          this.activeIdx = undefined
        }
        if (!this.value && this.tableData.length < json.list.length) {
          this.tableData = json.list
        }
      })
    },
    clear() {
      this.activeIdx = undefined
      this.query()
    },
    handler(data) {
      //左侧栏点击
      this.value = data.tableName
      this.tableData = [data]
      this.activeIdx = data.id + ''
    },
    toView(row) {
      //查看html
      if (!row.html) {
        this.$message.error('当前内容还未发布!')
        return
      }
      this.tableRow = row
      this.viewData = row.md
      this.htmlShow = true
    },
    query() {
      //查询
      query({ tableName: this.value })
        .then((json) => {
          this.tableData = json.list
        })
        .catch(() => {
          this.loading = false
        })
    },
    back() {
      //返回操作
      this.htmlShow = false
    },
  },
}
</script>
<style lange="scss">
.fade-transform-enter-active {
  transition: all 0.65s;
}
.fade-transform-leave-active {
  transition: all 0.1s;
}
.fade-transform-enter {
  opacity: 0;
  transform: scale(0.5);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: scale(1);
}

.fades-transform-leave-active,
.fades-transform-enter-active {
  transition: all 0.65s;
}

.fades-transform-enter {
  opacity: 0;
  transform: scale(0.5);
}

.fades-transform-leave-to {
  opacity: 0;
  transform: scale(1);
}
.el-menu-item,
.el-submenu__title {
  height: 28px !important;
  line-height: 28px !important;
}
</style>
<style lang="scss" scoped>
.home-md {
  padding: 0 20px;
  padding-left: 0;
  display: flex;
  justify-content: space-between;
  height: 100vh;
  .left-menu {
    width: 200px;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    background-color: rgb(84, 92, 100);
    border-right: 1px solid #e6e6e6;
  }
  .right-main {
    width: calc(100vw - 240px);
    margin-left: 220px;
  }
  .detail {
    margin-left: 20px;
    width: calc(100vw - 40px);
  }
  .header {
    background-color: rgba(255, 255, 255, 0.8);
    padding: 20px 10px;
    border-radius: 4px;
    margin-bottom: 30px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .main {
    background-color: rgba(255, 255, 255, 1);
    padding: 20px;
    position: relative;
    // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
.back {
  height: 45px;
  background-color: #f7f9fc;
  border-bottom: 1px solid #ebedf2;
  //   border-radius: 4px;
  //   border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 0 15px;
  display: flex;
  i {
    cursor: pointer;
    font-size: 36px;
    line-height: 50px;
    margin-right: 10px;
  }
  .btn-back {
    height: 30px;
    margin-top: 6px;
    line-height: 5px;
  }
  h3 {
    line-height: 45px;
    font-size: 15px;
    width: calc(100vw - 160px);
    margin-left: 10px;
    text-align: center;
    color: #303133;
    font-family: PingFangSC-Medium;
    font-weight: 300;
  }
}
.flex {
  z-index: 1;
  display: flex;
  position: relative;
  i {
    line-height: 26px;
  }
}
.weather {
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: #f56c6c;
  font-weight: 500;
  position: absolute;
  right: 0;
  top: 2px;
  z-index: 2;
}
.weatherErr {
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
.name-box {
  color: rgb(144, 147, 153);
  .name-zn {
    color: #fff;
  }
}
/deep/.el-menu .is-active span {
  color: #ffd04b;
}
</style>
