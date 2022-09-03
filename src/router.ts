import {createRouter, createWebHistory} from "vue-router";

import HomeView from "./views/HomeView.vue";
import SpectatorView from "./views/SpectatorView.vue";
import BroadcastView from "./views/BroadcastView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/view/:code",
      name: "view",
      component: SpectatorView
    },
    {
      path: "/broadcast",
      name: "broadcast",
      component: BroadcastView
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: () => import("./views/NotFoundView.vue")
    }
  ]
});

export default router;
