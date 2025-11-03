import { useMediaQuery } from '@vueuse/core'
import { computed } from 'vue'
import { useSidebar } from './useSidebar'

export function useAside() {
  // const sidebarStore = useSidebarStore();
  const { hasSidebar } = useSidebar()
  const is960 = useMediaQuery('(min-width: 960px)')
  const is1440 = useMediaQuery('(min-width: 1440px)')

  const isAsideEnabled = computed(() => {
    if (!is1440.value && !is960.value) {
      return false
    }

    return hasSidebar ? is1440.value : is960.value
  })

  return {
    isAsideEnabled,
  }
}
