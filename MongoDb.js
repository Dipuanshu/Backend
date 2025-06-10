const {MongoClient}=require('mongodb')
const url='mongodb://localhost:27017';//ab tak node js ko pta nhi hai ki mongodb kha per hai to uska path de denge//mangodb ka path hai ye
const database="e-comn"//Mongo Db k ander es database se connect krna hai//
const client=new MongoClient(url) //client variable k ander  mongodb se data fatch krke client mai store kiya
async function dbconnection(){
    let result=await client.connect()//ye function promise return krega to handle krne k liye awit lagyenge//
    let db=result.db(database);//kon se wale database se connect krna hai//
    let collection=db.collection('products');
    return collection;
}
module.exports=dbconnection;