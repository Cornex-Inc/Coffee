jQuery.browser = {};
$(function () {
    $('#id_follow_update').daterangepicker({
        autoUpdateInput: false,
        singleDatePicker: true,
        timePicker: true,
        timePicker24Hour: true,
        timePickerIncrement: 10,
        showDropdowns: true,
        drops: "up",
        locale: {
            format: 'YYYY-MM-DD HH:mm:ss',
            locale: { cancelLabel: 'Clear' }
        },
    }).on('show.daterangepicker', function (ev, picker) {
        picker.container.find(".hourselect").empty()
        picker.container.find(".hourselect").append('<option value = "9" > 9</option>');
        picker.container.find(".hourselect").append('<option value = "10" > 10</option>');
        picker.container.find(".hourselect").append('<option value = "11" > 11</option>');
        picker.container.find(".hourselect").append('<option value = "12" > 12</option>');
        picker.container.find(".hourselect").append('<option value = "13" > 13</option>');
        picker.container.find(".hourselect").append('<option value = "14" > 14</option>');
        picker.container.find(".hourselect").append('<option value = "15" > 15</option>');
        picker.container.find(".hourselect").append('<option value = "16" > 16</option>');
        picker.container.find(".hourselect").append('<option value = "17" > 17</option>');
    });
    waiting_list(true);
    $('#id_follow_update').on('apply.daterangepicker', function (ev, picker) {
        if (confirm("예약을 변경 하시겠습니까?")) {
            var reservation_date = picker.startDate.format('YYYY-MM-DD HH:mm:ss');
            var reception = $('#selected_reception').val();

            $.ajax({
                type: 'POST',
                url: '/receptionist/reservation_save/',
                data: {
                    'csrfmiddlewaretoken': $('#csrf').val(),
                    'reception': reception,
                },
                dataType: 'Json',
                success: function (response) {
                },
                error: function (request, status, error) {
                    alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

                },
            })
            $('#id_follow_update').val(picker.startDate.format('YYYY-MM-DD HH:mm:ss'));
        } 
        
    });
    $('#id_follow_update').on('cancel.daterangepicker', function (ev, picker) {
        if (confirm("예약을 취소 하시겠습니까?")) {
            var reception = $('#selected_reception').val();
            $.ajax({
                type: 'POST',
                url: '/receptionist/reservation_del/',
                data: {
                    'csrfmiddlewaretoken': $('#csrf').val(),
                    'reception': reception,
                },
                dataType: 'Json',
                success: function (response) {


                },
                error: function (request, status, error) {
                    alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

                },
            })
            $('#id_follow_update').val('');
        }
       
    });

    $('#storage_list_calendar').daterangepicker({
        showDropdowns: true,
        locale: {
            format: 'YYYY-MM-DD'
        }
    });

    $('#patient_tax_invoice_click').click(function () {
        $('#patient_tax_invoice').toggle();
    })

    $('#Bill').click(function () {
        $('.page_bill').printThis({
        });
    });


    

    $('#Report').click(function () {

        var reception_id = $('#selected_reception').val();
        if (reception_id == '') {
            alert('환자 먼저 선택');
            return;
        }

        report_list();
        $('#report_list').modal({ backdrop: 'static', keyboard: false });
        $('#report_list').modal('show');

        



        //report_id = $('#report_id').val();
        //if (report_id.trim() == '') {
        //    alert('리포트가 없음');
        //    return;
        //}
        //
        //$.ajax({
        //    type: 'POST',
        //    url: '/doctor/show_medical_report/',
        //    data: {
        //        'csrfmiddlewaretoken': $('#csrf').val(),
        //        'report_id': $('#report_id').val(),
        //    },
        //    dataType: 'Json',
        //    success: function (response) {
        //
        //        $('#patient_chart_print').html(response.patient_chart);
        //        $('#patient_name_print').html(response.patient_name_eng + ' ' + response.patient_name);
        //        $('#patient_ID_print').html(response.patient_ID);
        //        $('#patient_gender_print').html(response.patient_gender);
        //        $('#patient_age_print').html(response.patient_age);
        //        $('#patient_date_of_birth_print').html(response.patient_date_of_birth);
        //        $('#patient_address_print').html(response.patient_phone);
        //
        //        $('#reception_report_print').html(response.reception_report);
        //        $('#reception_usage_print').html(response.reception_usage);
        //
        //        $('#publication_date_print').html(response.publication_date);
        //        $('#date_of_hospitalization_print').html(response.date_of_hospitalization);
        //
        //        $('#recept_date').html(response.recept_date);
        //
        //
        //        $('.page').printThis({
        //            importCSS: true,
        //            loadCSS: "static/css/report.css",
        //            debug: true,
        //        });
        //
        //    },
        //    error: function (request, status, error) {
        //        alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        //
        //    },
        //})
    });

});


function report_list(page = null) {
    var reception_id = $('#selected_reception').val();
    var context = 5;
    $.ajax({
        type: 'POST',
        url: '/receptionist/report_list/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'reception_id': reception_id,
            'page': page,
            'context': context,
        },
        dataType: 'Json',
        success: function (response) {
            $("#Report_List").empty();
            for (var i = 0; i < context; i++) {
                var str = '';
                if (response.datas[i]) {
                    str += '<tr style="cursor:pointer; height:6.4vh;" onclick="report_select(' + response.datas[i].id + ')"><td>' + response.datas[i].chart + '</td>' +
                        '<td>' + response.datas[i].name_eng + '<br/>' + response.datas[i].name_kor + '</td>' +
                        '<td>' + response.datas[i].date_of_birth + '</td>' +
                        '<td>' + response.datas[i].depart + '</td>' +
                        '<td>' + response.datas[i].doctor + '</td>' +
                        '<td>' + response.datas[i].hospitalization + '</td></td>';
                }
                else {
                    str += '<tr style="height:6.4vh;"><td colspan="6"></td></tr>'
                }
                $("#Report_List").append(str);
            }

            //페이징
            $('#report_pagnation').html('');
            str = '';
            if (response.has_previous == true) {
                str += '<li> <a onclick="report_list(' + (response.page_number - 1) + ')">&laquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&laquo;</span></li>';
            }
            for (var i = response.page_range_start; i < response.page_range_stop; i++) {
                if (response.page_number == i) {
                    str += '<li class="active"><span>' + i + ' <span class="sr-only">(current)</span></span></li>';
                }
                else if (response.page_number + 5 > i && response.page_number - 5 < i) {
                    str += '<li> <a onclick="report_list(' + i + ')">' + i + '</a></li>';
                }
                else {
                }
            }
            if (response.has_next == true) {
                str += '<li><a onclick="report_list(' + (response.page_number + 1) + ')">&raquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&raquo;</span></li>';
            }
            $('#report_pagnation').html(str);
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}

function report_select(report_id) {
    $.ajax({
        type: 'POST',
        url: '/doctor/show_medical_report/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'report_id': report_id,
        },
        dataType: 'Json',
        success: function (response) {

            $('#patient_chart_print').html(response.patient_chart);
            $('#patient_name_print').html(response.patient_name_eng + ' ' + response.patient_name);
            $('#patient_ID_print').html(response.patient_ID);
            $('#patient_gender_print').html(response.patient_gender);
            $('#patient_age_print').html(response.patient_age);
            $('#patient_date_of_birth_print').html(response.patient_date_of_birth);
            $('#patient_address_print').html(response.patient_phone);

            $('#reception_report_print').html(response.reception_report);
            $('#reception_usage_print').html(response.reception_usage);

            $('#publication_date_print').html(response.publication_date);
            $('#date_of_hospitalization_print').html(response.date_of_hospitalization);

            $('#recept_date').html(response.recept_date);


            $('.page_report').printThis({
            });

        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function worker_on(path) {

    if (window.Worker) {
        w = new Worker(path);
        w.onmessage = function (event) {
            get_today_list();
        };

    }
}

function waiting_selected(paymentrecord_id) {
    $.ajax({
        type: 'POST',
        url: '/receptionist/waiting_selected/',
        
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'paymentrecord_id': paymentrecord_id,
            
        },
        dataType: 'Json',
        success: function (response) {
            $('#selected_reception').val(response.reception_id);

            $('#storage_bills tbody').empty();
            $('#patient_name').val(response.datas['name_kor'] + ' / ' + response.datas['name_eng']);
            $('#patient_date_of_birth').val(response.datas['date_of_birth']);
            $('#patient_phone').val(response.datas['phone']);
            $('#patient_address').val(response.datas['address']);
            $('#patient_doctor').val(response.datas['doctor_kor'] + ' / ' + response.datas['doctor_eng']  )
            $('#id_follow_update').val(response.datas['reservation']);
            
            var recepts_table = '';
            var str = '';
            var no = 1;
            if (response.datas['exams'].length != 0) {
                
                for (var i in response.datas['exams']) {
                    str += "<tr><td style='width: 300px;'>&nbsp;&nbsp;" + response.datas['exams'][i].code + " / " + response.datas['exams'][i].name + "</td>" +
                        "<td style='width: 80px;'></td>" +
                        "<td style='text-align:right; padding-right:10px;'>" + numberWithCommas(response.datas['exams'][i].price) + "</td>" +
                        "<td ></td>" +
                        "<td style='text-align:right; padding-right:10px;'>" + numberWithCommas(response.datas['exams'][i].price) + " VND</td></tr>";

                    recepts_table += '<tr><td>' + no + '</td>' +
                        '<td colspan="2">' + response.datas['exams'][i].name + '</td>' +
                        '<td>' + numberWithCommas(response.datas['exams'][i].price) + '</td>' +
                        '<td></td>' +
                        '<td>' + numberWithCommas(response.datas['exams'][i].price) + '</td></tr>';

                    no += 1;
                }
            }

            if (response.datas['tests'].length != 0) {
                
                
                for (var i in response.datas['tests']) {
                    str += "<tr><td style='width: 300px;'>&emsp;" + response.datas['tests'][i].code+" / " + response.datas['tests'][i].name + "</td>" +
                        "<td style='width: 80px;'></td>" +
                        "<td style='text-align:right; padding-right:10px;'>" + numberWithCommas(response.datas['tests'][i].price) + "</td>" +
                        "<td ></td>" +
                        "<td style='text-align:right; padding-right:10px;'>" + numberWithCommas(response.datas['tests'][i].price) + " VND</td></tr>";

                    recepts_table += '<tr><td>' + no + '</td>' +
                        '<td colspan="2">' + response.datas['tests'][i].name + '</td>' +
                        '<td>' + numberWithCommas(response.datas['tests'][i].price) + '</td>' +
                        '<td></td>' +
                        '<td>' + numberWithCommas(response.datas['tests'][i].price) + '</td></tr>';

                    no += 1;
                }
            }
            if (response.datas['precedures'].length != 0) {
                //str += '<tr><td colspan="3">Precedure</td></tr>';
                for (var i in response.datas['precedures']) {
                    str += "<tr><td style='width: 300px;'>&emsp;" + response.datas['precedures'][i].code + " / " +
                        response.datas['precedures'][i].name + "</td>" +
                        "<td style='width: 80px;'></td>" +
                        "<td style='text-align:right; padding-right:10px;'>" + numberWithCommas(response.datas['precedures'][i].price) + "</td>" +
                        "<td ></td>" +
                        "<td style='text-align:right; padding-right:10px;'>" + numberWithCommas(response.datas['precedures'][i].price) + " VND</td></tr>";


                    recepts_table += '<tr><td>' + no + '</td>' +
                        '<td colspan="2">' + response.datas['precedures'][i].name + '</td>' +
                        '<td>' + numberWithCommas(response.datas['precedures'][i].price) + '</td>' +
                        '<td></td>' +
                        '<td>' + numberWithCommas(response.datas['precedures'][i].price) + '</td></tr>';

                    no += 1;
                }
            }
            
            if (response.datas['medicines'].length != 0) {
                var medication_total = 0;
                //str += '<tr><td colspan="3">Medicine</td></tr>';
                for (var i in response.datas['medicines']) {
                    str += "<tr class='medication_contents'><td style='width: 300px;'>&emsp;" + response.datas['medicines'][i].code + " / " + response.datas['medicines'][i].name + "</td>" +
                        "<td style='width: 80px;'></td>" +
                        "<td style='text-align:right; padding-right:10px;'>" + numberWithCommas(response.datas['medicines'][i].unit) + "</td>" +
                        "<td style='text-align:center; vertical-align:middle;'>" + response.datas['medicines'][i].quantity + "</td>" +
                        "<td style='text-align:right; padding-right:10px;'>" + numberWithCommas(response.datas['medicines'][i].price) + " VND</td></tr>";


                    recepts_table += "<tr class='chart_table_medicine_contents'><td>" + no + "</td>" +
                        "<td colspan='2'>" + response.datas['medicines'][i].name + "</td>" +
                        "<td>" + numberWithCommas(response.datas['medicines'][i].unit) + "</td>" +
                        "<td>" + response.datas['medicines'][i].quantity + "</td>" +
                        "<td>" + numberWithCommas(response.datas['medicines'][i].price) + "</td></tr>";


                    no += 1;
                    medication_total += response.datas['medicines'][i].unit * response.datas['medicines'][i].quantity
                }

                recepts_table += '<tr class="chart_table_contents_items_shortcut"><td></td>' +
                    '<td colspan="2">Medicine</td>' +
                    '<td></td>' +
                    "<td></td>" +
                    '<td>' + numberWithCommas(medication_total) + '</td></tr>';

                
                str += '<tr class="medication_shortcut"><td>&emsp;Medicine</td>' +
                    '<td>' + '</td>' +
                    '<td>' + '</td>' +
                    '<td>' + '</td>' +
                    '<td style="text-align:right; padding-right:10px;">' + numberWithCommas(medication_total) +' VND</td></tr>';
            }

            str += "<tr><td></td><td></td><td style='text-align:center; font-weight:bold;'>Discount</td>"+
                '<td><input type="text" id="discount_input" class="form-control" style="display:inline; width:2.5vw; height:3.4vh;" aria-describedby="basic-addon1" value="' + response.datas['discount'] +'" /> %</td>' +
                '<td id="discount_show" style="text-align:right; padding-right: 0.6vw;"></td>';

            str += "<tr><td></td><td></td><td style='text-align:center;font-weight:bold;' >Total</td>" +
                "<td id='discount_total' colspan='2'style='text-align:right; padding-right:0.6vw;'>" +
                numberWithCommas(Number(response.datas['unpaid_total'] + response.datas['paid'])) + " VND</td></tr >";

            str += "<tr><td></td><td></td><td style='text-align:center;font-weight:bold;' >Paid</td>" +
                "<td id='discount_paid' colspan='2'style='text-align:right; padding-right:0.6vw;'>" + numberWithCommas(response.datas['paid']) + " VND</td></tr >";
             
            str += "<tr><td></td><td></td><td style='text-align:center;font-weight:bold;' >Unpaid</td>" +
                "<td id='discount_unpaid' colspan='2'style='text-align:right; padding-right:0.6vw;'>" + numberWithCommas(response.datas['unpaid_total']) + " VND</td></tr >";



            $('#storage_bills').append(str);
            $('#total_amount').val(numberWithCommas(response.datas['unpaid_total']));
            //get_bill_list(reception_id);

            $('#discount_input').keyup(function () {
                var regex = /[^0-9]/g;
                var discount = $('#discount_input').val();
                var total_aount = $('#total_amount').val();
                total_aount = total_aount.replace(regex, '');
                discount = discount.replace(regex, '');
                $('#discount_input').val(discount);
                if (total_aount != '' || discount != '') {
                    if (discount > 100) {
                        discount = 100
                        $('#discount_input').val(discount);
                    }
                    
                    discount = discount / 100;
                    var totalValue = total_aount - (total_aount * discount)
                    $('#discount_show').html(numberWithCommas((total_aount * discount)) + ' VND');
                    $('#discount_total').html(numberWithCommas((totalValue.toFixed(0)) + ' VND'));

                    $('#chart_table_discount').html($('#discount_input').val() + '%');
                    $('#chart_table_discount_amount').html(numberWithCommas((total_aount * discount)) )
                    $('#chart_table_total').html(numberWithCommas((totalValue.toFixed(0))));
                }

            });

            $('#chart_table_contents_items').empty();
            $('#chart_table_contents_items').append(recepts_table);


            $('.medication_contents').hide();
            $('.chart_table_medicine_contents').hide();
            

            $('#chart_table_discount').html('0%');
            $('#chart_table_discount_amount').html('0')
            $('#chart_table_total').html(numberWithCommas(response.datas['unpaid_total']));


            //tax invoice
            $('#tax_invoice_number').val(response.tax_invoice_number);
            $('#tax_invoice_company_name').val(response.tax_invoice_company_name);
            $('#tax_invoice_address').val(response.tax_invoice_address);


            $('#report_id').val(response.report);


            $('#show_medication_contents').click(function () {
                if ($(this).is(":checked")) {
                    $('.medication_contents').show();
                    $('.medication_shortcut').hide();
                    $('.chart_table_medicine_contents').show();
                    $('.chart_table_contents_items_shortcut').hide();
                   
                } else {
                    $('.medication_contents').hide();
                    $('.medication_shortcut').show();
                    $('.chart_table_contents_items_shortcut').show();
                    $('.chart_table_medicine_contents').hide();
                }
            })
            $("#discount_input").prop('disabled', true);
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}



function get_bill_list(reception_id) {
    $('#table_tbody_bill_list').empty();
    $.ajax({
        type: 'POST',
        url: '/receptionist/get_bill_list/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'reception_id': reception_id,
        },
        dataType: 'Json',
        success: function (response) {
            var total_outstanding_amount = 0;
            for (var i in response.datas) {
                var str = '<tr><td colspan="2">' + response.datas[i]['date'] + '</td>' +
                    '<td>' + response.datas[i]['total'] + '</td>' +
                    '<td>' + response.datas[i]['unpaid'] + '</td></tr>';
                total_outstanding_amount += response.datas[i]['unpaid'];
                for (var j in response.datas[i]['paymentrecords']) {
                    str += '<tr><td></td>' +
                        '<td colspan="2">' + response.datas[i]['paymentrecords'][j]['date'] + '</td>' +
                        '<td>' + response.datas[i]['paymentrecords'][j]['paid'] + ' / ' + response.datas[i]['paymentrecords'][j]['method'] + '</td></tr>';
                }
                $('#table_tbody_bill_list').append(str);
            }
            $('#total_outstanding_amount').html(total_outstanding_amount);
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}

function waiting_list(Today = false) {
    var date, start, end;

    if (Today == true) {
        start = today = moment().format('YYYY[-]MM[-]DD');
        end = today = moment().format('YYYY[-]MM[-]DD');
    } else {
        date = $('#storage_list_calendar').val();
        start = date.split(' - ')[0];
        end = date.split(' - ')[1];
    }



    $.ajax({
        type: 'POST',
        url: '/receptionist/waiting_list/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'start_date': start,
            'end_date': end,
            'string': $('#storage_search_input').val(),
            'filter': $('#storage_search_select option:selected').val(),
        },
        dataType: 'Json',
        success: function (response) {
            $('#storage_list_table > tbody ').empty();
            for (var i = 0; i < response.datas.length; i++) {
                var tr_class = "";
                if (response.datas[i]['status'] == 'unpaid')
                    tr_class = "class ='success'"
                else if (response.datas[i]['status'] == 'paid')
                    tr_class = "class ='danger'"

                var str = "<tr " + tr_class + "style='cursor:pointer;' onclick='waiting_selected(" + response.datas[i]['paymentrecord_id'] + ")'>" +
                    "<td>" + Number(i + 1) + "</td>";
                if (response.datas[i]['is_unpaid']) {
                    str += "<td style='color:red;'>";
                } else {
                    str += "<td>";
                }
                    str += response.datas[i]['chart'] + "</td>" +
                    "<td>" + response.datas[i]['name_kor'] + '<br/>' + response.datas[i]['name_eng'] + "</td>" +
                    "<td>" + response.datas[i]['date'] + "</td>" +
                    "<td>" + response.datas[i]['Depart'] + '<br/>' + response.datas[i]['Doctor'] + "</td>" +
                    "<td>" + response.datas[i]['paid'] + '</td>' +
                    "<td>" + response.datas[i]['unpaid_total'] + '</td>' +
                    "<td>" + Number(response.datas[i]['unpaid_total'] + response.datas[i]['paid'])+ '</td></td>'; 

                        //"<td>" + numberWithCommas(response.datas[i]['total_amount']) + "VND</td></tr>";
                    

                $('#storage_list_table').append(str);
            }
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}



function get_today_list() {
    $.ajax({
        type: 'POST',
        url: '/receptionist/get_today_list/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
        },
        dataType: 'Json',
        success: function (response) {
            $('#storage_today_table > tbody ').empty();
            for (var i in response.datas) {
                var tr_class = "";
                if (response.datas[i]['status'] == 'unpaid')
                    tr_class = "class ='success'"
                else if (response.datas[i]['status'] == 'paid')
                    tr_class = "class ='danger'"

                var str = "<tr " + tr_class + "style='cursor:pointer;' onclick='get_today_selected(" + response.datas[i]['reception_id'] + ")'>" +
                    "<td>" + Number(i + 1) + "</td>" +
                    "<td>" + response.datas[i]['chart'] + "</td>" +
                    "<td>" + response.datas[i]['name_kor'] + '<br/>' + response.datas[i]['name_eng'] + "</td>" +
                    "<td>" + response.datas[i]['Depart'] + '<br/>' + response.datas[i]['Doctor'] + "</td>" +
                    "<td>" + response.datas[i]['DateTime'] + "</td></tr>";

                $('#storage_today_table').append(str);
            }
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}

function get_today_selected(reception_id) {
    $.ajax({
        type: 'POST',
        url: '/receptionist/get_today_selected/',

        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'reception_id': reception_id,

        },
        dataType: 'Json',
        success: function (response) {
            $('#selected_reception').val(reception_id);

            $('#storage_bills tbody').empty();
            $('#patient_name').val(response.datas['name_kor'] + ' / ' + response.datas['name_eng']);
            $('#patient_date_of_birth').val(response.datas['date_of_birth']);
            $('#patient_phone').val(response.datas['phone']);
            $('#patient_address').val(response.datas['address']);
            $('#patient_doctor').val(response.datas['doctor_kor'] + ' / ' + response.datas['doctor_eng'])
            $('#id_follow_update').val(response.datas['reservation']);

            var recepts_table = ''
            var str = ''
            var no = 1;
            if (response.datas['exams'].length != 0) {
               
                
                for (var i in response.datas['exams']) {
                    str += "<tr><td style='width: 300px;'>&nbsp;&nbsp;" + response.datas['exams'][i].code + " / " + response.datas['exams'][i].name + "</td>" +
                        "<td style='width: 80px;'></td>" +
                        "<td style='text-align:right; padding-right:10px;'>" + numberWithCommas(response.datas['exams'][i].price) + "</td>" +
                        "<td ></td>" +
                        "<td style='text-align:right; padding-right:10px;'>" + numberWithCommas(response.datas['exams'][i].price) + " VND</td></tr>";

                    recepts_table += '<tr><td>' + no + '</td>' +
                        '<td colspan="2">' + response.datas['exams'][i].name + '</td>' +
                        '<td>' + numberWithCommas(response.datas['exams'][i].price) + '</td>' +
                        '<td></td>' +
                        '<td>' + numberWithCommas(response.datas['exams'][i].price) + '</td></tr>';

                    no += 1;
                }
            }
            if (response.datas['tests'].length != 0) {
                
                for (var i in response.datas['tests']) {
                    str += "<tr><td style='width: 300px;'>&nbsp;&nbsp;" + response.datas['tests'][i].code + " / " + response.datas['tests'][i].name + "</td>" +
                        "<td style='width: 80px;'></td>" +
                        "<td style='text-align:right; padding-right:10px;'>" + numberWithCommas(response.datas['tests'][i].price) + "</td>" +
                        "<td ></td>" +
                        "<td style='text-align:right; padding-right:10px;'>" + numberWithCommas(response.datas['tests'][i].price) + " VND</td></tr>";

                    recepts_table += '<tr><td>' + no + '</td>' +
                        '<td colspan="2">' + response.datas['tests'][i].name + '</td>' +
                        '<td>' + numberWithCommas(response.datas['tests'][i].price) + '</td>' +
                        '<td></td>' +
                        '<td>' + numberWithCommas(response.datas['tests'][i].price) + '</td></tr>';

                    no += 1;
                }
            }
            if (response.datas['precedures'].length != 0) {
                //str += '<tr><td colspan="3">Precedure</td></tr>';
                for (var i in response.datas['precedures']) {
                    str += "<tr><td style='width: 300px;'>&emsp;" + response.datas['precedures'][i].code + " / " +
                        response.datas['precedures'][i].name + "</td>" +
                        "<td style='width: 80px;'></td>" +
                        "<td style='text-align:right; padding-right:10px;'>" + numberWithCommas(response.datas['precedures'][i].price) + "</td>" +
                        "<td ></td>" +
                        "<td style='text-align:right; padding-right:10px;'>" + numberWithCommas(response.datas['precedures'][i].price) + " VND</td></tr>";


                    recepts_table += '<tr><td>' + no + '</td>' +
                        '<td colspan="2">' + response.datas['precedures'][i].name + '</td>' +
                        '<td>' + numberWithCommas(response.datas['precedures'][i].price) + '</td>' +
                        '<td></td>' +
                        '<td>' + numberWithCommas(response.datas['precedures'][i].price) + '</td></tr>';

                    no += 1;
                }
            }

            if (response.datas['medicines'].length != 0) {
                var medication_total = 0;
                //str += '<tr><td colspan="3">Medicine</td></tr>';
                for (var i in response.datas['medicines']) {
                    str += "<tr class='medication_contents'><td style='width: 300px;'>&emsp;" + response.datas['medicines'][i].code + " / " + response.datas['medicines'][i].name + "</td>" +
                        "<td style='width: 80px;'></td>" +
                        "<td style='text-align:right; padding-right:10px;'>" + numberWithCommas(response.datas['medicines'][i].unit) + "</td>" +
                        "<td style='text-align:center; vertical-align:middle;'>" + response.datas['medicines'][i].quantity + "</td>" +
                        "<td style='text-align:right; padding-right:10px;'>" + numberWithCommas(response.datas['medicines'][i].price) + " VND</td></tr>";


                    recepts_table += "<tr class='chart_table_medicine_contents'><td>" + no + "</td>" +
                        "<td colspan='2'>&emsp;" + response.datas['medicines'][i].name + "</td>" +
                        "<td>" + numberWithCommas(response.datas['medicines'][i].unit) + "</td>" +
                        "<td>" + response.datas['medicines'][i].quantity + "</td>" +
                        "<td>" + numberWithCommas(response.datas['medicines'][i].price) + "</td></tr>";

                    no += 1;
                    medication_total += response.datas['medicines'][i].unit * response.datas['medicines'][i].quantity
                }

                recepts_table += '<tr class="chart_table_contents_items_shortcut"><td></td>' +
                    '<td colspan="2">Medicine</td>' +
                    '<td></td>' +
                    "<td></td>" +
                    '<td>' + numberWithCommas(medication_total) + '</td></tr>';


                str += '<tr class="medication_shortcut"><td>&emsp;Medicine</td>' +
                    '<td>' + '</td>' +
                    '<td>' + '</td>' +
                    '<td>' + '</td>' +
                    '<td style="text-align:right; padding-right:10px;">' + numberWithCommas(medication_total) + ' VND</td></tr>';
            }

            str += "<tr><td></td><td></td><td style='text-align:center; font-weight:bold;'>Discount</td>" +
                '<td><input type="text" id="discount_input" class="form-control" style="display:inline; width:2.5vw; height:3.4vh;" aria-describedby="basic-addon1" value="' + response.datas['discount'] +'"/> %</td>' +
                '<td id="discount_show" style="text-align:right; padding-right:0.6vw;"></td>';

            str += "<tr><td></td><td></td><td style='text-align:center;font-weight:bold;' >Total</td>" +
                "<td id='discount_total' colspan='2'style='text-align:right; padding-right:0.6vw;'>" + numberWithCommas(response.datas['total_amount']) + " VND</td></tr >";

            str += "<tr><td></td><td></td><td style='text-align:center;font-weight:bold;' >Paid</td>" +
                "<td id='discount_paid' colspan='2'style='text-align:right; padding-right:0.6vw;'>" + numberWithCommas(response.datas['paid']) + " VND</td></tr >";
            
            str += "<tr><td></td><td></td><td style='text-align:center;font-weight:bold;' >Unpaid</td>" +
                "<td id='discount_unpaid' colspan='2'style='text-align:right; padding-right:0.6vw;'>" + numberWithCommas(response.datas['unpaid']) + " VND</td></tr >";

            

            $('#storage_bills').append(str);
            $('#total_amount').val(numberWithCommas(response.datas['total_amount']));
            //get_bill_list(reception_id);

            $('#discount_input').keyup(function () {
                var regex = /[^0-9]/g;
                var discount = $('#discount_input').val();
                var total_aount = $('#total_amount').val();
                total_aount = total_aount.replace(regex, '');
                discount = discount.replace(regex, '');
                $('#discount_input').val(discount);
                if (total_aount != '' || discount != '') {
                    if (discount > 100) {
                        discount = 100
                        $('#discount_input').val(discount);
                    }

                    discount = discount / 100;
                    var totalValue = total_aount - (total_aount * discount)
                    $('#discount_show').html(numberWithCommas((total_aount * discount)) + ' VND');
                    $('#discount_total').html(numberWithCommas((totalValue.toFixed(0)) + ' VND'));

                    $('#chart_table_discount').html($('#discount_input').val() + '%');
                    $('#chart_table_discount_amount').html(numberWithCommas((total_aount * discount)))
                    $('#chart_table_total').html(numberWithCommas((totalValue.toFixed(0))));

                    $('#discount_unpaid').html(numberWithCommas(totalValue - response.datas['paid']) + ' VND'   );
                }

            });

            $('#recept_patient').html(response.datas['name_kor'] + ' / ' + response.datas['name_eng']);
            $('#recept_date').html(response.datas['date']);
            $('#recept_doctor').html(response.datas['doctor_eng']);
            
            $('#chart_table_contents_items').empty();
            $('#chart_table_contents_items').append(recepts_table);

            $('.medication_contents').hide();
            $('.chart_table_medicine_contents').hide();
            
            $('#chart_table_discount').html($('#discount_input').val() + '%');
            $('#chart_table_discount_amount').html('0')
            $('#chart_table_total').html(numberWithCommas(response.datas['total_amount']));


            //tax invoice
            $('#tax_invoice_number').val(response.tax_invoice_number);
            $('#tax_invoice_company_name').val(response.tax_invoice_company_name);
            $('#tax_invoice_address').val(response.tax_invoice_address);


            $('#report_id').val(response.report);


            $('#show_medication_contents').click(function () {
                if ($(this).is(":checked")) {
                    $('.medication_contents').show();
                    $('.medication_shortcut').hide();
                    $('.chart_table_medicine_contents').show();
                    $('.chart_table_contents_items_shortcut').hide();
                   
                } else {
                    $('.medication_contents').hide();
                    $('.medication_shortcut').show();
                    $('.chart_table_contents_items_shortcut').show();
                    $('.chart_table_medicine_contents').hide();
                }
            })

            $("#discount_input").prop('disabled', false);
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}


function save_storage() {
    if ($('#selected_reception').val().trim = '') {
        alert('환자 먼저 선택');
        return;
    }

    paid = $('#id_pay').val();

    amount = $('#total_amount').val();

    $.ajax({
        type: 'POST',
        url: '/receptionist/storage_page_save/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'reception_id': $('#selected_reception').val(),
            'paid': $('#id_pay').val(),
            'method': $('#id_payment_info option:selected').val(),
            'discount': $('#discount_input').val(),
            'total': $("#discount_total").html(),
        },
        dataType: 'Json',
        success: function (response) {
            if (response.result == 'paid') {
                alert('already paid.');
                waiting_list(true);
            } else if (response.result == 'overflowed') {
                alert('Payment amount should be lower than remaining.')
            } else {
                alert('paid')
            }
            
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })


}

//index.html end