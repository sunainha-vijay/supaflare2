import SignInRoute from './sign-in.vue';

export { SignInRoute };
export default SignInRoute;
import { createRouter, createWebHistory } from 'vue-router'
import SignUp from './sign-up.vue'

const routes = [
  // other routes
  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
