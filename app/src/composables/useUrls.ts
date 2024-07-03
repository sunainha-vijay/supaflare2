// src/composables/useUrls.ts
import { ref, onMounted } from 'vue';

interface Url {
  id: number;
  original_url: string;
  slug: string;
}

const urls = ref<Url[]>([]);

onMounted(async () => {
  // Fetch URLs from API or database here
  const response = await fetch('/api/urls');
  const data = await response.json();
  urls.value = data;
});

export function useUrls() {
  return { urls };
}
