<template>
  <!-- Renderiza el componente adecuado basado en el tipo de dispositivo -->
  <component :is="componentToShow" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import AudioPlayerM1 from "~/components/AudioPlayerM1.vue"; // El componente para móviles iPhone
import AudioPlayerM2 from "~/components/AudioPlayerM2.vue"; // El componente para móviles Android
import AudioPlayerDesktop from "~/components/AudioPlayerM2.vue"; // El componente para escritorio

const componentToShow = ref(null);

// Función para detectar tipo de dispositivo
const detectDeviceType = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return "iPhone";
  } else if (/android/i.test(userAgent)) {
    return "Android";
  } else {
    return "Desktop";
  }
};

// Detectar dispositivo al montar el componente
onMounted(() => {
  const deviceType = detectDeviceType();
  if (deviceType === "iPhone") {
    componentToShow.value = AudioPlayerM1;
  } else if (deviceType === "Android") {
    componentToShow.value = AudioPlayerM2;
  } else {
    componentToShow.value = AudioPlayerDesktop;
  }
});
</script>
