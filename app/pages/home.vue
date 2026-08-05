<script setup lang="ts">
import type { ComponentType } from 'virtual:frosted-ui'

useHead({ title: 'Gated' })

const Home = shallowRef<ComponentType<Record<string, unknown>> | null>(null)
const ready = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const mod = await import('~/react/ContentLockerHome.ts')
    Home.value = mod.default as ComponentType<Record<string, unknown>>
    ready.value = true
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load designer'
  }
})
</script>

<template>
  <div class="page">
    <ReactIsland v-if="ready && Home" :component="Home" />
    <div v-else-if="error" class="boot boot--error">{{ error }}</div>
    <div v-else class="boot" aria-busy="true" />
  </div>
</template>

<style scoped>
.page,
.boot {
  min-height: 100vh;
  background: #0a0a0a;
}

.boot--error {
  display: grid;
  place-items: center;
  color: #f87171;
  font: 14px/1.4 system-ui, sans-serif;
  padding: 2rem;
}
</style>
