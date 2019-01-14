    var path = require('path');// Build in nodejs module
    var fs = require('fs');      //,,    FileSystem
    var Community = require('../models/community');
    var User = require('../models/user');
    var objectId = require('mongodb').ObjectID;

    var multer = require('multer')

var storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, 'public/Upload/CommunityProfile/');
    },
    filename: function (request, file, callback) {
        console.log(file);
        callback(null, file.originalname)
    }
});

var upload = multer({ storage: storage });




    module.exports = (app) => {
    

        app.get('/community/communitypanel', (req, res, next) =>{//http method, Gets information
            Community.find({}, (err, result) => {//all data is stores in 'data', mongoose.find method 
            res.render('community/communitypanel.ejs', {title: 'Community Panel', user: req.user});  
            });
         
        });

        app.get('/community/communitypanelData', (req, res, next) =>{//http method, Gets information
              console.log(req.user.myCommunity[0]);          
            //res.json({User: req.user}); 
        
        });

        app.get('/community/list', (req, res, next) =>{//http method, Gets information
            
            Community.find({}, (err, data) => {
                   if(err)
                   console.log(err);
                   else
                   //console.log(data);
                res.render('community/list.ejs', {title: 'Community List', user:req.user, data:data});
            }); 
         
        });

        app.get('/community/listData', (req, res, next) =>{//http method, Gets information
            
            Community.find({})
            .populate('owner')
            .populate('admin')
            .populate('user')
            .populate('invitedUser')
            .populate('request')
            .exec(function(error, data) {
                   if(error)
                   console.log(err);

                   res.json({"User": req.user, "Community": data});
            }); 
           
        });

        app.get('/community/communityList', (req, res, next) =>{//http method, Gets information
            res.render('community/communityList.ejs', {title: 'Community List', user:req.user});

        });

         //JSON
        app.get('/community/communityListData', (req, res, next) =>{//http method, Gets information
    
            Community.findOne({})
            .populate('owner')
            .exec(function(error, data) {
            if(err)
            console.log(err);
            else
            res.json({data});
        });   

        });

        app.post('/community/cancelCommunity', (req, res, next) =>{//http method, Gets information
    
            Community.updateOne(
                { "_id": objectId(req.body._id)}, 
                { $pull: 
                    {
                     request: req.user._id
                    }
                },(err, result) => {
                   if(err)
                   console.log("ERRORERROR" + err);
                   else
                   console.log(result);
                }
             )

         User.updateOne(
            { "_id": objectId(req.user._id)}, 
            { $pull: 
                {
                 pendingCommunity:  req.body._id
                }
            },(err, result) => {
               if(err)
               console.log("ERRORERROR" + err);
               else
               console.log(result);
            }
         ) 

        });

        app.post('/community/acceptInvitation', (req, res, next) =>{//http method, Gets information
        
       //PULL
            Community.updateOne(
                { "_id": objectId(req.body._id)}, 
                { $pull: 
                    {
                     invitedUser: req.user._id
                    }
                },(err, result) => {
                   if(err)
                   console.log("ERRORERROR" + err);
                   else
                   console.log(result);
                }
             )

         User.updateOne(
            { "_id": objectId(req.user._id)}, 
            { $pull: 
                {
                 inviteCommunity :  req.body._id
                }
            },(err, result) => {
               if(err)
               console.log("ERRORERROR" + err);
               else
               console.log(result);
            }
         ) 

         //PUSH
          
         Community.updateOne(
            { "_id": objectId(req.body._id)}, 
            { $push: 
                {
                 user: req.user._id
                }
            },(err, result) => {
               if(err)
               console.log("ERRORERROR" + err);
               else
               console.log(result);
            }
         )

     User.updateOne(
        { "_id": objectId(req.user._id)}, 
        { $push: 
            {
             community :  req.body._id
            }
        },(err, result) => {
           if(err)
           console.log("ERRORERROR" + err);
           else
           console.log(result);
        }
     ) 

        });

        app.post('/admin/updateCommunity', (req, res, next) =>{//http method, Gets information
        console.log(req.body._id + " " +  req.body.communityName + " " + req.body.communityActive);
        // update values
        var active;
        if(req.body.communityActive == "true")
        active = "yes";
        if(req.body.communityActive == "false")
        {
            console.log("DEACTIVATE");
            active = "no";    
        }

        Community.updateOne(
            { "_id": objectId(req.body._id)}, 
            { $set:
               {
                "name"  : req.body.communityName,
                "activated" : active
               }
            },(err, result) => {
               if(err)
               console.log("ERRORERROR" + err);
               else
               console.log(result);
            }
         )

         res.send();
    
    
    
    });

       app.post('/admin/getInfo', (req, res, next) =>{//http method, Gets information
        console.log(req.body._id);

        Community.findOne({'_id':req.body._id})
        .populate('owner')
        .exec(function(error, data) {
            if(err)
            console.log(err);
            else{   
                 console.log(data.description);
                 res.json({"Community" : data});
            }
        });

       });

       app.get('/community/userData', (req, res, next) =>{//http method, Gets information

        User.find({"_id": req.user._id})
        .populate('community')
        .populate('myCommunity')
        .populate('pendingCommunity')
        .populate('inviteCommunity')
        .exec(function(error, data) {
            res.json({"User": data});
        })
       });


        app.get('/community/inviteData/:id', (req, res, next) =>{//http method, Gets information
            
            User.find({}, (err, data) => {
                   if(err)
                   console.log(err);
                   else{

                    Community.findOne({"_id": objectId(req.params.id)})
                    .populate('owner')
                    .populate('admin')
                    .populate('user')
                    .populate('request')
                    .populate('invitedUser')
                    .exec(function(error, result) {
                        if(error)
                        console.log(err);
                       
                        res.json({"User": data, "Community": result});
                    }); 

                   }
                }); 
         
        });
        
        app.get('/community/invite/:id', (req, res, next) =>{//http method, Gets information
            
            Community.findOne({'_id':req.params.id}, (err, data) => {
                   if(err)
                   console.log(err);
                  
                res.render('community/invite.ejs', {title: 'Invite', id: req.params.id, user:req.user, data:data});
            }); 
         
        });

        app.post('/community/invite/:id', (req, res, next) =>{//http method, Gets information

        //push in the inviteduser array
        Community.updateOne(
            { "_id": objectId(req.params.id)}, 
            {
                $push:
                 {
                    invitedUser : req.body.invite_id
                 } 

            },(err, result) => {
               if(err)
               console.log("ERRORERROR" + err);
               else
               console.log(result);
            }
         )
           //push in the inviteCommunity


   
           Community.findOne({'_id':req.params.id}, (err, data) => {
            if(err)
            console.log(err);
           
           User.updateOne(
            { "_id": objectId(req.body.invite_id)}, 
            {
                $push: 
                {
                    inviteCommunity : req.params.id
                } 

            },(err, result) => {
               if(err)
               console.log("ERRORERROR" + err);
               else
               console.log(result);
            }
         )
        });

        });

        app.get('/community/discussion/:id', (req, res, next) =>{//http method, Gets information

                Community.findOne({"_id": objectId(req.params.id)})
                .populate('owner')
                .populate('admin')
                .exec(function(error, data) {
                    if(error)
                    console.log(error);
                
                    var isOwner = 0;
                    var isAdmin = 0;
                    if(data.owner._id.equals(req.user._id))
                    isOwner = 1;

                    for(var i = 0; i <data.admin.length; i++) {
                        if(data.admin[i]._id.equals(req.user._id))
                         {
                             isAdmin = 1;
                             break;
                         }
                    }

                    res.render('community/discussion.ejs', {title: 'Discussion', id: req.params.id, user:req.user, data:data, isOwner: isOwner, isAdmin: isAdmin});
                });
                  
           
         
        });

        app.get('/community/editCommunity/:id', (req, res, next) =>{//http method, Gets information
            console.log("THIS"+req.params.id+"THIS");
            Community.findOne({'_id':req.params.id}, (err, data) => {
                   if(err)
                   console.log("THERE IS A ERROR" + err);
                   var success = req.flash('success');
                res.render('community/editCommunity.ejs', {title: 'Edit Community', id: req.params.id, user:req.user, data:data, success: success, noErrors: success.length > 0});
            }); 
         
        });

        app.post('/community/editCommunity/:id', upload.single('image'), (req, res, next) =>{//http method, Gets information
            //updating community detail
            Community.findOne({'_id':req.params.id}, (err, data) => {
                if(data.request.length == 0){

            Community.updateOne(
                { "_id": objectId(req.params.id)}, 
                { $set:
                   {
                    "name" : req.body.name,
                    "rule"  : req.body.rule,
                    "description" : req.body.description,
                    "image" : req.file.originalname

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

                Community.updateOne(
                    { "_id": objectId(req.params.id)}, 
                    { $set:
                       {
                        "name" : req.body.name,
                        "description" : req.body.description,
                        "image" :  req.file.originalname
                       }
                    },(err, result) => {
                       if(err)
                       console.log("ERRORERROR" + err);
                       else
                       console.log(result);
                    }
                 ) 

            }
            });
            req.flash('success', 'Community data has been changed');
            res.redirect('/community/editCommunity/'+req.params.id);

         
        });

        

        app.get('/community/communityProfile/:id', (req, res, next) =>{//http method, Gets information
            
            Community.findOne({"_id": objectId(req.params.id)})
            .populate('owner')
            .populate('admin')
            .populate('user')
            .exec(function(error, data) {

                   //user.mycomm comm req.params.id
                   var count = 0;
                   var isMember = 0;
                   for(var i = 0; i < req.user.myCommunity.length; i++){
                   if(req.user.myCommunity[i] == req.params.id){
                       count++;
                       break;
                   }
                   }

                   for(var i = 0; i < req.user.community.length; i++){
                    if(req.user.community[i] == req.params.id){
                        count++;
                        break;
                    }
                    }
                    if(count > 0)
                    isMember = 1;
                    
                    count = 0;
                    var isPending = 0;
                    for(var i = 0; i < req.user.pendingCommunity.length; i++){
                        if(req.user.pendingCommunity[i] == req.params.id){
                            count++;
                            break;
                        }
                        }

                        if(count > 0)
                        isPending = 1;

                   // manage community
                        var isOwner = 0;
                        var isAdmin = 0;
                        if(data.owner._id.equals(req.user._id))
                        isOwner = 1;
    
                        for(var i = 0; i <data.admin.length; i++) {
                            if(data.admin[i]._id.equals(req.user._id))
                             {
                                 isAdmin = 1;
                                 break;
                             }
                        }


                res.render('community/communityProfile.ejs', {title: 'Community Profile', id: req.params.id, user:req.user, data:data, isMember: isMember, isPending: isPending, isOwner: isOwner, isAdmin: isAdmin});
            }); 
         
        });

      
        app.post('/community/communityProfile/:id', (req, res, next) =>{//http method, Gets information
            if(req.body.communityRule == 1){

            Community.updateOne(
                { "_id": objectId(req.body.communityId)}, 
                { $push:
                   {
                    user: req.user._id
                   }
                },(err, result) => {
                   if(err)
                   console.log("ERRORERROR" + err);
                   else
                   console.log(result);
                }
             )

             User.updateOne(
                { "_id": objectId(req.user._id)}, 
                { $push:
                     {
                    community: req.body.communityId
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
                Community.updateOne(
                    { "_id": objectId(req.body.communityId)}, 
                    { $push: 
                        {
                         request: req.user._id
                        }
                    },(err, result) => {
                       if(err)
                       console.log("ERRORERROR" + err);
                       else
                       console.log(result);
                    }
                 )

             User.updateOne(
                { "_id": objectId(req.user._id)}, 
                { $push: 
                    {
                     pendingCommunity:  req.body.communityId
                    }
                },(err, result) => {
                   if(err)
                   console.log("ERRORERROR" + err);
                   else
                   console.log(result);
                }
             )



            }

            Community.findOne({'_id' : communityId}, (err, data) => {
            if(err)
            console.log(err);
            else
            res.json({data});
            });

         
        });
         
        

        app.post('/community/updateUser/:id', (req, res, next) =>{//http method, Gets information
 
            console.log(req.params.id);
   // remove user AND add as an admin
            Community.updateOne(
                { "_id": objectId(req.params.id)}, 
                { $pull:
                   {
                    user : req.body.user_id
                   }
                },(err, result) => {
                   if(err)
                   console.log("ERRORERROR" + err);
                   else
                   console.log(result);
                }
             )

             Community.updateOne(
                { "_id": objectId(req.params.id)}, 
                {
                    $push: 
                    {
                        admin : req.body.user_id    
                    } 

                },(err, result) => {
                   if(err)
                   console.log("ERRORERROR" + err);
                   else
                   console.log(result);
                }
             )
             
             // move community data to mycommunity

             User.updateOne(
                { "_id": objectId(req.body.user_id)}, 
                { $pull:
                   {
                    community : req.params.id
                   }
                },(err, result) => {
                   if(err)
                   console.log("ERRORERROR" + err);
                   else
                   console.log(result);
                }
             )

                User.updateOne(
                    { "_id": objectId(req.body.user_id)}, 
                    {
                        $push: 
                        {
                            myCommunity: req.params.id
                        } 
    
                    },(err, result) => {
                       if(err)
                       console.log("ERRORERROR" + err);
                       else
                       console.log(result);
                    }
                 )

                 res.send(req.params.id);

        });


        app.post('/community/updateAdmin/:id', (req, res, next) =>{//http method, Gets information
       

            console.log(req.params.id);
   // remove admin AND add as a user
            Community.updateOne(
                { "_id": objectId(req.params.id)}, 
                { $pull:
                   {
                    admin :  req.body.admin_id
                   }
                },(err, result) => {
                   if(err)
                   console.log("ERRORERROR" + err);
                   else
                   console.log(result);
                }
             )

             Community.updateOne(
                { "_id": objectId(req.params.id)}, 
                {
                    $push:
                    {
                        user :  req.body.admin_id 
                    } 

                },(err, result) => {
                   if(err)
                   console.log("ERRORERROR" + err);
                   else
                   console.log(result);
                }
             )
             
             // move myCommunity data to community

             User.updateOne(
                { "_id": objectId(req.body.admin_id)}, 
                { $pull:
                   {
                    myCommunity : req.params.id
                   }
                },(err, result) => {
                   if(err)
                   console.log("ERRORERROR" + err);
                   else
                   console.log(result);
                }
             )

                User.updateOne(
                    { "_id": objectId(req.body.admin_id)}, 
                    {
                        $push: 
                        {
                            community: req.params.id                          
                        } 
    
                    },(err, result) => {
                       if(err)
                       console.log("ERRORERROR" + err);
                       else
                       console.log(result);
                    }
                 )

                 res.send(req.params.id);

        });


        app.post('/community/removeUser/:id', (req, res, next) =>{//http method, Gets information
        //Remove user from user array
        Community.updateOne(
            { "_id": objectId(req.params.id)}, 
            { $pull:
               {
                user : req.body.user_id
               }
            },(err, result) => {
               if(err)
               console.log("ERRORERROR" + err);
               else
               console.log(result);
            }
         )
         //Remove user from community array
          
         User.updateOne(
            { "_id": objectId(req.body.user_id)}, 
            { $pull:
               {
                community : req.params.id
               }
            },(err, result) => {
               if(err)
               console.log("ERRORERROR" + err);
               else
               console.log(result);
            }
         )
         res.send(req.params.id);

        });

        app.post('/community/removeAdmin/:id', (req, res, next) =>{//http method, Gets information
            //Remove user from user array
            Community.updateOne(
                { "_id": objectId(req.params.id)}, 
                { $pull:
                   {
                    admin :  req.body.admin_id
                   }
                },(err, result) => {
                   if(err)
                   console.log("ERRORERROR" + err);
                   else
                   console.log(result);
                }
             )
             //Remove user from community array
              
             User.updateOne(
                { "_id": objectId(req.body.admin_id)}, 
                { $pull:
                   {
                    myCommunity : req.params.id
                   }
                },(err, result) => {
                   if(err)
                   console.log("ERRORERROR" + err);
                   else
                   console.log(result);
                }
             )
                res.send(req.params.id);
            });

            app.post('/community/acceptRequest/:id', (req, res, next) =>{//http method, Gets information


            console.log(req.params.id);

            //Remove Request from REQUEST

            Community.updateOne(
                { "_id": objectId(req.params.id)}, 
                { $pull:
                   {
                    request : req.body.request_id
                 
                   }
                },(err, result) => {
                   if(err)
                   console.log("ERRORERROR" + err);
                   else
                   console.log(result);
                }
             )

             //Add to the user list

             Community.updateOne(
                { "_id": objectId(req.params.id)}, 
                {
                    $push:
                    {
                         user : req.body.request_id    
                    } 

                },(err, result) => {
                   if(err)
                   console.log("ERRORERROR" + err);
                   else
                   console.log(result);
                }
             )

             //remove user from pending array


              
             User.updateOne(
                { "_id": objectId(req.body.request_id)}, 
                { $pull:
                   {
                    pendingCommunity : req.params.id
                   }
                },(err, result) => {
                   if(err)
                   console.log("ERRORERROR" + err);
                   else
                   console.log(result);
                }
             )

             //add user to the community array

                User.updateOne(
                    { "_id": objectId(req.body.request_id)}, 
                    {
                        $push: {
                            community : req.params.id  
                        } 
    
                    },(err, result) => {
                       if(err)
                       console.log("ERRORERROR" + err);
                       else
                       console.log(result);
                    }
                 )
                 res.send(req.params.id);

            });

            app.post('/community/rejectRequest/:id', (req, res, next) =>{//http method, Gets information
               
              //Remove Request from REQUEST

            Community.updateOne(
                { "_id": objectId(req.params.id)}, 
                { $pull:
                   {
                    request : req.body.request_id
                   }
                },(err, result) => {
                   if(err)
                   console.log("ERRORERROR" + err);
                   else
                   console.log(result);
                }
             )
             //remove user from pending array

             User.updateOne(
                { "_id": objectId(req.body.request_id)}, 
                { $pull:
                   {
                    pendingCommunity : req.params.id
                   }
                },(err, result) => {
                   if(err)
                   console.log("ERRORERROR" + err);
                   else
                   console.log(result);
                }
             )
             res.send(req.params.id);


            });

          
            app.post('/community/cancelInvitation/:id', (req, res, next) =>{//http method, Gets information
           // console.log(req.body.inviteUserId);

             //Remove invite from INVITEDUSER

             Community.updateOne(
                { "_id": objectId(req.params.id)}, 
                { $pull:
                   {
                    "invitedUser" : req.body.invite_id
                   }
                },(err, result) => {
                   if(err)
                   console.log("ERRORERROR" + err);
                   else
                   console.log(result);
                }
             )

             // removing invite noti from USER
             User.updateOne(
                { "_id": objectId(req.body.invite_id)}, 
                { $pull:
                   {
                    "inviteCommunity" : req.params.id
                   }
                },(err, result) => {
                   if(err)
                   console.log("ERRORERROR" + err);
                   else
                   console.log(result);
                }
             )
             res.send(req.params.id);

            });
 

        app.get('/community/viewProfile/:id', (req, res, next) =>{//http method, Gets information
            
            User.findOne({'_id':req.params.id}, (err, data) => {
                   if(err)
                   console.log(err);


                res.render('community/viewProfile.ejs', {title: 'Community Profile', id: req.params.id, user:req.user, data:data});
            }); 
         
        });



        app.get('/community/communityMembers/:id', (req, res, next) =>{//http method, Gets information

            Community.findOne({"_id": objectId(req.params.id)})
            .populate('owner')
            .populate('admin')
            .populate('user')
            .exec(function(error, data) {
                   if(error){
                   console.log(err);
                    console.log("THERE IS A ERROR");  
                 }
               //manage community
                 var isOwner = 0;
                    var isAdmin = 0;
                    if(data.owner._id.equals(req.user._id))
                    isOwner = 1;

                    for(var i = 0; i <data.admin.length; i++) {
                        if(data.admin[i]._id.equals(req.user._id))
                         {
                             isAdmin = 1;
                             break;
                         }
                    }

                res.render('community/communityMembers.ejs', {title: 'Community Members', id: req.params.id, user:req.user, data:data, isOwner: isOwner, isAdmin: isAdmin});
            }); 
         
        });

        app.get('/community/manageCommunity/:id', (req, res, next) =>{//http method, Gets information
            
            Community.findOne({"_id": objectId(req.params.id)})
            .populate('owner')
            .populate('admin')
            .populate('user')
            .populate('invitedUser')
            .populate('request')
            .exec(function(error, data) {
                   if(error)
                   console.log(err);
                   
                   //edit Community
                   var isAdmin = 0;

                   for(var i = 0; i <data.admin.length; i++) {
                       if(data.admin[i]._id.equals(req.user._id))
                        {
                            isAdmin = 1;
                            break;
                        }
                   }

                res.render('community/manageCommunity.ejs', {title: 'Manage Community', id: req.params.id, user:req.user, data:data, isAdmin: isAdmin});
            }); 
         
        });

        app.get('/community/manageCommunityData/:id', (req, res, next) =>{//http method, Gets information
            
            Community.findOne({"_id": objectId(req.params.id)})
            .populate('owner')
            .populate('admin')
            .populate('user')
            .populate('invitedUser')
            .populate('request')
            .exec(function(error, data) {
                   if(error)
                   console.log(err);

                   var isAdmin = 0;

                   for(var i = 0; i <data.admin.length; i++) {
                       if(data.admin[i]._id.equals(req.user._id))
                        {
                            isAdmin = 1;
                            break;
                        }
                   }

                   res.json({"Community": data, "isAdmin": isAdmin});           
                 }); 
         
         
        });

        app.get('/community/communityMembersData/:id', (req, res, next) =>{//http method, Gets information
            
            Community.findOne({"_id": objectId(req.params.id)})
            .populate('owner')
            .populate('admin')
            .populate('user')
            .exec(function(error, data) {
                   if(error)
                   console.log(err);
                   else
                   res.json({"Community": data});
            }); 
         
        });

        app.get('/community/addCommunity', (req, res, next) =>{//http method, Gets information
            var success = req.flash('success');
            res.render('community/addCommunity.ejs', {title: 'Add Community', user: req.user, success: success, noErrors: success.length > 0});  
         
        });

        app.post('/community/addCommunity', upload.single('image'), (req, res, next) =>{//http method, Gets information
            
            var newCommunity = new Community();
            newCommunity.name = req.body.name;
            newCommunity.description = req.body.description;
            newCommunity.rule = req.body.rule;//WARNING *******************
            newCommunity.image = req.file.originalname;
            newCommunity.date = today;
            newCommunity.owner = req.user._id;

            newCommunity.save((err) => {
                if(err){
                    console.log(err);
                }

                console.log(newCommunity);
            });
            
            //push community in user myCommunity
            console.log("RESULTRESULT: " + newCommunity._id);
            User.update({
                '_id': objectId(req.user._id)
            },
            {
                $push: 
                {
                    myCommunity : newCommunity._id 
                }
            }, (err) => {
                if(err)
                console.log(err);
            })



            
            req.flash('success', 'Community has been Created');
            res.redirect('/community/addCommunity');
       

        
        
        });
      
        
    }


    var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

if(dd<10) {
    dd = '0'+dd
} 

if(mm<10) {
    mm = '0'+mm
} 

today = mm + '/' + dd + '/' + yyyy;