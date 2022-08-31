import React, { Component } from 'react'
class Loading extends Component {
    
    render() {
        const PF=process.env.REACT_APP_AVATAR
        return (
            <div style={{   
                margin:10,
                zIndex: 1222,
                width:'100%',display:'flex',alignItems:'center',justifyContent:'center',
                height: '60%'}}>
              <img style={{width:60}} src={PF+"loading.gif"} alt="dfs"></img>
            </div>
        )
    }
}

export default Loading