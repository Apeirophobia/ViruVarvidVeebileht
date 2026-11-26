<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { contactsServices } from '../../services/contactsServices.ts'
import type { ContactSummary } from '../../types/ContactSummary'

const contacts = ref<ContactSummary[]>([])
const loading = ref(false)
const error = ref("")
const emit = defineEmits<{
    select: [ContactID: string]
}>()

async function loadContacts(){
    loading.value = true
    error.value = ""
    try { 
        contacts.value = await contactsServices.getAll()
    } catch (err) {
        error.value = "Failed to load services."
        console.log(err)
    } finally {
        loading.value = false
    }
}

onMounted(loadContacts)
</script>

<template>
    <section>
        <h2>Contacts</h2>
        <button @click="loadContacts">Refresh</button>
        <p v-if="loading">Loading Contacts...</p>
        <p v-else-if="error">{{ error }}</p>
        <p v-else-if="contacts.length === 0">No contacts have been found</p>
        <ul v-else>
            <li v-for="contacts in contacts" :key="contacts.ContactID">
                <button :id="'details-' + contacts.ContactID" @click="emit('select', contacts.ContactID)">{{ contacts.Name }} </button>
                ({{ contacts.ContactID }})
            </li>
        </ul>
    </section>

</template>