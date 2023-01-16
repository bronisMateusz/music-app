import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Favorites from "@/views/Favorites.vue";
import Discover from "@/views/Discover.vue";
import Upload from "@/views/Upload.vue";
import Song from "@/views/Song.vue";
import User from "@/views/User.vue";
import Genre from "@/views/Genre.vue";
import Album from "@/views/Album.vue";
import NotFound from "@/views/NotFound.vue";

const routes = [
  {
    name: "home",
    path: "/",
    component: Home,
    meta: {
      template: "AppTemplate",
    },
  },
  {
    name: "favorites",
    path: "/favorites",
    component: Favorites,
    meta: {
      template: "AppTemplate",
    },
  },
  {
    name: "discover",
    path: "/discover",
    component: Discover,
    meta: {
      template: "AppTemplate",
    },
  },
  {
    name: "upload",
    path: "/upload",
    component: Upload,
    meta: {
      template: "AppTemplate",
    },
  },
  {
    name: "song",
    path: "/song/:id",
    component: Song,
    meta: {
      template: "SongTemplate",
    },
  },
  {
    name: "user",
    path: "/user",
    component: User,
    meta: {
      template: "AppTemplate",
    },
  },
  {
    name: "genre",
    path: "/genre/:name",
    component: Genre,
    meta: {
      template: "AppTemplate",
    },
  },
  {
    name: "album",
    path: "/album/:id",
    component: Album,
    meta: {
      template: "AppTemplate",
    },
  },
  {
    path: "/:catchAll(.*)*",
    redirect: "/404",
    meta: {
      template: "AppTemplate",
    },
  },
  {
    path: "/404",
    component: NotFound,
    meta: {
      template: "AppTemplate",
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
