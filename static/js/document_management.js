jQuery.browser = {};


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(function () {



    //검색
    $('#document_search').keydown(function (key) {
        if (key.keyCode == 13) {
            document_search();
        }
    })

    $("#document_search_btn").click(function () {
        document_search();
    });





    //파일

    //파일 세팅
    //$("#id_file").attr('accept', "image/*,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    //파일 버튼 선택
    $("#btn_file").click(function () {
        $("#id_file").click();
    });
    //파일 선택시 입력 창 변경
    $("#id_file").change(function (e) {
        for (i = 0; i < e.target.files.length; i++) {
            $("#new_edit_file_filename").val(document.getElementById("id_file").value);
        }
    });

    //파일 서브밋
    $('#id_ajax_upload_form').submit(function (e) {
        e.preventDefault();
        $form = $(this)
        var formData = new FormData(this);

        $("#overlay").fadeOut(300);
        $.ajax({
            url: '/KBL/file_save/',
            type: 'POST',
            data: formData,
            success: function (response) {
                $('.error').remove();
                console.log(response)
                if (response.error) {
                    $.each(response.errors, function (name, error) {
                        error = '<small class="text-muted error">' + error + '</small>'
                        $form.find('[name=' + name + ']').after(error);
                    })
                } else {

                    alert(gettext('Saved'));
                    $('#new_edit_file').modal('hide');
                    document_search();


                }
            },
            cache: false,
            contentType: false,
            processData: false,
            complete: function () {
                $("#overlay").fadeOut(300);
            },
            beforeSend: function () {
                $("#overlay").fadeIn(300);
            },
        });
    });



    document_search();

});



function document_search(page = null) {
    var context_in_page = 10;


    var category = $('#patient_type option:selected').val();
    var string = $('#patient_search').val();


    $.ajax({
        type: 'POST',
        url: '/KBL/document_search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'category': category,
            'string': string,

            'page': page,
            'context_in_page': context_in_page,
        },
        dataType: 'Json',
        success: function (response) {
            $('#file_list_table > tbody ').empty();
            for (var i = 0; i < context_in_page; i++) {
                if (response.datas[i]) {
                    var str = "<tr>";

                    str += "<td>" + response.datas[i]['id'] + "</td>" +
                        "<td>" + response.datas[i]['board_type'] + "</td>" +
                        "<td>" + response.datas[i]['document_name'] + "</td>" +
                        "<td>" + response.datas[i]['user'] + "</td>" +
                        "<td>" + response.datas[i]['registered_date'] + "</td>" +
                        '<td><a href="' + response.datas[i]['document_url'] + '"download="' + response.datas[i]['document_name'] + '"><i class="fa fa-lg fa-download"></i></a></td>' +
                        "<td>" +
                        "<a class='btn btn-default btn-xs' style='margin-right:5px;' href='javascript: void (0);' onclick='file_add_modal(" + response.datas[i].id + ")' ><i class='fa fa-lg fa-pencil'></i></a>" +
                        "<a class='btn btn-danger btn-xs' href='javascript: void (0);' onclick='delete_file(" + response.datas[i].id + ")' ><i class='fa fa-lg fa-trash'></i></a>" +
                        '</td></tr > ';


                } else {
                    var str = "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                }
                $('#file_list_table').append(str);
            }


            //페이징
            $('#table_pagnation').html('');
            str = '';
            if (response.has_previous == true) {
                str += '<li> <a onclick="document_search(' + (response.page_number - 1) + ')">&laquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&laquo;</span></li>';
            }

            for (var i = response.page_range_start; i < response.page_range_stop; i++) {
                if (response.page_number == i) {
                    str += '<li class="active"><span>' + i + ' <span class="sr-only">(current)</span></span></li>';
                }
                else if (response.page_number + 5 > i && response.page_number - 5 < i) {
                    str += '<li><a onclick="document_search(' + i + ')">' + i + '</a></li>';
                }
                else {
                }

            }
            if (response.has_next == true) {
                str += '<li><a onclick="document_search(' + (response.page_number + 1) + ')">&raquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&raquo;</span></li>';
            }
            $('#table_pagnation').html(str);



        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}




function file_add_modal(id = '') {

    $("#selected_file_id").val(id);

    $("#id_file").val('');

    $("#new_edit_file_name").val('');//Document Name
    $("#new_edit_file_remark").val('');
    $("#new_edit_file_filename").val('');

    $("#new_edit_file_old_file").html('');
    $("#new_edit_file_old_file_div").hide();
    if (id != '') { // 불러오기
        $.ajax({
            type: 'POST',
            url: '/KBL/file_get/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),

                'id': id,
            },
            dataType: 'Json',
            success: function (response) {

                $("#new_edit_file_name").val(response.title);
                $("#new_edit_file_remark").val(response.memo);

                $("#new_edit_file_old_file_div").show();
                $("#new_edit_file_old_file").html(response.origin_name);
            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        })

    }

    $('#new_edit_file').modal({ backdrop: 'static', keyboard: false });
    $('#new_edit_file').modal('show');
}

function save_file() {
    id = $("#selected_file_id").val();
    draft_id = $("#selected_file_list").val();
    //신규
    if (id == '') {
        if ($("#id_file").val() == '') {
            alert(gettext('Select File.'));
            return;
        }
    }
    //수정


    file_name = $("#new_edit_file_name").val();//문서이름
    if (file_name == '') {
        alert(gettext('File Name is Empty.'));
        return;
    }

    remark = $("#new_edit_file_remark").val();




    $('#id_ajax_upload_form').submit();

}

function delete_file(id = '') {

    if (id == '') {
        return;
    }

    if (confirm(gettext('Do you want to delete?'))) {
        $.ajax({
            type: 'POST',
            url: '/KBL/file_delete/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),

                'id': id,
            },
            dataType: 'Json',
            success: function (response) {
                if (response.result) {
                    alert(gettext('Deleted.'));
                    document_search($("#selected_file_list").val());
                }
            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        })
    }

}