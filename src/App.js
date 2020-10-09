import React from 'react';
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'

const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql'
})

const App = () => {
  return ( 
      <ApolloProvider client={client}>
           
      </ApolloProvider>
   );
}
 
export default App;
