import {environment as devEnv} from './environment.dev';
/*
 here you can overide production  specific configurations
 */
export const environment = {
  ...devEnv,

  production: true,
};
