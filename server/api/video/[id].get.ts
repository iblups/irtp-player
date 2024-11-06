// server/api/video/[id].js
import SomeService from "@mux/mux-node"; // Usa el servicio que configures en tu entorno

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const MUX_TOKEN_ID = "5b09d574-64ce-481f-815a-6d44f28a6dcb";
  const MUX_TOKEN_SECRET =
    "WZgWJLSshm0WXP77nzMpy5HijL3G/6yw7AaDsU2MHwAaZOiecbjIJwzWjecALTJVWulADxu7Nef";
  const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = config;
  const videoId = event.context.params.id;

  const client = new SomeService(MUX_TOKEN_ID, MUX_TOKEN_SECRET);

  try {
    // Obtener el video desde el servicio
    const video = await client.video.Assets.get(videoId);

    // Retornar solo el playbackId
    const playbackId = video.playback_ids?.find(
      (pb) => pb.policy === "public"
    )?.id;

    if (!playbackId) {
      return { status: "error", message: "Playback ID no encontrado" };
    }

    return { status: "success", playbackId };
  } catch (error) {
    console.error("Error al obtener el Playback ID:", error);
    return { status: "error", message: "Error al obtener el Playback ID" };
  }
});
