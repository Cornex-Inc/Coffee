﻿
jQuery.browser = {};
var reception_event_count = 0;
$(function () {
    //init
    if ($('#reception_table').length > 0) {
        reservation_search(true);
    }
    reception_search();
    new_patient_option(false);
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


    //문진 
    $(".js-range-slider").ionRangeSlider({
        min: 0,
        max: 10,
        from: 0,
        type: 'single',
        grid: true,
        grid_num: 10,
        skin: "round",
    });
    let pain_slider = $(".js-range-slider").data("ionRangeSlider");
    

    $("#patient_medical_exam_click").click(function () {
        $.ajax({
            type: 'POST',
            url: '/receptionist/Question/get/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),
                'patient_id': $('#patient_id').val(),
            },
            dataType: 'Json',
            success: function (response) {


                //문진 
                

                //init
                $('.medical_exam_pm input[type="text"]').val('');
                $('.medical_exam_pm input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
                $('#occurred_date').val();
                $('.medical_exam_pm input[type="radio"]').prop('checked', false);

                $("#physiotherapy_count,#acupuncture_count,#injection_treatment_count,#taking_medicine_count").attr('disabled', true);
                $("#operation_year, #operation_name").attr('disabled', true);

                pain_slider.update({
                    from: 0,
                })
                

                if (response.result == false) {
                    return;
                }
                //2

                var q2_item = response.pain_posi_text.split(',');
                for (var item in q2_item) {
                    if (q2_item[item] == "") {

                    }
                    else {
                        $('input[class=pain_location_text]:input[value=' + q2_item[item] + ']').prop("checked", true);
                    }
                }
                $('#occurred_date').val(response.sick_date);
                //3
                if (response.cure_yn == "true") {
                    $('#treatment_history_yn').attr("checked", true);
                }
                if (response.cure_phy_yn == "true") {
                    $('#physiotherapy_yn').prop("checked", true);
                    $("#physiotherapy_count").prop('disabled', false);
                    $('#physiotherapy_count').val(response.cure_phy_cnt);
                }
                if (response.cure_inject_yn == "true") {
                    $('#injection_treatment_yn').prop("checked", true);
                    $("#injection_treatment_count").prop('disabled', false);
                    $('#injection_treatment_count').val(response.cure_inject_cnt);
                }
                if (response.cure_medi_yn == "true") {
                    $('#taking_medicine_yn').prop("checked", true);
                    $("#taking_medicine_count").prop('disabled', false);
                    $('#taking_medicine_count').val(response.cure_medi_cnt);
                }
                if (response.cure_needle_yn == "true") {
                    $('#acupuncture_yn').prop("checked", true);
                    $("#acupuncture_count").prop('disabled', false);
                    $('#acupuncture_count').val(response.cure_needle_cnt);
                }


                //4
                pain_slider.update({
                    from: response.pain_level,
                })
                //5
                $("input:radio[name=operation_yn]:input[value=" + response.surgery_yn + " ]").prop("checked", true);
                if (response.surgery_yn == "1") {
                    $("#operation_year").prop('disabled', false);
                    $("#operation_year").val(response.surgery_year);
                    $("#operation_name").prop('disabled', false);
                    $("#operation_name").val(response.surgery_name);
                }

                //6
                var q6_item = response.exam_kind.split(',');
                for (var item in q6_item) {
                    if (q6_item[item] == "") {
                    }
                    else {
                        $('input[class=test_kinds]:input[value=' + q6_item[item] + ']').prop("checked", true);
                    }
                }

                $('#test_etc').val(response.exam_etc);
                var q6_film = response.cd_film_yn.split(',');
                for (var item in q6_film) {
                    if (q6_film[item] == "") {
                    }
                    else {
                        $('input[class=cd_film_yn]:input[value=' + q6_film[item] + ']').prop("checked", true);
                    }
                }

                //7
                var q7_item = response.disease_kind.split(',');
                for (var item in q7_item) {
                    if (q7_item[item] == "") {
                    }
                    else {
                        $('input[class=disease_history_kinds]:input[value=' + q7_item[item] + ']').prop("checked", true);
                    }
                }
                $('#disease_etc').val(response.disease_etc);
                $('#medication').val(response.medication);
                //8
                $("input:radio[name=medicine_side_effects]:input[value=" + response.side_effect_yn + " ]").prop("checked", true);
                //9
                $("input:radio[name=pregnant_radio]:input[value=" + response.pregnant_yn + " ]").prop("checked", true);

                //10
                $('#visit_motiv_item').val(response.visit_motiv_item);

                var q10_item = response.visit_motiv_item.split(',');
                for (var item in q10_item) {
                    if (q10_item[item] == "") {

                    }
                    else {
                        $('input[class=visit_motiv_item]:input[value=' + q10_item[item] + ']').prop("checked", true);
                    }
                }

                $('#visit_motiv_friend').val(response.visit_motiv_friend);
                $('#visit_motiv_etc').val(response.visit_motiv_etc);

 
            },
            error: function (request, status, error) {
                alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
        });

        $('#medical_exam_EventModal').modal({ backdrop: 'static', keyboard: false });
        $("#medical_exam_EventModal").scrollTop(0);
        $('#medical_exam_EventModal').modal('show');
    });

    $("#save").click(function () {
        var regex = /^[0-9]*$/;
        //2.
        var q2_item = "";
        var q2_date = "";
        $('.pain_location_text:checkbox:checked').each(function () {
            q2_item += (this.checked ? $(this).val() + "," : "");
        })

        q2_date = $('#occurred_date').val();

        //3.
        var q3_yn = $('#treatment_history_yn').prop("checked");
        var q3_phy_yn, q3_inject_yn, q3_medi_yn, q3_needle_yn;
        var q3_phy_cnt, q3_inject_cnt, q3_medi_cnt, q3_needle_cnt;
        q3_phy_yn = $('#physiotherapy_yn').prop("checked");
        if (q3_phy_yn) {
            q3_phy_cnt = $("#physiotherapy_count").val();
        }

        q3_inject_yn = $('#injection_treatment_yn').prop("checked");
        if (q3_inject_yn) {
            q3_inject_cnt = $("#injection_treatment_count").val();
        }

        q3_medi_yn = $('#taking_medicine_yn').prop("checked");
        if (q3_medi_yn) {
            q3_medi_cnt = $("#taking_medicine_count").val();
        }

        q3_needle_yn = $('#acupuncture_yn').prop("checked");
        if (q3_needle_yn) {
            q3_needle_cnt = $("#acupuncture_count").val();
        }

        //4.
        var q4 = $(".js-range-slider").val();

        //5.
        var q5_yn = $(':radio[name="operation_yn"]:checked').val();
        var q5_year = '';
        var q5_name = '';
        if (q5_yn == undefined) {
            alert('5번 지문이 비어있습니다.');
            return;
        }
        if (q5_yn == 1) {
            q5_year = $("#operation_year").val();
            q5_name = $("#operation_name").val();
        }

        //6.
        var q6_item = '';
        var q6_film = '';
        var q6_etc = $('#test_etc').val();
        $('.test_kinds:checkbox:checked').each(function () {
            q6_item += (this.checked ? $(this).val() + "," : "");
        })


        $('.cd_film_yn:checkbox:checked').each(function () {
            q6_film += (this.checked ? $(this).val() + "," : "");
        })

        //7.
        var q7_item = '';
        var q7_etc = $('#disease_etc').val();
        var q7_medi = $('#medication').val();
        $('.disease_history_kinds:checkbox:checked').each(function () {
            q7_item += (this.checked ? $(this).val() + "," : "");
        });

        //8.
        var q8_yn = $(':radio[name="medicine_side_effects"]:checked').val();
        if (q8_yn == undefined) {
            alert('8번 지문이 비어있습니다.');
            return;
        }

        //9.
        var q9_yn = $(':radio[name="pregnant_radio"]:checked').val();
        if (q9_yn == undefined) {
            alert('9번 지문이 비어있습니다.');
            return;
        }

        //10.
        var q10_etc = $('#visit_motiv_etc').val();
        var q10_friend = $('#visit_motiv_friend').val();
        var q10_item = "";
        $('.visit_motiv_item:checkbox:checked').each(function () {
            q10_item += (this.checked ? $(this).val() + "," : "");
        })

        $.ajax({
            type: 'POST',
            url: '/receptionist/Question/save/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),
                'patient_id': $('#patient_id').val(),
                'pain_posi_text': q2_item,
                'sick_date': q2_date,
                'cure_yn': q3_yn,
                'cure_phy_yn': q3_phy_yn,
                'cure_phy_cnt': q3_phy_cnt,
                'cure_inject_yn': q3_inject_yn,
                'cure_inject_cnt': q3_inject_cnt,
                'cure_medi_yn': q3_medi_yn,
                'cure_medi_cnt': q3_medi_cnt,
                'cure_needle_yn': q3_needle_yn,
                'cure_needle_cnt': q3_needle_cnt,
                'pain_level': q4,
                'surgery_yn': q5_yn,
                'surgery_year': q5_year,
                'surgery_name': q5_name,
                'exam_kind': q6_item,
                'exam_etc': q6_etc,
                'cd_film_yn': q6_film,
                'disease_kind': q7_item,
                'disease_etc': q7_etc,
                'medication': q7_medi,
                'side_effect_yn': q8_yn,
                'pregnant_yn': q9_yn,
                'visit_motiv_etc': q10_etc,
                'visit_motiv_friend': q10_friend,
                'visit_motiv_item': q10_item,
            },
            dataType: 'Json',
            success: function (response) {
                $('#medical_exam_EventModal').modal('hide');
            },
            error: function (request, status, error) {
                alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        })
    });

    //3
    $("#physiotherapy_count").prop('disabled', true);
    $('#physiotherapy_yn').click(function () {
        if ($(this).prop("checked")) {
            $("#physiotherapy_count").prop('disabled', false);
        } else {
            $("#physiotherapy_count").val('');
            $("#physiotherapy_count").prop('disabled', true);
        }
    })
    $("#physiotherapy_count").keyup(function () {
        var str = $(this).val();
        $(this).val(str.replace(/[^0-9]/g, ""));
    });

    $("#injection_treatment_count").prop('disabled', true);
    $('#injection_treatment_yn').click(function () {
        if ($(this).prop("checked")) {
            $("#injection_treatment_count").prop('disabled', false);
        } else {
            $("#injection_treatment_count").val('');
            $("#injection_treatment_count").prop('disabled', true);
        }
    })
    $("#injection_treatment_count").keyup(function () {
        var str = $(this).val();
        $(this).val(str.replace(/[^0-9]/g, ""));
    });

    $("#taking_medicine_count").prop('disabled', true);
    $('#taking_medicine_yn').click(function () {
        if ($(this).prop("checked")) {
            $("#taking_medicine_count").prop('disabled', false);
        } else {
            $("#taking_medicine_count").val('');
            $("#taking_medicine_count").prop('disabled', true);
        }
    })
    $("#taking_medicine_count").keyup(function () {
        var str = $(this).val();
        $(this).val(str.replace(/[^0-9]/g, ""));
    });

    $("#acupuncture_count").prop('disabled', true);
    $('#acupuncture_yn').click(function () {
        if ($(this).prop("checked")) {
            $("#acupuncture_count").prop('disabled', false);
        } else {
            $("#acupuncture_count").val('');
            $("#acupuncture_count").prop('disabled', true);
        }
    })
    $("#acupuncture_count").keyup(function () {
        var str = $(this).val();
        $(this).val(str.replace(/[^0-9]/g, ""));
    });

    //5
    $('#operation_year').prop('disabled', true);
    $('#operation_name').prop('disabled', true);
    $('input:radio[name=operation_yn]').click(function () {
        var is_checked = $(':radio[name="operation_yn"]:checked').val();
        if (is_checked == 1) {
            $('#operation_year').prop('disabled', false);
            $('#operation_name').prop('disabled', false);
        } else {
            $('#operation_year').prop('disabled', true);
            $('#operation_name').prop('disabled', true);
        }
    });

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


function new_patient_option(on_off) {
    if (on_off) {
        $('#patient_tax_invoice_click').attr('disabled', false);
        $('#patient_medical_exam_click').attr('disabled', false);
        $('#need_medical_report').attr('disabled', false);
    } else {
        $('#patient_tax_invoice_click').attr('disabled', true);
        $('#patient_medical_exam_click').attr('disabled', true);
        $('#need_medical_report').attr('disabled', true);
        $('#need_medical_report').prop('checked', false);
    }
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
    $('#patient_id').val('');
    $('#reception_table input[type=text] ').each(function () {
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

function set_cancel() {
    earse_inputs();
}

function set_new_patient() {
    earse_inputs();
    new_patient_option(false);
    $.ajax({
        type: 'POST',
        url: '/receptionist/set_new_patient/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
        },
        dataType: 'Json',
        success: function (response) {
            //$('#patient_chart').val(response.chart);
            
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
                earse_inputs();
                set_new_patient(false);
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
                set_new_patient(false);
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

    new_patient_option(true);
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





$("#medical_exam_EventModal #save");