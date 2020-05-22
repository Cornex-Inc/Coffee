jQuery.browser = {};


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(function () {


    $('.date_input').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        drops: "down",
        locale: {
            format: 'YYYY-MM-DD',
        },
    });
    $('.date_input').val('');
    $('#date_start').val(moment().subtract(14, 'd').format('YYYY-MM-DD'));
    $('#date_end').val(moment().format("YYYY-MM-DD"));

    //환자 검색
    $('#search_string').keydown(function (key) {
        if (key.keyCode == 13) {
            search_company();
        }
    })

    $("#search_btn").click(function () {
        search_company();
    });


    //문자 글자 고정
    $("#sms_modal_content").keydown(function () {
        if ($(this).val().length > 67) {
            $(this).val($(this).val().substring(0, 67));
        }
    })


    //직원 체크박스
    $("#check_all").change(function () {
       
        $(".employee_checkbox").prop("checked", $(this).prop("checked"));

    })

    search_company();

});



function customer_modal(id = null) {


   $("#register_name_kor").val('');
   $("#register_name_eng").val('');
   $("#register_ceo_name").val('');
   $("#register_business_type").val('');
   $("#register_corperation_number").val('');
   $("#register_number_employees").val('');
   $("#register_phone1").val('');
   $("#register_phone2").val('');
   $("#register_fax").val('');
   $("#register_addr1").val('');
   $("#register_addr2").val('');
   $("#register_date_establishment").val('');
   $("#register_condition").val('');
   $("#register_remark").val('');




    $('#customer_modal').modal({ backdrop: 'static', keyboard: false });
    $('#customer_modal').modal('show');

}


function employee_modal(id = '') {



    var company_id = $("#selected_id").val();
    if (company_id == '') {
        alert(gettext('Select Company first.'));
        return;
    }


    $("#selected_employee").val('');

    $("#employee_type").val('');
    $("#employee_position").val('');
    $("#employee_name_kor").val('');
    $("#employee_name_eng").val('');
    $("#employee_dob").val('');
    $("#employee_passport").val('');
    $("#employee_phone").val('');
    $("#employee_address").val('');
    $("#employee_email").val('');
    $("#employee_condition").val('');
    $("#employee_remark").val('');

    if (id != '') {

        $("#selected_employee").val(id);

        $.ajax({
            type: 'POST',
            url: '/KBL/customer_management_set_employee_info/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),

                'id': id,
            },
            dataType: 'Json',
            success: function (response) {

                $("#employee_type").val(response.employee_type);
                $("#employee_position").val(response.employee_position);
                $("#employee_name_kor").val(response.employee_name_kor);
                $("#employee_name_eng").val(response.employee_name_eng);
                $("#employee_dob").val(response.employee_dob);
                $("#employee_passport").val(response.employee_passport);
                $("#employee_phone").val(response.employee_phone);
                $("#employee_address").val(response.employee_address);
                $("#employee_email").val(response.employee_email);
                $("#employee_condition").val(response.employee_condition);
                $("#employee_remark").val(response.employee_remark);




            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        })


    }


    $('#employee_modal').modal({ backdrop: 'static', keyboard: false });
    $('#employee_modal').modal('show');
}

function project_modal(id = null) {
    $('#project_modal').modal({ backdrop: 'static', keyboard: false });
    $('#project_modal').modal('show');
}


function search_company(page = null) {
    var context_in_page = 10;

    var start = $('#date_start').val();
    var end = $('#date_end').val();

    var type = $('#patient_type option:selected').val();
    var string = $('#search_string').val();


    $.ajax({
        type: 'POST',
        url: '/KBL/customer_management_search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'start': start,
            'end': end,

            'type': type,
            'string': string,

            'page': page,
            'context_in_page': context_in_page,
        },
        dataType: 'Json',
        success: function (response) {
            $('#list_table > tbody ').empty();
            for (var i = 0; i < context_in_page; i++) {
                if (response.datas[i]) {
                    var str = "<tr style='cursor:pointer' onclick='select_customer(this," + response.datas[i]['id'] +")'>";
                    str += "<td>" + response.datas[i]['id'] + "</td>" +
                        "<td>" + response.datas[i]['type'] + "</td>" +
                        "<td>" + response.datas[i]['customer_no'] + "</td>" +
                        "<td>" + response.datas[i]['name_eng'] + "</td>" +
                        "<td>" + response.datas[i]['corporation_no'] + "</td>" +
                        "<td>" + response.datas[i]['name_phone1'] + "</td>" +
                        "<td>" + response.datas[i]['date_registered'] + "</td>" +
                        "<td>" + response.datas[i]['remark'] + "</td>" +
                        "<td><a class='btn btn-danger btn-xs' href='javascript: void (0);' onclick='delete_customer(" + response.datas[i]['id'] + ")' ><i class='fa fa-lg fa-trash'></i></a></td></tr>";


                } else {
                    var str = "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                }
                $('#list_table > tbody').append(str);
            }


            //페이징
            $('#table_pagnation').html('');
            str = '';
            if (response.has_previous == true) {
                str += '<li> <a onclick="search_company(' + (response.page_number - 1) + ')">&laquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&laquo;</span></li>';
            }

            for (var i = response.page_range_start; i < response.page_range_stop; i++) {
                if (response.page_number == i) {
                    str += '<li class="active"><span>' + i + ' <span class="sr-only">(current)</span></span></li>';
                }
                else if (response.page_number + 5 > i && response.page_number - 5 < i) {
                    str += '<li><a onclick="search_company(' + i + ')">' + i + '</a></li>';
                }
                else {
                }

            }
            if (response.has_next == true) {
                str += '<li><a onclick="search_company(' + (response.page_number + 1) + ')">&raquo;</a></li>';
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

function select_customer(obj,id = null) {
    if (id == null) {return;}

    $("#list_table tr").removeClass('danger')
    $(obj).addClass('danger')
    $("#selected_id").val(id);

    set_basic_info(id);
    set_employee_list(id);
    set_project_table(id);

}

function delete_customer(id = null) {
    if (id == null) { return; }

    if (confirm(gettext('Do you want to delete ?'))) {

        $.ajax({
            type: 'POST',
            url: '/KBL/customer_management_delete/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),

                'id': id,

            },
            dataType: 'Json',
            success: function (response) {
                if (response.result) {


                    alert(gettext('Deleted.'));

                    $("#basic_info_serial").val('');
                    $("#basic_info_name_kor").val('');
                    $("#basic_info_name_eng").val('');
                    $("#basic_info_ceo_name").val('');
                    $("#basic_info_business_type").val('');
                    $("#basic_info_corperation_number").val('');
                    $("#basic_info_number_employees").val('');
                    $("#basic_info_phone1").val('');
                    $("#basic_info_phone2").val('');
                    $("#basic_info_fax").val('');
                    $("#basic_info_addr1").val('');
                    $("#basic_info_addr2").val('');
                    $("#basic_info_date_establishment").val('');
                    $("#basic_info_condition").val('');
                    $("#basic_info_remark").val('');

                    search_company();
                }
            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        })

    }

}

function set_basic_info(id = null) {
    if (id == null) { return; }

    $.ajax({
        type: 'POST',
        url: '/KBL/customer_management_set_basic_info/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'id': id,

        },
        dataType: 'Json',
        success: function (response) {
            if (response.result) {

                $("#basic_info_serial").val(response.basic_info_serial);
                $("#basic_info_name_kor").val(response.basic_info_name_kor);
                $("#basic_info_name_eng").val(response.basic_info_name_eng);
                $("#basic_info_ceo_name").val(response.basic_info_ceo_name);
                $("#basic_info_business_type").val(response.basic_info_business_type);
                $("#basic_info_corperation_number").val(response.basic_info_corperation_number);
                $("#basic_info_number_employees").val(response.basic_info_number_employees);
                $("#basic_info_phone1").val(response.basic_info_phone1);
                $("#basic_info_phone2").val(response.basic_info_phone2);
                $("#basic_info_fax").val(response.basic_info_fax);
                $("#basic_info_addr1").val(response.basic_info_addr1);
                $("#basic_info_addr2").val(response.basic_info_addr2);
                $("#basic_info_date_establishment").val(response.basic_info_date_establishment);
                $("#basic_info_condition").val(response.basic_info_condition);
                $("#basic_info_remark").val(response.basic_info_remark);



            }
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })




}

function set_employee_list(company_id = null) {
    if (company_id == null) { return; }

    
    $.ajax({
        type: 'POST',
        url: '/KBL/customer_management_set_employee_list/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'company_id': company_id,

        },
        dataType: 'Json',
        success: function (response) {
            if (response.result) {
                $('#emplyoee_table > tbody ').empty();
                for (var i = 0; i < response.datas.length; i++) {

                    var str = "<tr>";
                    str += "<td>" + (i + 1) + "</td>" +
                        "<td><input type='checkbox' class='employee_checkbox' id='" + response.datas[i]['id'] + "' /></td>" +
                        "<td>" + response.datas[i]['position'] + "</td>" +
                        "<td id='namekor_" + response.datas[i]['id'] + "'>" + response.datas[i]['name_kor'] + "</td>" +
                        "<td id='nameeng_" + response.datas[i]['id'] + "'>" + response.datas[i]['name_eng'] + "</td>" +
                        "<td>" + response.datas[i]['date_of_birth'] + "</td>" +
                        "<td id='phonenumber_" + response.datas[i]['id'] + "'>" + response.datas[i]['phone'] + "</td>" +
                        "<td>" + response.datas[i]['status'] + "</td>" +
                        "<td>" + response.datas[i]['remark'] + "</td>" +
                        "<td>" +
                        "<a class='btn btn-default btn-xs btn_default_tmp' href='javascript: void (0);' onclick='employee_modal(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-pencil'></i></a >" +
                        "<a class='btn btn-danger btn-xs btn_dnager_tmp' href='javascript: void (0);' onclick='delete_employee(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-trash'></i></a >" +
                        "</td ></tr > ";

                    $('#emplyoee_table > tbody').append(str);
                }
            }
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })




}

function set_project_table(id = null) {
    if (id == null) { return; }


    $.ajax({
        type: 'POST',
        url: '/KBL/customer_management_set_project_list/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'id': id,

        },
        dataType: 'Json',
        success: function (response) {
            console.log(response)
            if (response) {
                $('#project_table > tbody ').empty();
                for (var i = 0; i < response.datas.length; i++) {

                    var str = "<tr>";
                    str += "<td>" + (i + 1) + "</td>" +
                        "<td><input type='checkbox' class='employee_checkbox' id='" + response.datas[i]['id'] + "' /></td>" +
                        "<td>" + response.project_type_dict[response.datas[i]['type']]['name'] + "</span></td>" +
                        "<td>" + response.datas[i]['name'] + "</td>" +
                        "<td>" + response.datas[i]['level'] + "</td>" +
                        "<td>" + response.datas[i]['date_start'] + "</td>" +
                        "<td>" + response.datas[i]['date_end'] + "</td>" +
                        "<td><span class='" + response.project_status_dict[response.datas[i]['status']]['class'] + "'>" + response.project_status_dict[response.datas[i]['status']]['name'] + "</span></td>" +
                        "<td>" + response.datas[i]['in_charge'] + "</td>" +
                        "<td>" + response.datas[i]['note'] + "</td>" +
                        "</tr>";

                    $('#project_table > tbody').append(str);
                }
            }
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })




}

function customer_modal_save(type = '') {


    if (type == '') {
        var id = '';

        var register_name_kor = $("#register_name_kor").val();
        var register_name_eng = $("#register_name_eng").val();
        var register_ceo_name = $("#register_ceo_name").val();
        var register_business_type = $("#register_business_type").val();
        var register_corperation_number = $("#register_corperation_number").val();
        var register_number_employees = $("#register_number_employees").val();
        var register_phone1 = $("#register_phone1").val();
        var register_phone2 = $("#register_phone2").val();
        var register_fax = $("#register_fax").val();
        var register_addr1 = $("#register_addr1").val();
        var register_addr2 = $("#register_addr2").val();
        var register_date_establishment = $("#register_date_establishment").val();
        var register_condition = $("#register_condition").val();
        var register_remark = $("#register_remark").val();

    }
    else if (type == 'basic_info') {
        var id = $("#selected_id").val();

        var register_name_kor = $("#basic_info_name_kor").val();
        var register_name_eng = $("#basic_info_name_eng").val();
        var register_ceo_name = $("#basic_info_ceo_name").val();
        var register_business_type = $("#basic_info_business_type").val();
        var register_corperation_number = $("#basic_info_corperation_number").val();
        var register_number_employees = $("#basic_info_number_employees").val();
        var register_phone1 = $("#basic_info_phone1").val();
        var register_phone2 = $("#basic_info_phone2").val();
        var register_fax = $("#basic_info_fax").val();
        var register_addr1 = $("#basic_info_addr1").val();
        var register_addr2 = $("#basic_info_addr2").val();
        var register_date_establishment = $("#basic_info_date_establishment").val();
        var register_condition = $("#basic_info_condition").val();
        var register_remark = $("#basic_info_remark").val();
    }

    if (register_name_kor == '') {
        alert(gettext('Name (KOR) field is empty.'));
        return;
    }
    if (register_name_eng == '') {
        alert(gettext('Name (ENG) field is empty.'));
        return;
    }
    if (register_ceo_name == '') {
        alert(gettext('CEO Name field is empty.'));
        return;
    }
    if (register_phone1 == '') {
        alert(gettext('Phone Number 1 field is empty.'));
        return;
    }
    if (register_condition == '') {
        alert(gettext('Condition field is empty.'));
        return;
    }
  

    $.ajax({
        type: 'POST',
        url: '/KBL/customer_management_add_save/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'id':id,

            'register_name_kor': register_name_kor,
            'register_name_eng': register_name_eng,
            'register_ceo_name': register_ceo_name,
            'register_business_type': register_business_type,
            'register_corperation_number': register_corperation_number,
            'register_number_employees': register_number_employees,
            'register_phone1': register_phone1,
            'register_phone2': register_phone2,
            'register_fax': register_fax,
            'register_addr1': register_addr1,
            'register_addr2': register_addr2,
            'register_date_establishment': register_date_establishment,
            'register_condition': register_condition,
            'register_remark': register_remark,

        },
        dataType: 'Json',
        success: function (response) {
            if (response.result) {
                if (type == '') {
                    $('#customer_modal').modal('hide');
                } else if (type == 'basic_info') {
                    alert(gettext('Saved.'));
                }
                search_company();
            }
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}

function employee_modal_save(id = '') {

    var company_id = $("#selected_id").val();
    if (company_id == '') { return; }

    var id = $("#selected_employee").val();

    var employee_type = $("#employee_type").val();
    var employee_position = $("#employee_position").val();
    var employee_name_kor = $("#employee_name_kor").val();
    var employee_name_eng = $("#employee_name_eng").val();
    var employee_dob = $("#employee_dob").val();
    var employee_passport = $("#employee_passport").val();
    var employee_phone = $("#employee_phone").val();
    var employee_address = $("#employee_address").val();
    var employee_email = $("#employee_email").val();
    var employee_condition = $("#employee_condition").val();
    var employee_remark = $("#employee_remark").val();


    if (employee_type == '') {
        alert(gettext('Type field is empty.'));
        return;
    }

    if (employee_name_kor == '') {
        alert(gettext('Name (KOR) field is empty.'));
        return;
    }
    if (employee_name_eng == '') {
        alert(gettext('Name (ENG) field is empty.'));
        return;
    }
    if (employee_dob == '') {
        alert(gettext('Date of Birth field is empty.'));
        return;
    }
    if (employee_phone == '') {
        alert(gettext('Phone Number field is empty.'));
        return;
    }
    if (employee_condition == '') {
        alert(gettext('Condition field is empty.'));
        return;
    }


    $.ajax({
        type: 'POST',
        url: '/KBL/customer_management_employee_add_save/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'id':id,
            'company_id': company_id,

            'employee_type': employee_type,
            'employee_position': employee_position,
            'employee_name_kor': employee_name_kor,
            'employee_name_eng': employee_name_eng,
            'employee_dob': employee_dob,
            'employee_passport': employee_passport,
            'employee_phone': employee_phone,
            'employee_address': employee_address,
            'employee_email': employee_email,
            'employee_condition': employee_condition,
            'employee_remark': employee_remark,


        },
        dataType: 'Json',
        success: function (response) {
            if (response.result) {
                    
                alert(gettext('Saved.'));
                $('#employee_modal').modal('hide');


                set_employee_list(company_id);
            }
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}

function delete_employee(id = null) {
    if (id == null) { return; }

    var company_id = $("#selected_id").val();
    if (company_id == '') { return; }

    if (confirm(gettext('Do you want to delete ?'))) {

        $.ajax({
            type: 'POST',
            url: '/KBL/customer_management_delete_employee/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),

                'id': id,

            },
            dataType: 'Json',
            success: function (response) {
                if (response.result) {


                    alert(gettext('Deleted.'));

                    set_employee_list(company_id);

                }
            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        })

    }

}

var number_list = [];
function sms_modal(patient_id) {
    $("#sms_modal_name").val('');
    $("#sms_modal_phone").val('');
    $("#sms_modal_content").val('');

    number_list = [];
    var phone = '';
    var checked = $(".employee_checkbox:checked");
    if (checked.length == 0) {
        alert(gettext('Select customer(s) to be sent'))
        return;
    } else if (checked.length == 1) {

        var name = $("#namekor_" + $(checked[0]).attr('id')).html() + ' / ' + $("#nameeng_" + $(checked[0]).attr('id')).html()  ;
        var phone = $("#phonenumber_" + $(checked[0]).attr('id')).html();
        number_list.push($("#phonenumber_" + $(checked[0]).attr('id')).html());
    } else {
        var name = $("#namekor_" + $(checked[0]).attr('id')).html() + gettext(' 님 외 ') + (checked.length - 1) + '명';
        for (var i = 0; i < checked.length; i ++) {


            phone += $("#phonenumber_" + $(checked).eq(i).attr('id')).html() + ','
            number_list.push($("#phonenumber_" + $(checked).eq(i).attr('id')).html());
        }
    }


    $('#sms_modal_name').val(name);
    $('#sms_modal_phone').val(phone);

    $('#sms_modal').modal({ backdrop: 'static', keyboard: false });
    $('#sms_modal').modal('show');

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

    //문자 전송 번호 
    list_number = phone.split(',');
    list_number = list_number.filter(function (item) {
        return item !== null && item !== undefined && item !== '';
    });
    str_list_number = list_number.join(',')

    $.ajax({
        type: 'POST',
        //url: '/manage/employee_check_id/',
        url: '/manage/sms/send_sms/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'type': 'MANUAL',
            'receiver': receiver,

            'phone': list_number.toString(),
            'contents': contents,

            'is_KBL': true,
        },
        beforeSend: function () {
            $("#overlay").fadeIn(300);
        },
        dataType: 'Json',
        success: function (response) {
            if (response.res == true) {

                context = {
                    //'csrfmiddlewaretoken': $('#csrf').val(),
                    'msg_id': response.id,
                    'phone': str_list_number,
                    'contents': $("#contents").val(),
                }


                //var url = 'http://kbl.cornex.co.kr/sms/sms_send.php?data=' + JSON.stringify(context)
                var url = 'http://kbl.cornex.co.kr/sms/sms_send.php?msg_id=' + response.id + '&phone=' + str_list_number + '&contents=' + contents;

                $.ajax({
                    crossOrigin: true,
                    type: 'POST',
                    //url: '/manage/employee_check_id/',
                    url: url,
                    //data: {
                    //    'csrfmiddlewaretoken': $('#csrf').val(),
                    //    'msg_id': response.id,
                    //    'phone': str_list_number,
                    //    'contents': $("#contents").val(),
                    //},
                    dataType: 'Json',
                    //jsonp: "callback", 
                    success: function (response) {
                        //전송 완료 시 창 닫기. 결과는 이력에서 확인
                        $('#sms_modal').modal('hide');
                        json_response = JSON.parse(response);

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