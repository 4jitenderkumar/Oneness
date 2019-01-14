
    function AllAdminList(id)
    {
      $.ajax({
        type: "GET",
        url: '/community/communityMembersData/' + id, // Using our resources.json file to serve results
        success: function(result) {
            var data = JSON.parse(JSON.stringify(result));
            var code ="";
            code += "<div class='col-sm-12 col-xs-12 allcoms community-user-div comUsersFxnCall' style='margin-top:5px;'>";
            code += "     <div class='col-sm-2 col-xs-5' style='padding:5px;'>";
            code += "          <a href='/community/viewprofile/"+data.Community.owner._id+"'>";
            code += "            <img src='/Upload/Profile/"+data.Community.owner.image+"' class='community-member-pic'>";
            code += "          </a>";
            code += "          <span class='label label-primary'>Owner</span>";
            code += "      </div>";
            code += "      <div class='col-sm-10 col-xs-7 scrollable'>";
            code += "          <a class='comusername' href='/community/viewprofile/"+data.Community.owner._id+"'>"+data.Community.owner.name+"</a>";
            code += "      </div>";
            code += " </div>"; 
            for(var i = 0; i < data.Community.admin.length; i++) {
                code += "<div class='col-sm-12 col-xs-12 allcoms community-user-div comUsersFxnCall' style='margin-top:5px;'>";
                code += "     <div class='col-sm-2 col-xs-5' style='padding:5px;'>";
                code += "          <a href='/community/viewprofile/"+data.Community.admin[i]._id+"'>";
                code += "            <img src='/Upload/Profile/"+data.Community.admin[i].image+"' class='community-member-pic'>";
                code += "          </a>";
                code += "          <span class='label label-success'>Admin</span>";
                code += "      </div>";
                code += "      <div class='col-sm-10 col-xs-7 scrollable'>";
                code += "          <a class='comusername' href='/community/viewprofile/"+data.Community.admin[i]._id+"'>"+data.Community.admin[i].name+"</a>";
                code += "      </div>";
                code += " </div>"; 
            }
            

          $('#comUsersList').html(code);
       // $('#search').empty();
        }
      });  
     }




     function AllUsersList(id)
     {
       $.ajax({
         type: "GET",
         url: '/community/communityMembersData/' + id, // Using our resources.json file to serve results
         success: function(result) {
             var data = JSON.parse(JSON.stringify(result));
             var code ="";
 
             for(var i = 0; i < data.Community.user.length; i++) {
                 code += "<div class='col-sm-12 col-xs-12 allcoms community-user-div comUsersFxnCall' style='margin-top:5px;'>";
                 code += "     <div class='col-sm-2 col-xs-5' style='padding:5px;'>";
                 code += "          <a href='/community/viewprofile/"+data.Community.user[i]._id+"'>";
                 code += "            <img src='/Upload/Profile/"+data.Community.user[i].image+"' class='community-member-pic'>";
                 code += "          </a>";
                 code += "          <span class='label label-success'>user</span>";
                 code += "      </div>";
                 code += "      <div class='col-sm-10 col-xs-7 scrollable'>";
                 code += "          <a class='comusername' href='/community/viewprofile/"+data.Community.user[i]._id+"'>"+data.Community.user[i].name+"</a>";
                 code += "      </div>";
                 code += " </div>"; 
             }
             
 
           $('#comUsersList').html(code);
        // $('#search').empty();
         }
       });  
      }
 
