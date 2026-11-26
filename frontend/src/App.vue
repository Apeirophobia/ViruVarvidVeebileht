<script setup lang="ts">
import { ref } from 'vue'

import ServicesView from "./views/ServicesView.vue";
</script>

<template>
  <div>
    <!-- päis -->
    <header>
      <h1>Viru Värvid</h1>
      <nav>
        <!-- validate that user is logged in here, block off any routerlinks that unlogged in user shouldnt have access to -->
        <RouterLink id="RL_Services" to="/services">Services</RouterLink>
        <RouterLink id="RL_Register" to="/register">Register</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>