<script setup lang="ts">
import { ref, watch } from 'vue';
import {usersServices} from "../../services/usersServices"
import type {User} from "../../types/User"

const props = defineProps<{
    userId: string
}>()

const user = ref<User | null>(null)
const loading = ref(false)
const error = ref("")

async function loadUser(id: string) {
    user.value = null
    loading.value= true
    error.value=""

    try {
        user.value = await usersServices.getById(id)
    } catch (err) {
        error.value = "Can not load users details"
        console.error(err)
    } finally {
        loading.value = false
    }
}
watch(
    () => props.userId, loadUser, {immediate:true}
)

</script>

<template>
    <section>
        <h2>This user</h2>

        <p v-if="loading">Loading user...</p>
        <p v-else-if="error">{{ error }}</p>
        <div v-else-if="user">
            <h3>{{ user.FirstName }} {{ user.LastName }}</h3>
            <p>Id in app: {{ user.CustomerID }}</p>
            <p>{{ user.FirstName }}</p>
            <p>{{ user.LastName }}</p>
            <p>{{ user.DisplayName }}</p>
            <p>{{ user.Email }}</p>
            <p>{{ user.OrderIDList }}</p>
        </div>
    </section>
</template>
