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
    $('#estimate_date_start').val(moment().subtract(7, 'd').format('YYYY-MM-DD'));
    $('#estimate_date_end').val(moment().format("YYYY-MM-DD"));

    //∞Àªˆ
    $('#estimate_search').keydown(function (key) {
        if (key.keyCode == 13) {
            search_estimate();
        }
    })




    search_estimate();

});



function estimate_sheet_modal(id = null) {

    $("#selected_estimate").val('');

    $("#estimate_recipient").val('');
    $("#estimate_email").val('');
    $("#estimate_tile").val('');
    $("#estimate_remark").val('');
    $("#estimate_payment_unit").val('');
    $("#estimate_status").val('');



    if (id != null) {


        $("#selected_estimate").val(id);

        $.ajax({
            type: 'POST',
            url: '/KBL/estimate_sheet_get/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),

                'id': id,
            },
            dataType: 'Json',
            success: function (response) {
                console.log(response)

                $("#estimate_recipient").val(response.estimate_recipient);
                $("#estimate_tile").val(response.estimate_tile);
                $("#estimate_remark").val(response.estimate_remark);
                $("#estimate_payment_unit").val(response.estimate_payment_unit);
                $("#estimate_status").val(response.estimate_status);


            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        });
    }




    $('#estimate_sheet_modal').modal({ backdrop: 'static', keyboard: false });
    $('#estimate_sheet_modal').modal('show');

}

function detailed_info_modal(id = null) {

    var estiamte_id = $("#selected_estimate").val();
    if (estiamte_id == '') {
        alert('Select Estimate Sheet first.');
        return;
    }

    $("#selected_detail_id").val('');

    $("#detail_type").val('');
    $("#detail_content").val('');
    $("#detail_unit_price").val('');
    $("#detail_quantity").val('');
    $("#detail_cost").val('');
    $("#detail_note").val('');

    if (id != null) {

        $("#selected_detail_id").val(id);
        console.log(id)
        $.ajax({
            type: 'POST',
            url: '/KBL/estimate_sheet_detail_get/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),

                'id': id,
            },
            dataType: 'Json',
            success: function (response) {
                console.log(response)

                $("#detail_type").val(response.detail_type);
                $("#detail_content").val(response.detail_content);
                $("#detail_unit_price").val(response.detail_unit_price);
                $("#detail_quantity").val(response.detail_quantity);
                $("#detail_cost").val(response.detail_cost);
                $("#detail_note").val(response.detail_note);

            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        });
    }



    $('#detailed_info_modal').modal({ backdrop: 'static', keyboard: false });
    $('#detailed_info_modal').modal('show');
}



function search_estimate(page = null) {
    var context_in_page = 10;


    var type = $('#estimate_type').val();
    var in_charge = $('#estimate_in_charge').val();
    var start = $('#estimate_date_start').val();
    var end = $('#estimate_date_end').val();
    var string = $('#estimate_search').val();


    $.ajax({
        type: 'POST',
        url: '/KBL/estimate_sheet_search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'type': type,
            'in_charge': in_charge,
            'start': start,
            'end': end,
            'string': string,

            'page': page,
            'context_in_page': context_in_page,
        },
        dataType: 'Json',
        success: function (response) {
            $('#estimate_list_table > tbody ').empty();
            for (var i = 0; i < context_in_page; i++) {
                if (response.datas[i]) {
                    var str = "<tr style='cursor:pointer' onclick='select_estimate(" + response.datas[i]['id'] + ")'>";
                    str += "<td>" + response.datas[i]['id'] + "</td>" +
                        "<td><span class='" + response.estimate_class_dict[response.datas[i]['estimate_classification']]['class'] + "'>" + response.estimate_class_dict[response.datas[i]['estimate_classification']]['name'] + "</span></td>" +
                        "<td>" + response.datas[i]['estimate_recipient'] + "</td>" +
                        "<td>" + response.datas[i]['estimate_tile'] + "</td>" +
                        "<td>" + response.datas[i]['estimate_in_charge'] + "</td>" +
                        "<td>" + response.datas[i]['estimate_date_register'] + "</td>" +
                        "<td>" + response.datas[i]['estimate_sent'] + "</td>" +
                        "<td>" + response.datas[i]['estimate_payment_unit'] + "</td>" +
                        "<td><span class='" + response.estimate_status_dict[response.datas[i]['estimate_status']]['class'] + "'>" + response.estimate_status_dict[response.datas[i]['estimate_status']]['name'] + "</span></td>" +
                        "<td>" +
                        "<a class='btn btn-warning btn-xs' href='javascript: void (0);' onclick='send_email_estimate(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-envelope-o'></i></a >" +
                        "<a class='btn btn-success btn-xs' href='javascript: void (0);' onclick='print_estimate(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-print'></i></a >" +
                        "<a class='btn btn-default btn-xs' href='javascript: void (0);' onclick='estimate_sheet_modal(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-pencil'></i></a >" +
                        "<a class='btn btn-danger btn-xs' href='javascript: void (0);' onclick='delete_estimate(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-trash'></i></a >" +
                        "</td ></tr > ";


                } else {
                    var str = "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                }
                $('#estimate_list_table > tbody').append(str);
            }


            //∆‰¿Ã¬°
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

function select_estimate(id = '') {

    $("#selected_estimate").val(id);


    $.ajax({
        type: 'POST',
        url: '/KBL/estimate_sheet_detail_list/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'id': id,

        },
        dataType: 'Json',
        success: function (response) {

            $('#detail_table > tbody ').empty();
            for (var i = 0; i < response.datas.length; i++) {
                if (response.datas[i]) {
                    var str = "<tr>";
                    str += "<td>" + (i + 1) + "</td>" +
                        "<td><input type='checkbox' class='detail_checked' id='detail_checked_" + response.datas[i]['id'] + "'</td>" +
                        "<td>" + response.datas[i]['estimate_type'] + "</td>" +
                        "<td>" + response.datas[i]['estimate_content'] + "</td>" +
                        "<td>" + response.datas[i]['estimate_unit_price'] + "</td>" +
                        "<td>" + response.datas[i]['estimate_quantity'] + "</td>" +
                        "<td>" + response.datas[i]['estimate_cost'] + "</td>" +
                        "<td>" + response.datas[i]['estimate_note'] + "</td>" +
                        "<td>" +
                        "<a class='btn btn-default btn-xs btn_default_tmp' href='javascript: void (0);' onclick='detailed_info_modal(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-pencil'></i></a >" +
                        "<a class='btn btn-danger btn-xs btn_danger_tmp' href='javascript: void (0);' onclick='delete_detailed_info(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-trash'></i></a >" +
                        "</td ></tr > ";

                    $('#detail_table > tbody').append(str);
                } 
               
            }


                   



        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}


function estimate_save(id = '') {

    var id = $("#selected_estimate").val();

    var estimate_recipient = $("#estimate_recipient").val();
    var estimate_email = $("#estimate_email").val();
    var estimate_tile = $("#estimate_tile").val();
    var estimate_remark = $("#estimate_remark").val();
    var estimate_payment_unit = $("#estimate_payment_unit").val();
    var estimate_status = $("#estimate_status").val();

    if (estimate_recipient == '') {
        alert(gettext('Recipient is empty.'));
        return;
    }
    if (estimate_email == '') {
        alert(gettext('E - Mail is empty.'));
        return;
    }
    if (estimate_tile == '') {
        alert(gettext('Title is empty.'));
        return;
    }
    if (estimate_remark == '') {
        alert(gettext('Remark is empty.'));
        return;
    }
    if (estimate_payment_unit == '') {
        alert(gettext('Payment Unit is empty.'));
        return;
    }
    if (estimate_status == '') {
        alert(gettext('Status is empty.'));
        return;
    }


    $.ajax({
        type: 'POST',
        url: '/KBL/estimate_sheet_save/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'id': id,

            'estimate_recipient': estimate_recipient,
            'estimate_email': estimate_email,
            'estimate_tile': estimate_tile,
            'estimate_remark': estimate_remark,
            'estimate_payment_unit': estimate_payment_unit,
            'estimate_status': estimate_status,

        },
        dataType: 'Json',
        success: function (response) {
            alert(gettext('Saved.'));
            $('#estimate_sheet_modal').modal('hide');
            search_estimate();
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}

function delete_estimate(id = null) {
    if (id == null) { return; }

    if (confirm(gettext('Do you want to delete?'))) {
        $.ajax({
            type: 'POST',
            url: '/KBL/estimate_sheet_delete/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),

                'id': id,
            },
            dataType: 'Json',
            success: function (response) {

                alert(gettext('Deleted.'));

                $("#detail_table > tbody").empty();
                $("#selected_estimate").val('');
                search_estimate();


            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        });
    }
}



function save_detail_modal() {

    var id = $("#selected_detail_id").val();

    var selected_estimate = $("#selected_estimate").val();
    if (selected_estimate == '') {
        return;
    }

    var detail_type = $("#detail_type").val();
    var detail_content = $("#detail_content").val();
    var detail_unit_price = $("#detail_unit_price").val();
    var detail_quantity = $("#detail_quantity").val();
    var detail_cost = $("#detail_cost").val();
    var detail_note = $("#detail_note").val();

    if (detail_type == '') {
        alert(gettext('Selet Type field.'));
        return;
    }
    if (detail_content == '') {
        alert(gettext('Content is empty.'));
        return;
    }
    if (detail_unit_price == '') {
        alert(gettext('Unit Price is empty.'));
        return;
    }
    if (detail_quantity == '') {
        alert(gettext('Quantity is empty.'));
        return;
    }
    if (detail_cost == '') {
        alert(gettext('Cost is empty.'));
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/KBL/estimate_sheet_detail_save/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'id': id,
            'selected_estimate': selected_estimate,

            'detail_type': detail_type,
            'detail_content': detail_content,
            'detail_unit_price': detail_unit_price,
            'detail_quantity': detail_quantity,
            'detail_cost': detail_cost,
            'detail_note': detail_note,

        },
        dataType: 'Json',
        success: function (response) {

            if (response.result) {
                alert(gettext("Saved."));
                select_estimate(selected_estimate);
                $('#detailed_info_modal').modal('hide');
            }

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    });



}


function delete_detailed_info(id = '') {
    if (id == '') { return; }
    var selected_estimate = $("#selected_estimate").val();
    if (selected_estimate == '') {
        return;
    }

    if (confirm('Do you want to delete?')) {

        $.ajax({
            type: 'POST',
            url: '/KBL/estimate_sheet_detail_delete/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),

                'id': id,
            },
            dataType: 'Json',
            success: function (response) {

                if (response.result) {
                    alert(gettext("Deleted."));
                    select_estimate(selected_estimate);
                }

            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        });
    }



}


function print_estimate(id) {

    $("#dynamic_div").html('');
    $('#dynamic_div').load('/KBL/print_estimate_sheet/' + id);

    $('#dynamic_div').printThis({
    });
}

function send_email_estimate(id = null) {

    if (confirm(gettext('Do you want to send E-Mail?'))) {

        $.ajax({
            type: 'POST',
            url: '/KBL/send_email_estimate/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),

                'id': id,
            },
            dataType: 'Json',
            success: function (response) {

                if (response.result) {
                    alert(gettext("Deleted."));
                    select_estimate(selected_estimate);
                }

            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        });

    }


}