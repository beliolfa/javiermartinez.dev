<template>
  <article class="pb-12">
    <Post v-slot="{ post, author, error }" :permalink="$route.params.permalink">
      <div v-if="error.code">
        No post found
      </div>
      <article v-else class="max-w-4xl w-full mx-auto">
        <div class="relative">
          <img class="flex-1 h-64 w-full object-cover" :src="post.image" :alt="post.title" />
          <AuthorAvatar
            :author="author"
            class="absolute"
            :style="{ bottom: '1rem', right: '1.8rem' }"
          />
        </div>

        <div class="mt-8">
          <h1 class="mt-2 text-2xl md:text-4xl font-medium leading-7">{{ post.title }}</h1>
          <div class="mt-1">
            <span class="text-sm font-medium text-gray-700">{{ post.readingTime }}</span>
            <span>|</span>
            <span class="text-sm font-medium text-gray-700">{{ post.createdAt | date }}</span>
          </div>

          <div class="mt-6">
            <nuxt-content :document="post" class="prose sm:prose lg:prose-lg xl:prose-xl" />
          </div>
        </div>
      </article>
    </Post>
  </article>
</template>

<script>
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

export default {
  name: 'ViewPost',

  filters: {
  date(value) {
    if (!value) return ''
    return format(parseISO(value), 'MMM dd, yyyy')
  }
}
}
</script>
<style>
.nuxt-content .nuxt-content-highlight {
    position: relative;
}
.nuxt-content .nuxt-content-highlight>.filename {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 10;
    font-family: DM Mono,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
    font-size: .875rem;
    letter-spacing: -.025em;
    line-height: 1;
    margin-right: 1rem;
    margin-top: .75rem;
}
</style>