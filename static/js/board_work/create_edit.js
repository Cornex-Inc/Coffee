$(function () {



    $("#id_file").change(function (e) {

        $("#select_files").empty();
        var str = '';

        for (i = 0; i < e.target.files.length; i++) {
            str += '<li><div class="file_origin_name">' + e.target.files[i].name; + '</div></li>'

        }
        $("#select_files").append(str);
    });



    $('#id_file').attr("multiple", "true");





    //√Îº“
    $("#cancel").click(function () {
        if ( confirm( gettext('Are you sure you want to cancel writing?') ) ) {
            location.replace('/manage/board');
        }
    });




});

function delete_file(id = null) {
    if (id == null) {
        return;
    }
    if (confirm(gettext('Do you want to delete ? '))) {

        $.ajax({
            type: 'POST',
            url: '/manage/board/delete_file/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),
                'id': id,
            },
            dataType: 'Json',
            success: function (response) {
                if (response.result == true) {
                    $("#current_file_" + id).hide();
                }
            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        })
    }
    
    


}