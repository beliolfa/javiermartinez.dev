<template>
  <div>
    <div class="flex items-center justify-between py-4">
      <h1
        class="text-2xl font-semibold leading-6"
      >
        <nuxt-link class="transition ease-in-out duration-300 hover:bg-blue-100 p-2 inline-block" :to="{ name: spanish ? 'es' : 'index' }">{{ welcomeText }}</nuxt-link> <span class="text-gray-600 text-sm">{{ changeLanguageText }} <nuxt-link :to="{ name: spanish ? 'index' : 'es' }">{{ spanish ? 'here' : 'aquí' }}</nuxt-link></span>
      </h1>
      <div class="flex items-center text-gray-600">
        <a href="https://twitter.com/beliolfa" class="hover:text-blue-500 mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-10"
          >
            <path
              d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
            />
          </svg>
        </a>
        <a href="https://github.com/beliolfa"  class="hover:text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-10"
          >
            <path
              d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
            />
          </svg>
        </a>
      </div>
    </div>
    <SponsorBanner v-if="spanish" />
  </div>
</template>

<script>
export default {
  name: 'LayoutHeader',

  computed: {
    spanish() {
      return this.$route.fullPath.includes('/es')
    },

    welcomeText() {
      return this.spanish ? 'Soy Javier Martínez, 💃 Bienvenid@!' :  "I'm Javier Martinez. 💃 Welcome!"
    },

    changeLanguageText() {
      return this.spanish ? 'Welcome, you can switch to english' :  'Bienvenid@, puedes cambiar al español'
    }
  }
}
</script>
