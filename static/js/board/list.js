$(document).ready(function () {



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
                str += "<div class='comment'>";
                console.log(response.list_comment[i].depth);
                for (var j = 0; j < response.list_comment[i].depth; j++) {
                    str += "&emsp;&emsp;"
                }

                str += response.list_comment[i].comment + 
                    " - " + response.list_comment[i].user + "<br/>" +
                    response.list_comment[i].datetime + "<input type='button' value='reply' onclick='$(&apos;#comment_reply_&apos; + " + response.list_comment[i].id +").toggle();'/>" + "<br/>" + 
                    "<div class='comment_reply' id='comment_reply_" + response.list_comment[i].id + "'><textarea></textarea><input type='button' onclick='add_comment(" + response.list_comment[i].id + ");' value='Save'/></div>" + 
                    "<input type='button' class='btn' value='edit' onclick=&apos;set_edit(" + response.list_comment[i].id + ");&apos; /> " + 
                    "<input type='button' class='btn' value='delete' onclick=delete_comment(" + response.list_comment[i].id + "); /> " + 
                    "</div>"
            }

            

            $("#content_comment_list").html(str);
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}

//댓글 등록
function add_comment(upper = null) {


    // 신규 / 수정 구분 해야함 
    var comment = ''
    if (upper == null) {
        comment = $("#text_comment_new").val();
    } else {
        comment = $("#comment_reply_" + upper + ' textarea').val();
    }

    if (comment == '') {
        alert(gettext('Input Text'));
        return;
    }
    

    $.ajax({
        type: 'POST',
        url: '/manage/board/comment/add',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'content_id': $("#content_id").val(),   //게시 글 ID
            'comment': comment,     //댓글 내용
            'upper_id': upper,
            
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

//댓글 수정
function set_edit(id) {
    
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

