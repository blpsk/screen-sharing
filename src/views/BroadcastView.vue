<template>
  <div class="container mt-3">
    <div class="row">
      <div class="col-lg-6">
        <video ref="videoElement" autoplay muted></video>
        <p v-if="!streaming" class="text-muted text-lg-center">The video preview will be available once you start
          streaming.</p>
        <p v-else>Viewers: {{ viewers }}</p>
      </div>
      <div class="col-lg-6">
        <div v-if="!streaming">
          <h3>Configuration</h3>
          <form @submit.prevent="startBroadcasting">
            <div class="mb-3">
              <label for="titleInput">Title</label>
              <input v-model="title" type="text" class="form-control" id="titleInput" placeholder="My awesome stream">
            </div>
            <div class="mb-3">
              <label for="resolutionInput">Resolution</label>
              <select id="resolutionInput" v-model="resolution" class="form-select">
                <option value="640x360">360p</option>
                <option value="854x480">480p</option>
                <option value="1280x720">720p</option>
                <option value="1920x1080" selected>1080p (default)</option>
                <option value="2560x1440">1440p</option>
                <option value="3840x2160">4k</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="framerateInput">Framerate</label>
              <select id="framerateInput" v-model="framerate" class="form-select">
                <option value="3">3 fps</option>
                <option value="15">15 fps</option>
                <option value="24" selected>24 fps (default)</option>
                <option value="30">30 fps</option>
                <option value="60">60 fps</option>
                <option value="144">144 fps</option>
              </select>
              <div class="form-text">
                Some browsers will limit the maximum resolution and framerate. Higher values require a fast connection
                on both ends.
              </div>
            </div>
            <div class="mb-3">
              <div class="col-lg-6">
                <div class="form-check">
                  <input v-model="streamAudio" class="form-check-input" type="checkbox" id="audioCheckbox">
                  <label class="form-check-label" for="audioCheckbox">Stream audio</label>
                </div>
              </div>
            </div>
            <div v-if="errorMessage.length !== 0" class="alert alert-danger">
              {{ errorMessage }}
            </div>
            <div class="mb-3">
              <div class="d-grid mb-3">
                <button class="btn btn-primary" type="submit">Start broadcasting</button>
              </div>
            </div>
          </form>
        </div>
        <div v-else>
          <h3>Streaming</h3>
          <div class="mb-3">
            <label for="codeInput" class="form-label">Sharing code</label>
            <div class="input-group mb-3">
              <input v-model="sharingId" type="text" class="form-control" id="codeInput" disabled>
              <button @click="copyToClipboard" class="btn btn-outline-secondary" type="button">Copy</button>
            </div>
          </div>
          <div class="mb-3">
            <button @click="stopBroadcasting" class="btn btn-danger" type="submit">Stop broadcasting</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
video {
  width: 100%;
  border: 1px dashed #000;
}
</style>

<script setup lang="ts">
import {ref} from "vue";
import {Peer} from "peerjs";

const peer = new Peer();

const videoElement = ref();

let stream: MediaStream | null = null;

const title = ref("");
const viewers = ref(0);
const framerate = ref(24);
const resolution = ref("1920x1080");
const streamAudio = ref(false);

const sharingId = ref("");

const streaming = ref(false);
const errorMessage = ref("");

// PeerJS types are not working
const dataConnections: any[] = [];
const mediaConnections: any[] = [];

function startBroadcasting() {
  const resValues = resolution.value.split("x");

  navigator.mediaDevices.getDisplayMedia({
    video: {
      width: parseInt(resValues[0]),
      height: parseInt(resValues[1]),
      frameRate: framerate.value
    },
    audio: streamAudio.value
  }).then(s => {
    stream = s;
    videoElement.value.srcObject = s;
    streaming.value = true;
    errorMessage.value = "";
  }).catch(err => {
    errorMessage.value = err.message;
    console.error(err);
    streaming.value = false;
    stream = null;
  });
}

function stopBroadcasting() {
  if (stream != null)
    stream.getTracks().forEach(t => t.stop());

  stream = null;
  streaming.value = false;

  dataConnections.forEach(conn => {
    conn.close();
  });

  mediaConnections.forEach(conn => {
    conn.close();
  });

  mediaConnections.splice(0, mediaConnections.length);
}

peer.on("open", id => {
  sharingId.value = id;
});

peer.on("connection", conn => {
  conn.on("open", () => {
    if (stream != null && streaming.value) {
      dataConnections.push(conn);
      mediaConnections.push(peer.call(conn.metadata.id, stream));
    }

    updateStatus();
  });

  conn.on("close", () => {
    const index = dataConnections.indexOf(conn);

    if (index > -1) {
      console.log("Removing data connection!");
      dataConnections.splice(index, 1);
    }

    updateStatus();
  });
});

function updateStatus() {
  viewers.value = dataConnections.length;

  dataConnections.forEach(conn => {
    conn.send(JSON.stringify({
      title: title.value,
      viewers: dataConnections.length
    }));
  });
}

peer.on("error", err => {
  console.error(err);
  errorMessage.value = err.message;
});

function copyToClipboard() {
  navigator.clipboard.writeText(sharingId.value).catch(e => {
    console.error(e);
  });
}
</script>
