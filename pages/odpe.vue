<template>
  <div
    class="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6"
  >
    <!-- Conteo de votos en la parte superior -->
    <div class="w-full max-w-4xl mb-6">
      <h3 class="text-base font-semibold text-gray-300">Últimos resultados</h3>
      <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div
          v-for="item in stats"
          :key="item.name"
          class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
        >
          <dt class="truncate text-sm font-medium text-gray-500">
            {{ item.name }}
          </dt>
          <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {{ item.stat }}
          </dd>
        </div>
      </dl>
    </div>

    <!-- Contenedor de dos columnas -->
    <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Tabla de ODPE -->
      <div class="px-4 sm:px-6 lg:px-8 bg-gray-800 rounded-lg p-4">
        <div class="sm:flex sm:items-center">
          <div class="sm:flex-auto">
            <h1 class="text-base font-semibold text-white">Oficinas ODPE</h1>
            <p class="mt-2 text-sm text-gray-300">
              Selecciona una ODPE para ver su transmisión en vivo.
            </p>
          </div>
        </div>
        <div class="mt-8 flow-root">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
            >
              <table class="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-300 sm:pl-0"
                    >
                      ODPE
                    </th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span class="sr-only">Ver</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-700 bg-gray-900">
                  <tr v-for="office in odpeList" :key="office.id">
                    <td
                      class="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-300 sm:pl-0"
                    >
                      {{ office.name }}
                    </td>
                    <td
                      class="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                    >
                      <button
                        class="text-indigo-400 hover:text-indigo-300"
                        @click="selectStream(office.streamUrl)"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Embed Player -->
      <div
        v-if="selectedStream"
        class="bg-gray-800 rounded-lg p-4 flex flex-col items-center"
      >
        <h2 class="text-lg font-semibold mb-3">🎥 Transmisión en Vivo</h2>
        <iframe
          :src="selectedStream"
          class="w-full h-64 rounded-lg"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Lista base de nombres de ODPE
const odpeNames = [
  "ABANCAY",
  "ALTO AMAZONAS",
  "ANDAHUAYLAS",
  "ANGARAES",
  "AREQUIPA",
  "ATALAYA",
  "AZANGARO",
  "BAGUA",
];

// Generación dinámica de la lista con URL embebida
const odpeList = ref(
  odpeNames.map((name, index) => ({
    id: index + 1,
    name,
    streamUrl: `https://whale-app-avpz7.ondigitalocean.app/player/${name
      .toLowerCase()
      .replace(/\s+/g, "")}`,
  }))
);

const selectedStream = ref(null);

const selectStream = (streamUrl) => {
  selectedStream.value = streamUrl;
};

// Datos de conteo de votos
const stats = ref([
  { name: "Total Votos", stat: "250,897" },
  { name: "Candidato A", stat: "120,500" },
  { name: "Candidato B", stat: "98,200" },
]);
</script>

<template>
  <div
    class="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6"
  >
    <!-- Conteo de votos en la parte superior -->
    <div class="w-full max-w-4xl mb-6">
      <h3 class="text-base font-semibold text-gray-300">Últimos resultados</h3>
      <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div
          v-for="item in stats"
          :key="item.name"
          class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
        >
          <dt class="truncate text-sm font-medium text-gray-500">
            {{ item.name }}
          </dt>
          <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {{ item.stat }}
          </dd>
        </div>
      </dl>
    </div>

    <!-- Contenedor de dos columnas -->
    <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Tabla de ODPE -->
      <div class="px-4 sm:px-6 lg:px-8 bg-gray-800 rounded-lg p-4">
        <div class="sm:flex sm:items-center">
          <div class="sm:flex-auto">
            <h1 class="text-base font-semibold text-white">Oficinas ODPE</h1>
            <p class="mt-2 text-sm text-gray-300">
              Selecciona una ODPE para ver su transmisión en vivo.
            </p>
          </div>
        </div>
        <div class="mt-8 flow-root">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
            >
              <table class="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-300 sm:pl-0"
                    >
                      ODPE
                    </th>
                    <th class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span class="sr-only">Ver</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-700 bg-gray-900">
                  <tr v-for="office in odpeList" :key="office.streamId">
                    <td
                      class="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-300 sm:pl-0"
                    >
                      {{ office.name }}
                    </td>
                    <td
                      class="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                    >
                      <button
                        class="text-indigo-400 hover:text-indigo-300"
                        @click="selectStream(office.streamId)"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Embed Player -->
      <div
        v-if="selectedStream"
        class="bg-gray-800 rounded-lg p-4 flex flex-col items-center"
      >
        <h2 class="text-lg font-semibold mb-3">🎥 Transmisión en Vivo</h2>
        <iframe
          :src="`https://whale-app-avpz7.ondigitalocean.app/player/${selectedStream}`"
          class="w-full h-64 rounded-lg"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Lista de ODPE: nombre y stream separado
const odpeList = ref([
  { name: "ABANCAY", streamId: "abancay" },
  { name: "ALTO AMAZONAS", streamId: "777b4d4cc0984575a7d14f6ee57dbcaf" },
  { name: "ANDAHUAYLAS", streamId: "902c1a0395264f269f1160efa00660e4" },
  { name: "ANGARAES", streamId: "ee2450c81e554f4cae0e6292106993c2" },
  { name: "AREQUIPA", streamId: "3f2cb1658d114f2693eff18d83199e67" },
  { name: "ATALAYA", streamId: "atalayastream1" },
  { name: "AZANGARO", streamId: "azangarostream1" },
  { name: "BAGUA", streamId: "baguastream1" },
  // Agrega más según necesites
]);

const selectedStream = ref(null);

const selectStream = (streamId) => {
  selectedStream.value = streamId;
};

// Conteo de votos
const stats = ref([
  { name: "Total Votos", stat: "250,897" },
  { name: "Candidato A", stat: "120,500" },
  { name: "Candidato B", stat: "98,200" },
]);
</script>
