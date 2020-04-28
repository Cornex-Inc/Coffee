

jQuery.browser = {};
$(function () {
    //ID 에 한글 입력 안되게 하기
    $("#add_edit_database_user_ID, #add_edit_database_password, #add_edit_database_password_confirm, #edit_database_password_password, #edit_database_password_confirm").keyup(function (event) {
        if (!(event.keyCode >= 37 && event.keyCode <= 40)) {
            var inputVal = $(this).val();
            $(this).val(inputVal.replace(/[^a-z0-9]/gi, ''));
        }
    });


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


    database_search();
    $('.database_control input[type=text],input[type=number]').each(function () {
        //this.className += 'form-control';

    })

    $("#search_depart, #search_division_type").change(function () {
        database_search();
    });

    $('#search_input').keypress(function (key) {
        if (key.keyCode == 13) {
            database_search();
        }
    });

    //inventory history
    $("#inventory_history_date").prop("disabled", true);
    $('#inventory_history_date').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        locale: {
            format: 'YYYY-MM-DD'
        }
    });



    $('#add_medicine_reg').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        locale: {
            format: 'YYYY-MM-DD'
        }
    });


    //ADD , Edit 


    ////Level 자동 계산
    function set_level_price_multi() {
        var price_input = $("#add_edit_database_price_input").val();
        var level = $('#add_edit_database_multiple_level option:selected').val();

        $("#add_edit_database_price_output").val(Math.ceil(price_input * level));
    }
    $("#add_edit_database_price_input, #add_edit_database_multiple_level").change(function () {
        set_level_price_multi();
    });

    $("#add_edit_database_price_input, #add_edit_database_multiple_level").keyup(function () {
        set_level_price_multi();
    });

    $("#add_edit_database_price_output").keyup(function () {
        $('#add_edit_database_multiple_level').val("0");
    });


});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function save_data_control() {
    if ($('#selected_option').val() == '') {
        alert(gettext("Select medicine first."));
        return;
    }
    if (isNaN($('#medicine_search_changes').val()) == true) {
        alert(gettext('Amount should be number'));
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/pharmacy/save_data_control/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'selected_option': $('#selected_option').val(),
            'name': $('#medicine_control_name').val(),
            'company': $('#medicine_search_company').val(),
            'country': $('#medicine_search_country').val(),
            'ingredient': $('#medicine_search_ingredient').val(),
            'unit': $('#medicine_search_unit').val(),
            'price': $('#medicine_control_price').val(),
            'changes': $('#medicine_search_changes').val(),
        },
        dataType: 'Json',
        success: function (response) {
            alert(gettext('Saved.'));
            $('.database_control input').each(function () {
                if ($(this).attr('type') == 'button')
                    return;
                $(this).val('');
            })
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}

function set_data_control(medicine_id) {
    $('#selected_option').val(medicine_id);

    $.ajax({
        type: 'POST',
        url: '/pharmacy/set_data_control/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'medicine_id': medicine_id,
        },
        dataType: 'Json',
        success: function (response) {
            $('#medicine_control_name').val(response.name);
            $('#medicine_search_company').val(response.company);
            $('#medicine_search_country ').val(response.country);
            $('#medicine_search_ingredient').val(response.ingredient);
            $('#medicine_search_unit').val(response.unit);
            $('#medicine_control_price').val(response.price);
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}



function pharmacy_control_save(Done = false) {
    var diagnosis_id = $('#selected_diagnosis').val();
    if (diagnosis_id.trim() == '') {
        alert(gettext('Select patient first.'));
        return;
    }
    if ($('#selected_diagnosis_status').val() == 'done') {
        alert(gettext('Already done.'));
        return;
    }

    if (Done)
        status = 'done';
    else
        status = 'hold';

    $.ajax({
        type: 'POST',
        url: '/pharmacy/save/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'status': status,
            'diagnosis_id': diagnosis_id,
        },
        dataType: 'Json',
        success: function (response) {
            alert(gettext("Saved."));
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}


function database_search(page = null) {
    var context_in_page = 20;

    var string = $('#search_input').val();
    var division_type = $('#search_division_type').val();
    var depart_filter = $("#search_depart").val();

    $('#database_table > tbody ').empty();
    $.ajax({
        type: 'POST',
        url: '/manage/employee_search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'string': string,
            'division_type': division_type,
            'depart_filter': depart_filter,
            'page': page,
            'context_in_page': context_in_page,
        },
        dataType: 'Json',
        success: function (response) {
            if (response.result = true) {
                for (var i = 0; i < context_in_page; i++) {
                    var str = '';
                    if (response.datas[i]) {
                        str = "<tr><td>" + response.datas[i].id + "</td>" +
                            "<td>" + response.datas[i]['division_type'] + "</td>" +
                            "<td>" + response.datas[i]['depart'] + "</td>" +
                            "<td>" + response.datas[i]['rank'] + "</td>" +
                            "<td>" + response.datas[i]['user_id'] + "</td>" +
                            "<td>" + response.datas[i]['name_ko'] + "<br/>" + response.datas[i]['name_en'] + "<br/>" + response.datas[i]['name_vi'] + "</td>" +
                            "<td>" + response.datas[i]['gender'] + "</td>" +
                            "<td>" + response.datas[i]['date_of_birth'] + "</td>" + 
                            "<td>" + response.datas[i]['email'] + "</td>" +
                            "<td>" + response.datas[i]['phone_number1'] + "</td>" +
                            "<td>" + response.datas[i]['phone_number2'] + "</td>" +
                            "<td>" + response.datas[i]['date_of_employment'] + "</td>" +
                            "<td>" + response.datas[i]['status'] + "</td>" +
                            "<td>" +
                            "<a class='btn btn-default btn-xs' style='margin-right:10px;' href='javascript: void (0);' onclick='edit_database(" + response.datas[i]['id'] + ")' ><i class='fa fa-lg fa-pencil'></i></a>" +
                            "<a class='btn btn-danger btn-xs' style='margin-right:10px;' href='javascript: void (0);' onclick='delete_database(" + response.datas[i]['id'] + ",&quot;" + response.datas[i]['user_id'] + "&quot;)' ><i class='fa fa-lg fa-trash'></i></a>" +
                            "<a class='btn btn-primary btn-xs' href='javascript: void (0);' onclick='edit_database_password(" + response.datas[i]['id'] + ",&quot;" + response.datas[i]['user_id'] + "&quot;)' ><i class='fa fa-lg fa-key'></i></a></tr> ";

                    } else {
                        str = "<tr><td></td>" +
                            "<td></td>" +
                            "<td></td>" +
                            "<td></td>" +
                            "<td></td>" +
                            "<td></td>" +
                            "<td></td>" +
                            "<td></td>" +
                            "<td></td>" +
                            "<td></td>" +
                            "<td></td>" +
                            "<td></td>" +
                            "<td></td>" +
                            "<td></td>" +
                            "</tr >"
                    }
                    $('#database_table > tbody ').append(str);

                }
            }
            


            //페이징
            $('#table_pagnation').html('');
            str = '';
            if (response.has_previous == true) {
                str += '<li> <a onclick="database_search(' + (response.page_number - 1) + ')">&laquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&laquo;</span></li>';
            }

            for (var i = response.page_range_start; i < response.page_range_stop; i++) {
                if (response.page_number == i) {
                    str += '<li class="active"><span>' + i + ' <span class="sr-only">(current)</span></span></li>';
                }
                else if (response.page_number + 5 > i && response.page_number - 5 < i) {
                    str += '<li> <a onclick="database_search(' + i + ')">' + i + '</a></li>';
                }
                else {
                }

            }
            if (response.has_next == true) {
                str += '<li><a onclick="database_search(' + (response.page_number + 1) + ')">&raquo;</a></li>';
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



//정보 추가 수정
function edit_database(id = null) {


    $("#add_edit_database_user_ID").val('');
    $("#add_edit_database_id_check_string").html('');
    $("#add_edit_database_id_check_status").val('');
    $("#add_edit_database_password").val('');
    $("#add_edit_database_password_confirm").val('');
    $("#add_edit_database_name_ko").val('');
    $("#add_edit_database_name_en").val('');
    $("#add_edit_database_name_vi").val('');
    $("#add_edit_database_gender option:first").prop("selected", true);
    $("#add_edit_database_phone1").val('');
    $("#add_edit_database_phone2").val('');
    $("#add_edit_database_dob").val('');
    $("#add_edit_database_email").val('');
    $("#add_edit_database_addr").val('');

    $("#add_edit_database_rank option:first").prop("selected", true);
    $("#add_edit_database_depart option:first").prop("selected", true);
    $("#add_edit_database_division option:first").prop("selected", true);

    $("#add_edit_database_status option:first").prop("selected", true);
    $("#add_edit_database_date_of_employment").val('');
    $("#add_edit_database_remark").val('');


    $("#add_edit_database_ID").prop("disabled", false);
    $("#add_edit_database_password").prop("disabled", false);
    $("#add_edit_database_password_confirm").prop("disabled", false);
  

    if (id != null) {
        $("#add_edit_database_header").html(gettext('Edit Employee'));
        $.ajax({
            type: 'POST',
            url: '/manage/employee_add_edit_get/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),
                'id': id,
            },
            dataType: 'Json',
            success: function (response) {
                if (response.result == true) {
                    $("#add_edit_database_id").val(id);

                    $("#add_edit_database_user_ID").prop("disabled", true);
                    $("#add_edit_database_password").prop("disabled", true);
                    $("#add_edit_database_password_confirm").prop("disabled", true);


                    $("#add_edit_database_user_ID").val(response.user_id);
                    $("#add_edit_database_id_check_string").html('');
                    $("#add_edit_database_id_check_status").val('true');
                    $("#add_edit_database_password").val(' - ');
                    $("#add_edit_database_password_confirm").val(' - ');
                    $("#add_edit_database_name_ko").val(response.name_ko);
                    $("#add_edit_database_name_en").val(response.name_en);
                    $("#add_edit_database_name_vi").val(response.name_vi);
                    $("#add_edit_database_gender").val(response.gender);
                    $("#add_edit_database_phone1").val(response.phone1);
                    $("#add_edit_database_phone2").val(response.phone2);
                    $("#add_edit_database_dob").val(response.date_of_birth);
                    $("#add_edit_database_email").val(response.email);
                    $("#add_edit_database_addr").val(response.address);

                    $("#add_edit_database_rank").val(response.rank);
                    $("#add_edit_database_depart").val(response.depart)
                    $("#add_edit_database_division").val(response.division)

                    $("#add_edit_database_status").val(response.status);
                    $("#add_edit_database_date_of_employment").val(response.date_of_employment);
                    $("#add_edit_database_remark").val(response.remark);

                } else {
                    alert(gettext('Please Refresh this page.'));
                }
            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
               
            },
        })
    }
    else {
        $("#add_edit_database_header").html(gettext('New Employee'));
        $("#add_edit_database_id").val('');
        $("#add_edit_database_user_ID").prop("disabled", false);
        $("#add_edit_database_password").prop("disabled", false);
        $("#add_edit_database_password_confirm").prop("disabled", false);
    }
    $('#add_edit_database').modal({ backdrop: 'static', keyboard: false });
    $('#add_edit_database').modal('show');


}


function save_database(id = null) {
    var id = $("#add_edit_database_id").val();
    if (id == null || id == '') {
        id = 0;
    }

    //check_validation
    if (!is_valid('save')) {
        return;
    }


    $.ajax({
        type: 'POST',
        url: '/manage/employee_add_edit/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'id': id,

            'user_id': $("#add_edit_database_user_ID").val(),
            'password': $("#add_edit_database_password").val(),
            'name_ko': $("#add_edit_database_name_ko").val(),
            'name_en': $("#add_edit_database_name_en").val(),
            'name_vi': $("#add_edit_database_name_vi").val(),
            'gender': $("#add_edit_database_gender option:selected").val(),
            'phone1': $("#add_edit_database_phone1").val(),
            'phone2': $("#add_edit_database_phone2").val(),
            'date_of_birth': $("#add_edit_database_dob").val(),
            'email': $("#add_edit_database_email").val(),
            'address': $("#add_edit_database_addr").val(),

            'rank': $("#add_edit_database_rank option:selected").val(),
            'depart': $("#add_edit_database_depart option:selected").val(),
            'division': $("#add_edit_database_division option:selected").val(),

            'status': $("#add_edit_database_status option:selected").val(),
            'date_of_employment': $("#add_edit_database_date_of_employment").val(),
            'remark': $("#add_edit_database_remark").val(),
        },
        dataType: 'Json',
        success: function (response) {
            if (response.result == true) {
                database_search();

                $("#add_edit_database").modal('hide');
            } else {
                alert(gettext('Please Refresh this page.'));
            }
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}



//퇴직처리
function delete_database(id = null, user_id = '') {

    $("#selected_user_resignation").html('');
    $("#delete_database_id").val('');

    $("#delete_database_date_of_resignation").val('');
    $("#delete_database_resignation_reason").val('');

    if (id == null) {
        alert(gettext('Select Item.'));
        return;
    }
    else {
        $("#selected_user_resignation").html(user_id);
        $("#delete_database_id").val(id);


        $('#edit_database_resignation').modal({ backdrop: 'static', keyboard: false });
        $('#edit_database_resignation').modal('show');

        $("#delete_database_ok").click(function () {

            $.ajax({
                type: 'POST',
                url: '/manage/employee_delete/',
                data: {
                    'csrfmiddlewaretoken': $('#csrf').val(),
                    'id': id,
                    'date_of_resignation': $("#delete_database_date_of_resignation").val(),
                    'resignation_reason': $("#delete_database_resignation_reason").val(),
                },
                dataType: 'Json',
                success: function (response) {
                    if (response.result == true) {
                        database_search();

                        $("#edit_database_resignation").modal('hide');
                    } else {
                        alert(gettext('Please Refresh this page.'));
                    }
                },
                error: function (request, status, error) {
                    console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

                },
            })
        })        
    }
}


//비밀번호 변경
function edit_database_password(id = null, user_id = '') {
    $("#password_database_id").val('');
    $("#selected_user_change_password").html('');

    
    $("#edit_database_password_password").val('');
    $("#edit_database_password_confirm").val('');


    if (id == null) {
        alert(gettext('Select Item.'));
        return;
    }
    else {
        $("#password_database_id").val(id);
        $("#selected_user_change_password").html(user_id);

        $('#edit_database_password').modal({ backdrop: 'static', keyboard: false });
        $('#edit_database_password').modal('show');

        $("#password_database_ok").click(function () {

            var test = $("#edit_database_password_password").val();
            console.log(test)

            $.ajax({
                type: 'POST',
                url: '/manage/employee_change_password/',
                data: {
                    'csrfmiddlewaretoken': $('#csrf').val(),
                    'id': id,
                    'password': test,
                },
                dataType: 'Json',
                success: function (response) {
                    if (response.result == true) {
                        database_search();
                    
                        $("#edit_database_password").modal('hide');
                    } else {
                        alert(gettext('Please Refresh this page.'));
                    }
                },
                error: function (request, status, error) {
                    console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

                },
            })

        })

    }


}


function check_id() {
    var user_id = $("#add_edit_database_user_ID").val()
    if (user_id == '' || user_id == null) {
        alert(gettext('ID field is empty.'));
        return false;
    }

    $.ajax({
        type: 'POST',
        url: '/manage/employee_check_id/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'user_id': $("#add_edit_database_user_ID").val(),
        },
        dataType: 'Json',
        success: function (response) {
            if (response.result == true) {
                $("#add_edit_database_id_check_status").val('true');
                $("#add_edit_database_id_check_string").html(gettext('Can be used.'))
                $("#add_edit_database_id_check_string").css('color', 'green');
            }
            else {
                $("#add_edit_database_id_check_status").val('false');
                $("#add_edit_database_id_check_string").html(gettext('Cannot be used. Type other ID.'))
                $("#add_edit_database_id_check_string").css('color', 'red');
            }
               
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })


}

function is_valid(type = null) {
    if (type == null) {
        return false;
    }
    else if (type == 'save') {
        //아이디
        var user_id = $("#add_edit_database_user_ID").val()
        if (user_id == '' || user_id == null) {
            alert(gettext('ID field is empty.'));
            return false;
        }

        //아이디 체크
        var check_id = $("#add_edit_database_id_check_status").val()
        if (check_id != 'true') {
            alert(gettext('Check ID.'));
            return false;
        }

        //비밀번호
        var password = $("#add_edit_database_password").val()
        if (password == '' || password == null) {
            alert(gettext('Password field is empty'));
            return false;
        }

        //비밀번호 확인
        var password_confirm = $("#add_edit_database_password_confirm").val()
        if (password_confirm == '' || password_confirm == null) {
            alert(gettext('Password Confirm field is empty'));
            return false;
        }

        //비밀번호 매칭 확인
        if (password != password_confirm) {
            alert(gettext('Check Password.'));
            return false;
        }

        //한글 이름
        var name_ko = $("#add_edit_database_name_ko").val()
        if (name_ko == '' || name_ko == null) {
            alert(gettext('Korean Name field is empty'));
            return false;
        }

        //영문 이름
        var name_en = $("#add_edit_database_name_en").val()
        if (name_en == '' || name_en == null) {
            alert(gettext('English Name field is empty'));
            return false;
        }

        //베트남 이름
        var name_vi = $("#add_edit_database_name_vi").val()
        if (name_vi == '' || name_vi == null) {
            alert(gettext('Vietnamese Name field is empty'));
            return false;
        }

        //Phone Number1
        var phone1 = $("#add_edit_database_phone1").val()
        if (phone1 == '' || phone1 == null) {
            alert(gettext('Phone Number1 field is empty'));
            return false;
        }

        //Date of Birth
        var dob = $("#add_edit_database_dob").val()
        if (dob == '' || dob == null) {
            alert(gettext('Date of Birth field is empty'));
            return false;
        }

        //Email
        var email = $("#add_edit_database_email").val()
        if (email == '' || email == null) {
            alert(gettext('Email field is empty'));
            return false;
        }

        //Division
        var division = $("#add_edit_database_division").val()
        if (division == '' || division == null) {
            alert(gettext('Division field is empty'));
            return false;
        }


        //Status
        var status = $("#add_edit_database_status").val()
        if (status == '' || status == null) {
            alert(gettext('Status field is empty'));
            return false;
        }

        //Date of Employee
        var date_of_emplyment = $("#add_edit_database_date_of_employment").val()
        if (date_of_emplyment == '' || date_of_emplyment == null) {
            alert(gettext('Date of Employment field is empty'));
            return false;
        }


        return true;
    }
    else if (type == 'save_edit') {
        return true;
    }
    else if (type == 'delete') {
        return true;
    }
    else if (type == 'change_password') {
        return true;
    }
    else {
        return false;
    }
    


}










function worker_on(path) {
    if ($("input:checkbox[id='pharmacy_list_auto']").is(":checked") == true) {
        if (window.Worker) {
            w = new Worker(path);
            w.onmessage = function (event) {
                waiting_list(true);
            };


        } else {
        }
    } else {
        w.terminate();
        w = undefined;
        $('#pharmacy_list_search').prop('disabled', false);

    }
}