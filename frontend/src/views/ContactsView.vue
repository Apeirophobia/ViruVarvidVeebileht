<script setup lang="ts">
import { ref } from 'vue'
import ContactsList from '../components/contacts/ContactsList.vue'
import ContactsDetails from '../components/contacts/ContactsDetails.vue'
import { contactsServices} from '../services/contactsServices.ts';
import ContactForm from '@/components/contacts/ContactForm.vue';


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

function contactSaved() {
  editing.value = false
  listVersion.value++
  detailsVersion.value++
}

</script>

<template>
  <main>
    <h1>Contacts</h1>

    <button id="createService" @click="createContact">Add contact</button>
    <p v-if="error">{{ error }}</p>

    <ContactsList :key="listVersion" @select="selectContact" />

    <ContactsDetails
      :key="`${selectedContactId}-${detailsVersion}`"
      :ContactID="selectedContactId"
    />

    <section v-if="editing">
      
      <button id="cancelEdit" @click="editing = false">Cancel</button>
      <ContactForm :ContactID="selectedContactId" @saved="contactSaved" />
    </section>

    <section v-if="selectedContactId && !editing">
   
    </section>

  </main>
</template>



