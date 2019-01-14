function inviteUser(id, inviteId){
  console.log("I am Inviting" + name);
                $.ajax({
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({invite_id:inviteId}),
                    url: '/community/invite/'+id,
                    success: function (response) {
                    
                    }
                 
                });
       
  }

function findUsers(id) {
          
        var input = $.trim($('#finding-input').val());
        console.log(input);
      $.ajax({
        type: "GET",
        url: '/community/inviteData/' +id, // Using our resources.json file to serve results
        success: function(result) {
            var data = JSON.parse(JSON.stringify(result));
            createCode(data, input); 
        }
      });  
    }


   function createCode(data, input){
      var code ="";
      var flag = 1;
      for(var i = 0; i < data.User.length; i++) {
      if(input == data.User[i].name){
        
        if(data.User[i]._id == data.Community.owner._id)
        flag = 0;

        for(var j = 0; j < data.Community.admin[j]; j++){
          if(data.User[i]._id == data.Community.admin[j]._id)
          {
            flag = 0;
            break;
          }
        }

        for(var j = 0; j < data.Community.user[j]; j++){
          if(data.User[i]._id == data.Community.user[j]._id)
          {
            flag = 0;
            break;
          }
        }

        for(var j = 0; j < data.Community.invitedUser[j]; j++){
          if(data.User[i]._id == data.Community.invitedUser[j]._id)
          {
            flag = 0;
            break;
          }
        }

        for(var j = 0; j < data.Community.request[j]; j++){
          if(data.User[i]._id == data.Community.request[j]._id)
          {
            flag = 0;
            break;
          }
        }
           if(flag == 0)
           continue;
           
        var communityId="'"+data.Community._id+"'";
        code="<div class='col-sm-12 col-xs-12 allcoms community-user-div' style='margin-top:5px;'>";
                     code +="<div class='col-sm-2 col-xs-3' style='padding:5px;'>";
                     code +="<img src='/Upload/Profile/"+data.User[i].image+"' class='community-member-pic'>";
                     code +="</div>";
                     code +="<div class='col-sm-8 col-xs-6 scrollable'>";
                     code +="<a class='comusername' href='/viewprofile/"+data.User[i]._id+"'>"+data.User[i].name+"</a>";
                     code +="</div>";
                     code +="<div class='col-sm-2 col-xs-3'>";

                     code +='<a class="btn btn-primary btn-sm invite-btn" style="float:right" onclick="inviteUser('+communityId+','+"'"+data.User[i]._id+"'"+')">';
                     code +="Invite</a>";

                     code +="</div>";
                     code +="</div>";
      }
   }
      

    $('#comlist').html(code);
    }
