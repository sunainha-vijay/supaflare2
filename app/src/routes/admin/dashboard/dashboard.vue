<template>
  <admin-view>
    <h1>Dashboard</h1>
    <table id="urls">
      <thead>
        <tr>
          <th>Short URL</th>
          <th>Original URL</th>
          <th>Slug</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="url in urls" :key="url.id">
          <td><a :href="'https://supaflare2.pages.dev/' + url.slug" target="_blank">https://supaflare2.pages.dev/{{ url.slug }}</a></td>
          <td>{{ url.original_url }}</td>
          <td>{{ url.slug }}</td>
        </tr>
      </tbody>
    </table>
  </admin-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useUrls } from '../composables/useUrls';

export default defineComponent({
  components: {},
  setup() {
    const { urls } = useUrls();

    return {
      urls,
    };
  },
});
</script>
