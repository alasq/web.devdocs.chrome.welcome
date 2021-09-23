<template>
  <div>
    <span
      >If you like this,you can fork this
      <a href="https://github.com/alasq/web.devdocs.chrome.welcome">repo</a> and
      edit it.</span
    >

    <select id="lang" v-model="language" name="lang">
      <option value="cn">中文</option>
      <option v-for="(lang, index) in langs" :key="index" :value="lang.lang">
        {{ lang.title }}
      </option>
    </select>
  </div>
  <div class="search-box">
    <input v-model="searchText" type="search" placeholder="请输入关键字搜索" />
  </div>
  <div class="flex">
    <div v-for="(group, index) of sortedData" :key="index">
      <h3>{{ group.title }}</h3>
      <ul>
        <li v-for="(item, key) of group.list" :key="key">
          <a
            :href="item.url"
            :class="{ hight: hight(item.title) }"
            @click.prevent="itemClick(item)"
          >
            <img :src="getFavico(item.url)" alt="" class="ico" />
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
import { getFavico, getLanguages } from '../../lib/util'

function getData(lang) {
  const data = []
  const files = require.context(`../../assets/`, true, /\.ya?ml$/)
  files.keys().forEach((key) => {
    if (lang && lang !== 'cn') {
      if (key.startsWith(`./${lang}/`)) {
        data.push(files(key))
      }
    } else if (!/\.\/.*?\//.test(key)) {
      data.push(files(key))
    }
  })
  return data
}

let lang = 'cn'
if (/en/.test(navigator.language)) {
  lang = 'en'
}
lang = localStorage.getItem('lang') || lang
export default {
  data() {
    return {
      data: getData(lang),
      count: null,
      searchText: '',
      getFavico,
      langs: getLanguages(),
      language: lang,
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
  watch: {
    language(newVal) {
      localStorage.setItem('lang', newVal)
      this.data = getData(newVal)
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
  text-decoration: none;
}
li a:visited {
  font-size: 16px;
  color: #2563eb;
}
.flex {
  display: flex;
  flex-wrap: wrap;
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
}

img.ico {
  width: 16px;
  height: 16px;
}
#lang {
  float: right;
  width: 100px;
  font: 1.5em sans-serif;
  outline: 0;
  border: 0;
  background: transparent;
  color: #248667;
  cursor: pointer;
  padding: 5px;
}
</style>
