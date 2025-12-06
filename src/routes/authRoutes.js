const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const router = express.Router();

// An authenticated Registration route

const createAuthRoutes = (pool) => {
    
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Generate salt for password hashing
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
  
        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(password, salt);
  
        // Save the hashed password and other required fields in the database
        await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
  
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
});
  
  // (Another authentication Route, the Login route)
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Retrieve user data from the "users" table
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await pool.query(query, [email]);
  
      if (result.rows.length === 0) {
        return res.status(401).send('Invalid email or password');
      }
  
      const user = result.rows[0];
  
      // Compare the hashed password with the provided password
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).send('Invalid email or password');
      }
  
      res.send('Login successful');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error logging in');
    }
  });

  return router;
};
  
  module.exports = router;
  module.exports = createAuthRoutes;