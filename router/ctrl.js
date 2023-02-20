const userDatabase = require('../databases/Databases');
const jwt = require('jsonwebtoken');
// const { response } = require('../app');

const login = (req, res) => {
  const {user, pw} = req.body;

  const userInfo = userDatabase.filter(item => {
    return item.user === user && item.pw === pw;
  })[0];

  if(!userInfo){
    res.status(403).json({
      success: false
    });
  }else{
    try {
       //access token 발급
       const accessToken = jwt.sign({
        id : userInfo.id,
        user : userInfo.user,
        username : userInfo.username,
      }, process.env.ACCESS_SECRET, {
        expiresIn : '5m',
        issuer : 'Fullio', 
      });

      //refresh token 발급
      const refreshToken = jwt.sign({
        id : userInfo.id,
        user : userInfo.user,
        username : userInfo.username,
      },  process.env.REFRESH_SECRET, {
        expiresIn : '6h',
        issuer : 'Fullio', 
      });

      //token 전송
      res.cookie("accessToken",accessToken, {
        secure : false,
        httpOnly : true,
      });

      res.cookie("refreshToken",refreshToken, {
        secure : false,
        httpOnly : true,
      });

      res.status(200).json({
        success: true
      });
      } catch (error) {
            
        res.status(500).json(error);
    }
  }
}

const accessToken = (req, res) => {
   try {
    const token = req.cookies.accessToken;
    const data = jwt.verify(token, process.env.ACCESS_SECRET);

    const userData = userDatabase.filter(item => {
      return item.user === data.user;
    })[0];

    const {pw, ...others} = userData;

    res.status(200).json(others);
   } catch (error) {
    res.status(500).json(error);
   } 
}

const refreshToken = (req, res) => {
  //access token 갱신
  try {
    const token = req.cookies.refreshToken;
    const data = jwt.verify(token, process.env.REFRESH_SECRET);

    const userData = userDatabase.filter(item => {
      return item.user === data.user;
    })[0]

    //access token 재발급
    const accessToken = jwt.sign({
      id : userData.id,
      user : userData.user,
      username : userData.username,
    }, process.env.ACCESS_SECRET, {
      expiresIn : '5m',
      issuer : 'Fullio', 
    });
    //쿠키전송
    res.cookie("accessToken",accessToken, {
      secure : false,
      httpOnly : true,
    });

    res.status(200).json("Access Token Recreated");

  } catch (error) {
    res.status(500).json(error);
  }
}

const loginSuccess = (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const data = jwt.verify(token, process.env.ACCESS_SECRET);

  const userData = userDatabase.filter(item => {
    return item.user === data.user;
  })[0];

  res.status(200).json(userData)

  } catch (error) {
    res.status(500).json(error)
  }
  


}

const logout = (req, res) => {
  try {
    res.cookie('accessToken', '');
    res.status(200).json("Logout Success");
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  login,
  accessToken,
  refreshToken,
  loginSuccess,
  logout,
}