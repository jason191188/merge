const express = require(`express`);
const dotenv = require('dotenv');
const cookieparser = require('cookie-parser');
const cors = require('cors');
const {
  login,
  accessToken,
  refreshToken,
  loginSuccess,
  logout,
} = require('./router/ctrl');

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieparser());
app.use(cors({
  origin : 'http://localhost:3000',
  methods : ['GET', 'POST'],
  credentials : true,
}))

app.post('/login', login);
app.get('/accesstoken', accessToken);
app.get('/refreshtoken', refreshToken);
app.get('/login/success', loginSuccess);
app.post('/logout', logout);


module.exports = app;