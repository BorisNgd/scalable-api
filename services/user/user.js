const express = require('express');
const nodeMailer = require('nodemailer');
const User = require('../../models/user');

const getUsers = async (req , res , next) =>{
    try{
        let users = await User.find({});

        if (users.length > 0) {
            return res.status(200).json({
                'message' : 'users fetched successfully',
                'data': users
            });
        }
    }catch(error){
        return res.status(500).json({
            'code' : 'SERVER_ERROR',
            'description' : 'something went wrong , Please try again later'
        });
    }
}

const getUserById = async (req ,res , next) => {
    try {
        let user = await User.findById(req.params.id);
        if(user){
            return res.status(200).json({
                'message' : `user with id ${req.params.id} fetched successfully`,
                'data':user
            });
        }

        return res.status(404).json({
            'code' : 'BAD_REQUEST_ERROR',
            'description': 'No users found in the system'
        });

    } catch (error) {
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong , please try again'
        });
    }
}

const createUser = async (req , res , next) =>{
    try {
        const{
            name,
            email
        } = req.body;

        if(name === undefined || name === ''){
            return res.status(422).json({
                'code':'REQUIRED_FIELD_MISSING',
                'description': 'name is required',
                'field': 'name'
            });
        }

        if (email === undefined || email === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'email is required',
                'field': 'email'
            });
        }

        let isEmailExists = await User.findOne({
            "email" : email
        });

        if(isEmailExists){
            return res.status(409).json({
                'code':'ENTITY_ALREADY_EXISTS',
                'description': 'email already exists',
                'field':'email'
            });
        }

        const temp = {
            name:name,
            email:email
        }

        let newUser = await User.create(temp);

        if(newUser){
            return res.status(201).json({
                'message':'User created successfull',
                'data' : newUser
            });
        }else{
            throw new Error('something went wrong')
        }
    } catch (error) {
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description' : 'something went wrong'
        });
    }
}

const updateUsser = async (req , res , next) =>{
    try {
        const userId = req.params.id;

        const{
            name,
            email
        } = req.body;

        if(name === undefined || name === ''){
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'name is required',
                'field':'name'
            });
        }

        if(email === undefined || email === ''){
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'email is required',
                'field':'email'
            });
        }

        let isUserExists = await User.findById(userId);

        if(!isUserExists){
            return res.status(404).json({
                'code':'BAD_REQUEST_ERROR',
                'description': 'No user found in the system'
            });
        }

        const temp = {
            name: name,
            email:email
        }

        let updateUser = await User.findByIdAndUpdate(userId , temp,{
            new:true
        });

        if (updateUser) {
            return res.status(200).json({
                'message': 'user updated successfully',
                'data':updateUser
            })
        }else{
            throw new Error('Something went wrong');
        }
    } catch (error) {
        return res.status(500).json({
            'code':'SERVER_ERROR',
            'description': 'something went wrong , please try again'
        });
    }
}

const deleteUser = async (req , res , next) =>{
    try {
        let user = await User.findByIdAndRemove(req.params.id);
        if (user) {
            return res.status(204).json({
                'message' : `user wih id ${req.params.id} deleted succesfully`
            });
        }

        return res.status(404).json({
            'code':'BAD_REQUEST_ERROR',
            'description': 'No users found'
        });

    } catch (error) {
        return res.status(500).json({
            'code':'SERVER_ERROR',
            'description': 'something went wrong'
        });
    }
}

const sendEmailtoUser =  (req , res , next) =>{

    let email =  req.body.email;
    try {

       if(email === undefined || email === ''){
            return res.status(422).json({
                'code':'REQUIRED_FIELD_MISSING',
                'description': 'email is required',
                'field': 'email'
            });
       }

       console.log(email);

       let transport = nodeMailer.createTransport({
           host: "smtp.mailtrap.io",
           port: 2525,
           auth: {
               user: "05edd8e00903dc",
               pass: "320c1749b0d113",
           },
           debug:true,
           logger:true
       });

       let mailOptions = {
           from:'"Boris Ngd" <xxxxxx@mail.com>',
           to:email,
           subject:'Testing Email' ,
           html: '<b>Send email in Node.js | Tutorials by Boris</b>'
       }

       transport.sendMail(mailOptions , (err , info) =>{
           if(err){
               res.status(500).json({
                   'code':'UNKOWN ERROR',
                   'description':err
               });
           }else{
               console.log(info);
               res.status(200).json({
                   'status': true,
                   'message':'Email send successfully'
               });
           }
       });

    } catch (error) {
        console.log(error);
        return res.status(200).json({
            'error':{
                'message':'Something went wrong'
            }
        });
    }
}

module.exports = {
    getUsers: getUsers,
    getUserById: getUserById,
    createUser: createUser,
    updateUser: updateUsser,
    deleteUser: deleteUser,
    sendEmailtoUser: sendEmailtoUser
}