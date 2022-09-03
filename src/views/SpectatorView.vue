<template>
  <div id="content" class="container mt-3">
    <div v-if="errorMessage.length !== 0" class="mb-3 alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>
    <video ref="video" autoplay controls></video>
    <h3>{{ title }}</h3>
    <p>Viewers: {{ viewers }}</p>
  </div>
</template>

<style scoped>
#content {
  max-width: 720px;
  margin: auto;
}

video {
  background-color: #000;
  width: 100%;
}
</style>

<script setup lang="ts">
import {ref} from "vue";
import {useRoute} from "vue-router";
import Peer from "peerjs";

const currentRoute = useRoute();

const video = ref();

const title = ref("");
const viewers = ref(0);
const errorMessage = ref("");

let stream: MediaStream | null = null;

const peer = new Peer();

peer.on("open", id => {
  const conn = peer.connect(currentRoute.params.code as string, {
    metadata: {
      id
    }
  });

  conn.on("open", () => {
    conn.on("data", data => {
      const parsed = JSON.parse(data as string);

      title.value = parsed.title;
      viewers.value = parsed.viewers;
    });
  });

  conn.on("error", e => {
    errorMessage.value = e.message;
    console.error(e);
  });
});

peer.on("call", call => {
  call.answer();

  call.on("stream", s => {
    stream = s;
    video.value.srcObject = stream;
  });

  call.on("close", () => {
    title.value = "Stream has ended";
  });
});

peer.on("error", e => {
  errorMessage.value = e.message;
  console.error(e);
});
</script>
