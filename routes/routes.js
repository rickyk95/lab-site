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
    service: 'gmail',
    auth: {
      user: 'labsanfelipe.sac@gmail.com',
      pass: 'Octubre131064'
    }
  });
  
  
  var mailOptions = {
      from: 'labsanfelipe.sac@gmail.com',
      to: 'rickyk95@hotmail.com',
      subject: 'Sending Email using Node.js',
      text: 'That was easy!',
      attachments:[
        {
          fileName:'logo.png',
          path:path.join(__dirname,'../public/images/logo.png'),
          cid:'123'
        }
      ]
    };



router.get('/contactanos',(req,res)=>{

    res.render('contactanos',{layout:false})
})



router.get('/faq', async (req,res)=>{

  getMongoDb(async (db)=>{

    let preguntas =  await db.collection('preguntas').find().toArray()

    res.render('faq',{layout:false,preguntas})

  })


  


})


router.get('/examenes',  (req,res)=>{

  
  getMongoDb( async (db)=>{

    let examsArray = await db.collection('examenes').find().toArray()

    res.render('examenes',{layout:false,examsArray})
  })
   
})



router.post('/contacto',(req,res)=>{

  console.log(__dirname)
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

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      res.send('Gracias por contactarnos')
   
})

module.exports=router;

