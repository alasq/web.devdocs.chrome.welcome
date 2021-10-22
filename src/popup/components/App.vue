<template>
  <div>
    <h3>Add To Welcome Page</h3>
    <form>
      <table>
        <tr>
          <td>Category</td>
          <td><input v-model="item.category" type="text" /></td>
        </tr>
        <tr>
          <td>Title</td>
          <td><input v-model="item.title" type="text" /></td>
        </tr>
        <tr>
          <td>URL</td>
          <td><input v-model="item.url" type="text" /></td>
        </tr>
        <tr>
          <td></td>
          <td><input type="submit" value="OK" @click.prevent="save" /></td>
        </tr>
      </table>
    </form>
  </div>
</template>

<script>
import localforage from 'localforage'
import { toRaw } from '@vue/reactivity'
import { getCurrentTab } from '../../lib/util'

export default {
  data() {
    return {
      item: {
        category: '',
        title: '',
        url: '',
      },
      favorite: [],
    }
  },
  created() {
    getCurrentTab((tab) => {
      this.item.category = 'My Favorite'
      this.item.title = tab.title
      this.item.url = tab.url
    })
    localforage.getItem('favorite').then((favorite) => {
      if (favorite) {
        this.favorite = favorite
      }
    })
  },
  methods: {
    save() {
      toRaw(this.item)
      const finded = this.favorite.find(
        (item) => item.title === this.item.category
      )
      if (finded) {
        const has = finded.list.find((item) => item.url === this.item.url)
        if (!has) {
          finded.list.push(this.item)
          this.forage()
        }
      } else {
        this.favorite.push({
          title: this.item.category,
          list: [{ title: this.item.title, url: this.item.url }],
        })
        this.forage()
      }
    },
    forage() {
      localforage.setItem('favorite', toRaw(this.favorite))
    },
  },
}
</script>
