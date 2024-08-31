<template>
  <AudioPlaye2 />

  <!-- Mostrar el streamUrl como texto -->
</template>

<script setup>
import AudioPlayer2 from "@/components/AudioPlayer2.vue";

function enableCustomLayout() {
  setPageLayout("custom");
}
definePageMeta({
  layout: false,
});
</script>
