<template>
  <ul>
    <li v-for="(album, index) in albums" :key="album.id">
      <router-link :to="{ name: 'album', params: { id: album.id } }" class="album">
        <aurora-gradient :variant="index" />
        <section>
          <h3>{{ album.name }}</h3>
          <p>
            New Album by <strong>{{ album.artist }}</strong>
          </p>
        </section>
      </router-link>
    </li>
  </ul>
</template>
<script>
import AuroraGradient from '@/components/AuroraGradient.vue'

export default {
  props: {
    albums: {
      type: Array,
      required: true
    }
  },
  components: { AuroraGradient }
}
</script>
