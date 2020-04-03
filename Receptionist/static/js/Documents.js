

$(function () {
    //init
    $("#document_control_start").daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        locale: {
            format: 'YYYY-MM-DD',
        },
    });

    $("#document_control_end").daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        locale: {
            format: 'YYYY-MM-DD',
        },
    });

    $('#document_control_input').keydown(function (key) {
        if (key.keyCode == 13) {
            document_search();
        }
    })

    $("#document_control_search").click(function () {
        document_search();
    })
});

function document_search() {

    var document_control_start = $('#document_control_start').val();
    var document_control_end = $('#document_control_end').val();
    var document_control_depart = $('#document_control_depart').val();
    var document_control_input = $('#document_control_input').val();


    $.ajax({
        type: 'POST',
        url: '/receptionist/document_search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'document_control_start': document_control_start,
            'document_control_end': document_control_end,
            'document_control_depart': document_control_depart,
            'document_control_input': document_control_input,
        },
        dataType: 'Json',
        success: function (response) {
            if (response.result == true) {
                $('#document_contents').empty();
                for (var i = 0; i < response.datas.length; i++) {

                    var str = '<tr><td>' + (i + 1) + '</td>' +
                        '<td>' + response.datas[i].chart + '</td>' +
                        '<td>' + response.datas[i].name + '</td>' +
                        '<td>' + response.datas[i].date_of_birth + '</td>' +
                        '<td>' + response.datas[i].depart + '</td>' +
                        '<td>' + response.datas[i].address + '</td>' +
                        '<td>' + response.datas[i].phone + '</td>' +
                        '<td>' + response.datas[i].date_time + '</td>';

                    if (response.datas[i].medical_report == true) {
                        str += '<td>' + "<a class='btn btn-default btn-xs' href='javascript: void (0);' onclick='print_medical_report(" + response.datas[i].id + ")' ><i class='fa fa-lg fa-print'></i></a>"+'</td>';
                        
                    }
                    else {
                        str += '<td></td>';
                    }

                    if (response.datas[i].prescription == true) {
                        str += '<td>' + "<a class='btn btn-default btn-xs' href='javascript: void (0);' onclick='print_prescription(" + response.datas[i].id + ")' ><i class='fa fa-lg fa-print'></i></a>"+'</td>';
                    }
                    else {
                        str += '<td></td>';
                    }

                    if (response.datas[i].lab_report == true) {
                        str += '<td>' + "<a class='btn btn-default btn-xs' href='javascript: void (0);' onclick='print_lab_report(" + response.datas[i].id + ")' ><i class='fa fa-lg fa-print'></i></a>"+'</td>';
                    }
                    else {
                        str += '<td></td>';
                    }



                    $("#document_contents").append(str);
                }


            }
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    });
}


function print_medical_report(id) {



}

function print_prescription(id) {
    $("#dynamic_div").html('');
    $('#dynamic_div').load('/receptionist/document_prescription/' + id);

    $('#dynamic_div').printThis({
    });
}

function print_lab_report(id) {
    $("#dynamic_div").html('');
    $('#dynamic_div').load('/receptionist/document_lab/'+id);

    $('#dynamic_div').printThis({

    });


}