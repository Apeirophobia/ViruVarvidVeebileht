<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { servicesServices } from '../services/servicesServices'
import type { ServiceSummary } from '../types/ServiceSummary'

const services = ref<ServiceSummary[]>([])
const loading = ref(false)
const error = ref("")

async function loadServices(){
    loading.value = true
    error.value = ""
    try { 
        services.value = await servicesServices.getAll()
    } catch (err) {
        error.value = "Failed to load services."
        console.log(err)
    } finally {
        loading.value = false
    }
}

onMounted(loadServices)
</script>

<template>
    <section>
        <h2>Services</h2>
        <button @click="loadServices">Refresh</button>
        <p v-if="loading">Loading services...</p>
        <p v-else-if="error">{{ error }}</p>
        <p v-else-if="services.length === 0">No services have been found</p>
        <ul v-else>
            <li v-for="service in services" :key="service.id">
                {{ service.name }} ({{service.id}})
            </li>
        </ul>
    </section>

</template>