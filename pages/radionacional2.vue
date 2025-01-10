<template>
  <!-- Renderiza el componente adecuado basado en si es móvil o escritorio -->
  <component :is="componentToShow" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import AudioPlayerMobile from "~/components/AudioPlayerM2.vue"; // El componente que funciona en móviles
import AudioPlayerDesktop from "~/components/AudioPlayerD2.vue"; // El componente que funciona en escritorio

const isMobile = ref(false);
const componentToShow = ref(null);

const detectMobileDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /android|iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
};

onMounted(() => {
  isMobile.value = detectMobileDevice();
  componentToShow.value = isMobile.value
    ? AudioPlayerMobile
    : AudioPlayerDesktop;
});
</script>
