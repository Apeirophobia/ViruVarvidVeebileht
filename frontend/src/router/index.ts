// type Router = TypesConfig extends Record<"Router", infer T> ? T : _RouterClassic;

import {createRouter, createWebHistory} from "vue-router"

import ServicesView from "../views/ServicesView.vue";
import RegisterView from "../views/RegisterView.vue";
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
      path: "/register",
      name: "register",
      component: RegisterView
    }
    ]
})

export default router