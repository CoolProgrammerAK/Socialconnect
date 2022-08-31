
const Postreducer= (state,{ type }) => {
    switch (type) {

    case 'FETCHING_POSTS':
        return {
          ...state, isfetchingposts:!state.isfetchingposts
        }
        case 'FETCHING_PROFILE':
            return {
             ...state,  isfetchingprofile:!state.isfetchingprofile
            } 
    default:
        return state
    }
}
export default Postreducer
