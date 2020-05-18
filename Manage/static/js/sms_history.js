

jQuery.browser = {};
$(function () {


    $("#search_type,#search_option").change(function () {
        sms_history_search();
    });

    $('#sms_history_search_input').keypress(function (key) {
        if (key.keyCode == 13) {
            sms_history_search();
        }
    });


    $('#search_date_start').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        locale: {
            format: 'YYYY-MM-DD'
        }
    });
    $("#search_date_start").val(moment().subtract(7, 'd').format('YYYY-MM-DD'));
    $('#search_date_end').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        locale: {
            format: 'YYYY-MM-DD'
        }
    });




    sms_history_search();

});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



function sms_history_search(page = 1) {
    var context_in_page = 20;

    var start = $('#search_date_start').val();
    var end = $('#search_date_end').val();

    var type = $('#search_type').val();
    var option = $('#search_option').val();
    var string = $('#sms_history_search_input').val();

    console.log(type);

    $('#list_database_table > tbody ').empty();
    $.ajax({
        type: 'POST',
        url: '/manage/sms/history/search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'start': start,
            'end': end,

            'type': type,
            'option': option,
            'string': string,

            'page': page,
            'context_in_page': context_in_page,
        },
        dataType: 'Json',
        success: function (response) {
            for (var i = 0; i < context_in_page; i++) {
                var str = "";
                if (response.datas[i]) {
                    
                    str = "<tr style='cursor: pointer;'><td>" + response.datas[i]['id'] + "</td><td>";
                    if (response.datas[i]['type'] == 'MANUAL') {
                        str += '<label class="label label-warning label_type">' + gettext('Manual') + '</label>';
                    } else if (response.datas[i]['type'] == 'AUTO') {
                        str += '<label class="label label-primary label_type">' + gettext('Auto') + '</label>';
                    }


                    str += "</td>" + 
                        "<td>" + response.datas[i]['company'] + "</td>" +
                        "<td>" + response.datas[i]['receiver'] + "</td>" +
                        "<td>" + response.datas[i]['phone'] + "</td>" +
                        "<td>" + response.datas[i]['datetime'] + "</td>" +
                        "<td>" + response.datas[i]['sender'] + "</td>" +
                        "<td>";
                    if (response.datas[i]['status'] == 2) {
                        str += '<label class="label label-default label_status">' + gettext('Sending...') + '</label>';
                    } else if (response.datas[i]['status'] == 1) {
                        str += '<label class="label label-success label_status">' + gettext('Done') + '</label>';
                    } else if (response.datas[i]['status'] == 0) {
                        str += '<label class="label label-danger label_status">' + gettext('Failed') + '</label>';
                    }
                        
                        str += "</td>" +
                        "<td>" + response.datas[i]['remark'] + "</td>" +
                        "<td>" + response.datas[i]['contents'] + "</td>" +
                        "<td>" +
                        "<a class='btn btn-default btn-xs' href='javascript: void (0);' onclick='show_history(" + response.datas[i]['id'] + ")' ><i class='fa fa-lg fa-history'></i></a>" +
                        "</td></tr>";


                } else {
                    var str = "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                }
                $('#list_database_table > tbody').append(str);
            }


            //페이징
            $('#pagnation').html('');
            str = '';
            if (response.has_previous == true) {
                str += '<li> <a onclick="sms_history_search(' + (response.page_number - 1) + ')">&laquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&laquo;</span></li>';
            }

            for (var i = response.page_range_start; i < response.page_range_stop; i++) {
                if (response.page_number == i) {
                    str += '<li class="active"><span>' + i + ' <span class="sr-only">(current)</span></span></li>';
                }
                else if (response.page_number + 5 > i && response.page_number - 5 < i) {
                    str += '<li> <a onclick="sms_history_search(' + i + ')">' + i + '</a></li>';
                }
                else {
                }

            }
            if (response.has_next == true) {
                str += '<li><a onclick="sms_history_search(' + (response.page_number + 1) + ')">&raquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&raquo;</span></li>';
            }
            $('#pagnation').html(str);

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}




function show_history(id = null) {
    if (id == null) {
        return;
    }


    $("#sms_modal_name").val('');
    $("#sms_modal_phone").val('');
    $("#sms_modal_content").val('');

    $.ajax({
        type: 'POST',
        url: '/manage/sms/history/get/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'id': id,
        },
        dataType: 'Json',
        success: function (response) {
            $('#sms_modal_name').val(response.name);
            $('#sms_modal_phone').val(response.phone);
            $('#sms_modal_content').val(response.contents);


            $('#sms_modal').modal({ backdrop: 'static', keyboard: false });
            $('#sms_modal').modal('show');
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })



}