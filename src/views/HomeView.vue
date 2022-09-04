<template>
  <div class="container mt-3">
    <form @submit.prevent="startViewing" novalidate>
      <div class="form-floating mb-3">
        <input v-model.trim="codeInput" type="text" class="form-control" id="codeInput" placeholder="Sharing code">
        <label for="floatingInput">Sharing code</label>
      </div>
      <div v-if="errorMessage.length !== 0" class="mb-3 alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>
      <div class="d-grid mb-3">
        <button class="btn btn-primary" type="submit">Watch</button>
      </div>
      <div class="mb-3 text-center">
        <RouterLink :to="{'name': 'broadcast'}">Create your own stream</RouterLink>
      </div>
      <div class="mb-3 text-center">
        <p class="text-muted font-monospace">Written by <a href="https://github.com/blpsk">@blpsk</a></p>
      </div>
    </form>
  </div>
</template>

<style scoped>
form {
  max-width: 440px;
  margin: auto;
}
</style>

<script setup lang="ts">
import {ref} from "vue";
import {RouterLink, useRouter} from "vue-router";

const router = useRouter();

const codeRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

const codeInput = ref("");
const errorMessage = ref("");

function startViewing() {
  if (!codeRegex.test(codeInput.value)) {
    errorMessage.value = "Invalid code provided.";
    return;
  }

  errorMessage.value = "";

  router.push({
    name: "view",
    params: {
      code: codeInput.value
    }
  });
}
</script>
