<script setup lang="ts">
import { ref, watch } from 'vue'
import { contactsServices } from '../../services/contactsServices'
import type { Contact, ContactInput } from '../../types/ContactSummary'

const props = defineProps<{
  ContactID?: string | null
}>()

const emit = defineEmits<{
  saved: []
}>()

function emptyContact(): ContactInput {
  return {
    Name: '',
    Email: '',
    PhoneNumber: ''
  }
}

const form = ref<ContactInput>(emptyContact())
const error = ref('')
const saving = ref(false)

async function loadContact() {
  error.value = ''
  if (!props.ContactID) {
    form.value = emptyContact()
    return
  }

  try {
    const contact: Contact = await contactsServices.getByID(props.ContactID)
    form.value = {
      Name: contact.Name,
      Email: contact.Email,
      PhoneNumber: contact.PhoneNumber,
    }
  } catch (err) {
    error.value = 'Cannot load this contact'
    console.error(err)
  }
}

async function saveContact() {
  saving.value = true
  error.value = ''

  try {
    if (props.ContactID) {

      // await contactsServices.update(props.ContactID, form.value)
    } else {
      await contactsServices.create(form.value)
    }

    emit('saved')
  } catch (err) {
    error.value = 'Saving failed'
    console.error(err)
  } finally {
    saving.value = false
  }
}

watch(() => props.ContactID, loadContact, { immediate: true })
</script>

<template>
  <section>
    <h2>{{ ContactID ? 'Edit Contact' : 'Create Contact' }}</h2>

    <form @submit.prevent="saveContact">
      <label for="contactName">ContactName</label><br />
      <input id="contactName" v-model="form.Name" required /><br /><br />

      <label for="email">Email</label><br />
      <input id="email" v-model.number="form.Email" type="email" required /><br /><br />

      <label for="phoneNumber">PhoneNumber</label><br />
      <input id="phoneNumber" v-model="form.PhoneNumber" required /><br /><br />

      <p v-if="error">{{ error }}</p>

      <button id="saveContact" type="submit" :disabled="saving">
        {{ saving ? 'Saving Contact...' : 'Save Contact' }}
      </button>
    </form>
  </section>
</template>