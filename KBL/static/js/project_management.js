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
    $('#project_date_start').val(moment().subtract(7, 'd').format('YYYY-MM-DD'));
    $('#project_date_end').val(moment().format("YYYY-MM-DD"));

        
    //검색
    $('#project_search').keydown(function (key) {
        if (key.keyCode == 13) {
            search_project();
        }
    })

    $("#project_search_btn").click(function () {
        search_project();
    });

    $(".depart_select").change(function () {
        search_project();
    });



    // 오토컴플릿
    function split(val) {
        return val.split(/,\s*/);
    }
    function extractLast(term) {
        return split(term).pop();
    }
    // 회사 검색 
    $("#project_manage_company")
        .on("keydown", function (event) {
            if (event.keyCode === $.ui.keyCode.TAB && $(this).autocomplete("instance").menu.active) {
                event.preventDefault();
            }
        })
        .autocomplete({
            source: function (request, response) {
                //$.getJSON("search.php", { term: extractLast(request.term) }, response);
                $.ajax({
                    type: 'POST',
                    url: '/KBL/selectbox_search_company/',
                    data: {
                        'csrfmiddlewaretoken': $('#csrf').val(),
                        'string': request.term
                    },
                    dataType: 'Json',
                    success: function (response1) {
                        response(response1.datas);
                    },
                    error: function (request, status, error) {
                        console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
                    },
                })
            },
            search: function () {
                // 최소 입력 길이를 마지막 항목으로 처리합니다.
                var term = extractLast(this.value);
                if (term.length < 2) {
                    return false;
                }
            },

            focus: function () {
                return false;
            },

            select: function (event, ui) {
                var terms = split(this.value);
                // 현재 입력값 제거합니다.
                terms.pop();
                // 선택된 아이템을 추가합니다.
                //terms.push(ui.item.value);
                // 끝에 콤마와 공백을 추가합니다.
                terms.push("");
                this.value = terms.join("");

                $("#project_manage_company").val(ui.item.value);

                $("#project_manage_company_id").val(ui.item.id);

                return false;
            }

        });


    // 비자 - 직원 검색 
    $("#visa_employee")
        .on("keydown", function (event) {
            if (event.keyCode === $.ui.keyCode.TAB && $(this).autocomplete("instance").menu.active) {
                event.preventDefault();
            }
        })
        .autocomplete({
            source: function (request, response) {
                //$.getJSON("search.php", { term: extractLast(request.term) }, response);
                $.ajax({
                    type: 'POST',
                    url: '/KBL/selectbox_search_employee/',
                    data: {
                        'csrfmiddlewaretoken': $('#csrf').val(),
                        'string': request.term,
                        'company_id': $("#visa_company_id").val(),
                    },
                    dataType: 'Json',
                    success: function (response1) {
                        response(response1.datas);
                    },
                    error: function (request, status, error) {
                        console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
                    },
                })
            },
            search: function () {
                // 최소 입력 길이를 마지막 항목으로 처리합니다.
                var term = extractLast(this.value);
                if (term.length < 2) {
                    return false;
                }
            },

            focus: function () {
                return false;
            },

            select: function (event, ui) {
                var terms = split(this.value);
                // 현재 입력값 제거합니다.
                terms.pop();
                // 선택된 아이템을 추가합니다.
                //terms.push(ui.item.value);
                // 끝에 콤마와 공백을 추가합니다.
                terms.push("");
                this.value = terms.join("");

                $("#visa_employee").val(ui.item.value);

                $("#visa_employee_id").val(ui.item.id);

                return false;
            }

        });

    // 노동허가서 - 직원 검색 
    $("#wp_employee_name")
        .on("keydown", function (event) {
            if (event.keyCode === $.ui.keyCode.TAB && $(this).autocomplete("instance").menu.active) {
                event.preventDefault();
            }
        })
        .autocomplete({
            source: function (request, response) {
                //$.getJSON("search.php", { term: extractLast(request.term) }, response);
                $.ajax({
                    type: 'POST',
                    url: '/KBL/selectbox_search_employee/',
                    data: {
                        'csrfmiddlewaretoken': $('#csrf').val(),
                        'string': request.term,
                        'company_id': $("#wp_company_id").val(),
                    },
                    dataType: 'Json',
                    success: function (response1) {
                        response(response1.datas);
                    },
                    error: function (request, status, error) {
                        console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
                    },
                })
            },
            search: function () {
                // 최소 입력 길이를 마지막 항목으로 처리합니다.
                var term = extractLast(this.value);
                if (term.length < 2) {
                    return false;
                }
            },

            focus: function () {
                return false;
            },

            select: function (event, ui) {
                var terms = split(this.value);
                // 현재 입력값 제거합니다.
                terms.pop();
                // 선택된 아이템을 추가합니다.
                //terms.push(ui.item.value);
                // 끝에 콤마와 공백을 추가합니다.
                terms.push("");
                this.value = terms.join("");

                $("#wp_employee_name").val(ui.item.value);

                $("#wp_employee_id").val(ui.item.id);

                return false;
            }

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
                    list_file($("#selected_file_list").val(), $("#board_type").val());


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




    search_project();
    project_select();
});



function project_manage_modal(id = null) {

    $("#selected_project_id").val('');

    $("#project_manage_company").val('');
    $("#project_manage_company_id").val('');
    $("#project_manage_type").val('');
    $("#project_manage_project_name").val('');
    $("#project_manage_level").val('');
    $("#project_manage_priority").val('');
    $("#project_manage_date_start").val('');
    $("#project_manage_date_end").val('');
    $("#project_manage_date_expected").val('');
    $("#project_manage_progress").val('');
    $("#project_manage_in_charge").val('');
    $("#project_manage_approval").val('');
    $("#project_manage_note").val('');

    $("#project_manage_type").prop("disabled", false);


    if (id != null) {

        $("#selected_project_id").val(id);
        $("#project_manage_type").prop("disabled", true);
        $.ajax({
            type: 'POST',
            url: '/KBL/project_get/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),

                'id': id,

            },
            dataType: 'Json',
            success: function (response) {

                $("#project_manage_company").val(response.project_manage_company);
                $("#project_manage_company_id").val(response.project_manage_company_id);
                $("#project_manage_type").val(response.project_manage_type);
                $("#project_manage_project_name").val(response.project_manage_project_name);
                $("#project_manage_level").val(response.project_manage_level);
                $("#project_manage_priority").val(response.project_manage_priority);
                $("#project_manage_date_start").val(response.project_manage_date_start);
                $("#project_manage_date_end").val(response.project_manage_date_end);
                $("#project_manage_date_expected").val(response.project_manage_date_expected);
                $("#project_manage_progress").val(response.project_manage_progress);
                $("#project_manage_in_charge").val(response.project_manage_in_charge);
                $("#project_manage_approval").val(response.project_manage_approval);
                $("#project_manage_note").val(response.project_manage_note);


            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        })


    }



    $('#project_manage_modal').modal({ backdrop: 'static', keyboard: false });
    $('#project_manage_modal').modal('show');

}

function detailed_info_modal(id = '') {
    var project_id = $("#selected_project_id").val();
    if (project_id == '') {
        alert(gettext('Select a project.'));
        return;
    }


    $("#selected_detail").val('');

    $("#detail_type").val('');
    $("#detail_project_details").val('');
    $("#detail_date").val('');
    $("#detail_note").val('');

    if (id != '') {

        $("#selected_visa").val(id)
        $.ajax({
            type: 'POST',
            url: '/KBL/detail_get/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),

                'id': id,

            },
            dataType: 'Json',
            success: function (response) {

                console.log(response)
                $("#selected_detail").val(response.selected_detail);
                $("#detail_type").val(response.detail_type);
                $("#detail_project_details").val(response.detail_project_details);
                $("#detail_date").val(response.detail_date);
                $("#detail_note").val(response.detail_note);


            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        })


    }


    $('#detailed_info_modal').modal({ backdrop: 'static', keyboard: false });
    $('#detailed_info_modal').modal('show');
}

function visa_modal(id = '') {


    $("#selected_visa").val('');
    $("#visa_employee_id").val('');
    $("#visa_employee").val('');
    $("#visa_granted_company").val('');
    $("#visa_type").val('');
    $("#visa_date_entry").val('');
    $("#visa_date_receipt_application").val('');
    $("#visa_date_receipt_doc").val('');
    $("#visa_date_subbmit_doc").val('');
    $("#visa_date_expected").val('');
    $("#visa_date_ordered").val('');
    $("#visa_application_status").val('');
    $("#visa_emergency").val('');
    $("#visa_status").val('');

    

    if (id != '') {

        $("#selected_visa").val(id)
        $.ajax({
            type: 'POST',
            url: '/KBL/visa_get/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),

                'id': id,

            },
            dataType: 'Json',
            success: function (response) {

                $("#visa_company_id").val(response.visa_company_id);
                $("#visa_company").val(response.visa_company);
                $("#visa_employee_id").val(response.visa_employee_id);
                $("#visa_employee").val(response.visa_employee);
                $("#visa_granted_company").val(response.visa_granted_company);
                $("#visa_type").val(response.visa_type);
                $("#visa_date_entry").val(response.visa_date_entry);
                $("#visa_date_receipt_application").val(response.visa_date_receipt_application);
                $("#visa_date_receipt_doc").val(response.visa_date_receipt_doc);
                $("#visa_date_subbmit_doc").val(response.visa_date_subbmit_doc);
                $("#visa_date_expected").val(response.visa_date_expected);
                $("#visa_date_ordered").val(response.visa_date_ordered);
                $("#visa_application_status").val(response.visa_application_status);
                $("#visa_emergency").val(response.visa_emergency);
                $("#visa_status").val(response.visa_status);



            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        })


    }




    $('#visa_modal').modal({ backdrop: 'static', keyboard: false });
    $('#visa_modal').modal('show');
}



function work_permit_modal(id = null) {

    $("#selected_wp").val('');


    $("#wp_employee_name").val('');
    $("#wp_employee_id").val('');
    $("#wp_EA_application_date").val('');
    $("#wp_EA_exp_date").val('');
    $("#wp_application_date").val('');
    $("#wp_WP_exp_date").val('');
    $("#wp_exp_date").val('');
    $("#wp_requirement").val('');
    $("#wp_note").val('');
    $("#wp_status").val('');



    if (id != '') {

        $("#selected_wp").val(id)
        $.ajax({
            type: 'POST',
            url: '/KBL/work_permit_get/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),

                'id': id,

            },
            dataType: 'Json',
            success: function (response) {

                console.log(response)


                $("#wp_employee_name").val(response.wp_employee);
                $("#wp_employee_id").val(response.wp_employee_id);

                $("#wp_EA_application_date").val(response.wp_EA_application_date);
                $("#wp_EA_exp_date").val(response.wp_EA_exp_date);
                $("#wp_application_date").val(response.wp_WP_application_date);
                $("#wp_WP_exp_date").val(response.wp_WP_exp_date);
                $("#wp_exp_date").val(response.wp_expected_date);

                $("#wp_requirement").val(response.wp_requiredment);
                $("#wp_note").val(response.wp_note);
                $("#wp_status").val(response.wp_status);




            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        })
    }

    $('#work_permit_modal').modal({ backdrop: 'static', keyboard: false });
    $('#work_permit_modal').modal('show');
}



function search_project(page = null) {
    var context_in_page = 8;

    var project_type = $('#project_type option:selected').val();
    var project_status = $('#project_status option:selected').val();
    var project_in_charge = $('#project_in_charge option:selected').val();

    var start = $('#project_date_start').val();
    var end = $('#project_date_end').val();

    var string = $('#project_search').val();


    $.ajax({
        type: 'POST',
        url: '/KBL/project_search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'project_type': project_type,
            'project_status': project_status,
            'project_in_charge': project_in_charge,

            'start': start,
            'end': end,

            'string': string,

            'page': page,
            'context_in_page': context_in_page,
        },
        dataType: 'Json',
        success: function (response) {
            $('#project_list_table > tbody ').empty();
            for (var i = 0; i < context_in_page; i++) {
                if (response.datas[i]) {
                    var str = "<tr style='cursor:pointer;' onclick='project_select(this)'>";
                    str += "<td>" + response.datas[i]['id'] + "</td>" +
                        "<td>" + response.datas[i]['customer_name'] + "</td>" +
                        "<td>" + response.project_type_dict[ response.datas[i]['type'] ]['name'] + "</td>" +
                        "<td>" + response.datas[i]['project_name'] + "</td>" +
                        "<td>" + response.datas[i]['level'] + "</td>" +
                        "<td>" + response.datas[i]['priority'] + "</td>" +
                        "<td>" + response.datas[i]['start_date'] + "</td>" +
                        "<td>" + response.datas[i]['end_date'] + "</td>" +
                        "<td>" + response.datas[i]['expected_date'] + "</td>" +
                        "<td><span class='" + response.project_status_dict[response.datas[i]['progress']]['class'] + "'>" + response.project_status_dict[response.datas[i]['progress']]['name'] + "</span></td>" +
                        "<td>" + response.datas[i]['in_charge'] + "</td>" +
                        "<td><span class='" + response.project_approval_dict[response.datas[i]['approval']]['class'] + "'>" + response.project_approval_dict[response.datas[i]['approval']]['name'] + "</span></td>" +
                        "<td>" + response.datas[i]['note'] + "</td>" +
                        "<td>" +
                        "<a class='btn btn-default btn-xs' href='javascript: void (0);' onclick='project_manage_modal(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-pencil'></i></a >" +
                        "<a class='btn btn-danger btn-xs' href='javascript: void (0);' onclick='project_delete(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-trash'></i></a >" +
                        "</td >" +
                        "<td style='width:0px;'>" + response.datas[i]['type'] + "</td>" + 
                        "<td style='width:0px;'>" + response.datas[i]['customer_id'] + "</td></tr>";


                } else {
                    var str = "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                }
                $('#project_list_table').append(str);
            }


            //페이징
            $('#table_pagnation').html('');
            str = '';
            if (response.has_previous == true) {
                str += '<li> <a onclick="search_project(' + (response.page_number - 1) + ')">&laquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&laquo;</span></li>';
            }

            for (var i = response.page_range_start; i < response.page_range_stop; i++) {
                if (response.page_number == i) {
                    str += '<li class="active"><span>' + i + ' <span class="sr-only">(current)</span></span></li>';
                }
                else if (response.page_number + 5 > i && response.page_number - 5 < i) {
                    str += '<li><a onclick="search_project(' + i + ')">' + i + '</a></li>';
                }
                else {
                }

            }
            if (response.has_next == true) {
                str += '<li><a onclick="search_project(' + (response.page_number + 1) + ')">&raquo;</a></li>';
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


function project_select(obj) {

    $('li[role="presentation"]').hide();
    $('li[role="presentation"]').attr('class','');
    $('div[role="tabpanel"]').hide();

    var project_id = $(obj).find('td:nth-child(1)').html();
    var company = $(obj).find('td:nth-child(2)').html();
    var company_id = $(obj).find('td:nth-child(16)').html();
    var type = $(obj).find('td:nth-child(15)').html();


    $("#detail_list > body, #visa_list_table > body, #work_permit_list_table > body").empty();
    $("#selected_project_id").val(project_id);


    if (type == 'VISA') {
        $("#tab_visa_list").show();
        $("#tab_visa_list").attr('class', 'active');
        $("#visa_list").show();


        //회사 이름 고정
        $("#visa_company").val(company);
        $("#visa_company_id").val(company_id);



        get_visa_list(project_id);


    } else if (type == 'WORKPERMIT') {
        $("#tab_work_permit_list").show();
        $("#tab_work_permit_list").attr('class', 'active');
        $("#work_permit_list").show();

        

        //회사 이름 고정
        $("#wp_company_name").val(company)
        $("#wp_company_id").val(company_id)


        get_work_permit_list(project_id);

    } else {
        $("#tab_detailed_info").show();
        $("#tab_detailed_info").attr('class', 'active');
        $("#detailed_info").show();

        get_detail_list(project_id);

    }
}

function project_save() {

    var id = $("#selected_project_id").val();


    var project_manage_company = $("#project_manage_company").val();
    var project_manage_company_id = $("#project_manage_company_id").val();
    var project_manage_type = $("#project_manage_type").val();
    var project_manage_project_name = $("#project_manage_project_name").val();
    var project_manage_level = $("#project_manage_level").val();
    var project_manage_priority = $("#project_manage_priority").val();
    var project_manage_date_start = $("#project_manage_date_start").val();
    var project_manage_date_end = $("#project_manage_date_end").val();
    var project_manage_date_expected = $("#project_manage_date_expected").val();
    var project_manage_progress = $("#project_manage_progress").val();
    var project_manage_in_charge = $("#project_manage_in_charge").val();
    var project_manage_approval = $("#project_manage_approval").val();
    var project_manage_note = $("#project_manage_note").val();


    if (project_manage_company == '') {
        alert(gettext('Company field is empty.'));
        return;
    }
    if (project_manage_company_id == '') {
        alert(gettext('Please search and select Company.'));
        return;
    }
    if (project_manage_type == '') {
        alert(gettext('Type field is empty.'));
        return;
    }
    if (project_manage_project_name == '') {
        alert(gettext('Project Name field is empty.'));
        return;
    }
    if (project_manage_level == '') {
        alert(gettext('Level field is empty.'));
        return;
    }
    if (project_manage_progress == '') {
        alert(gettext('Progress field is empty.'));
        return;
    }
    if (project_manage_approval == '') {
        alert(gettext('Approval field is empty.'));
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/KBL/project_save/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'id': id,

            'project_manage_company': project_manage_company,
            'project_manage_company_id': project_manage_company_id,
            'project_manage_type': project_manage_type,
            'project_manage_project_name': project_manage_project_name,
            'project_manage_level': project_manage_level,
            'project_manage_priority': project_manage_priority,
            'project_manage_date_start': project_manage_date_start,
            'project_manage_date_end': project_manage_date_end,
            'project_manage_date_expected': project_manage_date_expected,
            'project_manage_progress': project_manage_progress,
            'project_manage_in_charge': project_manage_in_charge,
            'project_manage_approval': project_manage_approval,
            'project_manage_note': project_manage_note,

        },
        dataType: 'Json',
        success: function (response) {
            alert(gettext('Saved.'));
            $('#project_manage_modal').modal('hide');
            search_project();

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}

function project_delete(id = null) {
    if (id == null) { return;}

    if (confirm(gettext('Do you want to delete?'))) {

        $.ajax({
            type: 'POST',
            url: '/KBL/project_delete/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),

                'id': id,
            },
            dataType: 'Json',
            success: function (response) {
                alert(gettext('Deleted.'));
                search_project();

            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        });
    }

}

function get_detail_list(selected_project_id = '') {
    if (selected_project_id == '') { return; }


    $.ajax({
        type: 'POST',
        url: '/KBL/detail_search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'selected_project_id': selected_project_id,
        },
        dataType: 'Json',
        success: function (response) {
            $('#detail_list > tbody ').empty();
            console.log(response)
            for (var i = 0; i < response.datas.length; i++) {


                var str = "<tr><td>" + (i + 1) + "</td>" +
                    "<td>" +
                    "<label class='container'>" +
                    "<input type='checkbox' class='check_detail' detail-check='" + response.datas[i]['id'] + "' ";
                    if (response.datas[i]['check'] == true) { str += " checked " }
                str += "/>" +
                    "<span class='checkmark'></span></label>" +
                    "</td >" +
                    "<td>" + response.datas[i]['type'] + "</td>" +
                    "<td>" + response.datas[i]['project_details'] + "</td>" +
                    "<td>" + response.datas[i]['date'] + "</td>" +
                    "<td>" + response.datas[i]['note'] + "</td>" +
                    "<td>" +
                    '<a class="btn btn-default btn-xs btn_default_tmp" href="javascript: void (0);" onclick="list_file(' + response.datas[i]["id"] + ',&#39;PROJECT_D&#39;)" > <i class="fa fa-lg fa-file-o"></i></a >' +
                    "</td>" +
                    "<td>" +
                    "<a class='btn btn-default btn-xs btn_default_tmp' href='javascript: void (0);' onclick='detailed_info_modal(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-pencil'></i></a >" +
                    "<a class='btn btn-danger btn-xs btn_danger_tmp' href='javascript: void (0);' onclick='detail_delete(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-trash'></i></a >" +
                    "</td ></tr>";


                $('#detail_list > tbody').append(str);
            }


            //체크박스 이벤트
            $(".check_detail").unbind();
            $(".check_detail").bind('change',function(event){
                event.preventDefault();
                var id = $(this).attr('detail-check');
                var checked = $(this).is(':checked');

                var question = '';
                var checked_str = '0';
                if (!checked) {
                    question = gettext('Do you want to uncheck?');
                } else {
                    question = gettext('Do you want to check?');
                }

                if (confirm(question)) {
                    $.ajax({
                        type: 'POST',
                        url: '/KBL/detail_check/',
                        data: {
                            'csrfmiddlewaretoken': $('#csrf').val(),

                            'id': id,
                            'checked': checked,

                        },
                        dataType: 'Json',
                        success: function (response) {

                            get_detail_list(project_id);
                        },
                        error: function (request, status, error) {
                            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

                        },
                    });




                }

            });

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })


}


function detailed_info_save() {

    var id = $("#selected_detail").val()
    var project_id = $("#selected_project_id").val();


    var detail_type = $("#detail_type").val();
    var detail_project_details = $("#detail_project_details").val();
    var detail_date = $("#detail_date").val();
    var detail_note = $("#detail_note").val();



    if (project_id == '') {
        alert(gettext('Error occured. Please press F5 then retry.'));
        return;
    }
    if (detail_type == '') {
        alert(gettext('Type is empty.'));
        return;
    }
    if (detail_project_details == '') {
        alert(gettext('Project Progress Detail is empty.'));
        return;
    }

    
    $.ajax({
        type: 'POST',
        url: '/KBL/detail_save/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'id': id,

            "project_id": project_id,

            'detail_type': detail_type,
            'detail_project_details': detail_project_details,
            'detail_date': detail_date,
            'detail_note': detail_note,

        },
        dataType: 'Json',
        success: function (response) {
            get_detail_list(project_id);
            alert(gettext('Saved.'));
            $('#detailed_info_modal').modal('hide');
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    });
}


function detail_delete(id = null) {
    if (id == null) { return; }

    var project_id = $("#selected_project_id").val();

    if (confirm(gettext('Do you want to delete?'))) {
        $.ajax({
            type: 'POST',
            url: '/KBL/detail_delete/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),

                'id': id,

            },
            dataType: 'Json',
            success: function (response) {

                get_detail_list(project_id);
                alert(gettext('Deleted.'));

            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        });
    }
}

function get_visa_list(selected_project_id = '') {
    if (selected_project_id == '') { return; }


    $.ajax({
        type: 'POST',
        url: '/KBL/visa_search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'selected_project_id': selected_project_id,
        },
        dataType: 'Json',
        success: function (response) {
            $('#visa_list_table > tbody ').empty();
            console.log(response)
            for (var i = 0; i < response.datas.length ; i++) {
                var str = "<tr>";
                if (response.datas[i]['emergency'] == '1') {
                    str += "<td><span class='label label-danger emc'>" + gettext('EMC') + "</span></td>";
                }
                else {
                    str += "<td>" + (i + 1) + "</td>";
                }
                str += "<td><span class='" + response.project_status_dict[response.datas[i]['status']]['class'] + "'>" + response.project_status_dict[response.datas[i]['status']]['name'] + "</span></td>" +
                    "<td>" + response.datas[i]['company'] + "</td>" +
                    "<td>" + response.datas[i]['employee'] + "</td>" +
                    "<td>" + response.datas[i]['granted_company'] + "</td>" +
                    "<td>" + response.datas[i]['date_receipt_application'] + "</td>" +
                    "<td>" + response.datas[i]['type'] + "</td>" +
                    "<td>" + response.datas[i]['date_entry'] + "</td>" +
                    "<td>" + response.datas[i]['date_receipt_doc'] + "</td>" +
                    "<td>" + response.datas[i]['date_subbmit_doc'] + "</td>" +
                    "<td>" + response.datas[i]['date_expected'] + "</td>" +
                    "<td>" +
                    '<a class="btn btn-default btn-xs" href="javascript: void (0);" onclick="list_file(' + response.datas[i]["id"] + ',&#39;VISA&#39;)" > <i class="fa fa-lg fa-file-o"></i></a >' +
                    "</td>" +
                    "<td>" +
                    "<a class='btn btn-default btn-xs' href='javascript: void (0);' onclick='visa_modal(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-pencil'></i></a >" +
                    "<a class='btn btn-danger btn-xs' href='javascript: void (0);' onclick='visa_delete(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-trash'></i></a >" +
                    "</td ></tr>";
                

                $('#visa_list_table > tbody').append(str);
            }


        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })


}

function visa_save() {

    var id = $("#selected_visa").val()
    var project_id = $("#selected_project_id").val();

    var visa_company_id = $("#visa_company_id").val();
    var visa_company = $("#visa_company").val();

    var visa_employee_id = $("#visa_employee_id").val();
    var visa_employee = $("#visa_employee").val();
    var visa_granted_company = $("#visa_granted_company").val();
    var visa_type = $("#visa_type").val();
    var visa_date_entry = $("#visa_date_entry").val();
    var visa_date_receipt_application = $("#visa_date_receipt_application").val();
    var visa_date_receipt_doc = $("#visa_date_receipt_doc").val();
    var visa_date_subbmit_doc = $("#visa_date_subbmit_doc").val();
    var visa_date_expected = $("#visa_date_expected").val();
    var visa_date_ordered = $("#visa_date_ordered").val();
    var visa_application_status = $("#visa_application_status").val();
    var visa_emergency = $("#visa_emergency").val();
    var visa_status = $("#visa_status").val();

    if (project_id == '') {
        alert(gettext('Error occured. Please press F5 then retry.'));
        return;
    }
    if (visa_employee_id == '') {
        alert(gettext('Please search and select Customer.'));
        return;
    }
    if (visa_employee == '') {
        alert(gettext('Customer Name is empty.'));
        return;
    }
    if (visa_type == '') {
        alert(gettext('Select Visa Type.'));
        return;
    }
    if (visa_emergency == '') {
        alert(gettext('Select is Emergency.'));
        return;
    }
    if (visa_status == '') {
        alert(gettext('Select Status.'));
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/KBL/visa_save/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'id': id,

            "project_id": project_id,

            "visa_company_id": visa_company_id,
            "visa_company": visa_company,
            "visa_employee_id": visa_employee_id,

            "visa_employee": visa_employee,
            "visa_granted_company": visa_granted_company,
            "visa_type": visa_type,
            "visa_date_entry": visa_date_entry,
            "visa_date_receipt_application": visa_date_receipt_application,

            "visa_date_receipt_doc": visa_date_receipt_doc,
            "visa_date_subbmit_doc": visa_date_subbmit_doc,
            "visa_date_expected": visa_date_expected,
            "visa_date_ordered": visa_date_ordered,
            "visa_application_status": visa_application_status,
            "visa_emergency": visa_emergency,
            "visa_status": visa_status,


        },
        dataType: 'Json',
        success: function (response) {
            get_visa_list(project_id);
            alert(gettext('Saved.'));
            
            $('#visa_modal').modal('hide');
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    });







}


function visa_delete(id = null) {
    if (id == null) { return;}

    var project_id = $("#selected_project_id").val();

    if (confirm(gettext('Do you want to delete?'))) {
        $.ajax({
            type: 'POST',
            url: '/KBL/visa_delete/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),

                'id': id,

            },
            dataType: 'Json',
            success: function (response) {

                get_visa_list(project_id);
                alert(gettext('Deleted.'));

            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        });
    }
    
}


function get_work_permit_list(selected_project_id = '') {
    if (selected_project_id == '') { return; }


    $.ajax({
        type: 'POST',
        url: '/KBL/work_permit_search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'selected_project_id': selected_project_id,
        },
        dataType: 'Json',
        success: function (response) {
            $('#work_permit_list_table > tbody ').empty();
            console.log(response)
            for (var i = 0; i < response.datas.length; i++) {
                var str = "<tr>";
                str += "<td>" + (i + 1) + "</td>" +
                    "<td><span class='" + response.project_status_dict[response.datas[i]['status']]['class'] + "'>" + response.project_status_dict[response.datas[i]['status']]['name'] + "</span></td>" +
                    "<td>" + response.datas[i]['employee'] + "</td>" +
                    "<td>" + response.datas[i]['position'] + "</td>" +
                    "<td>" + response.datas[i]['requiredment'] + "</td>" +
                    "<td>" + response.datas[i]['EA_application_date'] + "</td>" +
                    "<td>" + response.datas[i]['EA_exp_date'] + "</td>" +
                    "<td>" + response.datas[i]['WP_application_date'] + "</td>" +
                    "<td>" + response.datas[i]['WP_exp_date'] + "</td>" +
                    "<td>" + response.datas[i]['expected_date'] + "</td>" +
                    "<td>" + response.datas[i]['note'] + "</td>" +
                    "<td>" +
                    '<a class="btn btn-default btn-xs" href="javascript: void (0);" onclick="list_file(' + response.datas[i]["id"] + ',&#39;WORK_PERMIT&#39;)" > <i class="fa fa-lg fa-file-o"></i></a >' +
                    "</td>" +
                    "<td>" +
                    "<a class='btn btn-default btn-xs' href='javascript: void (0);' onclick='work_permit_modal(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-pencil'></i></a >" +
                    "<a class='btn btn-danger btn-xs' href='javascript: void (0);' onclick='work_permit_delete(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-trash'></i></a >" +
                    "</td ></tr>";


                $('#work_permit_list_table > tbody').append(str);
            }


        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })


}


function work_permit_save() {

    var id = $("#selected_wp").val();
    var project_id = $("#selected_project_id").val();

    var wp_company_name = $("#wp_company_name").val();
    var wp_company_id = $("#wp_company_id").val();
    var wp_employee_name = $("#wp_employee_name").val();
    var wp_employee_id = $("#wp_employee_id").val();
    var wp_EA_application_date = $("#wp_EA_application_date").val();
    var wp_EA_exp_date = $("#wp_EA_exp_date").val();
    var wp_application_date = $("#wp_application_date").val();
    var wp_WP_exp_date = $("#wp_WP_exp_date").val();
    var wp_exp_date = $("#wp_exp_date").val();
    var wp_requirement = $("#wp_requirement").val();
    var wp_note = $("#wp_note").val();
    var wp_status = $("#wp_status").val();


    if (project_id == '') {
        alert(gettext('Error occured. Please press F5 then retry.'));
        return;
    }
    if (wp_employee_id == '') {
        alert(gettext('Please search and select Customer.'));
        return;
    }
    if (wp_employee_name == '') {
        alert(gettext('Customer Name is empty.'));
        return;
    }
    if (wp_status == '') {
        alert(gettext('Status is empty.'));
        return;
    }



    $.ajax({
        type: 'POST',
        url: '/KBL/work_permit_save/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'id': id,
            'project_id': project_id,

            'wp_company_name': wp_company_name,
            'wp_company_id': wp_company_id,
            'wp_employee_name': wp_employee_name,
            'wp_employee_id': wp_employee_id,
            'wp_EA_application_date': wp_EA_application_date,
            'wp_EA_exp_date': wp_EA_exp_date,
            'wp_application_date': wp_application_date,
            'wp_WP_exp_date': wp_WP_exp_date,
            'wp_exp_date': wp_exp_date,
            'wp_requirement': wp_requirement,
            'wp_note': wp_note,
            'wp_status': wp_status,


        },
        dataType: 'Json',
        success: function (response) {
            get_work_permit_list(project_id);
            alert(gettext('Saved.'));
            
            $('#work_permit_modal').modal('hide');
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    });
}

function work_permit_delete(id = null) {
    if (id == null) { return; }

    var project_id = $("#selected_project_id").val();

    if (confirm(gettext('Do you want to delete?'))) {
        $.ajax({
            type: 'POST',
            url: '/KBL/work_permit_delete/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),

                'id': id,

            },
            dataType: 'Json',
            success: function (response) {

                get_work_permit_list(project_id);
                alert(gettext('Deleted.'));

            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        });
    }

}







/////////////          file




function list_file(id = null,type) {
    if (id == null) {
        return;
    }

    $("#board_type").val(type);

    $.ajax({
        type: 'POST',
        url: '/KBL/file_list/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'id': id,
            'type': type,
        },
        dataType: 'Json',
        success: function (response) {


            if (response.result) {

                $("#file_table tbody").empty();

                for (var i = 0; i < response.datas.length; i++) {
                    var str = '<tr><td>' + (i + 1) + '</td>' +
                        '<td>' + response.datas[i].name + ' <a href="' + response.datas[i].url + '"download="' + response.datas[i].origin_name + '"><i class="fa fa-lg fa-download"></i></a></td>' +
                        '<td>' + response.datas[i].date + '</td>' +
                        '<td>' + response.datas[i].creator + '</td>' +
                        '<td>' + response.datas[i].memo + '</td>' +
                        "<td>" +
                        "<a class='btn btn-default btn-xs' style='margin-right:5px;' href='javascript: void (0);' onclick='file_add_modal(" + response.datas[i].id + ")' ><i class='fa fa-lg fa-pencil'></i></a>" +
                        "<a class='btn btn-danger btn-xs' href='javascript: void (0);' onclick='delete_file(" + response.datas[i].id + ")' ><i class='fa fa-lg fa-trash'></i></a>" +

                        '</td></tr > ';

                    $("#file_table tbody").append(str);
                }


                $("#selected_file_list").val(id);

                $('#new_edit_file_list').modal({ backdrop: 'static', keyboard: false });
                $('#new_edit_file_list').modal('show');

            }

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
                    list_file($("#selected_file_list").val());
                }
            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        })
    }

}