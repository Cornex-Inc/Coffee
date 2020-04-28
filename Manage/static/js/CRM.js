jQuery.browser = {};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(function () {
    search_patient();
    
    //환자 검색
    $('#patient_search').keydown(function (key) {
        if (key.keyCode == 13) {
            search_patient();
        }
    })

    $("#patient_search_btn").click(function () {
        search_patient();
    });


    //문자 글자 고정
    $("#sms_modal_content").keydown(function () {
        if ($(this).val().length > 67) {
            $(this).val($(this).val().substring(0, 67));
        }
    })

});

function search_patient(page = null) {
    var context_in_page = 10;


    var category = $('#patient_type option:selected').val();
    var string = $('#patient_search').val();


    $.ajax({
        type: 'POST',
        url: '/manage/customer_manage_get_patient_list/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'category': category,
            'string': string,

            'page': page,
            'context_in_page': context_in_page,
        },
        dataType: 'Json',
        success: function (response) {
            $('#patient_list_table > tbody ').empty();
            for (var i = 0; i < context_in_page; i++) {
                if (response.datas[i]) {
                    var str = "<tr style='cursor:pointer;' onclick='set_patient_data(" +
                        parseInt(response.datas[i]['id']) +
                        ")'><td>" + response.datas[i]['id'] + "</td>";

                    if (response.datas[i]['has_unpaid']) {
                        str += "<td style=color:rgb(228,97,131);>";
                    } else {
                        str += "<td>";
                    }

                    str += response.datas[i]['chart'] + "</td>" +
                        "<td>" + response.datas[i]['name_kor'] + '<br />' + response.datas[i]['name_eng'] + "</td>" +
                        "<td>" + response.datas[i]['date_of_birth'] + ' (' + response.datas[i]['gender'] + '/' + response.datas[i]['age'] + ")</td>" +
                        "<td>" + response.datas[i]['phonenumber'] + "</td>" +
                        "<td>" + response.datas[i]['date_registered'] + "</td>" +
                        "<td>" + response.datas[i]['memo'] + "</td>" +
                        "<td><a class='btn btn-default' onclick=sms_modal('" + response.datas[i]['id'] +"')><i class='fa fa-commenting-o'></i></a></td></tr>";
                    //"<td><a class='btn btn-default btn-xs' href='javascript: void (0);' onclick='delete_database_precedure(" + response.datas[i]['id'] + ")' ><i class='fa fa-lg fa-history'></i></a></td></tr>";

                    
                } else {
                    var str = "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                }
                $('#patient_list_table').append(str);
            }


            //페이징
            $('#table_pagnation').html('');
            str = '';
            if (response.has_previous == true) {
                str += '<li> <a onclick="search_patient(' + (response.page_number - 1) + ')">&laquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&laquo;</span></li>';
            }

            for (var i = response.page_range_start; i < response.page_range_stop; i++) {
                if (response.page_number == i) {
                    str += '<li class="active"><span>' + i + ' <span class="sr-only">(current)</span></span></li>';
                }
                else if (response.page_number + 5 > i && response.page_number - 5 < i) {
                    str += '<li><a onclick="search_patient(' + i + ')">' + i + '</a></li>';
                }
                else {
                }

            }
            if (response.has_next == true) {
                str += '<li><a onclick="search_patient(' + (response.page_number + 1) + ')">&raquo;</a></li>';
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


function set_patient_data(patient_id) {

    //환자 기본 정보
    $.ajax({
        type: 'POST',
        url: '/manage/customer_manage_get_patient_info/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'patient_id': patient_id,
        },
        dataType: 'Json',
        success: function (response) {
            $('#patient_id').val(response.id);
            $('#patient_chart').val(response.chart);
            $('#basic_info_name_kor').val(response.name_kor);
            $('#basic_info_name_eng').val(response.name_eng);
            $('#basic_info_dob').val(response.date_of_birth);
            $('#basic_info_address').val(response.address);
            $('#basic_info_phone').val(response.phone);
            $("#basic_info_gender").val(response.gender);
            $('#patient_nationality').val(response.nationality);
            $('#basic_info_email').val(response.email);
            $('#basic_info_memo').val(response.memo);

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })


    //환자 방문 이력
    $.ajax({
        type: 'POST',
        url: '/manage/customer_manage_get_patient_visit/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'patient_id': patient_id,
        },
        dataType: 'Json',
        success: function (response) {
            $("#visit_history tbody").empty();
            for (var i = 0; i < response.datas.length ; i++) {
                if (response.datas[i]) {
                    var str = "<tr><td>" + parseInt(i + 1) + "</td>" + 

                        "<td>" + response.datas[i]['depart'] + "</td>" +
                        "<td>" + response.datas[i]['doctor'] + "</td>" +
                        "<td>" + response.datas[i]['date_visited'] + "</td>" +

                        "<td><a class='btn btn-default' onclick=('" + response.datas[i]['id'] + "') disabled><i class='fa fa-search'></i></a></td></tr>";
                    //"<td><a class='btn btn-default btn-xs' href='javascript: void (0);' onclick='delete_database_precedure(" + response.datas[i]['id'] + ")' ><i class='fa fa-lg fa-history'></i></a></td></tr>";

                    $('#visit_history tbody').append(str);
                } 
            }
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
} 



function sms_modal(patient_id) {
    $("#sms_modal_name").val('');
    $("#sms_modal_phone").val('');
    $("#sms_modal_content").val('');

    $.ajax({
        type: 'POST',
        url: '/manage/customer_manage_get_patient_sms_info/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'patient_id': patient_id,
        },
        dataType: 'Json',
        success: function (response) {
            $('#sms_modal_name').val(response.name_kor + ' / '+ response.name_eng);
            $('#sms_modal_phone').val(response.phone);


            $('#sms_modal').modal({ backdrop: 'static', keyboard: false });
            $('#sms_modal').modal('show');
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}



function send_sms(){

    var phone = $("#sms_modal_phone").val()
    var contents = $("#sms_modal_content").val()


    if (phone == '') {
        alert(gettext('Phone Number is Empty.'));
        return;
    }
    if (contents == '') {
        alert(gettext('Content is Empty.'));
        return;
    }

    $.ajax({
        type: 'POST',
        //url: '/manage/employee_check_id/',
        url: '/test/send/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'phone': phone,
            'contents': contents,
        },
        dataType: 'Json',
        success: function (response) {
            console.log(response);
            if (response.res == true) {
                var url = 'http://kbl.cornex.co.kr/sms/sms_send.php?msg_id=' + response.id + '&phone=' + phone + '&contents=' + contents;
                console.log('url : ' + url);

                $.ajax({
                    crossOrigin: true,
                    type: 'GET',
                    //url: '/manage/employee_check_id/',
                    url: url,
                    data: {
                        //'csrfmiddlewaretoken': $('#csrf').val(),
                        //'msg_id': response.id,
                        //'phone': $("#phone_number").val(),
                        //'contents': $("#contents").val(),
                    },
                    dataType: 'Json',
                    //jsonp: "callback", 
                    success: function (response) {
                        json_response = JSON.parse(response);

                        console.log(json_response);

                        $.ajax({
                            type: 'POST',
                            url: '/test/recv/',
                            data: {
                                'csrfmiddlewaretoken': $('#csrf').val(),
                                'msg_id': json_response.msg_id,
                                'status': json_response.status,
                                'code': json_response.code,
                                'tranId': json_response.tranId,
                            },
                            dataType: 'Json',
                            success: function (response) {
                                $('#sms_modal').modal('hide');
                            },
                            error: function (request, status, error) {
                                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
                            },
                        })

                    },
                    error: function (request, status, error) {
                        console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
                    },
                })

            }


        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        },
    })



}