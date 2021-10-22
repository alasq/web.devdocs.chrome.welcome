<template>
  <div>
    <div>
      1. <button @click="reset">Reset</button> Will clear all local data.
      Include Favorite , Sort , History ...
    </div>
    <div>
      2. <button @click="downloadYml">Export</button> Will download favorite as
      *.yml , you can also use it make a pull request !
    </div>
  </div>
</template>

<script>
import localforage from 'localforage'
import yaml from 'json2yaml'

export default {
  methods: {
    reset() {
      localforage.clear().then(() => {
        alert('Reset Success!')
      })
    },
    downloadYml() {
      localforage.getItem('favorite').then((favorite) => {
        const a = document.createElement('a')
        favorite.forEach((fav) => {
          const file = new Blob([yaml.stringify(fav)], { type: 'text/yml' })
          a.href = URL.createObjectURL(file)
          a.download = `${fav.title}.yml`
          a.click()
          URL.createObjectURL(file)
        })
      })
    },
  },
}
</script>
