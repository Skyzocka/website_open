const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const { time } = require('console');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const router = express.Router();
const authRoutes = require('./routes/authRoutes'); // Import authRoutes
const userRoutes = require('./routes/userRoutes'); // Import userRoutes

const app = express();

// Configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create a pool instance for PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'login_information_db', 
  password: 'redact',
  port: 5432, // redact
    // redact
});

// Creating the routers
app.use('/auth', authRoutes(pool));
app.use('/users', userRoutes);


// Time functions
const d = new Date();
const time_full = d;
const current_time = [d.getTime(), time_full];

// Set the path to users.json file
const usersFilePath = path.join(__dirname, 'users.json');

// Set static folder
app.use(express.static(path.join(__dirname, '..', 'public')));

// Set views folder
app.set('views', path.join(__dirname, 'views', 'Ideagiver', 'Unregistred'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true })); // body-Parser Middleware

// Add a route for the home page
app.get('/', (req, res) => {
  res.render('index');
});

// Add a route for the home page (with en)
app.get('/en', (req, res) => {
  res.render('index');
});

// Add a route for the german home page
app.get('/de', (req, res) => {
  res.render('de/index_de');
});

// Add a route for the registration page

app.get('/en/registration', (req, res) => {
  res.render('en/registration');
}); 

// Handle form submission for registration
app.post('/registration', (req, res) => {

  const { name, pwd, birthdate, Land } = req.body;

  // Save user information to a local file (you may want to hash passwords in a real application)
  const user = { email: name, password: pwd, birthdate, country: Land };
  
/* fs.writeFile('C:\Users\Redacted\OneDrive\Dokumente\VSCodeAllgemeinesProgrammieren\website', user, err => {
  if (err) {
    console.error(err);
  } else {
    // file written successfully
  }
}); */

  console.log("The user " + name + " got registered at " + current_time[1]);
  try {
    // Read existing users from the file
    const fileContent = fs.readFileSync(usersFilePath, 'utf-8');
    const users = fileContent ? JSON.parse(fileContent) : [];

    // Add the new user to the array
    users.push(user);

    // Write the updated array back to the file
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');

    // Redirect back to the home page after processing the registration form
    res.redirect('/');
  } catch (error) {
    console.error('Error processing registration:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Handle form submission for contact
app.post('/contact', (req, res) => {
  const { name, surname, text, email, number, Land } = req.body;

  // Configure nodemailer (replace later with company mail configuration)
  const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',  // Will have to change later to the according host
    port: 587,  // Port number for secure TLS connection
    secure: false,  
    auth: {
        user: 'XXXXXXXXXXXXX@email.com',
        pass: 'XXXXXXXXXXXXXX',
    },
  });

  // Email message
  const mailOptions = {
    from: 'XXXXXXXX@email.com',
    to: 'XXXXXXX@email.com',
    subject: 'New Contact Form Submission',
    text: `Vorname: ${name}\nNachname: ${surname}\nE-Mail: ${email}\nTelefonnummer: ${number}\nMessage: ${text}\nLand: ${Land}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Thank you for your message!');
    }
  });

  // Redirect back to the home page after processing the contact form
  res.redirect('/');
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = pool;
module.exports = app;