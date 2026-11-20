<script setup lang="ts">

import { ref} from "vue"
import Userslist from "../components/user/UsersList.vue"
import UserDetails from "../components/user/UserDetails.vue"

const selectedUserId = ref<string | null>(null)

    function selectUser(id: string) {
        selectedUserId.value = id
    }

</script>

<template>
    <div>
        <h1>See all users</h1>
        <Userslist @select="selectUser" />

        <UserDetails v-if="selectedUserId" :user-id="selectedUserId" />
    </div>
</template>