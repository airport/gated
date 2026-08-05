<script setup lang="ts">
import type { ComponentType } from 'virtual:frosted-ui'

useHead({
  title: 'Content locker · Gated',
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
    <div v-else class="fui-boot" aria-busy="true">Loading designer…</div>
    <template #fallback>
      <div class="fui-boot" aria-busy="true">Loading designer…</div>
    </template>
  </ClientOnly>
</template>

<style scoped>
.fui-boot {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #0b0d10;
  color: #8b8b8b;
  font-family: system-ui, sans-serif;
  font-size: 14px;
}
</style>
