<script setup lang="ts">
import { createElement, createRoot, type ComponentType, type Root } from 'virtual:frosted-ui'

const props = defineProps<{
  component: ComponentType<Record<string, unknown>>
  componentProps?: Record<string, unknown>
}>()

const host = ref<HTMLElement | null>(null)
let root: Root | null = null

function render() {
  if (!host.value || !root) return
  root.render(createElement(props.component, props.componentProps ?? null))
}

onMounted(() => {
  if (!host.value) return
  root = createRoot(host.value)
  render()
})

watch(
  () => [props.component, props.componentProps],
  () => render(),
  { deep: true },
)

onBeforeUnmount(() => {
  root?.unmount()
  root = null
})
</script>

<template>
  <div ref="host" class="react-island" />
</template>
