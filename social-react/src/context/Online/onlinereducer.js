
const Onlinereducer= (state,{ type,payload }) => {
    switch (type) {

    case 'FETCHING_ONLINEUSERS':
        return {
          ...state, onlineusers:payload.onlineusers,allonlineusers:payload.allonlineusers
        }

    default:
        return state
    }
}
export default Onlinereducer
