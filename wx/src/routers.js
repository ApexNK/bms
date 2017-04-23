import TabPage from 'VIEWS/TabPage/TabPage.vue';
import UserCenter from 'VIEWS/TabPage/UserCenter.vue';
import Income from 'VIEWS/TabPage/Income.vue';
import LoginPage from 'VIEWS/LoginPage.vue';
import AgentPage from 'VIEWS/AgentPage.vue';
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/',
    name: 'Agent',
    component: AgentPage
  },
  {
    path: '/Tab',
    name: 'Tab',
    component: TabPage,
    children: [
      {
        path: '/',
        redirect: '/Tab/UserCenter',
        component: UserCenter
      },
      {
        path: 'UserCenter',
        name: 'Tab.UserCenter',
        component: UserCenter
      },
      {
        path: 'Income',
        name: 'Tab.Income',
        component: Income
      }
    ]
  }
]

export default routes
