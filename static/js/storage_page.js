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
        picker.container.find(".hourselect").append('<option value = "9" selected> 9</option>');
        picker.container.find(".hourselect").append('<option value = "10" > 10</option>');
        picker.container.find(".hourselect").append('<option value = "11" > 11</option>');
        picker.container.find(".hourselect").append('<option value = "12" > 12</option>');
        picker.container.find(".hourselect").append('<option value = "13" > 13</option>');
        picker.container.find(".hourselect").append('<option value = "14" > 14</option>');
        picker.container.find(".hourselect").append('<option value = "15" > 15</option>');
        picker.container.find(".hourselect").append('<option value = "16" > 16</option>');
        picker.container.find(".hourselect").append('<option value = "17" > 17</option>');
    });
    
    $('#id_follow_update').on('apply.daterangepicker', function (ev, picker) {
        var hour = picker.container.find(".hourselect").children("option:selected").val();
        if (hour < 9)
            hour = 9;
        else if (hour > 18)
            hour = 18;
        picker.startDate.set({ hour: hour, });
        $('#id_follow_update').val(picker.startDate.format('YYYY-MM-DD HH:mm:ss'));
        if (confirm(gettext("Do you want to change reservation?"))) {
            var reservation_date = picker.startDate.format('YYYY-MM-DD HH:mm:ss');
            var reception = $('#selected_reception').val();

            $.ajax({
                type: 'POST',
                url: '/receptionist/reservation_save/',
                data: {
                    'csrfmiddlewaretoken': $('#csrf').val(),
                    'reception': reception,
                    'reservation_date': reservation_date,
                },
                dataType: 'Json',
                success: function (response) {
                },
                error: function (request, status, error) {
                    console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

                },
            })
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
                    console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

                },
            })
            $('#id_follow_update').val('');
        }
       
    });

    $('#storage_list_calendar_start').daterangepicker({
        singleDatePicker:true,
        showDropdowns: true,
        locale: {
            format: 'YYYY-MM-DD'
        }
    });
    $('#storage_list_calendar_end').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        locale: {
            format: 'YYYY-MM-DD'
        }
    });
    $("#storage_list_calendar_start, #storage_list_calendar_end, #reception_waiting_depart").change(function () {

        waiting_list();
    });


    $('#patient_tax_invoice_click').click(function () {
        $('#patient_tax_invoice').toggle();
    })

    $('#Bill').click(function () {
        id = $("#selected_reception").val();

        $("#dynamic_div").html('');
        $('#dynamic_div').load('/receptionist/document_medical_receipt_old/' + id);

        $('#dynamic_div').printThis({
        });


        //$('.page_bill').printThis({
        //});
    });


    $('#showpayments').click(function () {
        var reception_id = $('#selected_reception').val();
        if (reception_id == '') {
            alert(gettext('Select patient first.'));
            return;
        }
        payment_record_list();
        $('#payment_list').modal({ backdrop: 'static', keyboard: false });
        $('#payment_list').modal('show');

    });



    $('#Report').click(function () {
        var reception_id = $('#selected_reception').val();
        if (reception_id == '') {
            alert(gettext('Select patient first.'));
            return;
        }

        report_list();
        $('#report_list').modal({ backdrop: 'static', keyboard: false });
        $('#report_list').modal('show');

       
    });



    $('#depart_select').change(function() {
        get_today_list();

    });


    $('#storage_search_input').keydown(function (key) {
        if (key.keyCode == 13) {
            waiting_list();
        }
    })

    waiting_list();
});


function get_patient_past(reception_id) {
    $.ajax({
        type: 'POST',
        url: '/receptionist/get_patient_past/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'reception_id': reception_id,
        },
        dataType: 'Json',
        success: function (response) {
            $('#storage_list_table > tbody ').empty();
            for (var i = 0; i < response.datas.length; i++) {
                var tr_class = "";
                if (response.datas[i]['status'] == 'unpaid')
                    tr_class = "class ='warning'"
                //else if (response.datas[i]['status'] == 'paid')
                //    tr_class = "class ='success'"


                var str = "<tr " + tr_class + "style='cursor:pointer;'";
                if (response.datas[i]['paymentrecord_id']) {
                    str += "onclick='waiting_selected(" + response.datas[i]['paymentrecord_id'] + ")'>";
                }
                else {
                    str += "onclick='get_today_selected(" + response.datas[i]['reception_id'] + ")'>";
                }
                str += "<td style='vertical-align:middle;'>" + (parseInt(i) + 1) + "</td>";
                if (response.datas[i]['has_unpaid']) {
                    str += "<td style='color:rgb(228,97,131); vertical-align:middle;''>";
                } else {
                    str += "<td style='vertical-align:middle;'>";
                }
                str += response.datas[i]['chart'] + "</td>" +
                    "<td style='vertical-align:middle;' >" + response.datas[i]['name_kor'] + '<br/>' + response.datas[i]['name_eng'] + "</td>" +
                    "<td style='vertical-align:middle;' >" + response.datas[i]['date'] + "</td>" +
                    "<td style='vertical-align:middle;' >" + response.datas[i]['Depart'] + '<br/>' + response.datas[i]['Doctor'] + "</td>" +
                    "<td style='vertical-align:middle;' >" + numberWithCommas(response.datas[i]['paid']) + '</td>' +
                    "<td style='vertical-align:middle;' >" + numberWithCommas(Number(response.datas[i]['unpaid_total'])) + '</td></td>';

                //"<td>" + numberWithCommas(response.datas[i]['total_amount']) + "VND</td></tr>";


                $('#storage_list_table').append(str);
            }

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}


function delete_payment(record_id) {
    if (confirm('Delete This Record?')) {
        $.ajax({
            type: 'POST',
            url: '/receptionist/delete_payment/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),
                'record_id': record_id,
            },
            dataType: 'Json',
            success: function (response) {
                

                alert(gettext('Deleted'));
                payment_record_list();
            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        });
    }
}

function payment_record_list(page = null) {
    var reception_id = $('#selected_reception').val();
    var context = 5;

    $.ajax({
        type: 'POST',
        url: '/receptionist/payment_record_list/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'reception_id': reception_id,
            'page': page,
            'context': context,
        },
        dataType: 'Json',
        success: function (response) {
            $("#payment_record").empty();
            for (var i = 0; i < context; i++) {
                var str = '';
                if (response.datas[i]) {
                    str += '<tr><td>' + response.datas[i].chart + '</td>' +
                        '<td>' + response.datas[i].name_eng + '<br/>' + response.datas[i].name_kor + '</td>' +
                        '<td>' + response.datas[i].date + '</td>' +
                        '<td>' + response.datas[i].paid + '</td>' +
                        '<td>' + response.datas[i].method + '</td>' +
                        '<td style="cursor:pointer; vertical-align:middle;" onclick="delete_payment(' + response.datas[i].id + ')">X</td > ';
                }
                else {
                    str += '<tr><td colspan="6"></td></tr>'
                }
                $("#payment_record").append(str);
            }

            //페이징
            $('#record_pagnation').html('');
            str = '';
            if (response.has_previous == true) {
                str += '<li> <a onclick="payment_record_list(' + (response.page_number - 1) + ')">&laquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&laquo;</span></li>';
            }
            for (var i = response.page_range_start; i < response.page_range_stop; i++) {
                if (response.page_number == i) {
                    str += '<li class="active" id="record_list_page"><span>' + i + ' <span class="sr-only">(current)</span></span></li>';
                }
                else if (response.page_number + 5 > i && response.page_number - 5 < i) {
                    str += '<li> <a onclick="payment_record_list(' + i + ')">' + i + '</a></li>';
                }
                else {
                }
            }
            if (response.has_next == true) {
                str += '<li><a onclick="payment_record_list(' + (response.page_number + 1) + ')">&raquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&raquo;</span></li>';
            }
            $('#record_pagnation').html(str);
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    });
}


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
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

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
            $('#patient_serial_print').html(response.serial);
            $('#patient_name_print').html(response.patient_name_eng + ' ' + response.patient_name);
            $('#patient_ID_print').html(response.patient_ID);
            $('#patient_gender_print').html(response.patient_gender);
            $('#patient_age_print').html(response.patient_age + ' 세');
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
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

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
            $('#patient_doctor').val(response.datas['doctor_kor'] + ' / ' + response.datas['doctor_eng'])
            $('#id_follow_update').val(response.datas['reservation']);
            $('#recommendation').val(response.datas['recommendation']);

            $('#need_invoice').prop('checked', response.need_invoice);
            $('#need_insurance').prop('checked', response.need_invoice);

            $("#storage_memo").val(response.datas['payment_memo']);

            var recepts_table = '';
            var str = '';
            var no = 1;
            if (response.datas['exams'].length != 0) {
                
                for (var i in response.datas['exams']) {
                    str += "<tr><td style='width: 380px;' colspan='2'><label class='check_discount_label'><input type='checkbox' id='exam_item_" + response.datas['exams'][i].manager_id + "' class='discount_item'";
                    if (response.datas['exams'][i].is_checked == 'True') {
                        str += ' checked ';
                    }
                    str += "/>" + response.datas['exams'][i].code + " / " + response.datas['exams'][i].name + "</label ></td > " +
                        //"<td style='width: 80px;'></td>" +
                        "<td style='text-align:right; vertical-align:middle; padding-right:10px;'>" + numberWithCommas(response.datas['exams'][i].price) + "</td>" +
                        "<td ></td>" +
                        "<td style='text-align:right; vertical-align:middle; padding-right:10px;'>" + numberWithCommas(response.datas['exams'][i].price) + " VND</td></tr>";

                    recepts_table += '<tr>  ' +
                        '<td colspan="2">' + response.datas['exams'][i].name + '</td>' +
                        '<td style="text-align:right;">' + numberWithCommas(response.datas['exams'][i].price) + '</td>' +
                        '<td></td>' +
                        '<td style="text-align:right;">' + numberWithCommas(response.datas['exams'][i].price) + '</td><td></td></tr>';

                    no += 1;
                }
            }

            if (response.datas['tests'].length != 0) {
                for (var i in response.datas['tests']) {
                    str += "<tr><td style='width: 300px;' colspan='2'<label class='check_discount_label'><input type='checkbox' id='exam_item_" + response.datas['tests'][i].manager_id + "' class='discount_item'"
                    if (response.datas['tests'][i].is_checked == 'True') {
                        str += ' checked ';
                    }
                    str += " /> " + response.datas['tests'][i].code+" / " + response.datas['tests'][i].name + "</label ></td > " +
                        //"<td style='width: 80px;'></td>" +
                        "<td style='text-align:right; vertical-align:middle; padding-right:10px;'>" + numberWithCommas(response.datas['tests'][i].price) + "</td>" +
                        "<td ></td>" +
                        "<td style='text-align:right; vertical-align:middle; padding-right:10px;'>" + numberWithCommas(response.datas['tests'][i].price) + " VND</td></tr>";

                    recepts_table += '<tr>' +
                        '<td colspan="2">' + response.datas['tests'][i].name + '</td>' +
                        '<td style="text-align:right;">' + numberWithCommas(response.datas['tests'][i].price) + '</td>' +
                        '<td></td>' +
                        '<td style="text-align:right;">' + numberWithCommas(response.datas['tests'][i].price) + '</td><td></td></tr>';

                    no += 1;
                }
            }
            if (response.datas['precedures'].length != 0) {
                //str += '<tr><td colspan="3">Precedure</td></tr>';
                for (var i in response.datas['precedures']) {

                    str += "<tr><td style='width: 380px;' colspan='2'><label class='check_discount_label'><input type='checkbox' id='exam_item_" + response.datas['precedures'][i].manager_id + "' class='discount_item'";
                    if (response.datas['precedures'][i].is_checked == 'True') {
                        str += ' checked ';
                    }
                    str += "/>" + response.datas['precedures'][i].code + " / " +
                        response.datas['precedures'][i].name + "</label></td>" +
                        //"<td style='width: 80px;'></td>" +
                        "<td style='text-align:right; vertical-align:middle; padding-right:10px;'>" + numberWithCommas(response.datas['precedures'][i].price) + "</td>";

                    if (response.datas['precedures'][i].code.search('R') == -1) {
                        str += "<td style='text-align:right; vertical-align:middle; padding-right:10px;'></td>";
                        str += "<td style='text-align:right; vertical-align:middle; padding-right:10px;'>" + numberWithCommas(response.datas['precedures'][i].price) + " VND</td></tr>";
                    } else {
                        str += "<td style='text-align:center; vertical-align:middle; padding-right:10px;'>" + numberWithCommas(response.datas['precedures'][i].amount) + "</td>";
                        str += "<td style='text-align:right; vertical-align:middle; padding-right:10px;'>" + numberWithCommas(response.datas['precedures'][i].price * response.datas['precedures'][i].amount) + " VND</td></tr>";
                    }


                    recepts_table += '<tr>' +
                        '<td colspan="2">' + response.datas['precedures'][i].name + '</td>' +
                        '<td style="text-align:right;">' + numberWithCommas(response.datas['precedures'][i].price) + '</td>';
                    if (response.datas['precedures'][i].code.search('R') == -1) {
                        recepts_table += '<td style="text-align:center;"></td>';
                        recepts_table += '<td style="text-align:right;">' + numberWithCommas(response.datas['precedures'][i].price) + '</td><td></td></tr>';
                    } else {
                        recepts_table += '<td style="text-align:center;">' + numberWithCommas(response.datas['precedures'][i].amount) + '</td>';
                        recepts_table += '<td style="text-align:right;">' + numberWithCommas(response.datas['precedures'][i].price * response.datas['precedures'][i].amount) + '</td><td></td></tr>';
                    }
                    

                    no += 1;
                }
            }
            
            if (response.datas['medicines'].length != 0) {
                var medication_total = 0;
                //str += '<tr><td colspan="3">Medicine</td></tr>';
                for (var i in response.datas['medicines']) {
                    str += "<tr class='medication_contents'><td style='width: 380px;' colspan='2'><label class='check_discount_label'><input type='checkbox' id='exam_item_" + response.datas['medicines'][i].manager_id + "' class='discount_item'";
                    if (response.datas['medicines'][i].is_checked == 'True') {
                        str += ' checked ';
                    }
                    str += "/>" + response.datas['medicines'][i].code + " / " + response.datas['medicines'][i].name + "</label ></td > " +
                        //"<td style='width: 80px;'></td>" +
                        "<td style='text-align:right; vertical-align:middle; padding-right:10px;'>" + numberWithCommas(response.datas['medicines'][i].unit) + "</td>" +
                        "<td style='text-align:center; vertical-align:middle;'>" + response.datas['medicines'][i].quantity + "</td>" +
                        "<td style='text-align:right; vertical-align:middle; padding-right:10px;'>" + numberWithCommas(response.datas['medicines'][i].price) + " VND</td></tr>";


                    recepts_table += "<tr class='chart_table_medicine_contents'>" +
                        "<td colspan='2'>" + response.datas['medicines'][i].name + "</td>" +
                        "<td style='text-align: right;'>" + numberWithCommas(response.datas['medicines'][i].unit) + "</td>" +
                        "<td>" + response.datas['medicines'][i].quantity + "</td>" +
                        "<td style='text-align: right;'>" + numberWithCommas(response.datas['medicines'][i].price) + "</td><td></td></tr>";


                    no += 1;
                    medication_total += response.datas['medicines'][i].unit * response.datas['medicines'][i].quantity
                }

                recepts_table += '<tr class="chart_table_contents_items_shortcut">' +
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

            
            str += "<tr><td></td><td></td><td rowspan='2' style='vertical-align:middle; text-align:center; font-weight:bold; '>Discount</td>"+
                '<td><input type="text" id="discount_input" class="form-control" style="display:inline; width:2.5vw;" aria-describedby="basic-addon1" value="' + response.datas['discount'] +'" /> %</td>' +
                '<td id="discount_show" style="text-align:right; padding-right: 0.6vw;"></td>';
            str += "<tr><td></td><td></td><td></td><td style='text-align:right; padding-right:10px;'><input style='text-align:right; width:70px;display:inline;' id='discount_amount' class='form-control' value='" + response.datas['discount_amount'] + "'/>VND</td></tr>";


            str += "<tr><td></td><td></td><td style = 'vertical-align:middle; text-align:center; font-weight:bold;' > Add </td > ";
            str += "<td></td><td style='text-align:right; padding-right:10px;'><input autocomplete='off' style='text-align:right; width:70px;display:inline; text-align:right;' id='additional_amount' class='form-control' value='" + response.datas['additional'] + "'/>VND</td></tr>"


            //str += "<tr><td></td><td></td><td colspan='2' style='vertical-align:middle; text-align:center; font-weight:bold;'>" +
            //    "<label><input type='checkbox' id='is_emergency' style='position: relative;top: 15px;'";
            //if (response.datas['is_emergency'] == true)
            //    str += 'checked';
            //str += ">Emergency<br/>Fee(30%)</label>" + "</td ><td id='emergency_amount' style='text-align:right; vertical-align:middle;'>" + numberWithCommas(response.datas['emergency_amount'])+" VND</td></tr>";


            str += "<tr><td></td><td></td><td style='text-align:center;font-weight:bold;' >Total</td>" +
                "<td id='discount_total' colspan='2'style='text-align:right; padding-right:0.6vw;'>" +
                numberWithCommas(Number(response.datas['total_payment'])) + " VND</td></tr >" ;


            str += "<tr><td></td><td></td><td style='text-align:center;font-weight:bold;' >Paid</td>" +
                "<td id='discount_paid' colspan='2'style='text-align:right; padding-right:0.6vw;'>" + numberWithCommas(response.datas['paid']) + " VND</td></tr >";
             
            //str += "<tr><td></td><td></td><td style='text-align:center;font-weight:bold;' >Unpaid</td>" +
            //    "<td id='discount_unpaid' colspan='2'style='text-align:right; padding-right:0.6vw;'>" + numberWithCommas(response.datas['unpaid_total']) + " VND</td></tr >";

            //total
            $("#discount_total").val(numberWithCommas(response.datas['total_payment']));
            $("#total_amount").val(numberWithCommas(response.datas['sub_total']));

            $('#storage_bills').append(str);
            //get_bill_list(reception_id);
            $('.medication_contents').hide();
            $('.chart_table_medicine_contents').hide();
            //discount isvalid
            //discount percent

            //
            $('#recept_patient').html(response.datas['name_kor'] + ' / ' + response.datas['name_eng']);
            $('#recept_date').html(response.datas['date']);
            $('#recept_doctor').html(response.datas['doctor_eng']);
            $('#recept_date_of_birth').html(response.datas['date_of_birth']);
            $('#recept_depart').html(response.datas['depart']);

            $("#id_pay").val(0);

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
                    $('#chart_table_total').html(numberWithCommas((response.datas.sub_total.toFixed(0))));

                    $('#chart_table_paid_amount').html(numberWithCommas((totalValue.toFixed(0))));

                    $('#discount_unpaid').html(numberWithCommas(totalValue - response.datas['paid']) + ' VND');
                    $('#discount_amount').val('');

                }
            });

            //discount 직접입력
            $('#discount_amount').keyup(function () {
                chage_amount();
            })
            $('#chart_table_contents_items').empty();
            $('#chart_table_contents_items').append(recepts_table);

            //discount isvalid
            //discount percent
            $('#discount_input').keyup(function () {
                $("#discount_amount").val('');
                chage_amount();
            });

            //discount 직접입력
            $('#discount_amount').keyup(function () {
                $("#discount_input").val('');
                chage_amount();
            })

            $('#discount_amount ,#additional_amount').keyup(function () {
                $("#discount_input").val('');
                chage_amount();
            })
            $('#id_pay').val('');
            chage_amount();
            //응급
            //$('#is_emergency').change(function () {
            //    chage_amount();
            //});


            $('#chart_table_total').html(numberWithCommas(response.datas['sub_total']));
            $('#chart_table_paid_amount').html(numberWithCommas(response.datas['total_payment']));
            //임시
            if (response.datas['discount_amount'] != '') {
                
                $('#chart_table_discount_amount').html(numberWithCommas(response.datas['discount_amount']));
            } else if(response.datas['discount'] != '')  {
                discount = response.datas['discount'] / 100;

                var totalValue = (response.datas['sub_total'] * discount)


                $('#chart_table_discount').html(response.datas['discount'] + '%');
                $('#chart_table_discount_amount').html(numberWithCommas(totalValue));
            }
            
            //$('#chart_table_discount_amount').$('#discount_show').val()


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
            $("#discount_input, #discount_amount,#is_emergency,#additional_amount,.discount_item").prop('disabled', true);


            $('#show_medication_contents').prop("checked", false);



        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

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
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}

function waiting_list(Today = false) {
    var date, start, end;

    if (Today == true) {
        start = today = moment().format('YYYY[-]MM[-]DD');
        end = today = moment().format('YYYY[-]MM[-]DD');
    } else {
        start = $('#storage_list_calendar_start').val();
        end = $('#storage_list_calendar_end').val();
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
            'depart': $('#reception_waiting_depart').val(),
        },
        dataType: 'Json',
        success: function (response) {
            $('#storage_list_table > tbody ').empty();
            for (var i = 0; i < response.datas.length; i++) {
                var tr_class = "";
                if (response.datas[i]['status'] != 'paid')
                    tr_class = "class ='warning'"


                var str = "<tr " + tr_class + "style='cursor:pointer;'";
                if (response.datas[i]['paymentrecord_id']) {
                    str += "onclick='waiting_selected(" + response.datas[i]['paymentrecord_id'] + ")'>";
                }
                else {
                    str += "onclick='get_today_selected(" + response.datas[i]['reception_id'] + ")'>";
                }
                str += "<td style='vertical-align:middle;'>" + (parseInt(i) + 1) + "</td>";
                if (response.datas[i]['has_unpaid']) {
                    str += "<td style='color:rgb(228,97,131); vertical-align:middle;''>";
                } else {
                    str += "<td style='vertical-align:middle;'>";
                }
                    str += response.datas[i]['chart'] + "</td>" +
                    "<td style='vertical-align:middle;' >" + response.datas[i]['name_kor'] + '<br/>' + response.datas[i]['name_eng'] + "</td>" +
                    "<td style='vertical-align:middle;' >" + response.datas[i]['date'] + "</td>" +
                    "<td style='vertical-align:middle;' >" + response.datas[i]['Depart'] + '<br/>' + response.datas[i]['Doctor'] + "</td>" +
                    "<td style='vertical-align:middle;' >" + numberWithCommas( response.datas[i]['paid'] )+ '</td>' +
                        "<td style='vertical-align:middle;' >" + numberWithCommas(Number(response.datas[i]['unpaid_total']) )+ '</td></td>'; 
                 
                    

                $('#storage_list_table').append(str);
            }
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}



function get_today_list() {

    $.ajax({
        type: 'POST',
        url: '/receptionist/get_today_list/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'doctor': $("#waiting_list_doctor option:selected").val(),
            'depart': $('#depart_select').val(),
        },
        dataType: 'Json',  
        success: function (response) {
            $('#storage_today_table > tbody ').empty();
            for (var i in response.datas) {
                var tr_class = "";
                //if (response.datas[i]['status'] == 'unpaid')
                //    tr_class = "class ='success'"
                //else if (response.datas[i]['status'] == 'paid')
                //    tr_class = "class ='danger'"


                var str = "<tr " + tr_class + "style='cursor:pointer;' onclick='get_today_selected(" + response.datas[i]['reception_id'] + ");get_patient_past(" + response.datas[i]['reception_id'] + ");'>" +
                    "<td style='vertical-align:middle;'>" + (parseInt(i) + 1) + "</td>" +
                    "<td style='vertical-align:middle;";
                if (response.datas[i]['has_unpaid']) {
                    //str += " color:rgb(228,97,131); ";
                } 

                str += "'>" + response.datas[i]['chart'] + "</td>" +
                    "<td style='vertical-align:middle;'>" + response.datas[i]['name_kor'] + '<br/>' + response.datas[i]['name_eng'] + "</td>" +
                    "<td style='vertical-align:middle;'>" + response.datas[i]['Depart'] + '<br/>' + response.datas[i]['Doctor'] + "</td>" +
                    "<td style='vertical-align:middle;'>" + response.datas[i]['DateTime'] + "</td></tr>";

                $('#storage_today_table').append(str);
            }
            
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

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
            $('#recommendation').val(response.datas['recommendation']);

            $('#need_invoice').prop('checked', response.need_invoice);
            $('#need_insurance').prop('checked', response.need_invoice);

            $("#storage_memo").val('');
            $("#id_payment_info").val('');

            var recepts_table = ''
            var str = ''
            var no = 1;
            if (response.datas['exams'].length != 0) {
                for (var i in response.datas['exams']) {
                    str += "<tr><td style='width: 380px;' colspan='2'><label class='check_discount_label'><input type='checkbox' id='exam_item_" + response.datas['exams'][i].manager_id + "' class='discount_item'/>" + response.datas['exams'][i].code + " / " + response.datas['exams'][i].name + "</label></td>" +
                        //"<td style='width: 80px;'></td>" +
                        "<td style='text-align:right; vertical-align:middle; padding-right:10px;'>" + numberWithCommas(response.datas['exams'][i].price) + "</td>" +
                        "<td ></td>" +
                        "<td style='text-align:right; vertical-align:middle; padding-right:10px;'>" + numberWithCommas(response.datas['exams'][i].price) + " VND</td></tr>";

                    recepts_table += '<tr>' +
                        '<td colspan="2">' + response.datas['exams'][i].name + '</td>' +
                        '<td style="text-align:right;">' + numberWithCommas(response.datas['exams'][i].price) + '</td>' +
                        '<td></td>' +
                        '<td style="text-align:right;">' + numberWithCommas(response.datas['exams'][i].price) + '</td><td></td></tr>';

                    no += 1;
                }
            }
            if (response.datas['tests'].length != 0) {
                
                for (var i in response.datas['tests']) {
                    str += "<tr><tr><td style='width: 380px;' colspan='2'><label class='check_discount_label'><input type='checkbox' id='test_item_" + response.datas['tests'][i].manager_id + "' class='discount_item'/>" + response.datas['tests'][i].code + " / " + response.datas['tests'][i].name + "</label></td>" +
                        //"<td style='width: 80px;'></td>" +
                        "<td style='text-align:right; vertical-align:middle; padding-right:10px;'>" + numberWithCommas(response.datas['tests'][i].price) + "</td>" +
                        "<td ></td>" +
                        "<td style='text-align:right; vertical-align:middle; padding-right:10px;'>" + numberWithCommas(response.datas['tests'][i].price) + " VND</td></tr>";

                    recepts_table += '<tr>' +
                        '<td colspan="2">' + response.datas['tests'][i].name + '</td>' +
                        '<td style="text-align:right;">' + numberWithCommas(response.datas['tests'][i].price) + '</td>' +
                        '<td></td>' +
                        '<td style="text-align:right;">' + numberWithCommas(response.datas['tests'][i].price) + '</td><td></td></tr>';

                    no += 1;
                }
            }
            if (response.datas['precedures'].length != 0) {
                //str += '<tr><td colspan="3">Precedure</td></tr>';
                for (var i in response.datas['precedures']) {
                    str += "<tr><td style='width: 380px;' colspan='2'><label class='check_discount_label'><input type='checkbox' id='precedure_item_" + response.datas['precedures'][i].manager_id + "' class='discount_item'/>" + response.datas['precedures'][i].code + " / " +
                        response.datas['precedures'][i].name + "</label></td>" +
                        //"<td style='width: 80px;'></td>" +
                        "<td style='text-align:right; vertical-align:middle; padding-right:10px;'>" + numberWithCommas(response.datas['precedures'][i].price) + "</td>";

                    if (response.datas['precedures'][i].code.search('R') == -1) {
                        str += "<td style='text-align:right; vertical-align:middle; padding-right:10px;'></td>" +
                            "<td style='text-align:right; vertical-align:middle; padding-right:10px;'>" + numberWithCommas(response.datas['precedures'][i].price) + " VND</td></tr>";
                    } else {
                        str += "<td style='text-align:center; vertical-align:middle; padding-right:10px;'>" + numberWithCommas(response.datas['precedures'][i].amount) + "</td>" +
                            "<td style='text-align:right; vertical-align:middle; padding-right:10px;'>" + numberWithCommas(response.datas['precedures'][i].price * response.datas['precedures'][i].amount) + " VND</td></tr>";
                    }
                    


                    recepts_table += '<tr>' +
                        '<td colspan="2">' + response.datas['precedures'][i].name + '</td>' +
                        '<td style="text-align:right;">' + numberWithCommas(response.datas['precedures'][i].price) + '</td>';
                    if (response.datas['precedures'][i].code.search('R') == -1) {
                        recepts_table += '<td style="text-align:center;"></td>';
                        recepts_table += '<td style="text-align:right;">' + numberWithCommas(response.datas['precedures'][i].price) + '</td><td></td></tr>';
                    } else {
                        recepts_table += '<td style="text-align:center;">' + numberWithCommas(response.datas['precedures'][i].amount) + '</td>';
                        recepts_table += '<td style="text-align:right;">' + numberWithCommas(response.datas['precedures'][i].price * response.datas['precedures'][i].amount) + '</td><td></td></tr>';
                    }


                    no += 1;
                }
            }

            if (response.datas['medicines'].length != 0) {
                var medication_total = 0;
                //str += '<tr><td colspan="3">Medicine</td></tr>';
                for (var i in response.datas['medicines']) {
                    str += "<tr class='medication_contents'><td style='width: 380px;' colspan='2'><label class='check_discount_label'><input type='checkbox' id='medicine_item_" + response.datas['medicines'][i].manager_id + "' class='discount_item'/>" + response.datas['medicines'][i].code + " / " + response.datas['medicines'][i].name + "</label></td>" +
                        //"<td style='width: 80px;'></td>" +
                        "<td style='text-align:right; vertical-align:middle; padding-right:10px;'>" + numberWithCommas(response.datas['medicines'][i].unit) + "</td>" +
                        "<td style='text-align:center; vertical-align:middle;'>" + response.datas['medicines'][i].quantity + "</td>" +
                        "<td style='text-align:right; vertical-align:middle; padding-right:10px;'>" + numberWithCommas(response.datas['medicines'][i].price) + " VND</td></tr>";


                    recepts_table += "<tr class='chart_table_medicine_contents'>" +
                        "<td colspan='2'>" + response.datas['medicines'][i].name + "</td>" +
                        "<td style='text-align:right;'>" + numberWithCommas(response.datas['medicines'][i].unit) + "</td>" +
                        "<td>" + response.datas['medicines'][i].quantity + "</td>" +
                        "<td style='text-align:right;'>" + numberWithCommas(response.datas['medicines'][i].price) + "</td><td></td></tr>";

                    no += 1;
                    medication_total += response.datas['medicines'][i].unit * response.datas['medicines'][i].quantity
                }

                recepts_table += '<tr class="chart_table_contents_items_shortcut">' +
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


            str += "<tr><td></td><td></td><td rowspan='2' style='vertical-align:middle; text-align:center; font-weight:bold;'>Discount</td>" +
                '<td><input type="text" autocomplete="off" id="discount_input" class="form-control" style="display:inline; width:2.5vw;" aria-describedby="basic-addon1" value="' + response.datas['discount'] +'"/> %</td>' +
                '<td id="discount_show" style="text-align:right; padding-right:0.6vw;"></td>';
            str += "<tr><td></td><td></td><td></td><td style='text-align:right; padding-right:10px;'><input autocomplete='off' style='width:70px;display:inline;' text-align:right; id='discount_amount' class='form-control' value='" + response.datas['discount_amount'] + "'/>VND</td></tr>";

            
            str += "<tr><td></td><td></td><td style = 'vertical-align:middle; text-align:center; font-weight:bold;' > Add </td > ";
            str += "<td></td><td style='text-align:right; padding-right:10px;'><input autocomplete='off' style='text-align:right; width:70px;display:inline; text-align:right;' id='additional_amount' class='form-control' value='" + response.datas['additional'] + "'/>VND</td></tr>"
            

            //str += "<tr><td></td><td></td><td colspan='2' style='vertical-align:middle; text-align:center; font-weight:bold;'>" +
            //    "<label><input type='checkbox' id='is_emergency' style='position: relative;top: 15px;'";
            //if (response.datas['is_emergency'] == true)
            //    str += 'checked';
            //str += ">Emergency<br/>Fee(30%)</label>" + "</td ><td id='emergency_amount' style='text-align:right; vertical-align:middle;'></td></tr>";



            str += "<tr><td></td><td></td><td style='text-align:center;font-weight:bold;' >Total</td>" +
                "<td id='discount_total' colspan='2'style='text-align:right; padding-right:0.6vw;'>" + numberWithCommas(response.datas['total_amount']) + " VND</td></tr>";




            str += "<tr><td></td><td></td><td style='text-align:center;font-weight:bold;' >Paid</td>" +
                "<td id='discount_paid' colspan='2'style='text-align:right; padding-right:0.6vw;'>" + numberWithCommas(response.datas['paid']) + " VND</td></tr >";
            
            //str += "<tr><td></td><td></td><td style='text-align:center;font-weight:bold;' >Unpaid</td>" +
            //    "<td id='discount_unpaid' colspan='2'style='text-align:right; padding-right:0.6vw;'>" + numberWithCommas(response.datas['unpaid']) + " VND</td></tr >";

            

            $('#storage_bills').append(str);
            $('#total_amount').val(numberWithCommas(response.datas['total_amount']));
            //get_bill_list(reception_id);


            $('#chart_table_total').html(numberWithCommas(response.datas['total_amount']));
            $('#chart_table_paid_amount').html(numberWithCommas(response.datas['total_amount']));

            //discount isvalid
            //discount percent
            $('#discount_input').keyup(function () {
                $("#discount_amount").val('');
                chage_amount();
            });

            //discount 직접입력
            $('#discount_amount, #additional_amount').keyup(function () {
                $("#discount_input").val('');
                chage_amount();
            })
            $('#id_pay').val(response.datas['total_amount']);
            //응급
            //$('#is_emergency').change(function () {
            //    chage_amount();
            //});


            

            //$('#discount_unpaid').html(numberWithCommas(totalValue - response.datas['paid']) + ' VND');




            $('#recept_patient').html(response.datas['name_kor'] + ' / ' + response.datas['name_eng']);
            $('#recept_date').html(response.datas['date']);
            $('#recept_doctor').html(response.datas['doctor_eng']);
            $('#recept_date_of_birth').html(response.datas['date_of_birth']);
            $('#recept_depart').html(response.datas['depart']);
            
            $('#chart_table_contents_items').empty();
            $('#chart_table_contents_items').append(recepts_table);

            $('.medication_contents').hide();
            $('.chart_table_medicine_contents').hide();

            if ($('#discount_input').val() != '') {
                $('#chart_table_discount').html($('#discount_input').val() + '%');
                $('#chart_table_discount_amount').html(numberWithCommas($('#discount_show').val()));
            }
            else if ($('#discount_amount').val() != '') {
                $('#chart_table_discount').html('');
                $('#chart_table_discount_amount').html(numberWithCommas($('#discount_amount').val()));
            }
            else {
                $('#chart_table_discount').html('');
                $('#chart_table_discount_amount').html('0');
            }
            
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

            $("#discount_input, #discount_amount").prop('disabled', false);
            $('#show_medication_contents').prop("checked", false);
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}

function chage_amount() {

    var discount_amount = ''
    var total_aount = $('#total_amount').val();
    var total_amount = total_aount
    total_aount = total_aount.replace(/[^0-9]/g, "");
    if ($('#discount_amount').val() == '') {
        var discount = $('#discount_input').val();
        discount = discount / 100;
        discount_amount = total_aount * discount;
        $('#discount_show').html(discount_amount + ' VND');
    } else {
        discount_amount = $('#discount_amount').val();
    }

    var emergency_fee = 0
    if ($('#is_emergency').prop("checked")) {
        emergency_fee = total_aount * 0.3;   
    }
    $('#emergency_amount').html(numberWithCommas(emergency_fee.toFixed(0)) + ' VND');

    var additional = $('#additional_amount').val(); 
    $("#additional_items").empty();
    if (additional != '' && additional != null && additional != 0) {

        var additional_string = "<tr><td colspan='4'>" +
            "Additional Amount</td>" +
            "<td style='text-align:right;'>" + numberWithCommas(additional) + "</td>" +
            "<tr></td></tr>";

        $("#additional_items").append(additional_string);
    }

    total_aount = parseInt(total_aount) + parseInt(emergency_fee) - parseInt(discount_amount * 1) + parseInt(additional);


    $('#discount_total').html(numberWithCommas((total_aount.toFixed(0)) + ' VND'));

    $('#chart_table_total').html(numberWithCommas(total_amount));

    $('#chart_table_discount').html($('#discount_input').val() + '%');
    $('#chart_table_discount_amount').html(numberWithCommas((discount_amount)))

    $('#chart_table_paid_amount').html(numberWithCommas(total_aount));

    $('#id_pay').val(total_aount)

}

function save_storage() {
    if ($('#selected_reception').val().trim = '') {
        alert(gettext('Select patient first.'));
        return;
    }

    paid = $('#id_pay').val();
    console.log(paid)
    pay_method = $("#id_payment_info").val();
    if (pay_method == '') {
        alert(gettext('Select Payment method'));
        return;
    }
    amount = $('#total_amount').val();




    var list_checked = Array();
    var checkboxs = $(".discount_item");
    for (i = 0; i < checkboxs.length; i++) {
        checkbox_id = checkboxs[i].id.split('_');

        list_checked[i] = {
            'type': checkbox_id[0],
            'id': checkbox_id[2],
            'value': checkboxs[i].checked,
        };
        
    }

    console.log(JSON.stringify(list_checked))

    $.ajax({
        type: 'POST',
        url: '/receptionist/storage_page_save/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'reception_id': $('#selected_reception').val(),
            'paid': $('#id_pay').val(),
            'method': $('#id_payment_info option:selected').val(),
            'discount': $('#discount_input').val(),
            'discount_amount': $('#discount_amount').val(),
            'total': $("#discount_total").html(),
            'payment_memo': $("#storage_memo").val(),


            'list_checked': JSON.stringify(list_checked),

            'is_emergency': $('#is_emergency').prop("checked"),
            'additional': $('#additional_amount').val()
        },
        dataType: 'Json',
        success: function (response) {

            if (response.result == false) {
                alert(response.msg)
                return;
            }

            if (response.result == 'paid') {
                alert(gettext('Already paid.'));
                waiting_list(true);
                get_today_list();
            } else if (response.result == 'overflowed') {
                alert(gettext('Payment amount should be lower than remaining.'));
            } else {
                alert(gettext('Paid'));
            }
            
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })


}

//index.html end