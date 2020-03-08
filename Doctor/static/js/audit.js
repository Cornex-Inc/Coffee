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

    $('#doctor_search_exam_fee').change(function () {
        $('#doctor_search_test, #doctor_search_precedure, #doctor_search_medicine').val("").prop("selected", true);
        search_doctor_profit();
    })

    $('#doctor_search_test').change(function () {
        $('#doctor_search_exam_fee, #doctor_search_precedure, #doctor_search_medicine').val("").prop("selected", true);
        search_doctor_profit();
    })

    $('#doctor_search_precedure').change(function () {
        $('#doctor_search_exam_fee, #doctor_search_test, #doctor_search_medicine').val("").prop("selected", true);
        search_doctor_profit();
    })

    $('#doctor_search_medicine').change(function () {
        $('#doctor_search_exam_fee, #doctor_search_test, #doctor_search_precedure').val("").prop("selected", true);
        search_doctor_profit();
    })




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
            //set_profit_total();
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
            'depart': $('#doctors_search_depart option:selected').val(),
            'doctor': $('#doctors_search_doctor option:selected').val(),
            'exam_fee': $('#doctor_search_exam_fee option:selected').val(),
            'test': $('#doctor_search_test option:selected').val(),
            'precedure': $('#doctor_search_precedure option:selected').val(),
            'medicine': $('#doctor_search_medicine option:selected').val(),
            'page': page,
        },
        dataType: 'Json',
        success: function (response) {
            $('#doctors_table_result').empty();

            for (var i = 0; i < 10; i++) {//response.datas) {
                var str = '<tr>'
                if (response.datas[i]) {
                    str += '<td>' + response.datas[i]['no'] + '</td>' +
                        '<td>' + response.datas[i]['date'] + '</td>' +
                        '<td>' + response.datas[i]['patient_eng'] + '<br/>' +
                        response.datas[i]['Patient'] + ' (' +
                        response.datas[i]['date_of_birth'] +
                        ')</td>' +
                        '<td>' + response.datas[i]['Depart'] + '</td>' +
                        '<td>' + response.datas[i]['Doctor'] + '</td>';

                    // exam fee
                    str += '<td>';
                    if (response.datas[i]['list_exam_fee'].length == 0) {
                        str += ' - ';
                    } else {

                        for (var j = 0; j < response.datas[i]['list_exam_fee'].length; j++) {
                            str += response.datas[i]['list_exam_fee'][j]['value'];
                            if (j != response.datas[i]['list_exam_fee'].length - 1) {
                                str += '<br/>';
                            }
                        }
                    }

                    //Tests
                    str += '</td><td>';
                    if (response.datas[i]['list_test'].length == 0) {
                        str += ' - ';
                    } else {

                        for (var j = 0; j < response.datas[i]['list_test'].length; j++) {
                            str += response.datas[i]['list_test'][j]['value'];
                            if (j != response.datas[i]['list_test'].length - 1) {
                                str += '<br/>';
                            }
                        }
                    }

                    //Procedures
                    str += '</td><td>';
                    if (response.datas[i]['list_precedure'].length == 0) {
                        str += ' - ';
                    } else {

                        for (var j = 0; j < response.datas[i]['list_precedure'].length; j++) {
                            str += response.datas[i]['list_precedure'][j]['value'];
                            if (j != response.datas[i]['list_precedure'].length - 1) {
                                str += '<br/>';
                            }
                        }
                    }

                    //Medicines
                    str += '</td><td>';
                    if (response.datas[i]['list_medi'].length == 0) {
                        str += ' - ';
                    } else {

                        for (var j = 0; j < response.datas[i]['list_medi'].length; j++) {
                            str += response.datas[i]['list_medi'][j]['value'];
                            if (j != response.datas[i]['list_medi'].length - 1) {
                                str += '<br/>';
                            }
                        }
                    }


                    //Sub total
                    str += '</td><td>';
                    if (response.datas[i]['sub_total'] == 0) {
                        str += ' - ';
                    } else {


                        str += numberWithCommas(response.datas[i]['sub_total']);

                    }

                    //Discount
                    str += '</td><td>';
                    if (response.datas[i]['discount'] == 0 || response.datas[i]['discount'] == undefined) {
                        str += ' - ';
                    } else {

                        str += numberWithCommas(response.datas[i]['discount']);

                    }

                    //Total
                    str += '</td><td>';
                    if (response.datas[i]['total'] == 0) {
                        str += ' - ';
                    } else {
                        str += numberWithCommas(response.datas[i]['total']);
                    }




                    str += '</td></tr>';
                }
                else {
                    str += "<td colspan='12'></td></tr>"
                }

                $('#doctors_table_result').append(str);
            }
            //총 계
            //$('#doctors_table_result').empty();
            //set_profit_total();

            $('#profit_total_subtotal').html(numberWithCommas(response['amount_sub_total']));
            if (response['amount_discount'] == undefined) {
                $('#profit_total_discounted').html('-');
            } else {
                $('#profit_total_discounted').html(numberWithCommas(response['amount_discount']));
            }

            
            $('#profit_total_total').html(numberWithCommas(response['amount_total']));


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
            //set_profit_total();


        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}

function set_profit_total() {
    var regex = /[^0-9]/g;


    var subtotal_general = $('#subtotal_general').html().replace(regex, '');
    var subtotal_medicine = $('#subtotal_medicine').html().replace(regex, '');
    var subtotal_lab = $('#subtotal_lab').html().replace(regex, '');

    var profit_general = $('#profit_general').val();
    var profit_medicine = $('#profit_medicine').val();
    var profit_lab = $('#profit_lab').val();

    var profit_total_general = subtotal_general * profit_general / 100;
    var profit_total_medicine = subtotal_medicine * profit_medicine / 100;
    var profit_total_lab = subtotal_lab * profit_lab / 100;




    $('#profit_total_general').html(numberWithCommas(profit_total_general) + ' VND');
    $('#profit_total_medicine').html(numberWithCommas(profit_total_medicine) + ' VND');
    $('#profit_total_lab').html(numberWithCommas(profit_total_lab) + ' VND');

    $('#profit_total_total').html(numberWithCommas(
        profit_total_general +
        profit_total_medicine +
        profit_total_lab +
        profit_total_scaling +
        profit_total_panorama) + ' VND');

}
