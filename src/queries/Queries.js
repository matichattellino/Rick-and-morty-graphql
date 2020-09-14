export const GET_EPISODES_QUERY = gql => gql`
    query($page:Int, $filter: FilterEpisode) {
    episodes(page:$page, filter:$filter){
        info{
        count
        pages
        next
        prev
        }
        results{
            id
            name
            episode
            air_date
            characters{
            name
            image
          }
        }
    }
}
`

export const GET_CHARACTERS_QUERY = gql => gql`
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

export const GET_LOCATIONS_QUERY = gql => gql`
      query($page:Int, $filter: FilterLocation) {
        locations(page:$page, filter:$filter){
            info{
                count
                pages
                next
                prev
        }
        results{
            name
            dimension
            type
            residents {
              name
            }
        }
  }
}
` 
