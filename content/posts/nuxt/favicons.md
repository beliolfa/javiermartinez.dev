---
title: Create Dynamic Titles and Favicons with Nuxt
description: 'There are a lot of states that happen in your application in the background: Incoming messages, Notifications, Deploys, you name it...
Sometimes the best place to put an indicator to that state is just the browser tab'
image: https://images.unsplash.com/photo-1541018939203-36eeab6d5721?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80
author: javier-martinez
category: nuxt
createdAt: '2020-09-11T14:46:57.523Z'
---
According to a study by the University of Myself, 98.87% of developers don't pay attention to the `title` or the `favicon` of their webapps.
That *browser tab* is where your app is going to live since the user opens it, goes to Twitter on another tab, spends 30 minutes liking dog memes and then comes back to you.

There are a lot of states that happen in your application in the background: Incoming messages, Notifications, Deploys, you name it...
Sometimes the best place to put an indicator to that state is just the *browser tab*.

In our case, with [remate.io](https://remate.io), we have Projects the team can work on. A project has a unique color that identifies it. You can hop from one project to another, go to github, open issues, review that extra semicolon and then get back to the app (or not). When we are tracking our network tab looks like

![](https://user-images.githubusercontent.com/12644599/92307258-467d3e00-ef95-11ea-8d72-6ac41bfc1be0.gif)

This seems rocket science, but in fact is quite easy with `Nuxt` and its head method.

Nuxt.js uses `vue-meta` under the hood to update the headers and html attributes of your application. So we can do something like
```js
export default {
  head () {
    return {
      title: 'Nuxt is awesome!',
    }
  }
}
```

The fun fact is that `head` function acts like a computed, so it's reevaluated each time a dependency inside of it changes!

With that in mind, let's create a simple example: A dynamic page that gets a slug by route param with some categories in it
```js
// _slug.vue
export default {
  data() {
    return {
      slug: this.$route.params.slug,
      categories: [
        { slug: 'geography', name: 'Geography', color: 'rgb(66, 153, 225)' },
        { slug: 'history', name: 'History', color: 'rgb(236, 201, 75)' },
        { slug: 'sports', name: 'Sports', color: 'rgb(237, 137, 54)' },
      ]
    }
  }
}
```
Now, lets update the title of the page using the name of the category
```js
export default {
  data() {
    return {
      slug: this.$route.params.slug,
      categories: [
        { slug: 'geography', name: 'Geography', color: 'rgb(66, 153, 225)' },
        { slug: 'history', name: 'History', color: 'rgb(236, 201, 75)' },
        { slug: 'sports', name: 'Sports', color: 'rgb(237, 137, 54)' },
      ]
    }
  },

  computed: {
    category() {
      return this.categories.find(c => c.slug === this.slug) || {}
    }
  },

  head() {
    return {
      title: this.category.name,
    }
  }
}
```
Easy right? Let's go crazy and update the favicon too!
As you might know, you can use SVGs as favicons. This feature allows you to be more dynamic. For this example let's just use an inline SVG with a circle.
```js
export default {
  data() {
    return {
      slug: this.$route.params.slug,
      categories: [
        { slug: 'geography', name: 'Geography', color: 'rgb(66, 153, 225)' },
        { slug: 'history', name: 'History', color: 'rgb(236, 201, 75)' },
        { slug: 'sports', name: 'Sports', color: 'rgb(237, 137, 54)' },
      ]
    }
  },

  computed: {
    category() {
      return this.categories.find(c => c.slug === this.slug) || {}
    }
  },

  head() {
    return {
      title: this.category.name,
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: `data:image/svg+xml,
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  style="color: ${this.category.color};"
                  xmlns="http://www.w3.org/2000/svg"
                ><circle cx="16" cy="16" r="15.0049" fill="currentColor" /></svg>`,
        },
      ],
    }
  }
}
```
What we are doing here is simple. We are drawing an SVG and styling it with the color of the category. Inside, there is a circle that takes the `currentColor` and uses it in the `fill` property. The result for the `Sport` category will be an orange circle!

![image](https://user-images.githubusercontent.com/12644599/83921635-0b455600-a77f-11ea-991e-4b32436ade63.png)

You can checkout this [repo](https://github.com/beliolfa/vue-dose-favicon) and fork it out if you want to see it in action.
