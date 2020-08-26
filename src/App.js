import React from 'react';
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import GetCharacters from './components/characters/GetCharacters'
import Routes from './Routes';

const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql'
}) 

console.log(client);

// const GET_DATA = gql`  
//   {
//     characters {
//       results {
//         id
//         name
//       }
//     }
//   }
// `

const App = () => {
  return ( 
      <ApolloProvider client={client}>
           
      </ApolloProvider>
   );
}
 
export default App;
