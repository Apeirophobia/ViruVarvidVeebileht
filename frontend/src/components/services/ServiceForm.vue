<script setup lang="ts">
import { ref, watch } from 'vue'
import { servicesServices } from '../../services/servicesServices'
import type { Service, ServiceInput } from '../../types/ServiceSummary'

const props = defineProps<{
  ServiceID?: string | null
}>()

const emit = defineEmits<{
  saved: []
}>()

function emptyService(): ServiceInput {
  return {
    ServiceName: '',
    Price: 0,
    Category: '',
    Description: '',
  }
}

const form = ref<ServiceInput>(emptyService())
const error = ref('')
const saving = ref(false)

async function loadService() {
  error.value = ''
  if (!props.ServiceID) {
    form.value = emptyService()
    return
  }

  try {
    const service: Service = await servicesServices.getByID(props.ServiceID)
    form.value = {
      ServiceName: service.ServiceName,
      Price: service.Price,
      Category: service.Category,
      Description: service.Description ?? '',
    }
  } catch (err) {
    error.value = 'Cannot load this service'
    console.error(err)
  }
}

async function saveService() {
  saving.value = true
  error.value = ''

  try {
    if (props.ServiceID) {
      console.log("Update: ServiceForm.vue");
      await servicesServices.update(props.ServiceID, form.value)
    } else {
      console.log("Create: ServiceForm.vue");
      await servicesServices.create(form.value)
    }

    emit('saved')
  } catch (err) {
    error.value = 'Saving failed'
    console.error(err)
  } finally {
    saving.value = false
  }
}

watch(() => props.ServiceID, loadService, { immediate: true })
</script>

<template>
  <section>
    <h2>{{ ServiceID ? 'Edit Service' : 'Create Service' }}</h2>

    <form @submit.prevent="saveService">
      <label for="serviceName">Service Name</label><br />
      <input id="serviceName" v-model="form.ServiceName" required /><br /><br />

      <label for="price">Price</label><br />
      <input id="price" v-model.number="form.Price" type="number" min="1" step="1" required /><br /><br />

      <label for="category">Category</label><br />
      <input id="category" v-model="form.Category" required /><br /><br />

      <label for="description">Description</label><br />
      <textarea id="description" v-model="form.Description" required /><br /><br />

      <p v-if="error">{{ error }}</p>

      <button type="submit" :disabled="saving">
        {{ saving ? 'Saving service...' : 'Save Service' }}
      </button>
    </form>
  </section>
</template>
