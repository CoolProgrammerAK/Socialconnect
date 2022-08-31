
const Notificationreducer= (state,{ type,payload }) => {
    switch (type) {
      case 'REFRESHING_NOTIFICATION':
        return {
          ...state, fetchnotification:!state.fetchnotification
        }
    case 'FETCHING_NOTIFICATION':
      var d=payload.sort((a,b)=>new Date(b.time)-new Date())
   
      
        return {
        notifications:[ ...d]
        }
    // case 'REMOVING_NOTIFICATION':
    //     var data=state.notifications.filter(notification => payload.sender!=notification.sender && payload.type!= notification.notificationType )
       
    //         return {
    //           notifications:data
    //         }
    default:
        return state
    }
}
export default Notificationreducer
