// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const Mailgen = require('mailgen');
// const nodemailer = require('nodemailer');
// const axios = require('axios');
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';
import axios from 'axios';


const app = express()
const port = 5000

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const password = process.env.VITE_PASSWORD;
const email = process.env.VITE_EMAIL;
const apikey = process.env.VITE_API_KEY;
const secretKey = process.env.VITE_SECRETKEY;


const authenticate = (req, res, next) => {
  const providedApiKey = req.headers['x-api-key'] || req.query.apiKey;
  if (providedApiKey && providedApiKey === apikey) {
    next(); // Proceed to the next middleware/route handler
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
  };
  // Apply authentication middleware to all routes that need protection
  app.use('/api', authenticate);




const expiresIn = '1h';
  let configEmail = {
      service : 'gmail',
      auth : {
          user: email,
          pass: password
      }
  };

  let transporter = nodemailer.createTransport(configEmail);
  let MailGenerator = new Mailgen({
      theme: "neopolitan",
      product : {
          name: "Successful registation",
          link : 'https://thomaskitaba.github.io/architects/'
      },
      customCss: `
    body {
      background: linear-gradient(to right, #24243e, #302b63, #0f0c29);
      color: white;
    }
  `,
      footer: {
        text: "Copyright © 2024 architects"
      }
  });

  let ContactGenerator = new Mailgen({
    theme: "default",
    product : {
        name: "Contact Message",
        link : 'https://thomaskitaba.github.io/architects/'
    },

    footer: {
      text: "Copyright © 2024 tom-architects"
    }
});


const sendEmail = async (data) => {
  const {destinationEmail, mailType} = data;
  console.log(`inside sendmail ${destinationEmail}`);

  let response = '';
  let subject = '';
  // if (mailType === 'sign-up') {
  //   const {userId, mailType} = data;
  //   todo Insert Confi
  //   const token = await signEmail(userId);
  //   const confirmationLink = `https://architects.onrender.com/confirm?token=${token}`;
  //   subject = "Confirm your Account";
  //   response = {
  //     body: {
  //       name: "from architects team",
  //       intro: "You have Successfully created an account, Confirm your account using the link provided below",
  //       table: {
  //         data: [
  //           {
  //             confirm: confirmationLink,
  //             expires: "after 1 hour",
  //           }
  //         ]
  //       },
  //       outro: "Enjoy our Website, and don't hesitate to contribute your work with us so that everyone can see."
  //     }
  //   };
  // } else
   if (mailType === 'contact') {

    const {userId, mailType, form} = data;
    console.log(`inside sendmail ${destinationEmail}`);
    // destinationEmail = 'thomas.kitaba@gmail.com';
    console.log(form); // test
    console.log(form.message); // test

    subject = 'Contact Form Submission';
    if (form && form.fname && form.lname) {
      subject = `${form.fname} ${form.lname}'s Message`;
    }
    response = {
      body: {
        name: `from :${form.fname} ${form.lname}:- ${form.message}`,
        phone: `${form.phone}`,
        email: `${form.email}`,
        message: `Message: ${form.message}`,
      }
    };
  } else {
    return { message: 'Invalid request' };
  }

  // let mail = MailGenerator.generate(response);
  // if (mailType === 'contact') {
    mail = ContactGenerator.generate(response);
    mail = mail.replace('Yours truly, Contact Message', '');
  // }
    let message = {
      from: 'thomas.kitaba.diary@gmail.com',
      to: destinationEmail || 'thomas.kitaba.diary@gmail.com',
      subject: `${subject}`,
      html: mail
    };

    return new Promise((resolve, reject) => {
      if (transporter.sendMail(message)) {
        resolve({ message: "Message Sent Successfully" });
      } else {
        reject ({ error: 'error sending mail' });
      }
    })
};

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
