jQuery.browser = {};

var checked_list = {};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(function () {


    //검색
    $('.date_input').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        drops: "down",
        locale: {
            format: 'YYYY-MM-DD',
        },
    });
    $('.date_input').val('');
    $('#audit_date_start').val(moment().subtract(7, 'd').format('YYYY-MM-DD'));
    $('#audit_date_end').val(moment().format("YYYY-MM-DD"));

    $('#audit_search').keydown(function (key) {
        if (key.keyCode == 13) {
            search_audit();
        }
    })

    $("#audit_search_btn").click(function () {
        search_audit();
    });

    $("#audit_search_type, #audit_search_in_charge, #audit_search_status").change(function () {
        search_audit();
    });

    // 오토컴플릿
    function split(val) {
        return val.split(/,\s*/);
    }
    function extractLast(term) {
        return split(term).pop();
    }
    // 회사 검색 
    $("#audit_company")
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

                $("#audit_company").val(ui.item.value);

                $("#audit_company_id").val(ui.item.id);

                return false;
            }

        });


    //Service Fee 자동 계산
    $("#audit_service_fee").keyup(function (e) {
        var value = parseInt( $(this).val() );
        var vat = Math.floor( value / 10)
        $("#audit_service_fee_vat").val(vat);
        $("#audit_paid").val(value + vat);
    })
    $("#audit_service_fee_vat").keyup(function (e) {
        var value = parseInt( $("#audit_service_fee").val() );
        var vat = parseInt($(this).val());
        $("#audit_paid").val(value + vat);
    })



    search_audit();
});



function audit_management_modal(id = null) {


    $("#selected_audit").val('');

    $("#audit_company_id").val('');
    $("#audit_company").val('');
    $("#audit_type").val('');
    $("#audit_title").val('');
    $("#audit_service_fee").val('');
    $("#audit_quantity").val('');
    $("#audit_service_fee_vat").val('');
    $("#audit_paid").val('');
    $("#audit_date_paid").val('');
    $("#audit_note").val('');
    $("#audit_charge").val('');
    $("#audit_status").val('');


    if (id != null) {

        $("#selected_audit").val(id);

        $.ajax({
            type: 'POST',
            url: '/KBL/audit_get/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),

                'id': id,
            },
            dataType: 'Json',
            success: function (response) {
                console.log(response.audit_type)

                $("#audit_company_id").val(response.audit_company_id);
                $("#audit_company").val(response.audit_company);
                $("#audit_type").val(response.audit_type);
                $("#audit_title").val(response.audit_title);
                $("#audit_service_fee").val(response.audit_service_fee);
                $("#audit_service_fee_vat").val(response.audit_service_fee_vat);
                $("#audit_paid").val(response.audit_paid);
                $("#audit_date_paid").val(response.audit_date_paid);
                $("#audit_note").val(response.audit_note);
                $("#audit_charge").val(response.audit_charge);
                $("#audit_status").val(response.audit_status);


            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        })


    }



    $('#audit_management_modal').modal({ backdrop: 'static', keyboard: false });
    $('#audit_management_modal').modal('show');

}

function detailed_info_modal(id = null) {
    $('#detailed_info_modal').modal({ backdrop: 'static', keyboard: false });
    $('#detailed_info_modal').modal('show');
}


function search_audit(page = null) {
    var context_in_page = 10;

    var audit_type = $('#audit_search_type option:selected').val();
    var audit_in_charge = $('#audit_search_in_charge option:selected').val();
    var audit_status = $('#audit_search_status option:selected').val();

    var start = $('#audit_date_start').val();
    var end = $('#audit_date_end').val();

    var string = $('#audit_search').val();


    $.ajax({
        type: 'POST',
        url: '/KBL/audit_search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'audit_type': audit_type,
            'audit_in_charge': audit_in_charge,
            'audit_status': audit_status,

            'start': start,
            'end': end,

            'string': string,

            'page': page,
            'context_in_page': context_in_page,
        },
        dataType: 'Json',
        success: function (response) {
            //이벤트 중복 방지
            $(".check_approve").unbind('click');
            console.log(response)
            $('#audit_list_table > tbody ').empty();
            for (var i = 0; i < context_in_page; i++) {
                if (response.datas[i]) {
                    var str = "<tr>" + 
                        "<td>" + response.datas[i]['id'] + "</td>" +
                        "<td>" +
                        "<label class='container'>" +
                        "<input type='checkbox' class='check_detail' detail-check='" + response.datas[i]['id'] + "' company-id='" + response.datas[i]['company_id'] + "' ";
                    if (response.datas[i]['invoice'] != '') { str += " checked disabled" }
                    str += "/>" +
                        "<span class='checkmark'></span></label>" +
                        "</td >" +
                        "<td>" + response.datas[i]['company_name'] + "</td>" +
                        "<td>" + response.datas[i]['title'] + "</td>" +
                        "<td>" + response.project_type_dict[response.datas[i]['type']]['name'] + "</td>" +
                        "<td>" + numberWithCommas(response.datas[i]['service_fee']) + "</td>" +
                        "<td>" + numberWithCommas(response.datas[i]['quantity']) + "</td>" +
                        "<td>" + numberWithCommas(response.datas[i]['service_fee_vat']) + "</td>" +
                        "<td>" + numberWithCommas(response.datas[i]['service_fee_total']) + "</td>" +
                        "<td>" + numberWithCommas(response.datas[i]['paid']) + "</td>" +
                        "<td>" + response.datas[i]['date_paid'] + "</td>" +
                        "<td>" + '' + "</td>" +
                        "<td>" + '' + "</td>" +
                        "<td>" + '' + "</td>" +
                        "<td>" + response.datas[i]['in_charge'] + "</td>" +
                        //담당자 승인
                        "<td><input type='checkbox' class='check_approve check_incharge' id='check_incharge_" + response.datas[i].id + "' onclick='check(this)' " +
                        ((response.datas[i].check_in_charge == null) ? '' : 'checked') + "/><br/ >" +
                        ((response.datas[i].check_in_charge == null) ? '' : response.datas[i].check_in_charge) + "</td>" +
                        //팀장 승인
                        "<td><input type='checkbox' class='check_approve' id='check_leader_" + response.datas[i].id + "'  onclick='check(this)' " +
                        ((response.datas[i].check_leader == null) ? '' : 'checked') + "/><br/ > " +
                        ((response.datas[i].check_leader == null) ? '' : response.datas[i].check_leader) + "</td>" +
                        //회계 승인
                        "<td><input type='checkbox' class='check_approve' id='check_accounting_" + response.datas[i].id + "'  onclick='check(this)' " +
                        ((response.datas[i].check_account == null) ? '' : 'checked') + "/><br/ > " +
                        ((response.datas[i].check_account == null) ? '' : response.datas[i].check_account) + "</td>" +
                        //대표 승인
                        "<td><input type='checkbox' class='check_approve' id='check_ceo_" + response.datas[i].id + "'  onclick='check(this)' " +
                        ((response.datas[i].check_ceo == null) ? '' : 'checked') + "/><br/ > " +
                        ((response.datas[i].check_ceo == null) ? '' : response.datas[i].check_ceo) + "</td>" +
                        "<td><span class='" + response.project_status_dict[response.datas[i]['status']]['class'] + "'>" + response.project_status_dict[response.datas[i]['status']]['name'] +"</span></td>" +
                        "<td>";
                    if (response.datas[i]['invoice'] != '') {
                        str += "<span class='label label-success label-status'>Y</span>";
                    } else {
                        str += "<span class='label label-danger label-status'>N</span>";
                    }
                    str +="</td>" +
                        "<td>" +
                        "<a class='btn btn-default btn-xs' href='javascript: void (0);' onclick='audit_management_modal(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-pencil'></i></a >" +
                        "<a class='btn btn-danger btn-xs' href='javascript: void (0);' onclick='audit_delete(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-trash'></i></a >" +
                        "</td >" +
                        "<td>" + response.datas[i]['company_id'] + "</td></tr > ";


                } else {
                    var str = "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                }
                $('#audit_list_table').append(str);
            }


            //페이징
            $('#table_pagnation').html('');
            str = '';
            if (response.has_previous == true) {
                str += '<li> <a onclick="search_audit(' + (response.page_number - 1) + ')">&laquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&laquo;</span></li>';
            }

            for (var i = response.page_range_start; i < response.page_range_stop; i++) {
                if (response.page_number == i) {
                    str += '<li class="active"><span>' + i + ' <span class="sr-only">(current)</span></span></li>';
                }
                else if (response.page_number + 5 > i && response.page_number - 5 < i) {
                    str += '<li><a onclick="search_audit(' + i + ')">' + i + '</a></li>';
                }
                else {
                }

            }
            if (response.has_next == true) {
                str += '<li><a onclick="search_audit(' + (response.page_number + 1) + ')">&raquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&raquo;</span></li>';
            }
            $('#table_pagnation').html(str);


            //이벤트 재등록
            $(".check_approve").bind('click');

            //체크박스 이벤트
            $(".check_detail").unbind();
            checked_list = {};
            $(".check_detail").bind('change', function (event) {
                event.preventDefault();
                var id = $(this).attr('detail-check');
                var checked = $(this).is(':checked');

                checked_list[id] = checked;
            });

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}




function audit_save() {

    var id = $("#selected_audit").val();

    var audit_company_id = $("#audit_company_id").val();
    var audit_company = $("#audit_company").val();
    var audit_type = $("#audit_type").val();
    var audit_title = $("#audit_title").val();
    var audit_quantity = $("#audit_quantity").val();
    var audit_service_fee = $("#audit_service_fee").val();
    var audit_service_fee_vat = $("#audit_service_fee_vat").val();
    var audit_paid = $("#audit_paid").val();
    var audit_date_paid = $("#audit_date_paid").val();
    var audit_note = $("#audit_note").val();
    var audit_charge = $("#audit_charge").val();
    var audit_status = $("#audit_status").val();


    if (audit_company_id == '') {
        alert(gettext('Please search and select Company.'));
        return;
    }
    if (audit_company == '') {
        alert(gettext('Company Name is empty.'));
        return;
    }
    if (audit_type == '') {
        alert(gettext('Select Service Type.'));
        return;
    }
    if (audit_title == '') {
        alert(gettext('Title is empty.'));
        return;
    } 
    if (audit_service_fee == '') {
        alert(gettext('Service Fee is empty.'));
        return;
    }
    if (audit_quantity == '') {
        alert(gettext('Quantity is empty.'));
        return;
    }
    if (isNaN(audit_quantity)) {
        alert(gettext('Quantity should be in numbers.'));
        $("#audit_quantity").focus();
        return;
    }
    if (isNaN(audit_service_fee)) {
        alert(gettext('Service Fee should be in numbers.'));
        $("#audit_service_fee").focus();
        return;
    }
    if (audit_service_fee_vat == '') {
        alert(gettext('Service Fee(VAT) is empty.'));
        return;
    }
    if (isNaN(audit_service_fee_vat)) {
        alert(gettext('Service Fee(VAT) should be in numbers.'));
        $("#audit_service_fee_vat").focus();
        return;
    }
    if (audit_paid == '') {
        alert(gettext('Paid(Total) is empty.'));
        return;
    }
    if (isNaN(audit_paid)) {
        alert(gettext('Paid(Total) should be in numbers.'));
        $("#audit_paid").focus();
        return;
    }
    if (audit_status == '') {
        alert(gettext('Select Service Status.'));
        return;
    }


    $.ajax({
        type: 'POST',
        url: '/KBL/audit_save/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'id': id,

            'audit_company_id': audit_company_id,
            'audit_company': audit_company,
            'audit_type': audit_type,
            'audit_title': audit_title,
            'audit_service_fee': audit_service_fee,
            'audit_quantity': audit_quantity,
            'audit_service_fee_vat': audit_service_fee_vat,
            'audit_paid': audit_paid,
            'audit_date_paid': audit_date_paid,
            'audit_note': audit_note,
            'audit_charge': audit_charge,
            'audit_status': audit_status,


        },
        dataType: 'Json',
        success: function (response) {
            search_audit();
            alert(gettext('Saved.'));

            $('#audit_management_modal').modal('hide');
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    });


}


function audit_delete(id = null) {
    if (id == null) { return; }


    if (confirm(gettext('Do you want to delete?'))) {

        $.ajax({
            type: 'POST',
            url: '/KBL/audit_delete/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),

                'id': id,
            },
            dataType: 'Json',
            success: function (response) {
                alert(gettext('Deleted.'));
                search_audit();

            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        });
    }
}



function check(obj = null) {
    if (obj == null) {
        return;
    }

    var str = '';
    is_check = $(obj).prop("checked");
    if (is_check) {
        str = gettext('Do you want to approve?');
    } else {
        str = gettext('Do you want cancel approval?');
    }
    //승인 확인 시
    if (confirm(str)) {
        //승인 시 작동
        var tmp_id = $(obj).attr('id');

        var split_data = tmp_id.split('_');
        console.log(split_data)
        $.ajax({
            type: 'POST',
            url: '/KBL/audit_check_appraove/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),

                'id': split_data[2],
                'type': split_data[1],
                'val': $(obj).prop("checked"),

            },
            dataType: 'Json',
            success: function (response) {
                if (response.result) {
                    search_audit();
                }

            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        })

    } else {
        if (is_check) {
            $(obj).prop("checked", false);
        } else {
            $(obj).prop("checked", true);
        }
    }

}



function create_invoice() {

    var list_checkbox = $(".check_detail:checked").not(':disabled');

    if (list_checkbox.length == 0) {
        alert(gettext('Select Audit items first.'));
        return;
    }
    //valid
    
    //if (list_checkbox > 1) {
    //var first_id = $(list_checkbo).attr('conpany-id');
    //alert(first_id)
    //for (var i = 0; i < list_checkbox.length; i++) {
    //        console.log($(data).attr('conpany_id') );
    //
    //
    //    }
    //}

    if(confirm(gettext('Do you want to Create Invoice?'))) {
        $.ajax({
            type: 'POST',
            url: '/KBL/invoice_add/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),

                'data': JSON.stringify(checked_list),

            },
            dataType: 'Json',
            success: function (response) {
                if (response.result) {
                    search_audit();
                    alert(gettext('Created.'));
                }

            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        })
    }
    


}