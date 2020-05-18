jQuery.browser = {};


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(function () {


    search_patient();

    //�˻�
    $('#patient_search').keydown(function (key) {
        if (key.keyCode == 13) {
            search_patient();
        }
    })

    $("#patient_search_btn").click(function () {
        search_patient();
    });


    //���� ���� ����
    $("#sms_modal_content").keydown(function () {
        if ($(this).val().length > 67) {
            $(this).val($(this).val().substring(0, 67));
        }
    })

});



function invoice_management_modal(id = null) {

    $('#invoice_management_modal').modal({ backdrop: 'static', keyboard: false });
    $('#invoice_management_modal').modal('show');

}

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
                        "<td>" + response.datas[i]['visits'] + "</td>" +
                        "<td>" + numberWithCommas(response.datas[i]['paid_total']) + "</td>" +
                        "<td><a class='btn btn-default' onclick=sms_modal('" + response.datas[i]['id'] + "')>&nbsp;<i class='fa fa-2x fa-mobile'></i>&nbsp;</a></td></tr>";
                    //"<td><a class='btn btn-default btn-xs' href='javascript: void (0);' onclick='delete_database_precedure(" + response.datas[i]['id'] + ")' ><i class='fa fa-lg fa-history'></i></a></td></tr>";


                } else {
                    var str = "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                }
                $('#patient_list_table').append(str);
            }


            //����¡
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
            $('#sms_modal_name').val(response.name_kor + ' / ' + response.name_eng);
            $('#sms_modal_phone').val(response.phone);


            $('#sms_modal').modal({ backdrop: 'static', keyboard: false });
            $('#sms_modal').modal('show');
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}



function send_sms() {

    var receiver = $("#sms_modal_name").val()
    var phone = $("#sms_modal_phone").val()
    var contents = $("#sms_modal_content").val();
    $("#overlay").fadeOut(300);

    if (receiver == '') {
        alert(gettext('Name is Empty.'));
        return;
    }
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
        url: '/manage/sms/send_sms/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'type': 'MANUAL',
            'receiver': receiver,

            'phone': phone,
            'contents': contents,
        },
        beforeSend: function () {
            $("#overlay").fadeIn(300);
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
                        //���� �Ϸ� �� â �ݱ�. ����� �̷¿��� Ȯ��
                        $('#sms_modal').modal('show');
                        json_response = JSON.parse(response);

                        console.log(json_response);

                        $.ajax({
                            type: 'POST',
                            url: '/manage/sms/recv_result/',
                            data: {
                                'csrfmiddlewaretoken': $('#csrf').val(),
                                'msg_id': json_response.msg_id,
                                'status': json_response.status,
                                'code': json_response.code,
                                'tranId': json_response.tranId,
                            },
                            dataType: 'Json',
                            success: function (response) {

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
        complete: function () {
            $("#overlay").fadeOut(300);
            $('#sms_modal').modal('hide');
        }
    })

}




function show_past_history(reception_id = null) {
    if (reception_id == null) {
        return;
    }

    $('#past_diagnosis_showlarge_table tbody').empty();
    $.ajax({
        type: 'POST',
        url: '/manage/customer_manage_get_patient_visit_history/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'reception_id': reception_id,
        },
        dataType: 'Json',
        success: function (response) {
            if (response.result) {
                var str = "<tr style='background:#94ee90'><td colspan='5'>" + response['date'] + "(" + response.data['day'] + ")[" + response.data['doctor'] + "]</td>" +
                    "</td></tr>" + /*"<tr><td colspan='5'>History: D-" + response.data['diagnosis']  + */

                    "<tr><td colspan='5'><font style='font-weight:700;'>History:</font><br/><font style='font-weight:700; color:#d2322d'>S - </font>" + response.data['subjective'] + "<br/><font style='font-weight:700; color:#d2322d'>O - </font>" +
                    response.data['objective'] + "<br/><font style='font-weight:700; color:#d2322d'>A - </font>" +
                    response.data['assessment'] + "<br/><font style='font-weight:700; color:#d2322d'>P - </font>" +
                    response.data['plan'] + "<br/><font style='font-weight:700; color:#d2322d'>D - </font>" +
                    response.data['diagnosis'] +
                    "</td></tr>";


                for (var j in response.data['exams']) {
                    str += "<tr><td>" + response.data['exams'][j]['name'] + "</td><td>" +
                        "</td><td>" +
                        "</td><td>" +
                        "</td><td>" +
                        "</td></tr>";
                }

                for (var j in response.data['tests']) {
                    str += "<tr><td>" + response.data['tests'][j]['name'] + "</td><td>" +
                        "</td><td>" +
                        "</td><td>" +
                        "</td><td>" +
                        "</td></tr>";
                }
                for (var j in response.data['precedures']) {
                    str += "<tr><td>" + response.data['precedures'][j]['name'] + "</td><td>" +
                        "</td><td>" +
                        "</td><td>" +
                        "</td><td>" +
                        "</td></tr >";
                }
                for (var j in response.data['medicines']) {
                    str += "<tr><td>" + response.data['medicines'][j]['name'] + "</td><td>" +
                        response.data['medicines'][j]['unit'] + "</td><td>" +
                        response.data['medicines'][j]['amount'] + "</td><td>" +
                        response.data['medicines'][j]['days'] + "</td><td>" +
                        response.data['medicines'][j]['memo'] + "</td></tr >";
                }
            } else {
                str = 'Noresult';
            }

            $('#past_diagnosis_showlarge_table tbody').append(str);

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        },
    })



    $('#past_diagnosis_showlarge_modal').modal({ backdrop: 'static', keyboard: false });
    $('#past_diagnosis_showlarge_modal').modal('show');

}


function download_excel() {

    var url = '/manage/cumstomer_management_excel'

    window.open(url);

}