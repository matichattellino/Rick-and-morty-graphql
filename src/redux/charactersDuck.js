import { gql } from 'apollo-boost';
import ApolloClient from 'apollo-boost';    

//constants
let initialData = {
    loading: false,
    characters: [],
}

let client = new ApolloClient({
    uri: 'https://rickandmortyapi.com/graphql'
})

let GET_CHARACTERS = "GET_CHARACTERS"
let GET_CHARACTERS_SUCCESS = "GET_CHARACTERS_SUCCESS"
let GET_CHARACTERS_ERROR = "GET_CHARACTERS_ERROR"

//reducer
export default function reducer(state = initialData, action){
    switch(action.type){
        default:
            case GET_CHARACTERS:
            case GET_CHARACTERS_SUCCESS:
            case GET_CHARACTERS_ERROR:
            return state
    }
}

//actions
export let getCharactersAction = () => (dispatch, getState) => {
    let query = gql`
        query($page:Int, $filter: FilterCharacter) {
                    characters(page:$page, filter: $filter){
                        info{
                            count
                            pages
                            next
                            prev
                        }
                        results{
                            name
                            id
                            image
                            type
                        gender  
                        species
                        }
                    }
                }
    `
    dispatch({
        type: GET_CHARACTERS
    })
    return client.query({
        query,
        variables: { page: 1 },
    })
        .then(res => {
           dispatch({
               type: GET_CHARACTERS_SUCCESS,
               payload: res.data.characters
           })
        })
        .catch(err => {
            dispatch({
                type: GET_CHARACTERS_ERROR,
                payload: err
            })
            return;
        })
}
