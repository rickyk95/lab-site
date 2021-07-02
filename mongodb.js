const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'lab-db';

const getDb = (callback) =>{

    MongoClient.connect(url,{useNewUrlParser:true,useUnifiedTopology: true},  (error,client)=>{

        if(error){
            return console.log('error found')
        }

        const db = client.db(dbName)
       
        console.log('Successfully connected!')

        callback(db)
      
      })

}


module.exports = {

    getDb
}