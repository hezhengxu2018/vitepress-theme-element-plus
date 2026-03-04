import { computed, ref } from 'vue'

const isOpen = ref(false)
const panelWidth = ref<string | number>(420)

const panelWidthStyle = computed(() =>
  typeof panelWidth.value === 'number' ? `${panelWidth.value}px` : panelWidth.value,
)

export function useAskAIPanel() {
  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function toggle() {
    isOpen.value = !isOpen.value
  }

  function setWidth(width?: number | string) {
    panelWidth.value = width ?? 420
  }

  return {
    isOpen,
    panelWidthStyle,
    open,
    close,
    toggle,
    setWidth,
  }
}
