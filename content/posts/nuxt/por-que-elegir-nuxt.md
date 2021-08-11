---
title: ¿Por qué elegir Nuxt?
description: 'Vue es una excelente opción para desarrollar una aplicación moderna y escalable, pero hay ciertas preguntas que acabamos haciéndonos cada vez que empezamos un nuevo proyecto. Nuxt tiene la respuesta.'
image: https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80
author: javier-martinez
category: nuxt
language: es
createdAt: 2021-08-11T17:19:15.838Z
---

Estamos de acuerdo en que Vue es una excelente opción para desarrollar una aplicación moderna y escalable, pero hay ciertas preguntas que acabamos haciéndonos cada vez que empezamos un nuevo proyecto: ¿Dónde debería crear mis componentes? ¿Cómo debo hacer las llamadas al backend? ¿Cómo optimizo los recursos para que mi aplicación sea rápida? ¿Cómo hago que mi web sea segura? ¿Cómo implemento un sistema de autenticación que sea confiable?

Estas y muchas otras cuestiones vienen a nuestra cabeza en ciertos puntos del desarrollo de nuestra aplicación. Es aquí donde [Nuxt](https://nuxtjs.org) entra en juego para ayudarnos a crear aplicaciones preparadas para ser desplegadas en producción, sin necesidad de tomar estas decisiones. Basándose en las mejores prácticas, los hermanos [Sébastien](https://twitter.com/Atinux) y [Alexandre](https://twitter.com/iamnuxt) Chopin, junto a [su equipo](https://nuxtjs.org/team), han recopilado y puesto en práctica años de experiencia desarrollando tanto en Vue como en Node. Sugiriéndonos un boilerplate y una estructura de directorios predefinidos.

Además, en el momento de la instalación, Nuxt te irá guiando en el proceso de configuración de este boilerplate. Permitiéndote elegir tu procesador y librería de CSS favorita, linter, librería de testing, etc...

Al tener unos estándares fijados, Nuxt es especialmente recomendable para equipos de desarrollo. Moverte entre un proyecto y otro es muy cómodo ya que asumes que todo está en su sitio. Incluso incorporar personas al proyecto será muy fácil ya que sabrán dónde y cómo está configurado.

Un problema típico que nos encontramos en una aplicación creada con Vue es el mantenimiento del fichero de configuración de [Vue Router](https://router.vuejs.org/). En una app mediana o grande, este fichero puede crecer considerablemente. Además no hay una convención a la hora de nombrar estas rutas ni sobre cómo debemos estructurar los componentes de nuestras vistas. Nuxt propone para ello una estructura de directorios dentro de la carpeta `pages` y elimina por completo el hecho de usar un fichero de configuración. La ruta será construida en base a la carpeta donde esté situado el componente.

Algo similar ocurre con la configuración de [Vuex](https://vuex.vuejs.org/) a la hora de crear una store. En una aplicación Vue tendremos que crear una instancia de esta store de forma manual, configurando, en su caso, los módulos que la componen. En cambio, con Nuxt, cualquier fichero creado dentro de la carpeta `store` será considerado automáticamente un módulo.

Otro problema que nos surge a la hora de desplegar una aplicación Vue es la dificultad para conseguir una buena indexación en buscadores. Esto siempre ha sido un problema no solo para Vue sino para JavaScript en general. Con Nuxt esto es posible gracias al Server Side Rendering (SSR), generando ciertas páginas en el servidor y devolviéndolas en HTML al navegador.

¿Necesitas más control? No hay problema. Nuxt basa todo su funcionamiento en el fichero `nuxt.config.js` el cual te permitirá sobreescribir cualquier configuración por defecto.

Todo esto, y mucho más, lo trato en detalle en mi libro `Nuxt 3: Desarrolla aplicaciones web modernas y escalables` que puedes encontrar en preventa en [LeanPub](https://leanpub.com/nuxt3spanish). Si quieres hacerte con una copia con el 50% de descuento y apoyarme a seguir creando contenido, puedes adquirirlo en este [enlace](https://leanpub.com/nuxt3spanish).

¡Gracias!
