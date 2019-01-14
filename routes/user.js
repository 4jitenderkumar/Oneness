var nodemailer = require('nodemailer');

var User = require('../models/user');
var Community = require('../models/community');
var secret = require('../secret/secret.js');
var objectId = require('mongodb').ObjectID;
var multer = require('multer')

var storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, 'public/Upload/Profile/');
    },
    filename: function (request, file, callback) {
        console.log(file);
        callback(null, file.originalname)
    }
});

var upload = multer({ storage: storage });

module.exports = (app, passport) => {// app? , now we have access to the instance of express i.e. app

    app.get('/', (req, res, next) =>{//http method, Gets information
        
        if(req.session.cookie.originalMaxAge){// session is active
            res.redirect('/profile');
        }
        else{
            var errors = req.flash('error');
            console.log(errors);
            res.render('user/login.ejs', {title: 'Login', messages: errors, hasErrors: errors.length > 0});  

        } 
    });

    app.post('/' , passport.authenticate('local.login', {
        failureRedirect: '/',
        failureFlash   : true
    }), (req, res) => {
            console.log('Successfully logged in');
            req.session.cookie.maxAge = 30*24*60*60*1000; // 30 days 
            res.redirect('/profile'); 
    });

    
    app.get('/deactivated', (req, res, next) =>{//http method, Gets information

        res.render('user/deactivated.ejs', {title: 'Deactivated', user: req.user});  
     
    });

    app.get('/detail', (req, res, next) =>{//http method, Gets information

        res.render('user/detail.ejs', {title: 'Details', user: req.user});  
     
    });

   app.post('/detail', upload.single('image'), function(req, res, next) {//http method, Gets information
    
            User.updateOne(
                { "_id": objectId(req.user._id)}, 
                { $set:
                   {
                    "name" : req.body.name,
                    "image": req.file.originalname,
                    "dob"  : req.body.dob,
                    "gender" : req.body.gender,
                    "phone"  : req.body.phone,
                    "city" : req.body.city,
                    "interest" : req.body.inerest,
                    "journey"  : req.body.journey,
                    "expectation" : req.body.expectation, 
                    "status" : "confirmed"
                   }
                },(err, result) => {
                   if(err)
                   console.log("ERRORERROR" + err);
                   //else
                  // console.log(result);
                }
             )
              
             console.log(req.user);

            res.redirect('/profile');
    });


    app.get('/profile', (req, res, next) =>{//http method, Gets information

        if(req.user.activated == 'no'){// Deactivated
            res.redirect('/deactivated');
        }
        else{
            if(req.user.status == 'pending'){
                res.redirect('/detail');
            }
            else{
                if(req.user.role == 'user' || req.user.role == 'community manager')
                res.render('user/userProfile.ejs', {title: 'Profile', user: req.user});
                else// if admin
                res.render('user/profile.ejs', {title: 'Profile', user: req.user});  



            }
        }
     
    });

    

    app.get('/admin/profile', (req, res, next) =>{//http method, Gets information

        res.render('user/profile.ejs', {title: 'Profile', user: req.user});  
     
    });


    app.get('/admin/adduser', (req, res, next) =>{//http method, Gets information
        var error = req.flash('error');//#messages = errors
        var success = req.flash('success');
        console.log(error);
        res.render('user/adduser.ejs', {title: 'Add User', messages: error, hasErrors: error.length > 0, success: success, noErrors: success.length > 0, user: req.user});
         
    });

    app.post('/admin/adduser', passport.authenticate('local.signup', {
        //successRedirect: '/admin/adduser',
        failureRedirect: '/admin/adduser',
        failureFlash   : true
    }), (req, res) =>{

        var transport = nodemailer.createTransport({
            service: 'Yahoo',
            auth: {
                user: 'jitender614701@yahoo.com',
                pass: ''
            }
        });

        var mailOptions = {
            to: 'abhishekgoel101@gmail.com',
            from: 'jitender614701@yahoo.com',
            subject: 'User Account',
            html: 'Hello,\n\nYou are receiving this because you have been signed up as ' + req.body.roleoptions + ' at Oneness\n\nE-Mail: ' + req.body.email + '\n\nPassword: ' + 'req.body.password\n\nClick this link to login: http://localhost:3000/reset',
        };

        //to send the email
        transport.sendMail(mailOptions, (err, info) => {
            if(err){
                console.log(err);
            }
            else{
            console.log('Email has been sent' + info.response);
            }

            req.flash('success', 'Email has been sent to '+req.body.email);
            
            var error = req.flash('error');
            var success = req.flash('success');

            res.render('user/adduser.ejs', {title: 'Add User', messages: error, hasErrors: error.length > 0, success: success, noErrors: success.length > 0, user: req.user});

   
        });

    });

    app.get('/changePassword', (req, res, next) =>{//http method, Gets information
        var error = req.flash('error');//#messages = errors
        var success = req.flash('success');
        console.log(error);
        res.render('user/changePassword.ejs', {title: 'changePassword', messages: error, hasErrors: error.length > 0, success: success, noErrors: success.length > 0, user: req.user});
         
    });

    app.post('/changePassword', (req, res, next) =>{//http method, Gets information

        if(!req.user.validPassword(req.body.oldPassword)){

        req.flash('error','oldPassword is incorrect');
        res.redirect('/changePassword');
        }
        else{
            // all set now SAVE
                
                User.updateOne(
                    { "_id": objectId(req.user._id)}, 
                    { $set:
                       {
                        "password" :  req.user.encryptPassword(req.body.newPassword),
                       }
                    },(err, result) => {
                       if(err)
                       console.log("ERRORERROR" + err);
                       else{
                       console.log("Password is updated");

                       req.flash('success','Password is Updated' );
                       res.redirect('/changePassword');
                    }

                    }
                )
                 
                }
         
    });

    app.get('/admin/userList', (req, res, next) =>{//http method, Gets information
    
    res.render('user/userList.ejs', {title: 'User List', user: req.user});

    });

    //JSON
    app.get('/admin/userListData', (req, res, next) =>{//http method, Gets information
    
        User.find({}, (err, data) => {
            if(err)
            console.log(err);
            else
            res.json({data});
     });     
        });

    app.post('/admin/userList', (req, res, next) =>{//http method, Gets information
    
    
     });

     app.post('/admin/sendmail', (req, res, next) =>{//http method, Gets information
     console.log(req.body.username);
     console.log(req.body.subject);
     console.log(req.body.body);
    
     //send mail


      var smtpTransport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: secret.auth.user,
                pass: secret.auth.pass
            }
        });

        var mailOptions = {
            to: req.body.username,
            from: secret.auth.user,
            subject: req.body.subject,
            text: req.body.body
        };

        //to send the email
        smtpTransport.sendMail(mailOptions, (err, response) => {
            if(err){
                console.log(err);
            }
            else{
            console.log('Email has been sent');
            }

            req.flash('success', 'Email has been sent to '+req.body.email);
            
            var error = req.flash('error');
            var success = req.flash('success');

            res.render('user/adduser.ejs', {title: 'Add User', messages: error, hasErrors: error.length > 0, success: success, noErrors: success.length > 0, user: req.user});



        });
     });

     app.post('/admin/updateinfo', (req, res, next) =>{//http method, Gets information
        User.updateOne(
            { "_id": objectId(req.body._id)}, 
            { $set:
               {
                "phone"  : req.body.phone,
                "city" : req.body.city,
                "status" : req.body.status,
                "role" : req.body.role
               }
            },(err, result) => {
               if(err)
               console.log("ERRORERROR" + err);
               else
               console.log(result);
            }
         )

    });

    app.post('/admin/activation', (req, res, next) =>{//http method, Gets information
    console.log(req.body._id + req.body.active);
    if(!req.body.active){
        User.updateOne(
            { "_id": objectId(req.body._id)}, 
            { $set:
               {
                "activated"  : "no"   
               }
            },(err, result) => {
               if(err)
               console.log("ERRORERROR" + err);
               else
               console.log(result);
            }
         )
    }
    else{
        User.updateOne(
            { "_id": objectId(req.body._id)}, 
            { $set:
               {
                "activated"  : "yes"   
               }
            },(err, result) => {
               if(err)
               console.log("ERRORERROR" + err);
               else
               console.log(result);
            }
         )
    }
    res.send();

    });


    app.get('/logout', (req, res) => {
        req.logout();//method available through passport, CLEARS THE LOGIN SESSION, REMOVES THE req.user PROPERTY

        req.session.destroy((err) => {
            //path where user to be taken to after user is successfully logout
            res.redirect('/');
        })
    }); 

}
