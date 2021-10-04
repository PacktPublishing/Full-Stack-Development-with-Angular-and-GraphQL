import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, from, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';
import { HttpHeaders } from '@angular/common/http';

const uri = 'http://localhost:8080/graphql'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink ): ApolloClientOptions<any> {
  const accessToken = localStorage.getItem('accessToken');
  const http = httpLink.create({ uri });
  const setAuthorizationLink = setContext(() => ({
    headers: new HttpHeaders().set(
      'Authorization', `Bearer ${accessToken}`
    )
  }));
  return {
    link: from([setAuthorizationLink, http]),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule { }
