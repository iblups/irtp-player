<template>
  <div v-if="streamUrl">
    <VideoPlayer :streamUrl="streamUrl" />
  </div>
  <div v-else>
    <p>El canal solicitado no existe.</p>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import VideoPlayer from "@/components/VideoPlayer.vue";

const route = useRoute();
const channel = route.params.channel;

const streamUrls = {
  tvperuhd:
    "https://cdnhd.iblups.com/hls/777b4d4cc0984575a7d14f6ee57dbcaf.m3u8",
  tvperunoticias:
    "https://cdnhd.iblups.com/hls/902c1a0395264f269f1160efa00660e4.m3u8",
  tvperuinternacional:
    "https://cdnhd.iblups.com/hls/ee2450c81e554f4cae0e6292106993c2.m3u8",
  tvperuespecial:
    "https://cdnhd.iblups.com/hls/2ee85c7a0aff45d4b0f05552d81cadb0.m3u8",
  canalipe:
    "https://cdnhd.iblups.com/hls/3f2cb1658d114f2693eff18d83199e67.m3u8",
};

const streamUrl = streamUrls[channel] || "";
function enableCustomLayout() {
  setPageLayout("custom");
}
definePageMeta({
  layout: false,
});
</script>
