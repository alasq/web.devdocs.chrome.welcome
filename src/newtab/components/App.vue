<template>
  <div>
    <span
      >Only For Chinese FrontEnd Developer! If you like this,you can fork this
      <a href="https://github.com/alasq/web.devdocs.chrome.welcome">repo</a> and
      edit it.</span
    >
  </div>
  <div class="search-box">
    <input v-model="searchText" type="search" placeholder="请输入关键字搜索" />
  </div>
  <div class="flex">
    <div v-for="(group, index) of sortedData" :key="index">
      <h3>{{ group.title }}</h3>
      <ul>
        <li
          v-for="(item, key) of group.list"
          :key="key"
          :style="{
            'background-image':
              'url(' +
              (item.icon ||
                'https://www.google.cn/chrome/static/images/chrome-logo.svg') +
              ')',
          }"
        >
          <a
            :href="item.url"
            :class="{ hight: hight(item.title) }"
            @click.prevent="itemClick(item)"
          >
            {{ item.title }}</a
          >
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import localforage from 'localforage'
import { toRaw } from '@vue/reactivity'

const data = []
const files = require.context('../../assets/', false, /\.ya?ml$/)
files.keys().forEach((key) => {
  data.push(files(key))
})

export default {
  data() {
    return {
      data,
      count: null,
      searchText: '',
    }
  },
  computed: {
    sortedData() {
      if (this.count) {
        this.data.forEach(({ list }) => {
          list.sort(
            (a, b) => (this.count[b.url] || 0) - (this.count[a.url] || 0)
          )
        })
      }

      return this.data
    },
  },
  async created() {
    this.count = await localforage.getItem('count')
  },
  methods: {
    async itemClick(item) {
      const count = this.count || {}
      count[item.url] = (count[item.url] || 0) + 1
      await localforage.setItem('count', toRaw(count))
      window.location.href = item.url
    },
    hight(title) {
      if (!this.searchText) {
        return false
      }
      return new RegExp(toRaw(this.searchText), 'i').test(title)
    },
  },
}
</script>
<style>
li a {
  font-size: 16px;
  color: #60a5fa;
}
li a:visited {
  font-size: 16px;
  color: #2563eb;
}
.flex {
  display: flex;
}
.flex > div {
  padding: 10px;
}
.hight {
  background: yellow;
}
.search-box {
  text-align: center;
  margin-top: 50px;
}
.search-box input {
  width: 50%;
  height: 40px;
  font-size: 18px;
  border-radius: 20px;
  padding: 0 20px;
  border: 2px solid #39efb4;
  outline: 0;
}
.search-box input:focus {
  box-shadow: #39efb5b0 2px 2px 10px;
}
h3 {
  opacity: 0.6;
  font-size: 18px;
  color: #248667;
}
ul {
  padding-left: 0;
}
ul li {
  list-style-type: none;
  background: url('https://www.google.cn/chrome/static/images/chrome-logo.svg')
    no-repeat 0rem 0.3rem;
  background-size: 1rem 1rem;
  text-indent: 2em;
}
</style>
