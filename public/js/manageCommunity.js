function updateCountOnBtn(elmId,btntxt,flag){
  console.log("Ï am running");
  var btnTxt= $(elmId).text();
  btnNumCount = parseInt(btnTxt.match(/\d+/g)[0]);
  if(flag==0)
  {
    $(elmId).empty().append(btntxt+' ('+(btnNumCount-1)+')');
  }else if(flag==1){
    $(elmId).empty().append(btntxt+' ('+(btnNumCount+1)+')');
  } 
  /*else if(flag==3){
    $(elmId).empty().append(btntxt+' ('+(newUpdate)+')');
  }*/
}

function acceptRequest(id, _id){
  console.log("I am accepting Request");
                $.ajax({
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({request_id:_id}),
                    url: '/community/acceptRequest/'+id,
                    success: function (response) {

                      updateCountOnBtn('#requestedUserShowBtn','Requests',0);
                      updateCountOnBtn('#UsersShowBtn','Users',1);
                    Requests(response);
                    }
                 
                });
       
  }

  function rejectRequest(id, _id){
    console.log("I am Rejecting Request");
                  $.ajax({
                      type: 'POST',
                      contentType: 'application/json',
                      data: JSON.stringify({request_id:_id}),
                      url: '/community/rejectRequest/'+id,
                      success: function (response) {
                        updateCountOnBtn('#requestedUserShowBtn','Requests',0);
                      Requests(response);
                      }
                   
                  });
         
    }


    function cancelInvitation(id, invite_id){
      console.log("I am not inviting");
                    $.ajax({
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify({invite_id:invite_id}),
                        url: '/community/cancelInvitation/'+id,
                        success: function (response) {
                          notie.alert({type: 1, text:'Invitation Canceled', time: 2})
                          updateCountOnBtn('#invitedUserShowBtn','Invited Users',0);
                          Invited(response)
                        }
                     
                    });
           
      }

function removeUser(id,_id){
  console.log("I am Removing User");

            $.ajax({
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({user_id:_id}),
                url: '/community/removeUser/'+id,
                success: function (response) {
                /*  if(status) {
                    updateCountOnBtn('#UsersShowBtn','Users',0,1);
                    UserList();
                  } else {
                    updateCountOnBtn('#AdminsShowBtn','Admins',0,1);
                  
                  }*/
                  updateCountOnBtn('#UsersShowBtn','Users',0);
                    UserList(response);
                }
            });
 
}

function removeAdmin(id,_id){
  console.log("I am Removing Admin");

            $.ajax({
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({admin_id:_id}),
                url: '/community/removeAdmin/'+id,
                success: function (response) {
                 /* if(status) {
                    updateCountOnBtn('#UsersShowBtn','Users',0,1);
                    UserList();
                  } else {
                    updateCountOnBtn('#AdminsShowBtn','Admins',0,1);
                  }
                    */
                   updateCountOnBtn('#AdminsShowBtn','Admins',0);
                    AllAdmins(response);
                  
                }
            });
 
}


function updateUser(id, _id){
console.log("I am Updating User");
              $.ajax({
                  type: 'POST',
                  contentType: 'application/json',
                  data: JSON.stringify({user_id:_id}),
                  url: '/community/updateUser/'+id,
                  success: function (response) {
                   /* if(mode)
                    {
                      updateCountOnBtn('#UsersShowBtn','Users',0,1);
                      updateCountOnBtn('#AdminsShowBtn','Admins',1,1);
                    }else{
                      updateCountOnBtn('#UsersShowBtn','Users',1,1);
                      updateCountOnBtn('#AdminsShowBtn','Admins',0,1);
                    }
                    mode == 1 ? UserList() : AllAdmins();
                  */
                 updateCountOnBtn('#UsersShowBtn','Users',0);
                 updateCountOnBtn('#AdminsShowBtn','Admins',1);
                  UserList(response);
                   }
              });
     
}

function updateAdmin(id, _id){
  console.log("I am Updating Admin");
                $.ajax({
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({admin_id:_id}),
                    url: '/community/updateAdmin/'+id,
                    success: function (response) {
                     /* if(mode)
                      {
                        updateCountOnBtn('#UsersShowBtn','Users',0,1);
                        updateCountOnBtn('#AdminsShowBtn','Admins',1,1);
                      }else{
                        updateCountOnBtn('#UsersShowBtn','Users',1,1);
                        updateCountOnBtn('#AdminsShowBtn','Admins',0,1);
                      }*/
                      //mode == 1 ? UserList() : AllAdmins(response);
                      updateCountOnBtn('#UsersShowBtn','Users',1);
                      updateCountOnBtn('#AdminsShowBtn','Admins',0);
                      AllAdmins(response)
                    }
                 
                });
       
  }

    function UserList(id)
    {
        console.log("Hello I Am Running");
      $.ajax({
        type: "GET",
        url: '/community/manageCommunityData/' + id, // Using our resources.json file to serve results
        success: function(result) {
            var data = JSON.parse(JSON.stringify(result));
            var code ="";
            for(var i = 0; i < data.Community.user.length; i++) {
                var communityId="'"+data.Community._id+"'";
                code += "<div class='col-sm-12 col-xs-12 allcoms community-user-div comUsersFxnCall' style='margin-top:5px;'>";
                code += "     <div class='col-sm-2 col-xs-3' style='padding:5px;'>";
                code += "          <a href='/community/viewprofile/"+data.Community.user[i]._id+"'>";
                code += "            <img src='/Upload/Profile/"+data.Community.user[i].image+"' class='community-member-pic'>";
                code += "          </a>";
                code += "      </div>";
                code += "      <div class='col-sm-8 col-xs-6 scrollable'>";
                code += "          <a class='comusername' href='/community/viewprofile/"+data.Community.user[i]._id+"'>"+data.Community.user[i].name+"</a>";
                code += "      </div>";
                code +="<div class='col-sm-2 col-xs-3'>";
                code +='<a class="community-user-short-btn" onclick="updateUser('+communityId+','+"'"+data.Community.user[i]._id+"'"+');" style="float:left" >';            
                code +="<i class='fa fa-chevron-up'></i>";
                code +="</a>";
                code +='<a class="community-user-short-btn" onclick="removeUser('+communityId+','+"'"+data.Community.user[i]._id+"'"+')" style="float:right" >';
                code +="<i class='fa fa-times'></i></a>";
                code += " </div>"; 
                code += " </div>"; 
            }
            

          $('#comlist').html(code);
       // $('#search').empty();
        }
      });  
     }
     
     function AllAdmins(id)
     {
         console.log("Hello I Am Running ALLADMINS");
       $.ajax({
         type: "GET",
         url: '/community/manageCommunityData/' + id, // Using our resources.json file to serve results
         success: function(result) {
             var data = JSON.parse(JSON.stringify(result));
             var code ="";

             var communityId="'"+data.Community._id+"'";
             code += "<div class='col-sm-12 col-xs-12 allcoms community-user-div comUsersFxnCall' style='margin-top:5px;'>";
             code += "     <div class='col-sm-2 col-xs-3' style='padding:5px;'>";
             code += "          <a href='/community/viewprofile/"+data.Community.owner._id+"'>";
             code += "            <img src='/Upload/Profile/"+data.Community.owner.image+"' class='community-member-pic'>";
             code += "          </a>";
             code += "      </div>";
             code += "      <div class='col-sm-8 col-xs-6 scrollable'>";
             code += "          <a class='comusername' href='/community/viewprofile/"+data.Community.owner._id+"'>"+data.Community.owner.name+"</a>";
             code += "      </div>";
             code +="<span class='label label-success' style='margin-top:25px;float:right'>Owner</span>";
             code += " </div>"; 

             for(var i = 0; i < data.Community.admin.length; i++) {
                 var communityId="'"+data.Community._id+"'";
                 code += "<div class='col-sm-12 col-xs-12 allcoms community-user-div comUsersFxnCall' style='margin-top:5px;'>";
                 code += "     <div class='col-sm-2 col-xs-3' style='padding:5px;'>";
                 code += "          <a href='/community/viewprofile/"+data.Community.admin[i]._id+"'>";
                 code += "            <img src='/Upload/Profile/"+data.Community.admin[i].image+"' class='community-member-pic'>";
                 code += "          </a>";
                 code += "      </div>";
                 code += "      <div class='col-sm-8 col-xs-6 scrollable'>";
                 code += "          <a class='comusername' href='/community/viewprofile/"+data.Community.admin[i]._id+"'>"+data.Community.admin[i].name+"</a>";
                 code += "      </div>";
                if(!data.isAdmin){
                 code +="<div class='col-sm-2 col-xs-3'>";
                 code +='<a class="community-user-short-btn" onclick="updateAdmin('+communityId+','+"'"+data.Community.admin[i]._id+"'"+');" style="float:left" >';            
                 code +="<i class='fa fa-chevron-down'></i>";
                 code +="</a>";
                 code +='<a class="community-user-short-btn" onclick="removeAdmin('+communityId+','+"'"+data.Community.admin[i]._id+"'"+')" style="float:right" >';
                 code +="<i class='fa fa-times'></i></a>";
                 code += " </div>"; 
                  }
                 code +="<span class='label label-warning' style='margin-top:25px;float:right'>Admin</span>";
                 code += " </div>"; 
             }
             
 
           $('#comlist').html(code);
        // $('#search').empty();
         }
       });  
      }

      function Requests(id)
      {
          console.log("Hello I Am Running Requests");
        $.ajax({
          type: "GET",
          url: '/community/manageCommunityData/' + id, // Using our resources.json file to serve results
          success: function(result) {
              var data = JSON.parse(JSON.stringify(result));
              var code ="";
              //TO DO ADD OWNER
              for(var i = 0; i < data.Community.request.length; i++) {
                  var communityId="'"+data.Community._id+"'";
                  code="<div class='col-sm-12 col-xs-12 allcoms community-user-div' style='margin-top:5px;'>";
                  code +="<div class='col-sm-2 col-xs-3' style='padding:5px;'>";
                  code +="<a href='/viewprofile/"+data.Community.request[i]._id+"'><img src='/Upload/Profile/"+data.Community.request[i].image+"' class='community-member-pic'>";
                  code +="</a></div>";
                  code +="<div class='col-sm-8 col-xs-6 scrollable'>";
                  code +="<a class='comusername' href='/viewprofile/"+data.Community.request[i]._id+"'>"+data.Community.request[i].name+"</a>";
                  code +="</div>";
                  code +="<div class='col-sm-2 col-xs-3'>";
                  code +="<div class='dropdown'>";
                  code +="<div class='dropup request-btn-dropdown'><button class='btn btn-default dropdown-toggle' type='button' data-toggle='dropdown' style='float:right !important'>Option";
                  code +="</button>";
                  code +=" <ul>";
                  code +='<li><a class="request-dropdown-options" onclick="acceptRequest('+communityId+','+"'"+data.Community.request[i]._id+"'"+')">';
                  code +="Accept</a></li>";
                  code +='<li><a class="request-dropdown-options" onclick="rejectRequest('+communityId+','+"'"+data.Community.request[i]._id+"'"+')">';
                  code +="Reject</a></li>";        
                  code +="</ul>";
                  code +="</div></div>"
                  code +="</div>";          
                  code +="</div>"; 
              }
              
  
            $('#comlist').html(code);
         // $('#search').empty();
          }
        });  
       }

       function Invited(id)
      {
          console.log("Hello I Am Running Requests");
        $.ajax({
          type: "GET",
          url: '/community/manageCommunityData/' + id, // Using our resources.json file to serve results
          success: function(result) {
              var data = JSON.parse(JSON.stringify(result));
              var code ="";
              //TO DO ADD OWNER
              for(var i = 0; i < data.Community.invitedUser.length; i++) {
                  var communityId="'"+data.Community._id+"'";
                  code="<div class='col-sm-12 col-xs-12 allcoms community-user-div' style='margin-top:5px;'>";
                  code +="<div class='col-sm-2 col-xs-3' style='padding:5px;'>";
                  code +="<a href='/viewprofile/"+data.Community.invitedUser[i]._id+"'><img src='/Upload/Profile/"+data.Community.invitedUser[i].image+"' class='community-member-pic'>";
                  code +="</a></div>";
                  code +="<div class='col-sm-8 col-xs-6 scrollable'>";
                  code +="<a class='comusername' href='/viewprofile/"+data.Community.invitedUser[i]._id+"'>"+data.Community.invitedUser[i].name+"</a>";
                  code +="</div>";
                  code +="<div class='col-sm-2 col-xs-3'>";
                  code +='<a class="community-user-short-btn" onclick="cancelInvitation('+communityId+','+"'"+data.Community.invitedUser[i]._id+"'"+')" style="float:right">';
                  code +="<i class='fa fa-times'></i></a>";
                  code +="</div>";          
                  code +="</div>"; 
              }
              
  
            $('#comlist').html(code);
         // $('#search').empty();
          }
        });  
       }


