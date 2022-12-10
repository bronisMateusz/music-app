import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Favorites from "@/views/Favorites.vue";
import Library from "@/views/Favorites.vue";
import Discover from "@/views/Favorites.vue";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/favorites",
    component: Favorites,
  },
  {
    path: "/library",
    component: Library,
  },
  {
    path: "/discover",
    component: Discover,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
