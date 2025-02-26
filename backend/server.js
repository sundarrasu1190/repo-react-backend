const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql/msnodesqlv8');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

const dbConfig = {
  server: 'DESKTOP-2NN8EOQ\\MSSQLSERVER2019', // Use your server's name
  database: 'poc',
  options: {
    trustedConnection: true, // This enables Windows Authentication
  },
};

sql.connect(dbConfig, (err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the database');
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const request = new sql.Request();
  request.input('username', sql.VarChar, username);
  request.input('password', sql.VarChar, password);
  
  request.query('SELECT * FROM Users WHERE Username = @username AND Password = @password', (err, result) => {
    if (err) {
      console.error('SQL query error:', err);
      res.status(500).send('Error querying the database');
    } else {
      if (result.recordset.length > 0) {
        res.send('Login successful');
      } else {
        res.status(401).send('Invalid credentials');
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});