$(document).ready(function () {



    comments_update();
});
//��� ���ΰ�ħ
function comments_update(contents_id) {
    $.ajax({
        type: 'POST',
        url: '/manage/board/comment/get',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'content_id': $("#content_id").val(),   //�Խ� �� ID
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

//��� ���
function add_comment(upper = null) {


    // �ű� / ���� ���� �ؾ��� 
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
            'content_id': $("#content_id").val(),   //�Խ� �� ID
            'comment': comment,     //��� ����
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

//��� ����
function set_edit(id) {
    
}


//��� ����
function delete_comment(id) {
    
    if (confirm(gettext('Do you want to delete this comment?'))) {
        var url = '/manage/board/comment/delete/' + id + '/';


        $.ajax({
            type: 'POST',
            url: url,
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),
                'content_id': $("#content_id").val(),   //�Խ� �� 
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

