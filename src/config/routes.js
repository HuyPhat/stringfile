import App from 'App';
import auth_routes from 'auth/routes';
import file_routes from 'files/routes';
import team_routes from 'teams/routes';
import people_routes from 'people/routes';
import settings_routes from 'settings/routes';

const routes = [].concat(auth_routes, [
  {
    path: '/',
    component: App,
    private: true,
    routes: [].concat(file_routes, team_routes, people_routes, settings_routes)
  }
]);

export default routes;
