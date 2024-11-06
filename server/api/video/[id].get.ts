// server/api/video/[id].js

import { useRuntimeConfig } from "#imports";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const videoId = event.context.params.id;
  const MUX_TOKEN_ID = "5b09d574-64ce-481f-815a-6d44f28a6dcb";
  const MUX_TOKEN_SECRET =
    "WZgWJLSshm0WXP77nzMpy5HijL3G/6yw7AaDsU2MHwAaZOiecbjIJwzWjecALTJVWulADxu7Nef";

  const authHeader = `Basic ${Buffer.from(
    `${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`
  ).toString("base64")}`;

  try {
    const response = await $fetch(
      `https://api.mux.com/video/v1/assets/${videoId}`,
      {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    return { error: error.message };
  }
});
