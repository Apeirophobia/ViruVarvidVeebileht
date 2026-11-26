// type Router = TypesConfig extends Record<"Router", infer T> ? T : _RouterClassic;

import {createRouter, createWebHistory} from "vue-router"

import ServicesView from "../views/ServicesView.vue"
import RegisterView from "../views/RegisterView.vue"
import UsersView from "../views/UsersView.vue"
import ContactsView from "@/views/ContactsView.vue"
/*teiste vaadete impordid käivad siia ka*/
const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: "/",
      redirect: "/services"
    },
    {
      path: "/services",
      name: "services",
      component: ServicesView
    },
    {
      path: "/users",
      name: "users",
      component: UsersView
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView
    },
    {
      path: "/contacts",
      name: "contacts",
      component: ContactsView
    }
  ]
})

export default router