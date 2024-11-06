import SomeService from "@mux/mux-node";

export default defineEventHandler(async (event) => {
  const MUX_TOKEN_ID = "5b09d574-64ce-481f-815a-6d44f28a6dcb";
  const MUX_TOKEN_SECRET =
    "WZgWJLSshm0WXP77nzMpy5HijL3G/6yw7AaDsU2MHwAaZOiecbjIJwzWjecALTJVWulADxu7Nef";
  const videoId = event.context.params.id;

  const client = new SomeService(MUX_TOKEN_ID, MUX_TOKEN_SECRET);

  try {
    const video = await client.video.Assets.get(videoId);
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
