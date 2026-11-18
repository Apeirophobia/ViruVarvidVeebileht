<script setup lang="ts">
import ServicesDetails from './components/ServicesDetails.vue';
import ServicesList from './components/ServicesList.vue'

const selectedServiceId = ref<string | null>(null)
</script>


<template>
  <h1>You did it!</h1>
  <p>
    <ServicesList />
    <ServicesDetails v-if="selectedServiceId" :serviceId="selectedServiceId" />
    <hr />
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
</template>

<style scoped></style>
