<script setup lang="ts">
import type { ComponentType } from 'virtual:frosted-ui'

const FrostedDemo = shallowRef<ComponentType<Record<string, unknown>> | null>(
  null,
)

function openStorybook() {
  window.open(
    'https://storybook.whop.dev/?path=/docs/guides-1-getting-started--docs',
    '_blank',
    'noopener,noreferrer',
  )
}

onMounted(async () => {
  const mod = await import('~/react/FrostedDemo.ts')
  FrostedDemo.value = mod.default as ComponentType<Record<string, unknown>>
})
</script>

<template>
  <ClientOnly>
    <ReactIsland
      v-if="FrostedDemo"
      :component="FrostedDemo"
      :component-props="{ onOpenStorybook: openStorybook }"
    />
    <div v-else class="fui-boot" aria-busy="true">Loading UI kit…</div>
    <template #fallback>
      <div class="fui-boot" aria-busy="true">Loading UI kit…</div>
    </template>
  </ClientOnly>
</template>

<style scoped>
.fui-boot {
  min-height: 100vh;
  display: grid;
  place-items: center;
  color: var(--gray-11, #646464);
  font-family: system-ui, sans-serif;
  font-size: 14px;
}

:deep(.token-demo) {
  margin-top: 0.25rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
}
</style>
