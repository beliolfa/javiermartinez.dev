<template>
<div>
  <img class="my-4" src="https://user-images.githubusercontent.com/12644599/92306359-c227bc80-ef8e-11ea-91ba-671002208621.jpg">
  <h2 class="text-xl text-gray-800 border-b border-gray-300 pb-8">
    <p>First of all, I'm a person. Married to the best woman in the whole planet and father of two of the most beautiful (and annoying) children in the universe.</p>
    <p>Then I'm Lead Developer at <a class="text-blue-800 font-bold" href="https://www.64robots.com">64 Robots</a>. The most kickass software agency on the United States. We do cool products with Nuxt, Laravel and Tailwind.</p>
  </h2>
  <h1 class="text-3xl font bold my-8">Latest Posts</h1>
  <PostList v-slot="{ posts }">
    <div class="grid gap-12 lg:grid-cols-2">
      <ArticleListItem use-lang-folder v-for="post in posts" :key="post.path" :post="post" />
    </div>
  </PostList>
</div>
</template>

<script>
export default {
  name: 'Index',
  head: {
    title: 'Javier Martínez',
  }
}
</script>
