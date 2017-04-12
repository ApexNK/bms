import Home from 'VIEWS/Home.vue';
import Stage from 'VIEWS/Stage.vue';
import FinishPage from 'VIEWS/Finish.vue';

const routes = [
  {
    path: '/normalModel/:startindex/end/:endindex',
    name: 'normalModel',
    component: Stage
  },
  {
    path: '/strangeModel/:startindex/end/:endindex',
    name: 'strangeModel',
    component: Stage
  },
  {
    path: '/finish/:startindex/end/:endindex/name/:modelname/curstate/:state/cost/:time',
    name: 'finish',
    component: FinishPage
  },
  {
    path: '/',
    name: 'home',
    component: Home
  }
]

export default routes
