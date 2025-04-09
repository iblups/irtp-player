<template>
  <div v-if="streamUrl">
    <VideoPlayer :streamUrl="streamUrl" :videoId="stream" />
  </div>
  <div v-else>
    <p>El canal solicitado no existe o el stream es inválido.</p>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import VideoPlayer from "@/components/VideoPlayer.vue";

const route = useRoute();
const stream = route.params.stream;

// Armamos la URL del stream con base fija + parámetro dinámico
const streamUrl = stream ? `${stream}` : "";

definePageMeta({
  layout: false,
});
</script>
