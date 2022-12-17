import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Favorites from "@/views/Favorites.vue";
import Library from "@/views/Library.vue";
import Discover from "@/views/Discover.vue";
import NotFound from "@/views/NotFound.vue";

const routes = [
  {
    name: "home",
    path: "/",
    component: Home,
  },
  {
    name: "favorites",
    path: "/favorites",
    component: Favorites,
  },
  {
    name: "library",
    path: "/library",
    component: Library,
  },
  {
    name: "discover",
    path: "/discover",
    component: Discover,
  },
  {
    path: "/:catchAll(.*)*",
    redirect: "/404",
  },
  {
    path: "/404",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
