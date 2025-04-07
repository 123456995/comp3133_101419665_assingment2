import { ApplicationConfig, inject } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideApollo } from 'apollo-angular';
import { InMemoryCache, ApolloClientOptions } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';

import { environment } from '../environments/environment'; 

console.log('🌍 Using API URL:', environment.apiUrl); 

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      console.log('✅ Apollo is using:', environment.apiUrl); 
      return {
        cache: new InMemoryCache(),
        link: httpLink.create({ uri: environment.apiUrl }),
      } as ApolloClientOptions<any>;
    }),
  ],
};
