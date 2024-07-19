<template>
  <AudioPlayer />

  <!-- Mostrar el streamUrl como texto -->
</template>

<script setup>
import AudioPlayer from "@/components/AudioPlayer.vue";

function enableCustomLayout() {
  setPageLayout("custom");
}
definePageMeta({
  layout: false,
});
</script>
