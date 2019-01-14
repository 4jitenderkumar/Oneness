/*-----------------Buttons-----------------------------------------*/
var edbtn='<a class="btn btn-sm editbtn actionbtns" style="margin-top:35px;background-color: #2D312C;color: #fff"><span class="fa fa-edit"></span></a>';
var debtn='<a class="btn btn-sm deletebtn actionbtns" style="margin-top:35px;background-color: #2D312C;color: #fff"><span class="fa fa-trash"></span></a>';
var info='<a class="btn btn-sm infobtn actionbtns" style="margin-top:35px;background-color: #2D312C;color: #fff"><span class="fa fa-info"></span></a>';
var months=[ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
/*---Initialize DataTable------------------------------------------*/
var table=  $('#communitytable').DataTable( {
  "lengthMenu": [[10, 25, 50], [ 10, 25, 50]],
  serverSide:true,
  processing:true,
  columns: [
      {title : "Community Id",data: "_id", 'orderable' : false, 'searchable' : false,'sClass':'ComTableId' },
      {title : "Community Name", data: "name", 'orderable' : true, 'searchable' : true,'sClass':'ComTableName' },
      {title : "Membership Rule", data: "rule", 'orderable' : false, 'searchable' : true,'sClass':'ComTableRule' },
      {title : "Community Owner", data: "owner.name", 'orderable' : true, 'searchable' : false,'sClass':'ComTableAdmin' },
      {title : "Create Date", data: "date", 'orderable' : true, 'searchable' : false,'sClass':'ComTableDate' },
      {title : "Actions",data: null, 'orderable' : false, 'searchable' : false,'sClass':'tableAction'},
      {title : "Community Pic", data: 'image', 'orderable' : false, 'searchable' : false,'sClass':'ComTableImage',"visible": true },
      {title : "", data: 'activated', 'orderable' : false, 'searchable' : false,'sClass':'ComTableActive' },
      ],
      "order": [[ 1, "asc" ]],
        ajax: {
          url: '/community/communityListData',
          type: 'GET',
          "data": function ( d ) {
            d.communityMembershipRule = $('#CommunityRuleFilter').val();
          },
        },
      "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
        var adminName=aData.owner.name;
        if(aData.activated == "yes")
        {
          state=';border: 4px solid green;'
        } else {
          state=';border: 4px solid red;'
        }
        if(aData.rule=='permission')
        {
          Rule="Permission";
        }
        else{
            Rule="Direct";
        }

        function FullDate(dateObj)
        {
           var date = dateObj.getDate();
           var year = dateObj.getFullYear();
           var month= months[parseInt(dateObj.getMonth())];
           return date+'-'+month+'-'+year;
        }
        var dateObj = new Date(aData.date)
        createDate = FullDate(dateObj);

         $('td:eq(2)', nRow).html(Rule);
         $('td:eq(3)', nRow).html(adminName);
         $('td:eq(4)', nRow).html(createDate);
         $('td:eq(5)', nRow).html(edbtn+info); //debtn
         $('td:eq(6)', nRow).html('<img src="/Upload/CommunityProfile/'+aData.image+'" style="width:80px;height:80px'+state+'">');
         return;
      }

} );
function refresh()
{
  table.ajax.reload(null, false);
}
$(document).ready( function() {
    $('#CommunityRuleFilter').on('change', function () {
        table.ajax.reload(null, false);
    });
    $('#communitytable').fadeIn(2000); // show table in fade animation
    /*--------Pop Edit With Value------------------------------------------------*/
    $("#communitytable").on("click", ".editbtn", function () {
        var tds = $(this).closest('tr').children('td');
        i = 0;
        tds.each(function (index, object) {
            if (i == 0) {
                id = $(object).html();
            }
            else if (i == 1) {
                comname = $(object).html();
            }
            else if (i == 2) {
            }
            else if (i == 3) {
                adminname = $(object).html();
            }
            else if (i == 4) {
                date = $(object).html();
            }
            else if (i == 5) {
            }
            else if (i == 6) {
            }
            else if (i == 7) {
                staus=$(object).html();
            }
            else {
                return;
            }
            i++;
        })
        if (status=='yes') {
            $("#communityStatus").val("true");
        }
        else {
            $("#communityStatus").val("false");
        }
        $('#CommunityNamePop').text("Update " + comname);
        $('#CommunityAdminPop').text('Created by ' + adminname + ' ,'+date);
        $('#_id').val(id);
        $('#CommuityName').val(comname);
        $('#updateCommunity').modal('toggle');
        $('#updateCommunity').modal('show');
    });
    /*---------Delete Community--------------------------------------------------------------*/
    $("#communitytable").on("click", ".deletebtn", function () {
        var tds = $(this).closest('tr').children('td');
        i = 0;
        tds.each(function (index, Object, third) {
            if (i == 0) {
                id = $(Object).html();
            }
            else if (i == 1) {
                comname = $(Object).html();
            }
            else {
                return;
            }
            i++;
        })
        var data = {};
        data._id = id;
        // new confirm added
        $.confirm({
            title: 'Delete User!',
            content: "Are you sure you want to delete " + comname,
            buttons: {
                'Yes': {
                    btnClass: 'btn-success',
                    action: function () {
                        $.ajax({
                            type: 'POST',
                            data: JSON.stringify(data),
                            contentType: 'application/json',
                            url: '/admin/deleteCommunity',
                            success: function (response) {
                                table.ajax.reload(null, false);
                                notie.alert({type: 3, text: 'Community "' + comname + '" Deleted', time: 2})
                            },
                            error: function (response) {
                                notie.alert({type: 3, text: response, time: 2})
                            }
                        });
                    }
                },
                'No': {btnClass: 'btn-danger',}
            }
        });
    });
    /*---------------------Update Edit----------------------------------------*/
    $("#editsubmit").click(function () {
        var id = $('#_id').val();
        var comname = $('#CommuityName').val();
        var status = $('#communityStatus').val();
        var data = {};
        data._id = id;
        data.communityName = comname;
        data.communityActive = status;
        $('#updateCommunity').modal('hide');
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/admin/updateCommunity',
            success: function (response) {
                table.ajax.reload(null, false);
                notie.alert({type: 1, text:'Community "'+ comname + '" Updated', time: 2})
            },
            error: function (response) {
                notie.alert({type: 3, text: 'Unable to update Something went wrong', time: 2})
            }
        });
    });
    //---------------Community Info-------------------------------------------------*/
    $("#communitytable").on("click", ".infobtn", function () {
        var tds = $(this).closest('tr').children('td');
        i = 0;
        tds.each(function (index, object) {
            if (i == 0) {
                id = $(object).html();
            }
            else if(i==1)
            {
              comname = $(object).html();
            }
            else {
                if(i==6)
                {
                  pic = $(object).html().toString();
                  pic=pic.match('src\s*=\s*"([^"]+)"')[1];
                }
                if(i==7){
                    return;
                }
            }
            i++;
        })
        var data={};
        data._id=id;
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/admin/getInfo',
            success: function (response) {
                var data = JSON.parse(JSON.stringify(response));
              $('#CommunityInfoPop').html('Community '+comname);
              $('#communityDesc').html(data.Community.description);
                console.log(data.Community.name);
              $('#CommunityProfilePic').attr('src',pic);
              $('#CommunityInfo').modal('toggle');
              $('#CommunityInfo').modal('show');
            },
            error: function (response) {
                notie.alert({type: 3, text: 'Unable to update Something went wrong', time: 2})
            }
        });
    });
    //--------------------------------------------------------------------------
});