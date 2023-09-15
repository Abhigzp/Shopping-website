const express = require("express");
const app = express();
var cors = require('cors')
require('./db/config');
const AddUserSch=require('./db/AddUserSch');
const User = require('./db/User');
const Product=require('./db/Product');
const { response } = require("express");
const Jwt = require('jsonwebtoken');
const jwtKey='e-comm';
const port= 3100
app.use(express.json());
app.use(cors());


app.post("/rejister", async (req,res)=>{
  let user = new User(req.body);
  let result = await  user.save();
  result = result.toObject();
  delete result.password;
  // res.send(result);
  Jwt.sign({result},jwtKey,{expiresIn:"1h"},(err,token)=>{
    if(err){
      res.send({result:"Something went wrong ,Please try  after some time"})
    }
    res.send({result,auth:token})
  })
});


app.post("/products", async (req,res)=>{
  let product=new Product(req.body);
  let result = await product.save();
  res.send(result);
  
})  
app.post('/login',async (req,res)=>{
  console.log(req.body);
  if (req.body.password && req.body.email){
    let user =  await User.findOne(req.body).select("-password");
    if(user){
    Jwt.sign({user},jwtKey,{expiresIn:"1h"},(err,token)=>{
      if(err){
        res.send({result:"Something went wrong ,Please try  after some time"})
      }
      res.send({user,auth:token})
    })
} else{
  res.send({result:"no user found"})
}
 }else {
  res.send({reult:"no user found"});
 }
});

// get all data 
app.get('/allProducts', async (req,res)=>{
  let data  = await Product.find();
  if(data.length>0){
    res.send(data);
  console.log(data);
    }else{
    res.send({result:"no products found"});
  }
});

//delete products 
app.delete('/delProduct/:id', async (req,res)=>{
  const result = await Product.deleteOne({_id:req.params.id})
  res.send(result);
})

app.post('/allUser', async (req,res)=>{
 // res.send("user added")
  let user1 = new AddUserSch(req.body);
  let result = await  user1.save();
  res.send(result);
});

// update 
app.get('/delProduct/:id',async (req,res)=>{
  let result = await Product.findOne({_id:req.params.id});
  if(result){
    res.send(result);
  }else{
    res.send({result:"No record found"})
  }
});

app.put('/delProduct/:id',async (req,res)=>{
  let result = await Product.updateOne(
    {_id:req.params.id}
    ,{
       $set:req.body
     }
    );

  res.send(result);

});
app.get("/search/:key",async(req,res)=>{
let result = await Product.find({
  "$or":[
    { name:{$regex:req.params.key}},
    { price:{$regex:req.params.key}},
    { category:{$regex:req.params.key}},
    { company:{$regex:req.params.key}}
  ]
});
res.send(result);
});


app.listen(port, ()=>console.log(`Server is Live at ${port}`));