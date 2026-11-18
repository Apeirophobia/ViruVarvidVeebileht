<script setup lang="ts">
import { ref, watch } from 'vue'
import { servicesServices } from '../services/servicesServices'
import type { ServiceSummary } from '../types/ServiceSummary'

const props = defineProps<{
    serviceId: string
}>()

const service = ref<ServiceSummary | null>(null)
const error = ref("")
const loading = ref(false)

async function loadService(id: string){
    service.value = null
    loading.value = true
    error.value = ""
    try { 
        service.value = await servicesServices.getByID(id) as unknown as ServiceSummary
    } catch (err) {
        error.value = "Cannot get service"
        console.log(err)
    } finally {
        loading.value = false
    }
}

watch( () => props.serviceId, loadService, { immediate: true })
</script>

<template>
    <section>
        <h2>Service details</h2>
        <p v-if="loading">Loading service...</p>
        <p v-else-if="error">{{ error }}</p>
        <div v-else-if="service">
            <h3>{{ service.name }}</h3>
            <p>({{ service.id }})</p>
            <p>{{ service.description }}</p>
        </div>
    </section>
</template>