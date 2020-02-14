jQuery.browser = {};
$(function () {
    $('.input_part').keyup(function () {
        set_print_html();
    })

    $('#search_date').daterangepicker({
        locale: {
            format: 'YYYY-MM-DD',
        },
    })


    $('#btnPrint').click(function () {
        set_print_html();

        $.ajax({
            type: 'POST',
            url: '/doctor/medical_report_save/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),
                'reception_id': $('#selected_reception_id').val(),
                'report': $('#reception_report').val(),
                'usage': $('#reception_usage').val(),
                'hospitalization': $('#date_of_hospitalization').val(),
                'publication': $('#publication_date').val(),
                'selected_report': $('#selected_report').val()
            },
            dataType: 'Json',
            success: function (response) {
                $('#patient_serial_print').html(response.serial);
                $('.page').printThis({
                    importCSS: true,
                    loadCSS: "/static/css/report.css",
                });
            },
            error: function (request, status, error) {
                alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        })


        
        
    });
});

function set_print_html() {

    $('#patient_chart_print').html($('#patient_chart').val());
    $('#patient_name_print').html($('#patient_name').val());
    $('#patient_ID_print').html($('#patient_ID').val());
    $('#patient_gender_print').html($('#patient_gender').val());
    $('#patient_age_print').html($('#patient_age').val());
    $('#patient_date_of_birth_print').html($('#patient_date_of_birth').val());
    $('#patient_address_print').html($('#patient_address').val());
    
    $('#reception_report_print').html($('#reception_report').val());
    $('#reception_usage_print').html($('#reception_usage').val());

    $('#publication_date_print').html($('#publication_date').val());
    $('#date_of_hospitalization_print').html($('#date_of_hospitalization').val());
}




function search_report() {
    $.ajax({
        type: 'POST',
        url: '/doctor/report_search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'date': $('#search_date').val(),
            'filter': $('#search_select').val(),
            'input':$('#search_input').val(),
        },
        dataType: 'Json',
        success: function (response) {
            $('#Report_search_table_tbody').empty();
            for (var i = 0; i < response.datas.length; i++) {
                var str = '<tr style="cursor:pointer;" onclick="set_report(' + response.datas[i].report_id + ')"><td>' + response.datas[i].chart + '</td>' +
                    '<td>' + response.datas[i].serial + '</td>' +
                    '<td>' + response.datas[i].patient + '</td>' +
                    '<td>' + response.datas[i].ID + '</td>' +
                    '<td>' + response.datas[i].Doctor + '</td>' +
                    '<td>' + response.datas[i].PublicationDate + '</td></tr>';

                $('#Report_search_table_tbody').append(str);
            }
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
            'ajax': 'ajax',
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
 


        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}