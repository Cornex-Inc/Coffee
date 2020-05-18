jQuery.browser = {};


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(function () {


   

    //검색
    $('#patient_search').keydown(function (key) {
        if (key.keyCode == 13) {
            invoice_search();
        }
    })

    $("#patient_search_btn").click(function () {
        invoice_search();
    });


    //문자 글자 고정
    $("#sms_modal_content").keydown(function () {
        if ($(this).val().length > 67) {
            $(this).val($(this).val().substring(0, 67));
        }
    })

    invoice_search();

});



function invoice_management_modal(id = null) {

    $('#invoice_management_modal').modal({ backdrop: 'static', keyboard: false });
    $('#invoice_management_modal').modal('show');

}

function invoice_search(page = null) {
    var context_in_page = 10;


    var category = $('#patient_type option:selected').val();
    var string = $('#patient_search').val();


    $.ajax({
        type: 'POST',
        url: '/KBL/invoice_search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'category': category,
            'string': string,

            'page': page,
            'context_in_page': context_in_page,
        },
        dataType: 'Json',
        success: function (response) {
            $('#invoice_list_tale > tbody ').empty();
            for (var i = 0; i < context_in_page; i++) {
                if (response.datas[i]) {
                    var str = "<tr>" +
                        "<td>" + response.datas[i]['serial'] + "</td>" +
                        "<td>" + response.datas[i]['company_name'] + "</td>" +
                        "<td>" + response.datas[i]['type'] + "</td>" +
                        "<td>" + response.datas[i]['title'] + "</td>" +
                        "<td>" + response.datas[i]['in_charge'] + "</td>" +
                        "<td>" + response.datas[i]['date_register'] + "</td>" +
                        "<td>" + response.datas[i]['date_sent'] + "</td>" +
                        "<td><span class='" + response.invoice_status_dict[response.datas[i]['status']]['class'] + "'>" + response.invoice_status_dict[response.datas[i]['status']]['name'] + "</span></td>" +
                        "<td>";
                        if (response.datas[i]['status'] == "CANCEL") {
                            str += "</td><td></td></tr>";
                        
                        } else {
                            str += "<a class='btn btn-success btn-xs' href='javascript: void (0);' onclick='print_invoice(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-print'></i></a >" +
                                "<a class='btn btn-danger btn-xs btn-purple' href='javascript: void (0);' onclick='audit_delete(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-envelope-o'></i></a >" +
                                "</td >" +
                                "<td>" +
                                "<a class='btn btn-default btn-xs' href='javascript: void (0);' onclick='invoice_get(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-pencil'></i></a >" +
                                "<a class='btn btn-danger btn-xs' href='javascript: void (0);' onclick='invoice_delete(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-trash'></i></a >" +
                                "</td></tr>";
                        }
                    //"<td><a class='btn btn-default btn-xs' href='javascript: void (0);' onclick='delete_database_precedure(" + response.datas[i]['id'] + ")' ><i class='fa fa-lg fa-history'></i></a></td></tr>";


                } else {
                    var str = "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                }
                $('#invoice_list_tale').append(str);
            }


            //페이징
            $('#table_pagnation').html('');
            str = '';
            if (response.has_previous == true) {
                str += '<li> <a onclick="invoice_search(' + (response.page_number - 1) + ')">&laquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&laquo;</span></li>';
            }

            for (var i = response.page_range_start; i < response.page_range_stop; i++) {
                if (response.page_number == i) {
                    str += '<li class="active"><span>' + i + ' <span class="sr-only">(current)</span></span></li>';
                }
                else if (response.page_number + 5 > i && response.page_number - 5 < i) {
                    str += '<li><a onclick="invoice_search(' + i + ')">' + i + '</a></li>';
                }
                else {
                }

            }
            if (response.has_next == true) {
                str += '<li><a onclick="invoice_search(' + (response.page_number + 1) + ')">&raquo;</a></li>';
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


function invoice_get(id = null) {
    if (id == null) { return; }



    $.ajax({
        type: 'POST',
        url: '/KBL/invoice_get/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'id': id,
        },
        dataType: 'Json',
        success: function (response) {


            $("#invoice_serial").val(response.invoice_serial);
            $("#invoice_recipient").val(response.invoice_recipient);
            $("#invoice_title").val(response.invoice_title);

            $("#selected_invoice").val(id);

            $('#invoice_management_modal').modal({ backdrop: 'static', keyboard: false });
            $('#invoice_management_modal').modal('show');


        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    });
    
}


function invoice_edit() {

    var id = $("#selected_invoice").val();

    var invoice_serial = $("#invoice_serial").val();
    var invoice_recipient = $("#invoice_recipient").val();
    var invoice_title = $("#invoice_title").val();


    if (invoice_title == '') {
        alert(gettext('Title is empty.'));
        return;
    }
    if (invoice_recipient == '') {
        alert(gettext('Recipient is empty.'));
        return;
    }


    $.ajax({
        type: 'POST',
        url: '/KBL/invoice_edit/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'id': id,

            'invoice_serial': invoice_serial,
            'invoice_recipient': invoice_recipient,
            'invoice_title': invoice_title,

        },
        dataType: 'Json',
        success: function (response) {
            alert(gettext('Saved.'));
            $('#invoice_management_modal').modal('hide');
            invoice_search();

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    });


}



function invoice_delete(id = null) {
    if (id == null) { return; }


    if (confirm(gettext('Do you want to delete?'))) {

        $.ajax({
            type: 'POST',
            url: '/KBL/invoice_delete/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),

                'id': id,
            },
            dataType: 'Json',
            success: function (response) {
                alert(gettext('Deleted.'));
                invoice_search();

            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        });
    }

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
                        //전송 완료 시 창 닫기. 결과는 이력에서 확인
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


function print_invoice(id) {

    $("#dynamic_div").html('');
    $('#dynamic_div').load('/KBL/print_invoice/' + id);

    $('#dynamic_div').printThis({
    });
}