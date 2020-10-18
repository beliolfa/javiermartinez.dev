---
title: Streaming from the browser with Nuxt using sockets and ffmpeg
description: "Streaming from the browser directly to a RTMP server, the industry standard for publishing live streams, is simply impossible. Browser can't talk that language. You are going to need a server involved."
image: https://images.unsplash.com/photo-1598550480917-1c485268676e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=2250&amp;q=80
author: javier-martinez
category: nuxt
createdAt: 2020-10-18T17:32:12.928Z
---

Streaming from the browser directly to a RTMP server, the industry standard for publishing live streams, is simply impossible. Browsers can't talk that language. You are going to need a server involved.

### Why from the browser?
Good question. You always can use specialized software such as [OBS Studio](https://obsproject.com/) but this introduces a new step. If you are building a streaming platform I'm sure you want to reduce the friction and let the user goes live with a few clicks without leaving your app. Once users have that quick option in the browser they can switch to a Desktop app later, if they want to improve the performance and the quality.

On top of that, building your own solution will allow you to reduce the noise that big streaming apps create such as configs and settings that the user will never use.

### What are we going to use?
- [getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
For asking permission to the browser for accessing to the webcam and the microphone.
- [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)  Using this API you can record chunks of video and pass a callback when each chunk is ready. In our case we'll send it via socket to the server.
- [Socket.io](https://socket.io/)  For emitting the chunks in the client and receiving them in the server.
- [ffmpeg](https://ffmpeg.org/) running in the server, connected to the RTMP server. The video chunk that comes in the socket will be processed by this.

### The client

#### Accessing the media
First thing we are going to do is request access to the camera and the microphone using `getUserMedia`. If the user accepts the dialog, the promise is resolved and we are ready for saving the stream to our data.

Then this stream is going to be the source of a video element. As soon as the data is loaded we will play the video. The video is muted on purpose to avoid audio coupling.

```js[demo.vue]
<template>
  <div>
    <video ref="video" width="100%" muted />
  </div>
</template>

<script>
export default {
  data() {
    return {
      video: null,
      cameraStream: null,
    }
  },

  async mounted() {
      this.cameraStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      })

      this.video = this.$refs.video
      this.video.srcObject = this.cameraStream
      this.video.onloadedmetadata = () => {
        this.video.play()
      }
  }
}
</script>
```
#### Duplicating the video into a canvas
Now that we have our camera in place we are going to capture the video using a canvas stream. Before that, we need to duplicate the video into a canvas (which is going to be hidden).

The magic occurs in the `updateCanvas` method that we are going to call recursively using [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
```js[demo.vue]
<template>
  <div>
    <video ref="video" width="100%" muted />
    <canvas v-show="false" ref="canvas" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      // ...
      context: null,
    }
  },

  async mounted() {
      // ...
      this.video.onloadedmetadata = () => {
        this.video.play()
        this.$refs.canvas.width = this.video.videoWidth
        this.$refs.canvas.height = this.video.videoHeight
        this.updateCanvas()
      }
      this.context = this.$refs.canvas.getContext('2d')
  },

  methods: {
    updateCanvas() {
      if (this.video.ended || this.video.paused) return
      this.context.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight)
      requestAnimationFrame(this.updateCanvas)
    },
  }
}
</script>
```
#### Capturing chunks of video
Our canvas is duplicating everything that happens in the video. We are going to capture a stream of 30 frames on it. For that, we start up a `MediaRecorder` with the stream as a first param and an options object as second param. `MediaRecorder.start()` accepts a param, which is the length in milliseconds of the chunk.
```js[demo.vue]
<script>
export default {
  data() {
    return {
      // ...
      mediaRecorder: null,
    }
  },

  async mounted() {
      // ...
      this.context = this.$refs.canvas.getContext('2d')
      const mediaStream = this.$refs.canvas.captureStream(30)
      this.mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm',
        videoBitsPerSecond: 3000000,
      })
      this.mediaRecorder.start(2000)
  },

  // ...
}
</script>
```
#### Emitting the events
First of all we need to add `socket.io` to our project
```bash
yarn add socket.io
```
And create a plugin for it

```js[~/plugins/socket.io.js]
import io from 'socket.io-client'
const socket = io(process.env.WS_URL)

export default socket
```
Remember to add the websockets URL in your .env
```bash[.env]
WS_URL=http://localhost:3000
```
If only it existed as a way to notify the server when a chunk of video is ready... Wait a minute, `MediaRecorder` has a function called `ondataavailable` that we can override!

Lets use this hook to push an event to the server.
```js[demo.vue]
import socket from '~/plugins/socket.io.js'
<script>
export default {
  // ...

  async mounted() {
      // ...
      this.mediaRecorder.ondataavailable = e => {
        socket.emit('stream-video-chunk', e.data)
      }
  },

  // ...
}
</script>
```

### The Server
For our demo we are going to use the [socket example](https://github.com/nuxt/nuxt.js/blob/dev/examples/with-sockets/io/index.js) in the nuxt repo as a bolierplate.

Create a module called `io/index.js` and import it in `nuxt.config.js`
```js[nuxt.config.js]
export default {
	// ...
	modules: ['~/io'],
	// ...
}
```
For processing the video we are going to use  `ffmpeg`. If you already have it in your system is enough. But for convinience and compatibility reasons we are going to use a [NPM pacakage](https://github.com/kribblo/node-ffmpeg-installer) with the binaries.
```bash
yarn add @ffmpeg-installer/ffmpeg
```
Then when the socket connects we are going to spawn a child process of `ffmpeg` in node. The command of the process has the following structure:
- `path to the binary`. Available in path property of the instance.
- `input`. -i pipe:0 (we are going to push to the pipe every chunk that arrives in the socket)
- `settings`.  Additional ffmpeg settings for encoding the video and so on
- `output`. The RTMP server

```js[io/index.js]
// ...
const spawn = require('child_process').spawn
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path

export default function() {
  this.nuxt.hook('render:before', () => {
    // ...
    io.on('connection', socket => {
        const ffmegSettings = 'additional settings you may pass to ffmpeg'
        const streamUrl = 'rtmp://your.server:port/channel'
        const command = `${ffmpegPath} -i pipe:0 ${ffmpegSettings} "${streamUrl}"`
        const ffmpeg = spawn(command, { shell: true })
    })
  })
}
```
And the final step 🎉!

Listen to the socket that the client is emitting and push the video chunk to the stream.

```js[io/index.js]
// ...
export default function() {
  this.nuxt.hook('render:before', () => {
    // ...
    io.on('connection', socket => {
        // ...
        const ffmpeg = spawn(command, { shell: true })

        socket.on('stream-video-chunk', function(chunk) {
            ffmpeg.stdin.write(chunk)
        })
    })
  })
}
```

And that's all! You now have a broadcast platform in your Nuxt app.

If this post helped you or your company to build that feature that the client is requesting, consider buying me a coffee in [Github Sponsors](https://github.com/sponsors/beliolfa). Thank You 🥰