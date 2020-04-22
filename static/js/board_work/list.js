$(document).ready(function () {

    //Daterangepicker
    $(".date_input").daterangepicker({
        autoUpdateInput: false,
        singleDatePicker: true,
        showDropdowns: true,
        drops: "down",
        locale: {
            format: 'YYYY-MM-DD',
            locale: { cancelLabel: 'Clear' }
        },
    }).on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.endDate.format('YYYY-MM-DD'))
    });




    comments_update();
});
//댓글 새로고침
function comments_update(contents_id) {
    $.ajax({
        type: 'POST',
        url: '/manage/board/comment/get',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'content_id': $("#content_id").val(),   //게시 글 ID
        },
        dataType: 'Json',
        success: function (response) {
            $("#content_comment_list").html('');

            var str = '';
            for (var i = 0; i < response.list_comment.length; i++) {
                str += "<div class='comment_div'><div class='comment'>";
                for (var j = 0; j < response.list_comment[i].depth; j++) {
                    str += "<div class='comment_depth'></div>";
                }
                if (response.list_comment[i].depth > 0) {
                    str += "<div class='comment_depth_stair'>ㄴ</div>";
                }
                str += "<div class='comment_user_name'><p>" + response.list_comment[i].user + "</p></div>" +
                    "<div class='comment_item'><p id='comment_item_" + response.list_comment[i].id + "'>" + response.list_comment[i].comment + "</p></div>" +
                    "<div class='comment_date'><p>" + response.list_comment[i].datetime + 
                    "&emsp;<i class='fa fa-reply fa-flip-vertical i_coursor reply_comment' aria-hidden='true' id='reply_comment_" + response.list_comment[i].id + "'></i>";

                
                if (response.list_comment[i].is_creator == true) {
                    str += "<i class='fa fa-pencil fa-fw i_coursor edit_comment' aria-hidden='true' id='edit_comment_" + response.list_comment[i].id +"'></i>" +
                        "<i class='fa fa-trash fa-fw i_coursor delete_comment' aria-hidden='true' id='delete_comment_" + response.list_comment[i].id +"'></i>";
                }    
                str += "</p></div></div>" + 
                    "<div class='comment_reply_wrap' id='reply_comment_div_" + response.list_comment[i].id + "'>" + 
                    "<div class='comment_reply'><span class='fl' id='comment_text_front_" + response.list_comment[i].id + "'></span><div class='input-group'><textarea class='form-control reply_comment_text' id='reply_comment_text_" + response.list_comment[i].id + "'></textarea>" +
                    "<span class='input-group-btn'>" +
                    "<button class='btn btn-default add_reply_comment' id='add_reply_comment_" + response.list_comment[i].id + "'>" + gettext('Add<br />Comment') + "</button></span > " +
                    "</div></div>" +
                    "</div > " +
                    "</div>";
            }
            $("#content_comment_list").html(str);

            //답글
            var reply_content = '';
            var reply_textarea = '';
            var reply_upper = '';
            var is_edit = false;
            $(".reply_comment").click(function () {
                $(".comment_reply_wrap").hide();
                var this_id = $(this).attr('id');
                var split_id = this_id.split('_');

                reply_content = $("#reply_comment_div_" + split_id[2]);
                reply_textarea = $("#reply_comment_text_" + split_id[2]);
                reply_textarea.val('');

                $("#comment_text_front_" + split_id[2]).html('ㄴ');
                reply_upper = split_id[2];
                reply_content.show();
                is_edit = false;
                
            });
            $(".add_reply_comment").click(function () {
                if (is_edit) {// 수정
                    set_edit(reply_upper);
                } else {// 추가
                    add_comment(reply_upper);
                }
                
            });

            //수정
            $(".edit_comment").click(function () {
                $(".comment_reply_wrap").hide();
                var this_id = $(this).attr('id');
                var split_id = this_id.split('_');

                reply_content = $("#reply_comment_div_" + split_id[2]);
                reply_textarea = $("#reply_comment_text_" + split_id[2]);
                reply_textarea.val($("#comment_item_" + split_id[2]).html());
                reply_upper = split_id[2];
                $("#comment_text_front_" + split_id[2]).html('Edit:');
                reply_content.show();


                is_edit = true;
            });

            //삭제
            $(".delete_comment").click(function () {
                var this_id = $(this).attr('id');
                var split_id = this_id.split('_');

                delete_comment(split_id[2]);
            });


            $("#content_comment_count").html(gettext('Comments') + '(' + response.conntents_count + ')');
            $("#content_comment_count_top").html(response.conntents_count )
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}

//댓글 등록
function add_comment(upper = null) {


    var comment = ''
    if (upper == null) {
        comment = $("#text_comment_new").val();
    } else {
        comment = $("#reply_comment_text_" + upper).val();
    }

    if (comment == '') {
        alert(gettext('Input Text'));
        return;
    }

    var expected_date = $("#expected_date").val();
    var due_date = $("#due_date").val();
    var select_status = $("#select_status").val();
    $.ajax({
        type: 'POST',
        url: '/manage/board_work/comment/add',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'content_id': $("#content_id").val(),   //게시 글 ID
            'comment': comment,     //댓글 내용
            'upper_id': upper,
            'expected_date': expected_date,
            'due_date': due_date,
            'select_status': select_status,
        },
        dataType: 'Json',
        success: function (response) {
            comments_update($("#content_id").val());
            $("#text_comment_new").val('');

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    });
}

//댓글 수정
function set_edit(id) {


    comment = $("#reply_comment_text_" + id).val();
    if (comment == '') {
        alert(gettext('Input Text'));
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/manage/board/comment/edit/' + id + '/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'content_id': id,   //댓글  ID
            'comment': comment,     //댓글 내용

        },
        dataType: 'Json',
        success: function (response) {
            comments_update($("#content_id").val());
            $("#text_comment_new").val();

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    });
}


//댓글 삭제
function delete_comment(id) {
    
    if (confirm(gettext('Do you want to delete this comment?'))) {
        var url = '/manage/board/comment/delete/' + id + '/';


        $.ajax({
            type: 'POST',
            url: url,
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),
                'content_id': $("#content_id").val(),   //게시 글 
                'id':id,
            },
            dataType: 'Json',
            success: function (response) {
                comments_update($("#content_id").val());
                $("#text_comment_new").val();
            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        });
    }
}

