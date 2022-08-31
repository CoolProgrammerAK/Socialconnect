const jwt=require("jsonwebtoken")
module.exports=async(req,res,next)=>{
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
 
  try {
      if(!token){
        throw {status: 422, message: "Unauthorized user"}
      }
    jwt.verify(token,process.env.TOKEN_ID,(err,
    decoded)=>{
        if (err) {
          throw {status: 422, message: err.message}
         }
         if (decoded) {
            req.user=decoded
            next()
           }
    })
  } catch (error) {
    return res.status(error.status).json({error:error.message})
  }

}