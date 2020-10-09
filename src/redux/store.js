import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import userReducer from './userDuck'
import charactersDuck, { getCharactersAction } from './charactersDuck'

let rootReducer = combineReducers({
    user: userReducer,
    chars: charactersDuck
})

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export default function storeGenerate() {
    let store = createStore(    
        rootReducer, 
        composeEnhancers(applyMiddleware(thunk))
    )
    //get characters at the first time
    getCharactersAction()(store.dispatch, store.getState)
    return store 
}   