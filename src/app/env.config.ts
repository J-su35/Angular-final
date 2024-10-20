import { InjectionToken } from "@angular/core";

export type EnvConfig = {
  apiUrl: string;
};

export const ENV_CONFIG = new InjectionToken<EnvConfig>('ENV_CONFIG', {
  factory: () => {
    console.log('ENV_CONFIG');
    return { apiUrl: 'http://localhost:3000' }
  }
})
