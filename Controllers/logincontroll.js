
const  usersModel = require('../Schema/userschema')
const  loginvalidation  = require("../validation/loginval")
const bcrypt=require('bcrypt')
let jwt = require('jsonwebtoken');
require('dotenv').config();

//login function
const loginpost = async (req, res) => {
    try {
        // validation
        const { error } = loginvalidation(req.body);
        if (error) return res.status(449).send(error.message);
    
        // find user data
        const usergetdata = await usersModel.findOne({
            email: req.body.email,
        });
        if (!usergetdata)
          return res.status(401).send({
            status: false,
            message: 'username or password is incorrect',
          });
    
        // check password
        const checkpass = await bcrypt.compare(
          req.body.password,
          usergetdata.password
        );
        if (!checkpass)
          return res.status(401).send({
            status:false,
            message: 'username or password is incorrect',
          });
        // token using jwt
        const token = jwt.sign(
          {
            id: usergetdata._id,
            name: usergetdata.name,
            role:usergetdata.role
          },
          process.env.secrate_key
        );
        
    
        res.status(200).header('token', token).json({
          status: true,
          message: 'successfully logged in',
          token: token,
        });
      } catch (error) {
        res.status(400).send(error.message);
      }
};

module.exports = {loginpost};