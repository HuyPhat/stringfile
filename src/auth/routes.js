import LogInPage from './components/LogIn';
import LogoutView from './components/Logout';
import ForgotPassword from './components/ForgotPassword';
import LogInLinkedIn from './components/LogInLinkedIn';
import SignUpPlans from './components/SignUpPlans';
import SpecifiedPlan from './components/SpecifiedPlan';

export default [
  {
    path: '/sign-in',
    component: LogInPage
  },
  {
    path: '/linkedin/oauth2/callback',
    component: LogInLinkedIn
  },
  {
    path: '/forgot-password',
    component: ForgotPassword
  },
  {
    path: '/sign-out',
    component: LogoutView,
    private: true
  },
  {
    path: '/sign-up',
    component: SignUpPlans,
    private: false,
    routes: [
      {
        path: '/sign-up/starter',
        component: SpecifiedPlan,
        private: false
      },
      {
        path: '/sign-up/professional',
        component: SpecifiedPlan,
        private: false
      },
      {
        path: '/sign-up/teams',
        component: SpecifiedPlan,
        private: false
      },
      {
        path: '/sign-up/switch-to-team',
        component: SpecifiedPlan,
        private: false
      }
    ]
  }
];
