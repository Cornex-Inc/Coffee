jQuery.browser = {};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
$(function () {

    $(".date_input").daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        drops: "down",
        locale: {
            format: "YYYY-MM-DD",
        },
    });





    search_payment();
    //search_doctor_profit();
    //search_medicine();
    $('.contents_filter_wrap select, .date_input').change(function () {
        search_payment();
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
            set_profit_total();
        }

    });


    $('#payment_search_doctor').empty();
    $('#payment_search_doctor').append(new Option('---------', ''));

    $('#doctors_search_doctor').empty();
    $('#doctors_search_doctor').append(new Option('---------', ''));


    $("#payment_search_depart").change(function () {
        get_doctor($("#payment_search_depart"));
    })

    $("#doctors_search_depart").change(function () {
        get_doctor($("#doctors_search_depart"));
    })
});



function get_doctor(part, depart = null) {
    var part_id = part.attr('id');
    var doctor;
    if (part_id == 'payment_search_depart') {
        doctor = $('#payment_search_doctor');
    } else if (part_id == 'doctors_search_depart') {
        doctor = $('#doctors_search_doctor');
    }

    if (depart == null)
        depart = part.val();

    if (part.val() == '') {
        doctor.empty();
        doctor.append(new Option('---------', ''));
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/receptionist/get_depart_doctor/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'depart': part.val(),
        },
        dataType: 'Json',
        success: function (response) {
            doctor.empty();
            doctor.append(new Option('---------', ''));
            for (var i in response.datas)
                doctor.append("<option value='" + response.datas[i] + "'>" + i + "</Option>");

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}


function search_payment(page = null) {
    var page_context = $("#contents_filter_context_count").val();

    $.ajax({
        type: 'POST',
        url: '/manage/search_payment/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'page_context': page_context,

            'start': $("#payment_search_date_start").val(),
            'end': $("#payment_search_date_end").val(),

            'depart': $('#contents_filter_depart').val(),
            'doctor': $('#contents_filter_doctor').val(),

            //'general': $('#payment_search_general option:selected').val(),
            //'medicine': $('#payment_search_medicine option:selected').val(),
            //'lab': $('#payment_search_lab option:selected').val(),

            'payment_method': $('#contents_filter_payment_method').val(),
            'payment_status': $('#contents_filter_payment_status').val(),


            'page': page, 
        },
        dataType: 'Json',
        success: function (response) {
            $('#payment_table_result').empty();

            var str = '';
            for (var i = 0; i < page_context; i++) {//response.datas) {
                
                if (response.datas[i]) {
                    str += '<tr>';

                    //진료 기본 정보
                    str += '<td>' + response.datas[i]['no'] + '</td>' +
                        '<td>' + response.datas[i]['date'] + '</td>' +
                        '<td>' + response.datas[i]['patient_eng'] + '<br/>' +
                        response.datas[i]['Patient'] + ' (' +
                        response.datas[i]['date_of_birth'] +
                        ')</td>' +
                        '<td>' + response.datas[i]['Depart'] + '</td>' +
                        '<td>' + response.datas[i]['Doctor_kor'] + '<br/>' + response.datas[i]['Doctor_eng'] + '</td>';



                    //진룍 목록
                    ////진료비
                    str += '<td>';
                    for (var j = 0; j < response.datas[i]['list_exam_fee'].length; j++) {
                        if (response.datas[i]['list_exam_fee'][j].checked == 'True') {
                            str += "<i class='fa fa-check-circle '></i> "
                        }
                        str += response.datas[i]['list_exam_fee'][j].value + '<br/>';
                    }
                    str += '</td>';

                    ////검사
                    str += '<td>';
                    for (var j = 0; j < response.datas[i]['list_lab'].length; j++) {
                        if (response.datas[i]['list_lab'][j].checked == 'True') {
                            str += "<i class='fa fa-check-circle '></i> "
                        }
                        str += response.datas[i]['list_lab'][j].value + '<br/>';
                    }
                    str += '</td>';


                    ////처치
                    str += '<td>';
                    for (var j = 0; j < response.datas[i]['list_precedure'].length; j++) {
                        if (response.datas[i]['list_precedure'][j].checked == 'True') {
                            str += "<i class='fa fa-check-circle '></i> "
                        }
                        str += response.datas[i]['list_precedure'][j].value + '<br/>';
                    }
                    str += '</td>';


                    ////방사선
                    str += '<td>';
                    for (var j = 0; j < response.datas[i]['list_radiation'].length; j++) {
                        if (response.datas[i]['list_radiation'][j].checked == 'True') {
                            str += "<i class='fa fa-check-circle '></i> "
                        }
                        str += response.datas[i]['list_radiation'][j].value + ' x ' + response.datas[i]['list_radiation'][j].amount + '<br/>';
                    }
                    str += '</td>';

                    ////약
                    str += '<td>';
                    for (var j = 0; j < response.datas[i]['list_medicine'].length; j++) {
                        if (response.datas[i]['list_medicine'][j].checked == 'True') {
                            str += "<i class='fa fa-check-circle '></i> "
                        }
                        str += response.datas[i]['list_medicine'][j].value + ' x ' + response.datas[i]['list_medicine'][j].amount +'<br/>';
                    }
                    str += '</td>';

                        
                    //수납 정보

                    str += '<td>' + response.datas[i]['paid_by'] +
                        '</td><td>' + numberWithCommas(response.datas[i]['sub_total']) +
                        '</td><td>' + numberWithCommas(response.datas[i]['additional']) +
                        '</td><td>' + numberWithCommas(response.datas[i]['discount']) +
                        '</td><td>' + numberWithCommas(response.datas[i]['total']) +
                        '</td><td';
                    if (response.datas[i]['unpaid'] == 0) {
                        str += "> - </td ></tr >'";
                    } else {
                        str += " style='color:red;'>" + numberWithCommas(response.datas[i]['unpaid']) + '</td ></tr > ';
                    }

                        


                } else {
                    str += '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
                }
            }
            $('#payment_table_result').append(str);

            $("#payment_sub_total_total").html(numberWithCommas(response['payment_total_subtotal']));
            $("#payment_additional_total").html(numberWithCommas(response.payment_total_additional));
            $("#payment_discount_total").html(numberWithCommas(response.payment_total_discount));
            $("#payment_total_total").html(numberWithCommas(response.payment_total_total));
            $("#payment_unpaid_total").html(numberWithCommas(response.payment_total_unpaid));



            //총계



            //    var str ='<tr>'
            //    if (response.datas[i]) {
            //        str += '<td>' + response.datas[i]['no'] + '</td>' +
            //            '<td>' + response.datas[i]['date'] + '</td>' + 
            //            '<td>' + response.datas[i]['patient_eng'] + '<br/>' +
            //            response.datas[i]['Patient'] + ' (' +
            //            response.datas[i]['date_of_birth'] +
            //            ')</td>' +
            //            '<td>' + response.datas[i]['Depart'] + '</td>' +
            //            '<td>' + response.datas[i]['Doctor'] + '</td>';
            //
            //        // exam fee
            //        str += '<td>';
            //        if (response.datas[i]['lab'].length == 0) {
            //            str += ' - ';
            //        } else {
            //            for (var j = 0; j < response.datas[i]['lab'].length; j++) {
            //                str += response.datas[i]['lab'][j]['value'];
            //                if (j != response.datas[i]['lab'].length - 1) {
            //                    str += '<br/>';
            //                }
            //            }
            //        }
            //        str += '</td><td>';
            //        
            //        if (response.datas[i]['general'].length == 0) {
            //            str += ' - ';
            //        } else {
            //            
            //            for (var j = 0; j < response.datas[i]['general'].length; j++) {
            //                str += response.datas[i]['general'][j]['value'] ;
            //                if (j != response.datas[i]['general'].length - 1) {
            //                    str += '<br/>';
            //                }
            //            }
            //        }
            //        
            //        str += '</td><td>';
            //        if (response.datas[i]['medi'].length == 0) {
            //            str += ' - ';
            //        } else {
            //            for (var j = 0; j < response.datas[i]['medi'].length; j++) {
            //                str += response.datas[i]['medi'][j]['value'];
            //                if (j != response.datas[i]['medi'].length - 1) {
            //                    str += '<br/>';
            //                }
            //            }
            //        }
            //        
            //        str += '</td>';
            //
            //        var method = '<td>'
            //        if (response.datas[i]['paid_by_card'] != '')
            //            method += 'card<br/>';
            //        if (response.datas[i]['paid_by_cash'] != '')
            //            method += 'cash<br/>';
            //        if (response.datas[i]['paid_by_remit'] != '')
            //            method += 'remit<br/>';
            //        if (response.datas[i]['paid_by_card'] == '' && response.datas[i]['paid_by_cash'] == '' && response.datas[i]['paid_by_remit'] == '')
            //            method += '-<br/>';
            //        str += method.substring(0,method.length-5);
            //        str += '</td>'
            //
            //        str += '<td>' + numberWithCommas(response.datas[i]['total']) + '</td>';
            //
            //
            //    }
            //    else {
            //        str +="<td colspan='10'></td></tr>"
            //    }
            //
            //    $('#payment_table_result').append(str);
            //}

            //$('#payment_total_total').html(numberWithCommas(response.payment_total_total));

            //페이징
            $('#payment_pagnation').html('');
            str = '';
            if (response.has_previous == true) {
                str += '<li> <a onclick="search_payment(' + (response.page_number - 1) +')" style="cursor:pointer">&laquo;</a></li>';
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
                str += '<li><a onclick="search_payment(' + (response.page_number+1) + ')" style="cursor:pointer">&raquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&raquo;</span></li>';
            }
            $('#payment_pagnation').html(str);
            //그래프 연동
            //payment_set_graph(response.datas);

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}



function search_doctor_profit(page = null) {

    $.ajax({
        type: 'POST',
        url: '/manage/doctor_profit/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'start_end_date': $('#doctor_search_date').val(),
            'depart': $('#doctors_search_depart option:selected').val(),
            'doctor': $('#doctors_search_doctor option:selected').val(),
            'general': $('#doctor_search_general option:selected').val(),
            'medicine': $('#doctor_search_medicine option:selected').val(),
            'lab': $('#doctor_search_lab option:selected').val(),
            //'scaling': $('#doctor_search_scaling option:selected').val(),
            //'panorama': $('#doctor_search_panorama option:selected').val(),
            'page': page, 
        },
        dataType: 'Json',
        success: function (response) {
            $('#doctors_table_result').empty();

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
                    if (response.datas[i]['general'].length == 0) {
                        str += ' - ';
                    } else {
                        for (var j = 0; j < response.datas[i]['general'].length; j++) {
                            str += response.datas[i]['general'][j]['value'];
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
                            str += response.datas[i]['medi'][j]['value'];
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
                            str += response.datas[i]['lab'][j]['value'];
                            if (j != response.datas[i]['lab'].length - 1) {
                                str += '<br/>';
                            }
                        }
                    }
                    str += '</td></tr>';

                }
                else {
                    str += "<td colspan='8'></td></tr>"
                }

                $('#doctors_table_result').append(str);
            }
            //총 계
            //$('#doctors_table_result').empty();

            $('#subtotal_general').html(numberWithCommas(response.amount_general) + ' VND');
            $('#subtotal_medicine').html(numberWithCommas(response.amount_medicine) + ' VND');
            $('#subtotal_lab').html(numberWithCommas(response.amount_lab) + ' VND');

            set_profit_total();


            //페이징
            $('#doctors_pagnation').html('');
            str = '';
            if (response.has_previous == true) {
                str += '<li> <a onclick="search_doctor_profit(' + (response.page_number - 1) + ') style="cursor:pointer;"">&laquo;</a></li>';
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
            set_profit_total();


        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}

function set_profit_total() {
    var regex = /[^0-9]/g;




    var subtotal_general = $('#subtotal_general').html().replace(regex,'');
    var subtotal_medicine = $('#subtotal_medicine').html().replace(regex, '');
    var subtotal_lab = $('#subtotal_lab').html().replace(regex, '');
    //var subtotal_scaling = $('#subtotal_scaling').html().replace(regex, '');
    //var subtotal_panorama = $('#subtotal_panorama').html().replace(regex, '');

    var profit_general = $('#profit_general').val();
    var profit_medicine = $('#profit_medicine').val();
    var profit_lab = $('#profit_lab').val();
    //var profit_scaling = $('#profit_scaling').val();
    //var profit_panorama = $('#profit_panorama').val();

   
    var profit_total_general = subtotal_general * profit_general / 100;
    var profit_total_medicine = subtotal_medicine * profit_medicine / 100;
    var profit_total_lab = subtotal_lab * profit_lab / 100;
    //var profit_total_scaling = subtotal_scaling * profit_scaling / 100;
    //var profit_total_panorama = subtotal_panorama * profit_panorama / 100;




    $('#profit_total_general').html(numberWithCommas(profit_total_general) + ' VND');
    $('#profit_total_medicine').html(numberWithCommas(profit_total_medicine) + ' VND');
    $('#profit_total_lab').html(numberWithCommas(profit_total_lab) + ' VND');
    //$('#profit_total_scaling').html(numberWithCommas(profit_total_scaling) + ' VND');
    //$('#profit_total_panorama').html(numberWithCommas(profit_total_panorama) + ' VND');

    $('#profit_total_total').html(numberWithCommas(
        profit_total_general +
        profit_total_medicine +
        profit_total_lab) + ' VND');
        //profit_total_scaling +
        //profit_total_panorama) + ' VND');

}





function search_medicine(page = null) {
    var filter = $('#medicine_search_filter option:selected').val();
    var string = $('#medicine_search_input').val();
    var context_in_page = 10;
    
    $.ajax({
        type: 'POST',
        url: '/manage/search_medicine/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'start_end_date': $('#medicine_search_date').val(),
            'filter':filter,
            'string': string,
            'page': page, 
            'context_in_page': context_in_page,
        },
        dataType: 'Json',
        success: function (response) {
            var total_amount = 0;
            $('#medicine_table_result').empty();
            for (var i = 0; i < 10; i++) {//response.datas) {
                var str = "<tr>"
                if (response.datas[i]) {
                    str += "<td>" + response.datas[i][1]['id'] + "</td>" +
                        "<td>" + response.datas[i][1]['code'] + "</td>" +
                        "<td>" + response.datas[i][1]['name'] + "</td>" +
                        "<td>" + response.datas[i][1]['ingredient'] + "</td>" +
                        "<td>" + response.datas[i][1]['company'] + "</td>" +
                        "<td style='text-align:center;'>" + response.datas[i][1]['count'] + "</td>" +
                        "<td style='text-align:right;'>" + numberWithCommas(response.datas[i][1]['price']) + " VND</td>" +
                        "<td style='text-align:center;'>" + response.datas[i][1]['sales'] + "</td>" +
                        "<td style='text-align:right;'>" + numberWithCommas(response.datas[i][1]['total_salse']) + " VND</td></tr>";

                    total_amount += response.datas[i][1]['total_salse']
                } else {
                    str += "<td colspan='9'></td></tr>";
                    
                }
                $('#medicine_table_result').append(str);
                $('#medicine_table_total').html(numberWithCommas(total_amount) + ' VND');
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
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}

