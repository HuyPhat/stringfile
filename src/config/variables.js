import DEV_VARIABLES from './variables.dev';
import PROD_VARIABLES from './variables.prod';

let ENV_VARIABLES;
if (process.env.NODE_ENV === 'development') {
  ENV_VARIABLES = DEV_VARIABLES;
} else if (process.env.NODE_ENV === 'production') {
  ENV_VARIABLES = PROD_VARIABLES;
}
export default ENV_VARIABLES;
