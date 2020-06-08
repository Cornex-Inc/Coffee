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
    $('#visa_date_start').val(moment().subtract(7, 'd').format('YYYY-MM-DD'));
    $('#visa_date_end').val(moment().format("YYYY-MM-DD"));

    //∞Àªˆ
    $('#visa_search').keydown(function (key) {
        if (key.keyCode == 13) {
            visa_list_search();
        }
    })

    $("#visa_search_btn").click(function () {
        visa_list_search();
    });

    $("#visa_date_end, #visa_date_start, #visa_status, #visa_type").change(function () {
        visa_list_search();
    })

    visa_list_search();

});



function visa_management_modal(id = null) {

    $('#visa_management_modal').modal({ backdrop: 'static', keyboard: false });
    $('#visa_management_modal').modal('show');

}



function visa_list_search(page = null) {
    var context_in_page = 10;


    var start = $('#visa_date_start').val();
    var end = $('#visa_date_end').val();

    var visa_type = $('#visa_type option:selected').val();
    var visa_status = $('#visa_status option:selected').val();
    var string = $('#visa_search').val();


    $.ajax({
        type: 'POST',
        url: '/KBL/visa_list_search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'start': start,
            'end': end,

            'visa_type': visa_type,
            'visa_status': visa_status,
            'string': string,

            'page': page,
            'context_in_page': context_in_page,
        },
        dataType: 'Json',
        success: function (response) {
            $('#visa_list_table > tbody ').empty();
            console.log(response)
            for (var i = 0; i < context_in_page; i++) {
                if (response.datas[i]) {
                    var str = "<tr>";
                    if (response.datas[i]['emergency'] == '1') {
                        str += "<td><span class='label label-danger emc'>" + gettext('EMC') + "</span></td>";
                    }
                    else {
                        str += "<td>" + response.datas[i]['id'] + "</td>";
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
                        '<a class="btn ';
                    if (response.datas[i]['is_file']) {
                        str += 'btn btn-success btn - xs" href = "javascript: void(0);" onclick = "list_file(' + response.datas[i]["id"] + ',&#39;VISA&#39;)" > <i class="fa fa-lg fa-file"></i></a > ';
                    } else {
                        str += 'btn btn-default btn - xs" href="javascript: void (0); " onclick="list_file(' + response.datas[i]["id"] + ',&#39;VISA&#39;)" > <i class="fa fa-lg fa-file-o"></i></a > ';
                    }
                    //"</td>" +
                    //"<td>" +
                    //"<a class='btn btn-default btn-xs' href='javascript: void (0);' onclick='visa_modal(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-pencil'></i></a >" +
                    //"<a class='btn btn-danger btn-xs' href='javascript: void (0);' onclick='visa_delete(" + response.datas[i]['id'] + ")' > <i class='fa fa-lg fa-trash'></i></a >" +
                    str += "</td ></tr>";
                }
                else {
                    str = "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>"
                }

                $('#visa_list_table > tbody').append(str);
            }



            //∆‰¿Ã¬°
            $('#table_pagnation').html('');
            str = '';
            if (response.has_previous == true) {
                str += '<li> <a onclick="visa_list_search(' + (response.page_number - 1) + ')">&laquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&laquo;</span></li>';
            }

            for (var i = response.page_range_start; i < response.page_range_stop; i++) {
                if (response.page_number == i) {
                    str += '<li class="active"><span>' + i + ' <span class="sr-only">(current)</span></span></li>';
                }
                else if (response.page_number + 5 > i && response.page_number - 5 < i) {
                    str += '<li><a onclick="visa_list_search(' + i + ')">' + i + '</a></li>';
                }
                else {
                }

            }
            if (response.has_next == true) {
                str += '<li><a onclick="visa_list_search(' + (response.page_number + 1) + ')">&raquo;</a></li>';
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




function list_file(id = null, type) {
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
            console.log(response)

            if (response.result) {

                $("#file_table tbody").empty();

                for (var i = 0; i < response.datas.length; i++) {
                    var str = '<tr><td>' + (i + 1) + '</td>' +
                        '<td>' + response.datas[i].name + ' <a href="' + response.datas[i].url + '"download="' + response.datas[i].origin_name + '"><i class="fa fa-lg fa-download"></i></a></td>' +
                        '<td>' + response.datas[i].date + '</td>' +
                        '<td>' + response.datas[i].creator + '</td>' +
                        '<td>' + response.datas[i].memo + '</td>' +
                        //"<td>" +
                        //"<a class='btn btn-default btn-xs' style='margin-right:5px;' href='javascript: void (0);' onclick='file_add_modal(" + response.datas[i].id + ")' ><i class='fa fa-lg fa-pencil'></i></a>" +
                        //"<a class='btn btn-danger btn-xs' href='javascript: void (0);' onclick='delete_file(" + response.datas[i].id + ")' ><i class='fa fa-lg fa-trash'></i></a>" +
                        //"</td>" + 
                        "</tr >";

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
