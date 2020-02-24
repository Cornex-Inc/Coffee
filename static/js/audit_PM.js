jQuery.browser = {};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
$(function () {


    $('#doctor_search_date').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'This Year': [moment().startOf('year'), moment().endOf('year')],
            'Last Year': [moment().subtract(1, 'year').add(1, 'day'), moment()],
        },
        drops: "down",
        "alwaysShowCalendars": true,
        locale: {
            format: 'YYYY-MM-DD',
        },
    });



    search_doctor_profit();
    $('#doctor_search_date').change(function () {
        search_doctor_profit();
    })
    $('#doctor_search_search').change(function () {
        search_doctor_profit();
    })
    

    //$('#doctor_search_exam').change(function () {
    //    $('#doctor_search_medicine, #doctor_search_lab').val("").prop("selected", true);
    //    search_doctor_profit();
    //})
    //
    //$('#doctor_search_precedure').change(function () {
    //    $('#doctor_search_general, #doctor_search_lab').val("").prop("selected", true);
    //    search_doctor_profit();
    //})
    //
    //$('#doctor_search_radiography').change(function () {
    //    $('#doctor_search_medicine, #doctor_search_general').val("").prop("selected", true);
    //    search_doctor_profit();
    //})




    $('.doctor_profit_control').keyup(function () {
        var regex = /[^0-9]/g;
        var profit = $(this).val();
        profit = profit.replace(regex, '');
        $(this).val(profit);
        if (profit != '') {
            if (profit > 100) {
                profit = 100
                $(this).val(profit);
            }
        }

    });
});


function search_doctor_profit(page = null) {

    $.ajax({
        type: 'POST',
        url: '/manage/doctor_profit/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'start_end_date': $('#doctor_search_date').val(),
            'doctor': $('#doctors_search_doctor').val(),
            'search': $('#doctor_search_search').val(),
            //'exam': $('#doctor_search_exam option:selected').val(),
            //'precedure': $('#doctor_search_precedure option:selected').val(),
            //'radiography': $('#doctor_search_radiography option:selected').val(),
            'page': page,
        },
        dataType: 'Json',
        success: function (response) {
            $('#doctors_table_result').empty();
            total_amount = 0;
            for (var i = 0; i < 10; i++) {//response.datas) {
                var str = '<tr>'
                if (response.datas[i]) {
                    str += '<td style="vertical-align: middle;">' + response.datas[i]['no'] + '</td>' +
                        '<td style="vertical-align: middle;">' + response.datas[i]['date'] + '</td>' +
                        '<td style="vertical-align: middle;">' + response.datas[i]['patient_eng'] + '<br/>' +
                        response.datas[i]['Patient'] + ' (' +
                        response.datas[i]['date_of_birth'] +
                        ')</td>' +
                        '<td style="vertical-align: middle;">' + response.datas[i]['Depart'] + '</td>' +
                        '<td style="vertical-align: middle;">' + response.datas[i]['Doctor'] + '</td>';
                    
                    // exam fee
                    str += '<td style="vertical-align: middle;">';
                    if (response.datas[i]['exams'].length == 0) {
                        str += ' - ';
                    } else {

                        for (var j = 0; j < response.datas[i]['exams'].length; j++) {
                            str += response.datas[i]['exams'][j]['value'];
                            if (j != response.datas[i]['exams'].length - 1) {
                                str += '<br/>';
                            }
                        }
                    }
                    str += '</td><td style="vertical-align: middle;">';
                    if (response.datas[i]['precedures'].length == 0) {
                        str += ' - ';
                    } else {

                        for (var j = 0; j < response.datas[i]['precedures'].length; j++) {
                            str += response.datas[i]['precedures'][j]['value'];
                            if (j != response.datas[i]['precedures'].length - 1) {
                                str += '<br/>';
                            }
                        }
                    }
                    str += '</td><td style="vertical-align: middle;">';
                    if (response.datas[i]['radiographys'].length == 0) {
                        str += ' - ';
                    } else {

                        for (var j = 0; j < response.datas[i]['radiographys'].length; j++) {
                            str += response.datas[i]['radiographys'][j]['value'] + ' x ' + response.datas[i]['radiographys'][j]['amount'];;

                            if (j != response.datas[i]['radiographys'].length - 1) {
                                str += '<br/>';
                            }
                        }
                    }
                    str += '<td style="vertical-align: middle;">' + numberWithCommas(response.datas[i]['subtotal']) + '</td>'
                    str += '</td></tr>';
                    total_amount += response.datas[i]['subtotal'];
                }
                else {
                    str += "<td colspan='11'></td></tr>"
                }

                $('#doctors_table_result').append(str);
            }
            //총 계
            $("#profit_total_total").html(numberWithCommas(total_amount));

            //단일 선택은 월별 출력
            if (response.monthly_total != undefined) {
                $("#profit_monthly_total_total").html(numberWithCommas(response.monthly_total));
                $('#monthly_total').show();
            } else {
                $('#monthly_total').hide();
            }


            //페이징
            $('#doctors_pagnation').html('');
            str = '';
            if (response.has_previous == true) {
                str += '<li> <a onclick="search_doctor_profit(' + (response.page_number - 1) + ')" style="cursor:pointer;">&laquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&laquo;</span></li>';
            }

            for (var i = response.page_range_start; i < response.page_range_stop; i++) {
                if (response.page_number == i) {
                    str += '<li class="active"><span>' + i + ' <span class="sr-only">(current)</span></span></li>';
                }
                else if (response.page_number + 5 > i && response.page_number - 5 < i) {
                    str += '<li> <a onclick="search_doctor_profit(' + i + ')" style="cursor:pointer;">' + i + '</a></li>';
                }
                else {
                }

            }
            if (response.has_next == true) {
                str += '<li><a onclick="search_doctor_profit(' + (response.page_number + 1) + ')" style="cursor:pointer;">&raquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&raquo;</span></li>';
            }
            $('#doctors_pagnation').html(str);


        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}
