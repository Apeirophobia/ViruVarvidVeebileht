<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import { usersServices } from "@/services/usersServices";
import type { UserRegister } from "@/types/User"

const props = defineProps<{
    userId?: string | null
}>()

const emit = defineEmits<{
    saved:[]
}>()

const error = ref("")
const saving = ref(false)

function emptyUser(): UserRegister {
    return {
        UserName: "",
        EmailAddress: "",
        UserStatus: null,
        SignupDate: new Date().toDateString(),
        UserCollectionID: null,
        ReviewListID: null,
        ProfileID: null,
        CredentialID: null,
        Password: "",
        PasswordConfirmation: null
    }
}

const form = ref<UserRegister>(emptyUser())

async function register() {
    saving.value = true
    error.value = ""

    try {
        await usersServices.register(form.value)
            console.log("try")
    } catch (err) {
        error.value = "Saving failed"
        if (err instanceof Error) {
        console.error(err.message);
        } else {
        console.error('An unknown error occurred:', err);
        }
    } finally {
        saving.value = false
    }
}

</script>

<template>
    <section>
        <h2>Input your personal and private data</h2>
        <p style="font-size: 3px; color:#fefefe;">haha made u look</p>
        <form @submit.prevent="register">
            <label for="UserName">User Name <span color="red">*</span></label><br/>
            <input id="UserName" v-model="form.UserName" required/><br/><br/>

            <label type="email" for="EmailAddress">Email Address <span color="red">*</span></label><br/>
            <input id="EmailAddress" v-model="form.EmailAddress" required/><br/><br/>

            <label for="Password">Password <span color="red">*</span></label><br/>
            <input type="password" id="Password" v-model="form.Password" required/><br/><br/>

            <label for="PasswordConfirmation">Confirm password <span color="red">*</span></label><br/>
            <input type="password" id="PasswordConfirmation" v-model="form.PasswordConfirmation" required/><br/><br/>

            <span color="red">Fields with an * (asterix) must be filled</span><br/><br/>

            <p v-if="error">{{ error }}</p><br/><br/>

            <button type="submit" :disabled="saving">{{ saving ? "Registering user, please hold" : "Register" }}</button><br/><br/>
        </form><br/><br/>
    </section>
</template>