
$(function () {
    search_report();
    $('.input_part_contorl input, .input_part_contorl textarea').keyup(function () {
        set_print_html();
    })

    $('#search_date').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        drops: "up",
        locale: {
            format: 'YYYY-MM-DD',
        },
    });

    $('#date_of_hospitalization').daterangepicker({
        singleDatePicker: true,
        autoUpdateInput: false,
        locale: {
            format: 'YYYY-MM-DD',
        },
    });
    $('#date_of_hospitalization').on('apply.daterangepicker', function (ev, picker) {
        $('#date_of_hospitalization').val(picker.startDate.format('YYYY-MM-DD'));
    });


    $('#btnPrint_eng').click(function () {
        set_print_html();
        $('.page_print_eng').printThis({
            importCSS: true,
            loadCSS: "/static/css/report.css",
        });


    });



    $('#btnPrint').click(function () {
        set_print_html();

        if ($('#date_of_hospitalization').val().trim() == '') {
            alert('통원 일자를 선택하세요.');
            return;
        }

        if ($('#reception_report').val().trim() == '') {
            alert('소견 내용이 없습니다.');
            return;
        }

        if ($('#reception_usage').val().trim() == '') {
            alert('용도 내용이 없습니다.');
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/doctor/medical_report_save/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),
                'selected_patient': $('#selected_patient').val(),
                'report': $('#reception_report').val(),
                'usage': $('#reception_usage').val(),
                'hospitalization': $('#date_of_hospitalization').val(),
                'publication': $('#publication_date').val(),
                'selected_report': $('#selected_report').val(),
                'doctor': $('#doctor_id').val(),
            },
            dataType: 'Json',
            success: function (response) {
                $('#patient_serial_print').html(response.serial);
                $('.page_print').printThis({
                    importCSS: true,
                    loadCSS: "/static/css/report.css",
                });
            },
            error: function (request, status, error) {
                alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        })
    });

    $('#btnNew').click(function () {

        $('#patient_list').modal({ backdrop: 'static', keyboard: false });
        $('#patient_list').modal('show');

        $('#patient_chart').val('');
        $('#patient_name').val('');
        $('#patient_ID').val('');
        $('#patient_gender').val('');
        $('#patient_age').val('');
        $('#patient_date_of_birth').val('');
        $('#patient_address').val('');
        $('#patient_phone').val('')
        $('#reception_report').val('');
        $('#reception_usage').val('');

        $('#publication_date').val('');
        $('#date_of_hospitalization').val('');


        $('#selected_report').val('');
        $('#selected_patient').val('');


    });
});


function search_report() {
    var page_context = 11;
    $.ajax({
        type: 'POST',
        url: '/doctor/report_search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'filter': $('#search_select').val(),
            'input': $('#search_input').val(),
            'page_context': page_context,
        },
        dataType: 'Json',
        success: function (response) {
            $('#search_table_contents').empty();
            for (var i = 0; i < page_context; i++) {
                var str = ""
                if (response.datas[i]) {
                    str += '<tr style="cursor:pointer; height:40px;" onclick="set_report(' + response.datas[i].report_id + ')"><td>' + response.datas[i].chart + '</td>' +
                        '<td>' + response.datas[i].serial + '</td>' +
                        '<td>' + response.datas[i].patient_name_eng + '<br/>' + response.datas[i].patient_name_kor + '</td>' +
                        '<td>' + response.datas[i].ID + '</td>' +
                        '<td>' + response.datas[i].Doctor + '</td>' +
                        '<td>' + response.datas[i].PublicationDate + '</td></tr>';
                }
                else {
                    str += "<tr style='height:40px;'><td colspan='7'></td></tr>";
                }
                $('#search_table_contents').append(str);
            }
            //ㅍㅔ이징
            $('#payment_pagnation').html('');
            str = '';
            if (response.has_previous == true) {
                str += '<li> <a onclick="search_payment(' + (response.page_number - 1) + ')">&laquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&laquo;</span></li>';
            }

            for (var i = response.page_range_start; i < response.page_range_stop; i++) {
                if (response.page_number == i) {
                    str += '<li class="active"><span>' + i + ' <span class="sr-only">(current)</span></span></li>';
                }
                else if (response.page_number + 5 > i && response.page_number - 5 < i) {
                    str += '<li> <a onclick="search_payment(' + i + ')">' + i + '</a></li>';
                }
                else {
                }

            }
            if (response.has_next == true) {
                str += '<li><a onclick="search_payment(' + (response.page_number + 1) + ')">&raquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&raquo;</span></li>';
            }
            $('#payment_pagnation').html(str);
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}


function set_report(report_id) {
    $.ajax({
        type: 'POST',
        url: '/doctor/show_medical_report/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'report_id': report_id,
        },
        dataType: 'Json',
        success: function (response) {
            $('#patient_chart').val(response.patient_chart);
            $('#patient_name').val(response.patient_name_eng + ' ' + response.patient_name);
            $('#patient_ID').val(response.patient_ID);
            $('#patient_gender').val(response.patient_gender);
            $('#patient_age').val(response.patient_age);
            $('#patient_date_of_birth').val(response.patient_date_of_birth);
            $('#patient_address').val(response.patient_address);
            $('#patient_phone').val(response.patient_phone)
            $('#reception_report').val(response.reception_report);
            $('#reception_usage').val(response.reception_usage);

            $('#publication_date').val(response.publication_date);
            $('#date_of_hospitalization').val(response.date_of_hospitalization);

            $('#selected_reception_id').val(response.reception_id);
            $('#selected_report').val(response.selected_report);

            $('#doctor_name_screen').html(response.doctor);
            $("#doctor_name_print").html(response.doctor);
            set_print_html();
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}


function set_print_html() {

    $('#patient_chart_screen').html($('#patient_chart').val());
    $('#patient_name_screen').html($('#patient_name').val());
    $('#patient_ID_screen').html($('#patient_ID').val());
    $('#patient_gender_screen').html($('#patient_gender').val());
    $('#patient_age_screen').html($('#patient_age').val() + ' 세');
    $('#patient_date_of_birth_screen').html($('#patient_date_of_birth').val());
    $('#patient_address_screen').html($('#patient_address').val());

    $('#reception_report_screen').html($('#reception_report').val());
    $('#reception_usage_screen').html($('#reception_usage').val());

    $('#publication_date_screen').html($('#publication_date').val());
    $('#date_of_hospitalization_screen').html($('#date_of_hospitalization').val());

    $('#patient_chart_print').html($('#patient_chart').val());
    $('#patient_name_print').html($('#patient_name').val());
    $('#patient_ID_print').html($('#patient_ID').val());
    $('#patient_gender_print').html($('#patient_gender').val());
    $('#patient_age_print').html($('#patient_age').val() + ' 세');
    $('#patient_date_of_birth_print').html($('#patient_date_of_birth').val());
    $('#patient_address_print').html($('#patient_address').val());

    $('#reception_report_print').html($('#reception_report').val());
    $('#reception_usage_print').html($('#reception_usage').val());

    $('#publication_date_print').html($('#publication_date').val());
    $('#date_of_hospitalization_print').html($('#date_of_hospitalization').val());
}


function patient_search(data) {
    //window.location.href = 'reception/' + data;
    var category = $('#patient_search_select option:selected').val();
    var string = $('#patient_search_input').val();

    if (string == null || string == '') {
        alert('검색어 입력');
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/receptionist/patient_search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'category': category,
            'string': string,
        },
        dataType: 'Json',
        success: function (response) {
            $('#Patient_Search').empty();
            for (var i = 0; i < 5; i++) {
                if (response.datas[i]) {
                    var str = "<tr style='cursor:pointer; height:30px;' onclick='set_patient_data(" +
                        parseInt(response.datas[i]['chart']) +
                        ")'><td>" + response.datas[i]['chart'] + "</td>" +
                        "<td>" + response.datas[i]['name_kor'] + ' / ' + response.datas[i]['name_eng'] + "</td>" +
                        "<td>" + response.datas[i]['date_of_birth'] + ' (' + response.datas[i]['gender'] + '/' + response.datas[i]['age'] + ")</td>" +
                        "<td>" + response.datas[i]['phonenumber'] + "</td></tr>";
                } else {
                    var str = '<tr><td colspan="4" style="height:30px"></td></tr>';
                }
                    $('#Patient_Search').append(str);
                
            }
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}

function set_patient_data(patient_id) {
    $.ajax({
        type: 'POST',
        url: '/doctor/set_patient_data/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'patient_id': patient_id,
            'doctor_id': $("#doctor_id").val(),
        },
        dataType: 'Json',
        success: function (response) {
            $('#patient_chart').val(response.chart);
            $('#patient_name').val(response.name);
            $('#patient_gender').val(response.gender);
            $('#patient_date_of_birth').val(response.date_of_birth);
            $('#patient_address').val(response.address);
            $('#patient_phone').val(response.phone);

            $('#patient_ID').val(response.ID);
            $('#patient_age').val(response.age);
            $('#publication_date').val(response.today);

            $('#selected_report').val('new');
            $('#selected_patient').val(patient_id);

            $('#patient_list').modal('hide');
            
            $('#doctor_name_screen').html(response.doctor);
            $("#doctor_name_print").html(response.doctor);

            set_print_html();
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}