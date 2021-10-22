import i18n from './i18n'

export function openOrFocusOptionPage() {
  const optionsUrl = chrome.extension.getURL('option.html')
  chrome.tabs.query({}, (tabs) => {
    let found = false
    for (let i = 0; i < tabs.length; i += 1) {
      const { url } = tabs[i]
      if (url && url.match(optionsUrl)) {
        found = true
        chrome.tabs.update(tabs[i].id, { selected: true })
      }
    }
    if (!found) {
      chrome.tabs.create({ url: optionsUrl })
    }
  })
}

export function getCurrentTab(cb) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      cb(tabs[0])
    }
  })
}

export function getExtensionVersion() {
  const manifest = chrome.runtime.getManifest()
  return manifest.version
}

export function getFavico(pageUrl) {
  const host = new URL(pageUrl).hostname

  return `https://icons.feedercdn.com/${encodeURI(host)}`
}

export function getLanguages() {
  return __lANGS__.map((langDir) => {
    return {
      lang: langDir,
      title: i18n[langDir] || langDir,
    }
  })
}
