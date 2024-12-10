import jwt from "jsonwebtoken"

const authMiddleware = async (req,res,next)=>{
    const {token} = res.headers ; 
    if(!token){
        return res.json({message:"Please login first."})
    }
    try{
        const token_decode =jwt.verify(token,process.env.JWT_SECRET) ; 
        req.body.userId = token_decode.id ; 
        next() ; 
    }catch(error){
        console.log(error);
        return res.json({success:false, message:"Invalid token."})
    }

}
export default authMiddleware ; 