---
title: Ciclo de vida de Nuxt
description: '¿Qué ocurre desde el momento que alguien teclea la url de nuestro sitio web en el navegador hasta que la información es mostrada completamente? A esto se le conoce como Lifecycle, o ciclo de vida en español. Es el equivalente al "Naces, creces, te reproduces y mueres" de las aplicaciones.'
image: https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1950&amp;q=80
author: javier-martinez
category: nuxt
language: es
createdAt: 2021-09-04T08:45:00.058Z
---
¿Qué ocurre desde el momento que alguien teclea la url de nuestro sitio web en el navegador hasta que la información es mostrada completamente?

A esto se le conoce como `Lifecycle`, o ciclo de vida en español. Es el equivalente al "Naces, creces, te reproduces y mueres" de las aplicaciones. A cada proceso que ocurre durante este ciclo se le denomina `hook` y, como su nombre indica, es un gancho al que podemos agarrarnos para realizar ciertas acciones en ciertos momentos concretos de la vida de nuestra aplicación. Este concepto no te resultará nuevo si has creado aplicaciones con Vue. Nuxt simplemente añade más puntos de control en el camino. Además introduce los específicos del lado del servidor. A continuación los veremos detalladamente y en orden.

![131349769-5aea20f1-922f-44f6-b7a9-6312e113883b (1)](https://user-images.githubusercontent.com/12644599/132089008-065b7362-0d8e-43e2-a105-ce1339715091.png)

## Hooks del lado del servidor

Los siguientes hooks solo serán ejecutados si nuestra aplicación está configurada como [Server Side Rendering](https://es.nuxtjs.org/docs/2.x/concepts/server-side-rendering). Como en esta fase aún no tendremos una instancia de Vue creada, no tendremos acceso al objeto `this`. Pese a ello, Nuxt nos inyectará como primer parámetro un sustituto a dicho objeto, llamado [objeto de contexto](https://es.nuxtjs.org/docs/2.x/concepts/context-helpers), donde tendremos acceso a distintos helpers. Al vivir en el servidor, estos hooks serán los primeros en ejecutarse.

### nuxtServerInit

Este es la primera acción que se ejecuta en el lado del servidor y es un tanto especial. Solo es ejecutado si se detecta una `store` configurada. Además, el objeto de contexto será recibido como segundo parámetro, ya que el primer parámetro será la propia store de Vuex.

### middleware

Un middleware nos sirve para ejecutar lógica antes de que una página sea visitada. En modo SSR, este hook será llamado una sola vez en el servidor —cuando se accede a la página por primera vez—, después será llamado en el cliente cada vez que se visite una nueva ruta. En modo SPA, al carecer de servidor, se ejecutará la primera carga en el lado del cliente.

Dentro de este hook podemos distinguir tres subtipos de middleware, los cuales serán ejecutados en el siguiente orden:

- **Global**

    Afectan a todas y cada una de las rutas de la aplicación. Son definidos en `nuxt.config.js`

- **Compartido**

    Afectan a un grupo específico de rutas. Son definidos en el `layout` correspondiente.

- **Página**

    Afectan a una única ruta. Son definidos en componentes de tipo `página`.

### validate

Este hook se comporta igual que un middleware. Se ejecuta justo antes de visitar cualquier ruta y en los supuestos anteriormente descritos. La única diferencia es que su cometido es devolver `true` o `false`. Dependiendo de este valor, Nuxt admitirá o no la navegación a dicha ruta. Permite, además, ejecutar llamadas asíncronas e incluso devolver una promesa en lugar de un booleano.

> Este hook solo está disponible en componentes de tipo página.

### asyncData

Con este hook podremos añadir dinámicamente nueva `data` a nuestra página. Antes de que la instancia de Vue sea creada, podremos ejecutar lógica en el lado del servidor para incluir nueva información y tenerla disponible en el lado del cliente. Como los middleware, se ejecuta antes de visitar una ruta.

> Este hook solo está disponible en componentes de tipo página.

### fetch

Es muy parecido a `asyncData` pero con la única diferencia de que no mezcla `data` en el componente página. Es especialmente útil para lanzar alguna acción de Vuex antes de que la página sea renderizada en el cliente.

> Este hook solo está disponible en componentes de tipo página.

## Hooks del lado del cliente

Los siguientes hooks serán ejecutados tanto si nuestra aplicación está configurada como Server Side Rendering como si está configurada como SPA. Al vivir en el cliente, se ejecutarán justo después de los del lado del servidor (si nuestra aplicación está configurada como SSR). En esta fase ya tendremos disponible una instancia de Vue por lo tanto tendremos acceso al objeto `this`. Por contra, Nuxt no inyectará el objeto de contexto, al no ser ya necesario.

### beforeCreate (Vue)

Este hook es llamado cuando la instancia de Vue es inicializada.

### created (Vue)

Llamado justo después de que la instancia de Vue sea creada completamente. Tendremos acceso a `this` y a `computed properties`.

### fetch

Introducido en Nuxt 2.12, es muy similar al fetch del lado del servidor pero con la diferencia de que, en este caso, sí tendremos disponible el objeto `this`. Además, podremos usarlo en cualquier componente y no solo en los de tipo página.

Nuxt incluye un valioso helper llamado `$fetchState` que podrá ser usado en nuestro `template` para colocar loaders o animaciones. El valor de `$fetchState.pending` será `true` justo después del hook `created` y pasará a ser `false` al finalizar el hook `mounted`. También podremos comprobar el valor de `$fetchState.error` para saber si hubo alguna excepción durante el proceso y así poder mostrar información al usuario.

Como peculiaridad, es el único hook que puede ser llamado programáticamente. Para ello podremos invocarlo como una función más usando `$fetch()`.

### beforeMount (Vue)

Este hook es llamado justo antes de que el DOM sea renderizado.

### mounted (Vue)

Llamado después de que el DOM está renderizado y sea reactivo.

### beforeUpdate (Vue)

Llamado antes de actualizar el DOM.

### updated (Vue)

Llamado después de actualizar el DOM.

### beforeDestroy (Vue)

Llamado antes de destruir la instancia de Vue.

### destroyed (Vue)

Llamado después de destruir la instancia de Vue.

Como has podido comprobar, Vue y Nuxt nos ofrecen un detallado y ordenado ciclo de vida donde ejecutar nuestra lógica en el momento correcto.

Todo esto, y mucho más, lo trato en detalle en mi libro `Nuxt 3: Desarrolla aplicaciones web modernas y escalables` que puedes encontrar en preventa en [LeanPub](https://leanpub.com/nuxt3spanish). Si quieres hacerte con una copia con el 50% de descuento y apoyarme a seguir creando contenido, puedes adquirirlo en este [enlace](https://leanpub.com/nuxt3spanish).

¡Gracias por leerme!