import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Favorites from "@/views/Favorites.vue";
import Library from "@/views/Favorites.vue";
import Discover from "@/views/Favorites.vue";

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
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
