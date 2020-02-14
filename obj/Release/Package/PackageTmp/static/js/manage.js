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



    search_payment();
    //search_medicine();
    $('.payment_search_table_filter input,.payment_search_table_filter select').change(function () {
        search_payment();
    })

    $('#payment_profit_input').keyup(function () {
        var regex = /[^0-9]/g;
        var profit = $('#payment_profit_input').val();
        profit = profit.replace(regex, '');
        $('#payment_profit_input').val(profit);
        if (profit != '') {
            if (profit > 100) {
                profit = 100
                $('#payment_profit_input').val(profit);
            }
            set_profit_total();
        }

    });
});


function search_payment(page=null) {
    $.ajax({
        type: 'POST',
        url: '/manage/search_payment/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'start_end_date': $('#payment_search_date').val(),
            'depart': $('#payment_search_depart option:selected').val(),
            'doctor': $('#payment_search_doctor option:selected').val(),

            'general': $('#payment_search_general option:selected').val(),
            'medicine': $('#payment_search_medicine option:selected').val(),
            'lab': $('#payment_search_lab option:selected').val(),
            'scaling': $('#payment_search_scaling option:selected').val(),
            'panorama': $('#payment_search_panorama option:selected').val(),

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

            for (var i = 0; i < 10; i++){//response.datas) {
                var str ='<tr>'
                if (response.datas[i]) {
                    str += '<td style="vertical-align: middle;">' + response.datas[i]['no'] + '</td>' +
                        '<td style="vertical-align: middle;">' + response.datas[i]['date'] + '</td>' + 
                        '<td style="vertical-align: middle;">' + response.datas[i]['patient_eng'] + '<br/>' +
                        response.datas[i]['Patient'] + ' (' +
                        response.datas[i]['date_of_birth'] +
                        ')</td>' +
                        '<td style="vertical-align: middle;">' + response.datas[i]['Depart'] + '</td>' +
                        '<td style="vertical-align: middle;">' + response.datas[i]['Doctor'] + '</td></td>';

                    // exam fee
                    str += '</td><td style="vertical-align: middle;">';
                    if (response.datas[i]['general'].length == 0) {
                        str += ' - ';
                    } else {
                        for (var j = 0; j < response.datas[i]['general'].length; j++) {
                            str += response.datas[i]['general'][j];
                            if (j != response.datas[i]['general'].length - 1) {
                                str += '<br/>';
                            }
                        }
                    }
                    str += '</td><td style="vertical-align: middle;">';
                    if (response.datas[i]['medi'].length == 0) {
                        str += ' - ';
                    } else {
                        for (var j = 0; j < response.datas[i]['medi'].length; j++) {
                            str += response.datas[i]['medi'][j];
                            if (j != response.datas[i]['medi'].length - 1) {
                                str += '<br/>';
                            }
                        }
                    }
                    str += '</td><td style="vertical-align: middle;">';
                    if (response.datas[i]['lab'].length == 0) {
                        str += ' - ';
                    } else {
                        for (var j = 0; j < response.datas[i]['lab'].length; j++) {
                            str += response.datas[i]['lab'][j];
                            if (j != response.datas[i]['lab'].length - 1) {
                                str += '<br/>';
                            }
                        }
                    }
                    str += '</td><td style="vertical-align: middle;">';
                    if (response.datas[i]['scaling'].length == 0) {
                        str += ' - ';
                    } else {
                        for (var j = 0; j < response.datas[i]['scaling'].length; j++) {
                            str += response.datas[i]['scaling'][j];
                            if (j != response.datas[i]['scaling'].length - 1) {
                                str += '<br/>';
                            }
                        }
                    }
                    str += '</td><td style="vertical-align: middle;">';
                    if (response.datas[i]['panorama'].length == 0) {
                        str += ' - ';
                    } else {
                        for (var j = 0; j < response.datas[i]['panorama'].length; j++) {
                            str += response.datas[i]['panorama'][j];
                            if (j != response.datas[i]['panorama'].length - 1) {
                                str += '<br/>';
                            }
                        }
                    }
                    str += '</td>';

                    var method = '<td>'
                    if (response.datas[i]['paid_by_card'] != '')
                        method += 'card<br/>';
                    if (response.datas[i]['paid_by_cash'] != '')
                        method += 'cash<br/>';
                    if (response.datas[i]['paid_by_remit'] != '')
                        method += 'remit<br/>';
                    if (response.datas[i]['paid_by_card'] == '' && response.datas[i]['paid_by_cash'] == '' && response.datas[i]['paid_by_remit'] == '')
                        method += '-<br/>';
                    str += method.substring(0,method.length-5);
                    str += '</td>'

                    str += '<td style="vertical-align: middle;">' + numberWithCommas(response.datas[i]['paid']) + '</td>' +
                        '<td style="vertical-align: middle;">' + numberWithCommas(response.datas[i]['unpaid']) + '</td>' +
                        '<td style="vertical-align: middle;">' + numberWithCommas(response.datas[i]['total']) + '</td></td>';

                }
                else {
                    str +="<td colspan='14'></td></tr>"
                }

                $('#payment_table_result').append(str);
            }
            
            $('#payment_total_total').html(numberWithCommas(response.payment_total_total));
            $('#payment_total_paid').html(numberWithCommas(response.payment_total_paid));
            $('#payment_total_unpaid').html(numberWithCommas(response.payment_total_unpaid));

            //페이징
            $('#payment_pagnation').html('');
            str = '';
            if (response.has_previous == true) {
                str += '<li> <a onclick="search_payment(' + (response.page_number - 1)+')">&laquo;</a></li>';
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
                str += '<li><a onclick="search_payment(' + (response.page_number+1) + ')">&raquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&raquo;</span></li>';
            }
            $('#payment_pagnation').html(str);
            set_profit_total();
            //그래프 연동
            payment_set_graph(response.datas);

        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}



function search_doctor_profit(page=null) {
    $.ajax({
        type: 'POST',
        url: '/manage/doctor_profit/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'start_end_date': $('#doctor_search_date').val(),
            'depart': $('#doctors_search_depart option:selected').val(),
            'doctor': $('#doctors_search_doctor option:selected').val(),
            'general': $('#doctors_search_general option:selected').val(),
            'medicine': $('#doctors_search_medicine option:selected').val(),
            'lab': $('#doctors_search_lab option:selected').val(),
            'scaling': $('#doctors_search_scaling option:selected').val(),
            'panorama': $('#doctors_search_panorama option:selected').val(),
            'page': page, 
        },
        dataType: 'Json',
        success: function (response) {
            
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}





function search_medicine(page=null) {
    var string = $('#medicine_search_input').val();

    
    $.ajax({
        type: 'POST',
        url: '/pharmacy/medicine_search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'string': string,
            'page': page, 
        },
        dataType: 'Json',
        success: function (response) {
            $('#medicine_table_result').empty();
            for (var i = 0; i < 10; i++) {//response.datas) {
                var str = "<tr>"
                if (response.datas[i]) {
                    str += "<td>" + response.datas[i]['id'] + "</td>" +
                        "<td>" + response.datas[i]['name'] + "</td>" +
                        "<td>" + response.datas[i]['company'] + "</td>" +
                        "<td>" + response.datas[i]['ingredient'] + "</td>" +
                        "<td>" + response.datas[i]['unit'] + "</td>" +
                        "<td>" + response.datas[i]['price'] + "</td>" +
                        "<td>" + response.datas[i]['count'] + "</td></tr>";
                }
                    else {
                    str += "<td colspan='7'></td></tr>";
                }
                $('#medicine_table_result').append(str);
            }
            //페이징
            $('#medicine_pagnation').html('');
            str = '';
            if (response.has_previous == true) {
                str += '<li> <a onclick="search_medicine(' + (response.page_number - 1) + ')">&laquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&laquo;</span></li>';
            }

            for (var i = response.page_range_start; i < response.page_range_stop; i++) {
                if (response.page_number == i) {
                    str += '<li class="active"><span>' + i + ' <span class="sr-only">(current)</span></span></li>';
                }
                else if (response.page_number + 5 > i && response.page_number -5  < i) {
                    str += '<li> <a onclick="search_medicine(' + i + ')">' + i + '</a></li>';
                }
                else {
                }
            }
            if (response.has_next == true) {
                str += '<li><a onclick="search_medicine(' + (response.page_number + 1) + ')">&raquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&raquo;</span></li>';
            }
            $('#medicine_pagnation').html(str);
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}

function set_profit_total() {
    var regex = /[^0-9]/g;
    var profit = $('#payment_profit_input').val();
    var payment_total = $('#payment_total_total').html();
    payment_total = payment_total.replace(regex, '');
    if (profit == 0) 
        profit = 0;
    else
        profit = profit / 100;

    profit_total = payment_total * profit;

    $('#payment_profit_total').html(numberWithCommas(profit_total));
}

