<script setup lang="ts">
import { ref } from 'vue'
import ServicesDetails from '../components/services/ServicesDetails.vue'
import ServicesList from '../components/services/ServicesList.vue'
import ServiceForm from '../components/services/ServiceForm.vue'
import { servicesServices } from '../services/servicesServices'

const selectedServiceId = ref<string | null>(null)
const editing = ref(false)
const listVersion = ref(0)
const detailsVersion = ref(0)
const error = ref('')

function selectService(ServiceID: string) {
  selectedServiceId.value = ServiceID
  editing.value = false
}

function createService() {
  selectedServiceId.value = null
  editing.value = true
}

function serviceSaved() {
  editing.value = false
  listVersion.value++
  detailsVersion.value++
}

async function deleteService() {
  if (!selectedServiceId.value || !confirm('Delete this service?')) return

  error.value = ''

  try {
    await servicesServices.delete(selectedServiceId.value)
    selectedServiceId.value = null
    editing.value = false
    listVersion.value++
  } catch (err) {
    error.value = 'Cannot delete this service'
    console.error(err)
  }
}
</script>

<template>
  <main>
    <h1>Services</h1>
    <button @click="createService">Add service</button>
    <p v-if="error">{{ error }}</p>

    <ServicesList :key="listVersion" @select="selectService" />

    <section v-if="selectedServiceId && !editing">
      <ServicesDetails
        :key="`${selectedServiceId}-${detailsVersion}`"
        :ServiceID="selectedServiceId"
      />
      <button @click="editing = true">Edit</button>
      <button @click="deleteService">Delete</button>
    </section>

    <section v-if="editing">
      <button @click="editing = false">Cancel</button>
      <ServiceForm :ServiceID="selectedServiceId" @saved="serviceSaved" />
    </section>
  </main>
</template>



