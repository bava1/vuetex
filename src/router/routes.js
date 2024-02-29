
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'tasks', component: () => import('pages/TasksPage.vue') },
      { path: 'articles', component: () => import('pages/ArticlesPage.vue') },
      { path: 'about', component: () => import('pages/AboutPage.vue') },
      { path: 'contacts', component: () => import('pages/ContactsPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
