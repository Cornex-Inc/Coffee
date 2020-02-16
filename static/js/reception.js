
jQuery.browser = {};
var reception_event_count = 0;
$(function () {
    //init
    if ($('#reception_table').length > 0) {
        reservation_search(true);
    }
    reception_search();
    //Patient 
    if ($("#patient_date_of_birth").length > 0) {
        $("#patient_date_of_birth").daterangepicker({

            singleDatePicker: true,
            showDropdowns: true,
            locale: {
                format: 'YYYY-MM-DD',
            },
        });
    }


    $('#patient_search_input').keydown(function (key) {
        if (key.keyCode == 13) {
            patient_search();
        }
    })

    //Reception search
    if ($("#reception_waiting_date").length > 0) {
        $("#reception_waiting_date").daterangepicker({
            singleDatePicker: true,
            locale: {
                format: 'YYYY-MM-DD'
            }
        });
    }
    $('#reception_waiting_date').on('apply.daterangepicker', function () {
        today = moment().format('YYYY[-]MM[-]DD');
        date = $('#reception_waiting_date').val();
        if (date == today) {
            reception_waiting_date_worker(true);
        } else {
            reception_waiting_date_worker(false);
            reception_search();
        }
    });

    

    $("#depart_select").change(function () {
        get_doctor($("#depart_select"));
    });

    

    $("#reception_waiting_depart").change(function () {
        reception_search();
        get_doctor($("#reception_waiting_depart"));
    });
    $("#reception_waiting_doctor").change(function () {
        reception_search();
    });

    $("#reservation_depart_select").change(function () {
        reservation_search();
        get_doctor($("#reservation_depart_select"));
    });
    $("#reservation_doctor_select").change(function () {
        reservation_search();
    });


    //payment search
    if ($("#Datepicker_payment").length > 0) {
        $("#Datepicker_payment").datepicker({
            changeMonth: true,
            changeYear: true,
            nextText: '다음 달',
            prevText: '이전 달',
            currentText: '오늘',
            closeText: '닫기',
            monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            dateFormat: "yy-mm-dd",
        });
    }

    //reservation
    if ($("#Datepicker_reservation").length > 0) {
        $("#Datepicker_reservation").datepicker({
            changeMonth: true,
            changeYear: true,
            nextText: '다음 달',
            prevText: '이전 달',
            currentText: '오늘',
            closeText: '닫기',
            monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            dateFormat: "yy-mm-dd",
        });
    }








    if ($("#Datepicker").length > 0) {
        $("#Datepicker").datepicker({
            changeMonth: true,
            changeYear: true,
            nextText: '다음 달',
            prevText: '이전 달',
            currentText: '오늘',
            closeText: '닫기',
            monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            dateFormat: "yy-mm-dd",
        });
    }

    if ($("#Timepicker").length > 0) {
        $("#Timepicker").timepicker({
            minTime: '09: 00am',
            maxTime: '18: 00am',
            step: 10,
        });
    }

    $('#reception_reservation_date').daterangepicker({
        singleDatePicker: true,
        drops: "up",
        locale: {
            format: 'YYYY-MM-DD'
        }
    });

    $('#reception_reservation_date').on('apply.daterangepicker', function () {
        reservation_search();
    });




    $('.status_table_filter input').change(function () {

    })
    $('#patient_tax_invoice_click').click(function () {
        $('#show_Tax_invoice').toggle();
    })
   
});


$("#reservation_table").click(function () {
    $('#reservation_table > tbody > tr').remove();
    $('#reservation_table > tbody').append('<tr><td>추가된 라인!!</td></tr>');

});

function get_doctor(part, depart = null) {
    var part_id = part.attr('id');
    var doctor;
    if (part_id == 'depart_select') {
        doctor = $('#doctor_select');
    } else if (part_id == 'reception_waiting_depart') {
        doctor = $('#reception_waiting_doctor');
    } else if (part_id == 'reservation_depart_select') {
        doctor = $('#reservation_doctor_select');
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
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}

function reservation_none() {
    $('#reservation_table > tbody').append('<tr><td colspan="5"> - 예약 없음 - </td></tr>');
}
function check_reservation(data) {
    $.ajax({
        type: 'POST',
        url: '/receptionist/check_reservation/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'patient_id': data,
        },
        dataType: 'Json',
        success: function (response) {
            alert(response.datas.length);
            $('#reservation_table > tbody > tr').remove();
            if (response.datas.length == 0 ) {
                reservation_none();
            }
            else {
                for (var i in response.datas)
                    $('#reservation_table > tbody').append("<tr><td>추가된 라인!!</td></tr>");
            }
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}

//index.html begin
function earse_inputs() {

    $('#reception_table input ').each(function () {
        name = $(this).attr("name");
        if (name == 'gender' || $(this).attr('id') == 'patient_tax_invoice_click') {
            return;
        } else {
            $(this).val('');
        }
    })
    $('#depart_select option:eq(0)').prop("selected", true);
    $('#doctor_select option:eq(0)').prop("selected", true);

    $('input:radio[name=gender]').prop('checked', false);

}

function set_new_patient() {
    earse_inputs();

    $.ajax({
        type: 'POST',
        url: '/receptionist/set_new_patient/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
        },
        dataType: 'Json',
        success: function (response) {
            $('#patient_chart').val(response.chart)
            
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}


function patient_check_required() {
    var $t, t;
    var fields = [$('#patient_name_kor'),
        $('#patient_name_eng'),
        $('#patient_date_of_birth'),]


    if ($('#patient_chart').val() =='') {
        alert('신환의 경우 New를 먼저 클릭하고 정보를 입력해주세요.' +
            '\n재진의 경우 환자를 검색 후 클릭하여 진행 해주세요.');
        return false;
    }


    if (!$('input[name=gender]').is(':checked')) {
        alert("gender (은)는 필수 입력입니다.");
        return false;
    }

    var result = true;
    $.each(fields,function () {
        $t = jQuery(this);
        if ($t.prop("required")) {
            if (!jQuery.trim($t.val())) {
                t = $t.attr("name");
                $t.focus();
                alert("'" + t + "'" + "(은)는 필수 입력입니다.");
                result = false;
                return false;
            }
        }
    });
    return result;
}


function save_patient() {
    if ( !patient_check_required() ) {
        return;
    }
    var id = $('#patient_id').val();
    var chart_no = $('#patient_chart').val();
    var name_kor = $('#patient_name_kor').val();
    var name_eng = $('#patient_name_eng').val();
    var date_of_birth = $('#patient_date_of_birth').val();
    var gender = $('input[name="gender"]:checked').val();
    var address = $('#patient_address').val();
    var phone = $('#patient_phone').val();
 
    var past_history = $('#history_past').val();
    var family_history = $('#history_family').val();

    var tax_invoice_number = $('#tax_invoice_number').val();
    var tax_invoice_company_name = $('#tax_invoice_company_name').val();
    var tax_invoice_address = $('#tax_invoice_address').val();

    $.ajax({
        type: 'POST',
        url: '/receptionist/save_patient/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'id':id,
            'cahrt_no': chart_no,
            'name_kor': name_kor,
            'name_eng': name_eng,
            'date_of_birth': date_of_birth,
            'phone': phone,
            'gender': gender,
            'address': address,
            'past_history': past_history,
            'family_history': family_history,

            'tax_invoice_number': tax_invoice_number,
            'tax_invoice_company_name': tax_invoice_company_name,
            'tax_invoice_address': tax_invoice_address,
        },
        dataType: 'Json',
        success: function (response) {
            if (response.result == true) {
                alert('저장에 성공 했습니다..');
                set_new_patient();
            } else {
                alert('저장에 실패 했습니다.');
            }


        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}


function reception_check_required() {
    var t, $t;
    var fields = [$('#depart_select'),
        $('#doctor_select'),]



    var result = true;
    $.each(fields, function () {
        $t = jQuery(this);
        if ($t.prop("required")) {
            if (!jQuery.trim($t.val())) {
                t = $t.attr("name");
                $t.focus();
                alert("'" + t + "'" + "(은)는 필수 입력입니다.");
                result = false;
                return false;
            }
        }
    });
    return result;
}

function save_recept() {
    if (!patient_check_required()) {
        return;
    }
    if (!reception_check_required()) {
        return
    }
    var id = $('#patient_id').val();
    var chart_no = $('#patient_chart').val();
    var name_kor = $('#patient_name_kor').val();
    var name_eng = $('#patient_name_eng').val();
    var date_of_birth = $('#patient_date_of_birth').val();
    var gender = $('input[name="gender"]:checked').val();
    var address = $('#patient_address').val();
    var phone = $('#patient_phone').val();

    var past_history = $('#history_past').val();
    var family_history = $('#history_family').val();

    var depart = $('#depart_select').val();
    var doctor = $('#doctor_select').val();
    var chief_complaint = $('#chief_complaint').val();

    var tax_invoice_number = $('#tax_invoice_number').val();
    var tax_invoice_company_name = $('#tax_invoice_company_name').val();
    var tax_invoice_address = $('#tax_invoice_address').val();

    var need_medical_report = $('#need_medical_report').prop("checked");

    $.ajax({
        type: 'POST',
        url: '/receptionist/save_reception/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'id': id,
            'cahrt_no': chart_no,
            'name_kor': name_kor,
            'name_eng': name_eng,
            'date_of_birth': date_of_birth,
            'phone': phone,
            'gender': gender,
            'address': address,
            'past_history': past_history,
            'family_history': family_history,
            'depart': depart,
            'doctor': doctor,
            'chief_complaint': chief_complaint,

            'tax_invoice_number': tax_invoice_number,
            'tax_invoice_company_name': tax_invoice_company_name,
            'tax_invoice_address': tax_invoice_address,

            'need_medical_report': need_medical_report,
        },
        dataType: 'Json',
        success: function (response) {
            if (response.result == true) {
                alert('접수 되었습니다.');
                reception_search(true);
                earse_inputs();

            } else {
                alert('접수에 실패 했습니다.');
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
        url: '/receptionist/set_patient_data/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'patient_id': patient_id,
        },
        dataType: 'Json',
        success: function (response) {
            $('#patient_id').val(response.id);
            $('#patient_chart').val(response.chart);
            $('#patient_name_kor').val(response.name_kor);
            $('#patient_name_eng').val(response.name_eng);
            $('#patient_date_of_birth').val(response.date_of_birth);
            $('#patient_address').val(response.address);
            $('#patient_phone').val(response.phone);
            
            $('#history_past').val(response.history_past);
            $('#history_family').val(response.history_family);

            $('input:radio[name=gender]').filter('[value=' + response.gender + ']').prop('checked', true);  

            //tax invoice
            $('#tax_invoice_number').val(response.tax_invoice_number);
            $('#tax_invoice_company_name').val(response.tax_invoice_company_name);
            $('#tax_invoice_address').val(response.tax_invoice_address);
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })


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
            $('#Patient_Search > tbody ').empty();
            if (response.datas.length == 0) {
                $('#Patient_Search').append("<tr><td colspan='8'>None Result !!</td></tr>");
            } else {
                for (var i in response.datas) {
                    var str = "<tr style='cursor:pointer;' onclick='set_patient_data(" +
                        parseInt(response.datas[i]['id']) +
                    ")'><td>" + (parseInt(i) + 1) + "</td>";

                    if (response.datas[i]['has_unpaid']) {
                        str += "<td style=color:rgb(228,97,131);>";
                    } else {
                        str += "<td>";
                    }

                    str+= response.datas[i]['chart'] + "</td>" +
                        "<td>" + response.datas[i]['name_kor'] + ' / ' + response.datas[i]['name_eng'] + "</td>" +
                        "<td>" + response.datas[i]['date_of_birth'] + ' (' + response.datas[i]['gender'] + '/' + response.datas[i]['age'] + ")</td>" +
                        "<td>" + response.datas[i]['phonenumber'] + "</td>" +
                        "<td>" + response.datas[i]['address'] + "</td></tr>";

                    $('#Patient_Search').append(str);
                }
            }
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}


function reception_search() {
    var date, depart, doctor;

    date = $('#reception_waiting_date').val().trim();

    depart = $('#reception_waiting_depart option:selected').val().trim();
    doctor = $('#reception_waiting_doctor option:selected').val().trim();

    $.ajax({
        type: 'POST',
        url: '/receptionist/reception_search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'date': date,
            'depart': depart,
            'doctor': doctor,
        },
        dataType: 'Json',
        success: function (response) {
            $('#Rectption_Status > tbody ').empty();
            if ( response.datas.length == 0 ) {
                $('#Rectption_Status').append("<tr><td colspan='8'>None Result !!</td></tr>");
            } else {
                for (var i in response.datas) {
                    var str = "<tr><td style='width: 3.2vw;'>" + (parseInt(i) + 1) + "</td>";

                        if (response.datas[i]['has_unpaid']) {
                            str += "<td style=color:rgb(228,97,131); width: 5.9vw;>";
                        } else {
                            str += "<td style='width: 5.9vw;'>";
                        }
                    str += response.datas[i]['chart'] + "</td>" +
                        "<td style='width:10.5vw;'>" + response.datas[i]['name_kor'] + "<br/>" + response.datas[i]['name_eng'] + "</td>" +
                        "<td style='width:10.5vw;'>" + response.datas[i]['date_of_birth'] +' ('+ response.datas[i]['gender']+'/' + response.datas[i]['age'] + ")</td>" +
                        "<td style='width:5.2vw'>" + response.datas[i]['depart'] + "</td>" +
                        "<td style='width: 8.4vw'>" + response.datas[i]['doctor'] + "</td>" +
                        "<td style='width:7.8vw; text-align:center'> " + response.datas[i]['is_new'] + "</td></tr>";

                    $('#Rectption_Status').append(str);
                }
            }
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}



function payment_search(Today = false,show_all_unpaid=false) {
    var date, status;

    if (Today) {
        var dt = new Date();

        var recentYear = dt.getFullYear();
        var recentMonth = dt.getMonth() + 1;
        var recentDay = dt.getDate();

        if (recentMonth < 10) recentMonth = "0" + recentMonth;
        if (recentDay < 10) recentDay = "0" + recentDay;
        date = recentYear + "-" + recentMonth + "-" + recentDay;
        $('#payment_date > input').val(date);
    } else {
        date = $('#payment_date > input').val();
    }
    status = $('#payment_status option:selected').val();
    $.ajax({
        type: 'POST',
        url: '/receptionist/payment_search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'date': date,
            'status': status,
            'show_all_unpaid': show_all_unpaid,
        },
        dataType: 'Json',
        success: function (response) {
            $('#Payment_Status > tbody ').empty();
            if (response.datas.length == 0) {
                $('#Payment_Status').append("<tr><td colspan='8'>None Result !!</td></tr>");
            } else {
                for (var i in response.datas)
                    var str = "<tr><td>" + (parseInt(i) + 1) + "</td>" +
                        "<td>" + response.datas[i]['chart'] + "</td>" +
                        "<td>" + response.datas[i]['name_kor'] + "/" + response.datas[i]['name_eng'] + "</td>" +
                        "<td>" + response.datas[i]['gender'] + response.datas[i]['age'] + "</td>" +
                        "<td>" + response.datas[i]['reception_time'] + "</td>" +
                        "<td>" + response.datas[i]['depart'] + "</td>" +
                        "<td>" + response.datas[i]['doctor'] + "</td>" +
                        "<td>" + " - " + "</td></tr>";

                $('#Payment_Status').append(str);
            }
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}


function reservation_search(Today = false) {
    var date, depart, doctor, status;

    //date = today = moment().format('YYYY[-]MM[-]DD');
    date = $('#reception_reservation_date').val();
    if (date == '')
        date = today = moment().format('YYYY[-]MM[-]DD');
    depart = $('#reservation_depart_select option:selected').val();
    doctor = $('#reservation_doctor_select option:selected').val();

    $.ajax({
        type: 'POST',
        url: '/receptionist/reservation_search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'date': date,
            'depart': depart,
            'doctor': doctor,
            'status': status,
        },
        dataType: 'Json',
        success: function (response) {
            $('#Reservation_Status > tbody ').empty();
            if (response.datas.length == 0) {
                $('#Reservation_Status').append("<tr><td colspan='8'>None Result !!</td></tr>");
            } else {
                for (var i in response.datas) {
                    var str = "<tr><td>" + (parseInt(i) + 1) + "</td>";

                        if (response.datas[i]['has_unpaid']) {
                            str += "<td style=color:rgb(228,97,131);>";
                        } else {
                            str += "<td>";
                        }

                    str +=  response.datas[i]['chart'] + "</td>" +
                        "<td>" + response.datas[i]['name'] + "</td>" +
                        "<td>" + response.datas[i]['date_of_birth'] + "</td>" +
                        "<td>" + response.datas[i]['phone'] + "</td>" +
                        "<td>" + response.datas[i]['depart'] + "</td>" +
                        "<td>" + response.datas[i]['doctor'] + "</td>" +
                        "<td>" + response.datas[i]['time'] + "</td></tr>"

                    $('#Reservation_Status').append(str);
                }
                
            }
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}



function worker_on(path) {
    if ($("input:checkbox[id='work_on']").is(":checked") == true) {
        if (window.Worker) {
            w = new Worker(path);
            w.onmessage = function (event) {
                reception_search(true);
            };

        } else {
        }
    } else {
        w.terminate();
        w = undefined;
    }
}


