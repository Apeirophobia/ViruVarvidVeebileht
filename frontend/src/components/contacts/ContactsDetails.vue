<script setup lang="ts">
import { ref, watch } from 'vue'
import { contactsServices } from '../../services/contactsServices'
import type { Contact } from '../../types/ContactSummary'

const props = defineProps<{
    ContactID: string
}>()

const contact = ref<Contact | null>(null)
const error = ref("")
const loading = ref(false)

async function loadService(id: string){
    contact.value = null
    loading.value = true
    error.value = ""
    try { 
        contact.value = await contactsServices.getByID(id)
    } catch (err) {
        error.value = 'Cannot get contact.'
        console.error(err)
    } finally {
        loading.value = false
    }
}

watch( () => props.ContactID, loadService, { immediate: true })
</script>

<template>
    <section>
        <h2>Contact Details</h2>
        <p v-if="loading">Loading contact info...</p>
        <p v-else-if="error">{{ error }}</p>
        <div v-else-if="contact">
            <h3 id="contactDetailsName">Name: {{ contact.Name }}</h3>
            <p id="contactDetailsEmail">Email: {{ contact.Email }}</p>
            <p id="contactDetailsPhoneNumber">PhoneNumber: {{ contact.PhoneNumber }}</p>
        </div>
    </section>
</template>