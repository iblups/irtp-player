<template>
  <!-- Renderiza el componente adecuado basado en si es móvil o escritorio -->
  <component :is="componentToShow" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import AudioPlayerMobile from "~/components/AudioPlayerM.vue"; // El componente para móviles
import AudioPlayerDesktop from "~/components/AudioPlayerD.vue"; // El componente para escritorio

const isMobile = ref(false);
const componentToShow = ref(null);

// Función mejorada para detectar dispositivos móviles
const detectMobileDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /android|iPhone|iPad|iPod/i.test(userAgent);
};

// Detectar dispositivo al montar el componente
onMounted(() => {
  isMobile.value = detectMobileDevice();
  componentToShow.value = isMobile.value
    ? AudioPlayerMobile
    : AudioPlayerDesktop;
});
</script>
