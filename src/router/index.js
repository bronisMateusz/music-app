import { createRouter, createWebHistory } from 'vue-router'

import AlbumView from '@/views/AlbumView.vue'
import DiscoverView from '@/views/DiscoverView.vue'
import GenresView from '@/views/GenresView.vue'
import GenreView from '@/views/GenreView.vue'
import HomeView from '@/views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import SongView from '@/views/SongView.vue'
import UserFavoritesView from '@/views/UserFavoritesView.vue'
import UserProfileView from '@/views/UserProfileView.vue'
import UserUploadsView from '@/views/UserUploadsView.vue'

const routes = [
  {
    name: 'album',
    path: '/album/:id',
    component: AlbumView,
    meta: {
      template: 'AppTemplate'
    }
  },
  {
    name: 'discover',
    path: '/discover',
    component: DiscoverView,
    meta: {
      template: 'AppTemplate'
    }
  },
  {
    name: 'genres',
    path: '/genres',
    component: GenresView,
    meta: {
      template: 'AppTemplate'
    }
  },
  {
    name: 'genre',
    path: '/genre/:name',
    component: GenreView,
    meta: {
      template: 'AppTemplate'
    }
  },
  {
    name: 'home',
    path: '/',
    component: HomeView,
    meta: {
      template: 'AppTemplate'
    }
  },
  {
    name: 'song',
    path: '/song/:id',
    component: SongView,
    meta: {
      template: 'SongTemplate'
    }
  },
  {
    name: 'favorites',
    path: '/favorites',
    component: UserFavoritesView,
    meta: {
      template: 'AppTemplate'
    }
  },
  {
    name: 'user',
    path: '/user',
    component: UserProfileView,
    meta: {
      template: 'AppTemplate'
    }
  },
  {
    name: 'uploads',
    path: '/uploads',
    component: UserUploadsView,
    meta: {
      template: 'AppTemplate'
    }
  },
  {
    path: '/:catchAll(.*)*',
    redirect: '/404',
    meta: {
      template: 'AppTemplate'
    }
  },
  {
    path: '/404',
    component: NotFoundView,
    meta: {
      template: 'AppTemplate'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
