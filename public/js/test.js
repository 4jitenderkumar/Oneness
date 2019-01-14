$(document).ready(function() {
    $('#searchInput').keyup(function(){

        var input = $.trim($('#searchInput').val());
        console.log(input);
      $.ajax({
        type: "GET",
        url: '/community/listData', // Using our resources.json file to serve results
        success: function(result) {
            var data = JSON.parse(JSON.stringify(result));
            createCode(data, input); 
        }
      });  
     });



   function createCode(data, input){
      var code ="";
      for(var i = 0; i < data.Community.length; i++) {
     

      if(input == data.Community[i].name){
        
        if(data.User._id == data.Community[i].owner._id)
        continue;

        for(var j = 0; j < data.Community[i].admin[j]; j++){
          if(data.User._id == data.Community[i].admin[j]._id)
          continue;
        }

        for(var j = 0; j < data.Community[i].user[j]; j++){
          if(data.User._id == data.Community[i].user[j]._id)
          continue;
        }

        for(var j = 0; j < data.Community[i].invitedUser[j]; j++){
          if(data.User._id == data.Community[i].invitedUser[j]._id)
          continue;
        }

        for(var j = 0; j < data.Community[i].request[j]; j++){
          if(data.User._id == data.Community[i].request[j]._id)
          continue;
        }
        var communityId="'"+data.Community[i]._id+"'";
  code +='<div class="container mainDivDiscover-container" style="padding:0" id="mainDivDiscover'+data.Community[i]._id+'">';
  code +='<div class="panel community-show-item panel-default allSidesSoft" style="style="padding:0;background:white;">';
  code +='<div class="panel-body" style="padding:0;padding-top:20px">';
  code +='  <div class="col-sm-2 col-xs-3 col-lg-1 col-md-2">';
  code +='    <a href="communityprofile/'+data.Community[i]._id+'">';
  code +='       <img src="" class="allSides" style="height:70px;width:70px;border:3px solid rgb(235, 235, 235)" />';
  code +='    </a>';
  code +='  </div>';
  code +='  <div class="col-sm-8 col-xs-6 col-lg-8 col-md-8 community-name">';
  code +='    <a href="communityprofile/'+data.Community[i]._id+'" class="community-name">';
  code +=     data.Community[i].name;
  code +='    </a>';
  code +='  </div>';

  code +='  <div class="col-sm-2 col-xs-3 col-lg-3 col-md-2" style="padding:15px 10px 0 10px">';
  code +='<div id="joinBtns'+data.Community[i]._id+'">';
    if(data.Community[i].rule == 'permission')
    {
      console.log(data.Community[i].image);
      code +='<button class="btn btn-primary btn-sm pull-right" id="btn'+data.Community[i]._id+'" onclick="getBtnValue('+'0,'+communityId+');" data-id="0" >';            
      code +='Ask To Join';
      code +='</button>';
    } else {
      code +='<button class="btn btn-primary btn-sm pull-right" id="btn'+data.Community[i]._id+'" onclick="getBtnValue('+'1,'+communityId+');" data-id="1" >';         
      code +='Join';
      code +='</button>';
    }
  code +='</div>';
  code +='  </div>';

  code +='</div>';
  code +='<div class="panel-body" style="padding:10px 0 10px 0;">';
  code +='  <div class="col-sm-12 col-xs-12 col-lg-12 col-md-12">';
  code +='    <p class="totalUsers">';
  code +=data.Community[i].user.length+' Members';
  code +='    </p>';
  code +='  </div>';
  code +='  <div class="col-sm-12 col-xs-12 col-lg-12 col-md-12 community-description" style="font-size:16px">';
    code +='<div id="less'+data.Community[i]._id+'" class="community-description">';
          var full=data.Community[i].description;
          LessDesc=full.replace(/<(?:.|\n)*?>/gm,'');
          LessDesc=LessDesc.substring(0,200);
    if(data.Community[i].description.length>200)
    {
      LessDesc +=LessDesc+'......';
    }
    code +=LessDesc;
    code +='</div>';
  code +='<div id="more'+data.Community[i]._id+'" class="community-description community-description-full">';
  var fullDesc = data.Community[i].description.replace(/<(?:.|\n)*?>/gm,'');
  code +=fullDesc;
  code +='</div>';
  if(data.Community[i].description.length>200)
  {
    code +='    <button class="btn badge expand" data-id="'+data.Community[i]._id+'" style="outline: none;">More</button>';
  }
  code +='  </div>';
  code +='</div>';
  code +='</div>';
  code +='</div>';
      }
}
      

    $('#search').html(code);
 // $('#search').empty();
    }

  });