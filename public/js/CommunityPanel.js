//---------initial----------//
var anyCommunity = false;
joinedCommunity();
pendingCommunity();
myCommunity();
inviteCommunity();
/*flag 0 for joined community
*flag 1 for pending community
*flag 2 for my community
*flag 3 for invite community
*/
function createCommunityDivForPanel(response,flag,extClass){
  console.log(response);
  var badge = '';
  var badge2 = '';
  var panelForwarded = 'discussion';
  var numberUser = '';
  try{
      if(flag==0 || flag==2){

           var panelComImage = response.image;
           var panelComId = response._id;
           var panelComName = response.name;

          if(flag==2)
        {
          numberUser = 'Request('+response.request.length+')';
          numberUser = "<a class='comnametxt-user' href='/community/manageCommunity/"+panelComId+"'>"+numberUser+"</a>";
          badge = '<label class="label label-success" style="cursor:pointer !important;"><i class="fa fa-cogs"></i></label>';
        }else{
          numberUser = 'Members('+response.user.length + response.admin.length+')';
          numberUser = "<a class='comnametxt-user' href='/community/communitymembers/"+panelComId+"'>"+numberUser+"</a>";
          badge = '<label class="label label-success" style="cursor:pointer !important;"><i class="fa fa-cogs"></i></label>';
        }
      }else if(flag==1){
        var panelComImage = response.image;
        var panelComId = response._id;
        var panelComName = response.name;
        panelForwarded = 'communityprofile';
        numberUser = 'Members('+response.request.length+')';
        numberUser = "<a class='comnametxt-user' style='text-decoration:none;color:black;cursor:context-menu'>"+numberUser+"</a>";
        badge = '<label class="label label-danger" style="cursor:pointer !important;"><i class="fa fa-times"></i></label>';
        badge2 = '<label class="label label-danger">Pending</label>&nbsp;&nbsp;&nbsp;';
      }else if(flag==3){
        var panelComImage = response.image;
        var panelComId = response._id;
        var panelComName = response.name;
        panelForwarded = 'communityprofile';
        numberUser = 'Members('+response.request.length+')';
        numberUser = "<a class='comnametxt-user' style='text-decoration:none;color:black;cursor:context-menu'>"+numberUser+"</a>";
        badge = '<label class="label label-success" style="cursor:pointer !important;"><i class="fa fa-times"></i></label>';
        badge2 = '<label class="label label-success">Invitation</label>&nbsp;&nbsp;&nbsp;';
      }
        code="<div class='col-sm-12 col-xs-12 "+extClass+" community-div' style='margin-top:5px;' id='can"+panelComId+"'>";
        code +="<div class='col-sm-1 col-xs-3' style='padding:10px;z-index:1'>";
        code +="<a href='/community/"+panelForwarded+"/"+panelComId+"'><img src='/Upload/CommunityProfile/"+panelComImage+"' class='cpic'></a>";
        code +="</div>";
        code +="<div class='col-sm-10 col-xs-7' style='padding-top:25px;padding-bottom:5px;overflow:scroll'>";
        code +="     <p style='margin:0'><a class='comnametxt' href='/community/"+panelForwarded+"/"+panelComId+"'>"+badge2+panelComName+"</a>&nbsp;&nbsp;&nbsp;"+numberUser+"</p>";
        code +="</div>";
        code +="<div class='col-sm-1 col-xs-2' style='padding:0'>";
        if(flag==1)
        {
          code +="<a class='community-short-btn' onclick='cancelRequest(\""+panelComId+"\")' style='float:right'>";
          code +=badge+"</a>";
        } else if(flag==2)
        {
          code +="<a class='community-short-btn' href='/community/manageCommunity/"+panelComId+"' style='float:rignt'>";
          code +=badge+"</a>";
        }else if(flag==3)
        {
          code +="<a class='fa fa-check' onclick='acceptInvitation(\""+panelComId+"\")' style='float:right'>";
          code +=badge+"</a>";
        }
        code +="</div>";
        code +="</div>";
        anyCommunity = true;
  }catch(err){
    code = '';
  }
  return code;
}
//--------------------------------------------------------------------------------------------------------------------
function pendingCommunity()
{
    $.ajax({
           type: 'GET',
           contentType: 'application/json',
           url: '/community/userData',
           success: function (response) {
            var data = JSON.parse(JSON.stringify(response));
               $('.pendingCommunity').remove();
               for(i=0;i<data.User[0].pendingCommunity.length;i++)
               {
                
                  $('#my-pending-commuity').append(createCommunityDivForPanel(data.User[0].pendingCommunity[i],1,'pendingCommunity'));
              
               }
          
           },
           error: function (err) {
               notie.alert({type: 3, text:'Something went wrong!', time: 2})
               if(!anyCommunity)
               {
                 var code ="<div class='col-sm-12 joinedCommunity well' style='margin-top:5px;font-weight:bold'>";
                 code +="<center>No any joined community</center><br /><center>";
                 code +="<a class='btn btn-default' href='/community/list'>Click here for more communities</a></center>";
                 code +="</div>";
                 $('#community-that-am-in').append(code);
               }
           }
       });
}
//-----------------------------------------------------------------------------------------------------------------------------

function inviteCommunity()
{
    $.ajax({
           type: 'GET',
           contentType: 'application/json',
           url: '/community/userData',
           success: function (response) {
            var data = JSON.parse(JSON.stringify(response));
               $('.inviteCommunity').remove();
               for(i=0;i<data.User[0].inviteCommunity.length;i++)
               {
                
                  $('#my-invite-commuity').append(createCommunityDivForPanel(data.User[0].inviteCommunity[i],3,'inviteCommunity'));
              
               }
          
           },
           error: function (err) {
               notie.alert({type: 3, text:'Something went wrong!', time: 2})
               if(!anyCommunity)
               {
                 var code ="<div class='col-sm-12 joinedCommunity well' style='margin-top:5px;font-weight:bold'>";
                 code +="<center>No any joined community</center><br /><center>";
                 code +="<a class='btn btn-default' href='/community/list'>Click here for more communities</a></center>";
                 code +="</div>";
                 $('#community-that-am-in').append(code);
               }
           }
       });
}
//-------------------------------------------------------------------------------

function joinedCommunity()
{
    $.ajax({
           type: 'GET',
           contentType: 'application/json',
           url: '/community/userData',
           success: function (response) {
            var data = JSON.parse(JSON.stringify(response));
               $('.joinedCommunity').remove();
                  //---------------------------
                  console.log(data.User[0].community);
                   for(i=0;i<data.User[0].community.length;i++)
                   {
                     console.log(data.User[0].community[i]._id);
                          /*
                            existFlag = true;
                            $('.loading-community-panel-image').remove();
                            */
                            $('#community-that-am-in').append(createCommunityDivForPanel(data.User[0].community[i],0,'joinedCommunity'));
                          
                    }
                  //---------------------------
           },
           error: function (err) {
               notie.alert({type: 3, text:'Something went wrong!', time: 2})
           }
       });
}
//--------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
function myCommunity()
{
    $.ajax({
           type: 'GET',
           contentType: 'application/json',
           url: '/community/userData',
           success: function (response) {
            var data = JSON.parse(JSON.stringify(response));
               $('.myCommunity').remove();
                  //---------------------------
                   for(i=0;i<data.User[0].myCommunity.length;i++)
                   {
                       
                          /*
                            existFlag = true;
                            $('.loading-community-panel-image').remove();
                          */
                         $('#can-create-community').append(createCommunityDivForPanel(data.User[0].myCommunity[i],2,'myCommunity'));

                    }
                  //---------------------------
           },
           error: function (err) {
               notie.alert({type: 3, text:'Something went wrong!', time: 2})
           }
       });
}
//---------------------------------------------------------------------------------------------------
function cancelRequest(id)
{
  $.confirm({
      title: 'Cancel Request',
      content: "Do you really want cancel request...",
      buttons: {
          'Yes': {
              btnClass: 'btn-success',
              action: function () {
                $.ajax({
                       type: 'POST',
                       contentType: 'application/json',
                       data: JSON.stringify({_id:id}),
                       url: '/community/cancelCommunity',
                       success: function (response) {
                         $('#can'+id).remove();
                         pendingCommunity();
                       },
                       error: function (err) {
                           notie.alert({type: 3, text:'Something went wrong!', time: 2})
                       }
                   });
              }
          },
          'No': {btnClass: 'btn-danger',}
      }
  });
}

//****************************************************************************** */
function acceptInvitation(id)
{
  $.confirm({
      title: 'Accept Invitation',
      content: "Do you really want to accept Invitation...",
      buttons: {
          'Yes': {
              btnClass: 'btn-success',
              action: function () {
                $.ajax({
                       type: 'POST',
                       contentType: 'application/json',
                       data: JSON.stringify({_id:id}),
                       url: '/community/acceptInvitation',
                       success: function (response) {
                         $('#can'+id).remove();
                         inviteCommunity();
                       },
                       error: function (err) {
                           notie.alert({type: 3, text:'Something went wrong!', time: 2})
                       }
                   });
              }
          },
          'No': {btnClass: 'btn-danger',}
      }
  });
}