import userModel from "../models/userModel.js";

// add to panier 

const addToCart = async(req,res)=>{
    try{
        let userData = await userModel.findOne({_id:req.body.userId}) ; 
    let cartData = await userData.cartData;
    if(!cartData[req.body.itemId])
        {
            cartData[req.body.itemId] = 1 ;
        }
        else{
            cartData[req.body.itemId]++;
        }
        await userModel.findByIdAndUpdate(res.body.userId,{cartData});
        res.json({success: true ,  message:"item added to cart"})
        
    }catch{
        console.log(error) ; 
        res.json({success: false ,  message:"error "})
    }
    
}

// remove from panier 
const removeFromCard = async(req,res)=>{}

// fetch user cart data 

const getCart = async(req,res)=>{} 

export{addToCart , removeFromCard , getCart}