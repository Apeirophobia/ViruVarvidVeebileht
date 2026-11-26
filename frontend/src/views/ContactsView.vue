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

</script>

<template>
  <main>
    <h1>Contacts</h1>

    <ContactsList :key="listVersion" @select="selectContact" />


  </main>
</template>



