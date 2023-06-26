<template>
  <div class="wrapper">
    <RouletteVue />
  </div>
</template>

<script>
import RouletteVue from '../components/Roulette.vue';

export default {
  components: {
    RouletteVue: RouletteVue
  }
};
</script>
<style>
.wrapper {
  position: relative;
}
</style>
