<script setup lang="ts">
import { ref } from 'vue'
import ContactsList from '../components/contacts/ContactsList.vue'
import { contactsServices} from '../services/contactsServices.ts';

const selectedContactId = ref<string | null>(null)
const editing = ref(false)
const listVersion = ref(0)
const detailsVersion = ref(0)
const error = ref('')

function selectContact(ContactID: string) {
  selectedContactId.value = ContactID
  editing.value = false
}

function createContact() {
  selectedContactId.value = null
  editing.value = true
}

</script>

<template>
  <main>
    <h1>Contacts</h1>

    <button id="createService" @click="createContact">Add contact</button>
    <p v-if="error">{{ error }}</p>

    <ContactsList :key="listVersion" @select="selectContact" />


  </main>
</template>



