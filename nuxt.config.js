import theme from '@64robots/nuxt-content-blog'

export default theme({
  head: {
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.jpg' },
    ],
    script: [{ src: 'https://cdn.usefathom.com/script.js', 'data-site': 'MAMOBRWJ', defer: true }],
  }
})
