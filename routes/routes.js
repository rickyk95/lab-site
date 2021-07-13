const express = require('express');
const path = require('path')
const router = express.Router();

const getMongoDb = require('../mongodb').getDb;

const {google}  = require('googleapis');


const connectToGoogle = async () =>{

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1MpYYZ5_5UBe_eaPWwWDPRfdiLcizqCOuMUrUsw9KNX4";

  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet1!A:A",
  })

  return getRows.data.values

}




var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'Godaddy',
  host: "smtpout.secureserver.net",  
  secureConnection: true,
  port: 465,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });
  

  
  var mailOptions = {
      from: process.env.EMAIL,
      to:'@gmail.com',
      subject: 'Sending Email using Node.js',
      attachments:[
        {
          fileName:'logo.png',
          path:path.join(__dirname,'../public/images/logo.png'),
          cid:'123'
        }
      ]
    };



router.get('/contactanos',(req,res)=>{



  
    res.render('contactanos',{layout:false},(error,html)=>{

        if(error){
          
          res.status(404).send("<h1 style='text-align:center;'>Se ha encontrado un error</h1>")

          return console.log(error)

        }else{

          res.send(html)
        }
    })


})



router.get('/faq', async (req,res)=>{

  let preguntas;

  getMongoDb(async (db)=>{


    try{

    
        preguntas =  await db.collection('preguntas').find().toArray()

        if(preguntas.length === 0) throw "<h1>Se ha encontrado un error</h1>"
        
        res.render('faq',{layout:false,preguntas},(error,html)=>{

            if (error) res.status(404).send("<h1 style='text-align:center;'>Ha habido un error</h1>")   
            
            res.status(200).send(html)
        })

    }catch(e){

        res.status(500).send(e)
    }

  },'lab-db',process.env.MONGOPRODUCTIONURL)
  
})






router.get('/examenes',(req,res)=>{

  let examsArray = [];

  
  getMongoDb(async (db)=>{

      try{

         examsArray = await db.collection('examenes').find().toArray()

          examsArray = examsArray.map((test)=>{

            return test.name
          }).sort()

          if(examsArray.length === 0) throw "<h1> Se ha encontrado un error "


          res.render('examenes',{layout:false,examsArray},(error,html)=>{

            if(error){
      
              console.log(error)
              res.status(404).send("<h1 style='text-align:center;'> Se ha econtrado un error </h1>")
      
            }else{
      
              res.status(200).send(html)
      
            }
          })

      }catch(e){

          res.send(e)

       }

    
  },'lab-db',process.env.MONGOPRODUCTIONURL)

})

 



router.post('/contacto',(req,res)=>{


    mailOptions.to = req.body.email
    mailOptions.subject = `Gracias por contactarnos ${req.body.nombre}`
    mailOptions.html = `<html>
                        <head>

                          <style>

                          html,body{

                            height:100%;
                          }

                          h5{

                            position:relative;
                            bottom:0;
                          }

                          </style>

                        </head>

                        <body>

                            <h3> Gracias por tu mensaje ${req.body.nombre},</h3> 
                            <p> En seguida estaremos en contacto contigo para responder tus preguntas. </p> 
                            <img src="cid:123" width=150px;height=150px;>
                        </body>

                        </html>

                        `
try{


    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });



      mailOptions.to = process.env.EMAIL
      mailOptions.subject = `Mensaje de correo ${req.body.email}`
      mailOptions.html = `<h5>Mensaje de ${req.body.nombre}:</h5>

      
                          <p>${req.body.message}</p>`;

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      

      res.redirect('/')

}catch{

  res.redirect('/contacto')
}
   
})

module.exports=router;

