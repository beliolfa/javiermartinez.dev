<template>
<div>
  <img class="mt-4" src="https://user-images.githubusercontent.com/12644599/92306359-c227bc80-ef8e-11ea-91ba-671002208621.jpg">
  <h2 class="text-xl text-gray-800 border-b border-gray-300 pb-8">
    <p>Antes que nada, soy un ser humano. Casado con la mejor mujer del mundo y padre de dos de los mas preciosos (y molestos) niños en el universo.</p>
    <p>Despues, soy Lead Developer en <a class="text-blue-800 font-bold" href="https://www.64robots.com">64 Robots</a>. La agencia de software más maravillosa de los Estados Unidos. Hacemos productos chulos con Nuxt, Laravel y Tailwind.</p>
  </h2>
  <h1 class="text-3xl font bold my-8">Últimos Artículos</h1>
  <PostList language="es" v-slot="{ posts }">
    <div class="grid gap-12 lg:grid-cols-2">
      <ArticleListItem use-lang-folder v-for="post in posts" :key="post.path" :post="post" />
    </div>
  </PostList>
</div>
</template>

<script>
export default {
  name: 'IndexSpanish',

  head: {
    title: 'Javier Martínez',
  },
}
</script>