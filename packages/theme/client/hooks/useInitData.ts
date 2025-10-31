import type { NProgress } from 'nprogress';
import { inject } from 'vue';

export function useInitData() {
  const np = inject<NProgress>('progress');
  // $autoSidebar.set(data.autoSidebar);
  // $articleList.set(data.list);
  // provide('baseData', data);
  return {
    np
  };
}
