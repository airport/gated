<script setup lang="ts">
import type { ComponentType } from 'virtual:frosted-ui'

useHead({
  title: 'Gated',
})

const Home = shallowRef<ComponentType<Record<string, unknown>> | null>(null)

onMounted(async () => {
  const mod = await import('~/react/ContentLockerHome.ts')
  Home.value = mod.default as ComponentType<Record<string, unknown>>
})
</script>

<template>
  <ClientOnly>
    <ReactIsland v-if="Home" :component="Home" />
    <div v-else class="boot" aria-busy="true" />
    <template #fallback>
      <div class="boot" aria-busy="true" />
    </template>
  </ClientOnly>
</template>

<style scoped>
.boot {
  min-height: 100vh;
  background: #070a12;
}
</style>
