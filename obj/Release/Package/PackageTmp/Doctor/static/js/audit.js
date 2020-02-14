jQuery.browser = {};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
$(function () {


    $('#payment_search_date').daterangepicker({
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
    search_payment();


    $('#payment_search_date, #payment_search_depart, #payment_search_doctor, #payment_search_test, #payment_search_precedure, #payment_search_medicine, #payment_search_paid_by, #payment_search_check_paid').change(function () {
        search_payment();
    })
});


function search_payment(page = null) {
    $.ajax({
        type: 'POST',
        url: '/manage/search_payment/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'start_end_date': $('#payment_search_date').val(),
            'depart': $('#payment_search_depart option:selected').val(),
            'doctor': $('#payment_search_doctor option:selected').val(),
            'test': $('#payment_search_test option:selected').val(),
            'precedure': $('#payment_search_precedure option:selected').val(),
            'medicine': $('#payment_search_medicine option:selected').val(),
            'input': $('#payment_search_input').val(),
            'pup': $('#payment_search_check_paid option:selected').val(),
            'paid_by': $('#payment_search_paid_by option:selected').val(),
            'page': page,
        },
        dataType: 'Json',
        success: function (response) {
            $('#payment_table_result').empty();
            $('#payment_total_amount').html('');
            $('#payment_total_paid').html('');
            var payment_total_total = 0;
            var payment_total_paid = 0;
            var payment_total_unpaid = 0;
            for (var i = 0; i < 10; i++) {//response.datas) {
                var str = '<tr>'
                if (response.datas[i]) {
                    str += '<td style="vertical-align: middle;">' + response.datas[i]['no'] + '</td>' +
                        '<td style="vertical-align: middle;">' + response.datas[i]['date'] + '</td>' +
                        '<td style="vertical-align: middle;">' + response.datas[i]['Patient'] + '<br/>' + response.datas[i]['patient_eng'] + '</td>' +
                        '<td style="vertical-align: middle;">' + response.datas[i]['date_of_birth'] + '</td>' +
                        '<td style="vertical-align: middle;">' + response.datas[i]['address'] + '</td>' +
                        '<td style="vertical-align: middle;">' + response.datas[i]['Depart'] + '</td>' +
                        '<td style="vertical-align: middle;">' + response.datas[i]['Doctor'] + '</td>' +
                        '<td style="vertical-align: middle;">';
                    if (response.datas[i]['tests'].length == 0) {
                        str += ' - ';
                    } else {
                        for (var j = 0; j < response.datas[i]['tests'].length; j++) {
                            str += response.datas[i]['tests'][j];
                            if (j != response.datas[i]['tests'].length - 1) {
                                str += '<br/>';
                            }
                        }
                    }
                    str += '</td><td style="vertical-align: middle;">';
                    if (response.datas[i]['precedures'].length == 0) {
                        str += ' - ';
                    } else {
                        for (var j = 0; j < response.datas[i]['precedures'].length; j++) {
                            str += response.datas[i]['precedures'][j];
                            if (j != response.datas[i]['precedures'].length - 1) {
                                str += '<br/>';
                            }
                        }
                    }
                    str += '</td><td style="vertical-align: middle;">';
                    if (response.datas[i]['medicines'].length == 0) {
                        str += ' - ';
                    } else {
                        for (var j = 0; j < response.datas[i]['medicines'].length; j++) {
                            str += response.datas[i]['medicines'][j];
                            if (j != response.datas[i]['medicines'].length - 1) {
                                str += '<br/>';
                            }
                        }
                    }
                    str += '</td>';
                    var method = '<td>'
                    if (response.datas[i]['paid_by_card'] != '')
                        method += 'card<br/>';
                    if (response.datas[i]['paid_by_card'] != '')
                        method += 'cash<br/>';
                    if (response.datas[i]['paid_by_card'] != '')
                        method += 'remit<br/>';
                    if (response.datas[i]['paid_by_card'] == '' && response.datas[i]['paid_by_cash'] == '' && response.datas[i]['paid_by_remit'] == '')
                        method += '-<br/>';
                    str += method.substring(0, method.length - 5);
                    str += '</td>'

                    str += '<td style="vertical-align: middle;">' + numberWithCommas(response.datas[i]['paid']) + '</td>' +
                        '<td style="vertical-align: middle;">' + numberWithCommas(response.datas[i]['unpaid']) + '</td>' +
                        '<td style="vertical-align: middle;">' + numberWithCommas(response.datas[i]['total']) + '</td></td>';


                }
                else {
                    str += "<td colspan='14'></td></tr>"
                }

                $('#payment_table_result').append(str);
            }

            $('#payment_total_total').html(numberWithCommas(payment_total_total));
            $('#payment_total_paid').html(numberWithCommas(payment_total_total - payment_total_unpaid));
            $('#payment_total_unpaid').html(numberWithCommas(payment_total_unpaid));

            //∆‰¿Ã¬°
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