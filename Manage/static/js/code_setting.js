jQuery.browser = {};


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(function () {


    

    //∞Àªˆ
    $('#code_search').keydown(function (key) {
        if (key.keyCode == 13) {
            search_code();
        }
    })

    $("#code_search_btn").click(function () {
        search_code();
    });

    search_code();
});



function code_management_modal(id = '') {

    $("#selected_code").val('');

    $("#code_upper_commcode").val('');
    $("#code_upper_commcode_name").val('');
    $("#code_commcode_grp").val('');
    $("#code_commcode_grp_name").val('');
    $("#code_commcode").val('');
    $("#code_commcode_name_ko").val('');
    $("#code_commcode_name_en").val('');
    $("#code_commcode_name_vi").val('');
    $("#code_se1").val('');
    $("#code_se2").val('');
    $("#code_se3").val('');
    $("#code_se4").val('');
    $("#code_se5").val('');
    $("#code_se6").val('');
    $("#code_se7").val('');
    $("#code_se8").val('');
    $("#code_seq").val('');
    $("#code_use_yn").val('');


    if (id != '') {

        $("#selected_code").val(id);

        $.ajax({
            type: 'POST',
            url: '/manage/code_get/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),

                'id': id,


            },
            dataType: 'Json',
            success: function (response) {

                $("#code_upper_commcode").val(response.code_upper_commcode);
                $("#code_upper_commcode_name").val(response.code_upper_commcode_name);
                $("#code_commcode_grp").val(response.code_commcode_grp);
                $("#code_commcode_grp_name").val(response.code_commcode_grp_name);
                $("#code_commcode").val(response.code_commcode);
                $("#code_commcode_name_ko").val(response.code_commcode_name_ko);
                $("#code_commcode_name_en").val(response.code_commcode_name_en);
                $("#code_commcode_name_vi").val(response.code_commcode_name_vi);
                $("#code_se1").val(response.code_se1);
                $("#code_se2").val(response.code_se2);
                $("#code_se3").val(response.code_se3);
                $("#code_se4").val(response.code_se4);
                $("#code_se5").val(response.code_se5);
                $("#code_se6").val(response.code_se6);
                $("#code_se7").val(response.code_se7);
                $("#code_se8").val(response.code_se8);
                $("#code_seq").val(response.code_seq);
                $("#code_use_yn").val(response.code_use_yn);


            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        })
    }


    $('#code_management_modal').modal({ backdrop: 'static', keyboard: false });
    $('#code_management_modal').modal('show');

}


function search_code(page = null) {
    var context_in_page = 9;


    var category = $('#code_type option:selected').val();
    var string = $('#code_search').val();


    $.ajax({
        type: 'POST',
        url: '/manage/code_search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'category': category,
            'string': string,

            'page': page,
            'context_in_page': context_in_page,
        },
        dataType: 'Json',
        success: function (response) {
            $('#code_list_table > tbody ').empty();
            for (var i = 0; i < context_in_page; i++) {
                if (response.datas[i]) {
                    var str = "<tr>";

                    str += "<td>" + response.datas[i]['id'] + "</td>" +
                        "<td>" + response.datas[i]['upper_commcode'] + "</td>" +
                        "<td>" + response.datas[i]['upper_commcode_name'] + "</td>" +
                        "<td>" + response.datas[i]['commcode_grp'] + "</td>" +
                        "<td>" + response.datas[i]['commcode_grp_name'] + "</td>" +
                        "<td>" + response.datas[i]['commcode'] + "</td>" +
                        "<td>" + response.datas[i]['commcode_name_ko'] + "</td>" +
                        "<td>" + response.datas[i]['commcode_name_en'] + "</td>" +
                        "<td>" + response.datas[i]['commcode_name_vi'] + "</td>" +
                        "<td>" + response.datas[i]['se1'] + "</td>" +
                        "<td>" + response.datas[i]['se2'] + "</td>" +
                        "<td>" + response.datas[i]['se3'] + "</td>" +
                        "<td>" + response.datas[i]['se4'] + "</td>" +
                        "<td>" + response.datas[i]['se5'] + "</td>" +
                        "<td>" + response.datas[i]['se6'] + "</td>" +
                        "<td>" + response.datas[i]['se7'] + "</td>" +
                        "<td>" + response.datas[i]['se8'] + "</td>" +
                        "<td>" + response.datas[i]['seq'] + "</td>" +
                        "<td>" + response.datas[i]['registrerer'] + "</td>" +
                        "<td>" + response.datas[i]['date_of_registered'] + "</td>" +
                        "<td>" +
                        "<a class='btn btn-default btn-xs' href='javascript: void (0);' onclick='code_management_modal(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-pencil'></i></a >" +
                        "<a class='btn btn-danger btn-xs' href='javascript: void (0);' onclick='code_delete(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-trash'></i></a >" +
                        "</td >" +
                        "</tr>";

                } else {
                    var str = "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                }
                $('#code_list_table > tbody').append(str);
            }


            //∆‰¿Ã¬°
            $('#table_pagnation').html('');
            str = '';
            if (response.has_previous == true) {
                str += '<li> <a onclick="search_code(' + (response.page_number - 1) + ')">&laquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&laquo;</span></li>';
            }

            for (var i = response.page_range_start; i < response.page_range_stop; i++) {
                if (response.page_number == i) {
                    str += '<li class="active"><span>' + i + ' <span class="sr-only">(current)</span></span></li>';
                }
                else if (response.page_number + 5 > i && response.page_number - 5 < i) {
                    str += '<li><a onclick="search_code(' + i + ')">' + i + '</a></li>';
                }
                else {
                }

            }
            if (response.has_next == true) {
                str += '<li><a onclick="search_code(' + (response.page_number + 1) + ')">&raquo;</a></li>';
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




function commcode_save() {


    var id = $("#selected_code").val();


    var code_upper_commcode = $("#code_upper_commcode").val();
    var code_upper_commcode_name = $("#code_upper_commcode_name").val();
    var code_commcode_grp = $("#code_commcode_grp").val();
    var code_commcode_grp_name = $("#code_commcode_grp_name").val();
    var code_commcode = $("#code_commcode").val();
    var code_commcode_name_ko = $("#code_commcode_name_ko").val();
    var code_commcode_name_en = $("#code_commcode_name_en").val();
    var code_commcode_name_vi = $("#code_commcode_name_vi").val();
    var code_se1 = $("#code_se1").val();
    var code_se2 = $("#code_se2").val();
    var code_se3 = $("#code_se3").val();
    var code_se4 = $("#code_se4").val();
    var code_se5 = $("#code_se5").val();
    var code_se6 = $("#code_se6").val();
    var code_se7 = $("#code_se7").val();
    var code_se8 = $("#code_se8").val();
    var code_seq = $("#code_seq").val();
    var code_use_yn = $("#code_use_yn").val();



    //if (project_manage_company == '') {
    //    alert(gettext('Company field is empty.'));
    //    return;
    //}
    //if (project_manage_company_id == '') {
    //    alert(gettext('Please search and select Company.'));
    //    return;
    //}
    //if (project_manage_type == '') {
    //    alert(gettext('Type field is empty.'));
    //    return;
    //}
    //if (project_manage_project_name == '') {
    //    alert(gettext('Project Name field is empty.'));
    //    return;
    //}
    //if (project_manage_level == '') {
    //    alert(gettext('Level field is empty.'));
    //    return;
    //}
    //if (project_manage_progress == '') {
    //    alert(gettext('Progress field is empty.'));
    //    return;
    //}
    //if (project_manage_approval == '') {
    //    alert(gettext('Approval field is empty.'));
    //    return;
    //}

    $.ajax({
        type: 'POST',
        url: '/manage/code_save/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'id': id,

            'code_upper_commcode': code_upper_commcode,
            'code_upper_commcode_name': code_upper_commcode_name,
            'code_commcode_grp': code_commcode_grp,
            'code_commcode_grp_name': code_commcode_grp_name,
            'code_commcode': code_commcode,
            'code_commcode_name_ko': code_commcode_name_ko,
            'code_commcode_name_en': code_commcode_name_en,
            'code_commcode_name_vi': code_commcode_name_vi,
            'code_se1': code_se1,
            'code_se2': code_se2,
            'code_se3': code_se3,
            'code_se4': code_se4,
            'code_se5': code_se5,
            'code_se6': code_se6,
            'code_se7': code_se7,
            'code_se8': code_se8,
            'code_seq': code_seq,
            'code_use_yn': code_use_yn,

        },
        dataType: 'Json',
        success: function (response) {
            alert(gettext('Saved.'));
            $('#code_management_modal').modal('hide');
            search_code();

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}

function code_delete(id = null) {
    if (id == null) { return; }

    if (confirm(gettext('Do you want to delete?'))) {

        $.ajax({
            type: 'POST',
            url: '/manage/code_delete/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),

                'id': id,
            },
            dataType: 'Json',
            success: function (response) {
                alert(gettext('Deleted.'));
                search_code();

            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        });
    }




}