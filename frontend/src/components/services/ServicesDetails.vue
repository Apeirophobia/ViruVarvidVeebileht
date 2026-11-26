<script setup lang="ts">
import { ref, watch } from 'vue'
import { servicesServices } from '../../services/servicesServices'
import type { Service } from '../../types/ServiceSummary'

const props = defineProps<{
    ServiceID: string
}>()

const service = ref<Service | null>(null)
const error = ref("")
const loading = ref(false)

async function loadService(id: string){
    service.value = null
    loading.value = true
    error.value = ""
    try { 
        service.value = await servicesServices.getByID(id)
    } catch (err) {
        error.value = 'Cannot get service.'
        console.error(err)
    } finally {
        loading.value = false
    }
}

watch( () => props.ServiceID, loadService, { immediate: true })
</script>

<template>
    <section>
        <h2>Service Details</h2>
        <p v-if="loading">Loading service info...</p>
        <p v-else-if="error">{{ error }}</p>
        <div v-else-if="service">
            <h3 id="serviceDetailsName">{{ service.ServiceName }}</h3>
            <p id="serviceDetailsDescription">{{ service.Description }}</p>
            <p id="serviceDetailsPrice">Price: {{ service.Price }}</p>
            <p id="serviceDetailsCategory">Category: {{ service.Category }}</p>
        </div>
    </section>
</template>