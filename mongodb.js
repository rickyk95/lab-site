const MongoClient = require('mongodb').MongoClient;
//const url = 'mongodb://127.0.0.1:27017';
//const dbName = 'lab-db';
const url = process.env.MONGOURL;

console.log(process.env.MONGOURL)
console.log(process.env.MONGOURL)


const getDb = (callback,name,connectionString) =>{

    MongoClient.connect(connectionString,{useNewUrlParser:true,useUnifiedTopology: true},  (error,client)=>{

        if(error){
            return console.log('error found',error)
        }

        const db = client.db(name)
       
        console.log('Successfully connected!')

        callback(db)
      
      })

}


module.exports = {

    getDb
}