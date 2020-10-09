import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Routes from './Routes'
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-boost'
import { Provider } from 'react-redux';
import generateStore from './redux/store'

let store = generateStore()

const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql'
});

ReactDOM.render(
  <BrowserRouter>
      <ApolloProvider client={client}>
        <Provider store={store}>
          <Routes />
          <App /> 
        </Provider>
      </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
