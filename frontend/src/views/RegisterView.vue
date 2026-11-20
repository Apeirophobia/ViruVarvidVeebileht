<script setup lang="ts">
import { ref } from 'vue';
import UsersList from "../components/user/UsersList.vue"
import UserDetails from "../components/user/UserDetails.vue"

const selectedUserID = ref<string | null>(null)

function selectUser(id: string) {
  selectedUserID.value = id
}
</script>

<template>
    <div>
        <h1>See all users</h1>
        <UsersList @select="selectUser" />

        <UserDetails v-if="selectedUserID" :userId="selectedUserID" />
    </div>
</template>