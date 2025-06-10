const express=require("express");
const dbconnection=require("./MongoDb");
const app=express();
app.use(express.json());//json data ko solve krne k liye//
app.get('/',async (req,res)=>{
    let data=await dbconnection();
    const result= await data.find().toArray();
res.send(result);
});
app.post("/",async (req,res)=>{
   let data=await dbconnection();
   const result=await data.insertOne(req.body)
    res.send(result);
});
app.put("/:name",async (req,res)=>{
    let data=await dbconnection();
    const result= await data.updateOne(
        {name:req.params.name},
        {$set:req.body}
    )
    res.send({name:"arjun"});
});
app.delete("/:name",async (req,res)=>{
    let data=await dbconnection();
    const result= await data.deleteOne(
        {name:req.params.name}
    )
   
    res.send({name:"ram"});
})

app.listen(5000);