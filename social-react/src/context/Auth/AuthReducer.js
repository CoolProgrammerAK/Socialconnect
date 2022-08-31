
const Authreducer= (state,{ type, payload }) => {
    switch (type) {

    case 'LOGIN_START':
        return {
            user:null,
            isFetching:{login:true,register:false},
            error:"",
        }
    case 'LOGIN_SUCCESS':
        localStorage.setItem("user",JSON.stringify(payload))
        return {   user:payload,
            isFetching:{login:false,register:false},
            error:""
        }
  
        case 'REGISTER_START':
        return {
            user:null,
            isFetching:{login:false,register:true},
            error:""
        }
    case 'DONE':
   
        return {   user:null,
            isFetching:{login:false,register:false},
            error:""
        }
    case 'UPDATED_PROFILE':
        return {
            ...state,user:localStorage.getItem('user')
        }
    default:
        return state
    }
}
export default Authreducer
