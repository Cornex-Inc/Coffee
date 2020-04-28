
jQuery.browser = {};
var reception_event_count = 0;
$(function () {
    //init


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
    if ($("#reception_waiting_date_start").length > 0) {
        $("#reception_waiting_date_start").daterangepicker({
            singleDatePicker: true,
            locale: {
                format: 'YYYY-MM-DD'
            }
        });
    }
    if ($("#reception_waiting_date_end").length > 0) {
        $("#reception_waiting_date_end").daterangepicker({
            singleDatePicker: true,
            locale: {
                format: 'YYYY-MM-DD'
            }
        });
    }
    //$('#reception_waiting_date').on('apply.daterangepicker', function () {
    //    today = moment().format('YYYY[-]MM[-]DD');
    //    date = $('#reception_waiting_date').val();
    //    if (date == today) {
    //        reception_waiting_date_worker(true);
    //    } else {
    //        reception_waiting_date_worker(false);
    //        reception_search();
    //    }
    //});

    

    $("#depart_select").change(function () {
        get_doctor($("#depart_select"));
    });
    $("#edit_reception_depart").change(function () {
        get_doctor($("#edit_reception_depart"));
    });



    $("#reception_waiting_date_start, #reception_waiting_date_end").change(function () {
        reception_search();
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

    $('#reception_reservation_date_start,#reception_reservation_date_end').daterangepicker({
        singleDatePicker: true,
        drops: "up",
        locale: {
            format: 'YYYY-MM-DD'
        }
    });

    $('#reception_reservation_date_start,#reception_reservation_date_end').on('apply.daterangepicker', function () {
        reservation_search();
    });

    reservation_search();

    //보험
    $('#patient_tax_invoice_click').click(function () {

        //초기화
        $('#tax_exam_EventModal input[type=hidden]').val('');
        $('#tax_exam_EventModal input[type=text]').val('');

        //불러오기
        $.ajax({
            type: 'POST',
            url: '/receptionist/Tax_Invoice/get/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),
                'patient_id': $('#patient_id').val(),
            },
            dataType: 'Json',
            success: function (response) {
                //id - hidden
                $('#selected_tax_invoice_id').val(response['id']),
                //chart no
                $('#tax_invoice_chart').val(response['chart']);
                //name
                $('#tax_invoice_name').val(response['name_kor'] + "/" + response['name_eng']);
                //date of birth
                $('#tax_invoice_date_of_birth').val(response['date_of_birth'] + ' (' + response['gender'] + '/' + response['age'] + ")");

                //tax invoice info
                $('#tax_invoice_number').val(response['number']);
                $('#tax_invoice_company_name').val(response['company_name']);
                $('#tax_invoice_address').val(response['address']);

            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        })



        $('#tax_exam_EventModal').modal({ backdrop: 'static', keyboard: false });
        $("#tax_exam_EventModal").scrollTop(0);
        $('#tax_exam_EventModal').modal('show');


        //저장
        $('#tax_invoice_save').click(function () {
            $.ajax({
                type: 'POST',
                url: '/receptionist/Tax_Invoice/save/',
                data: {
                    'csrfmiddlewaretoken': $('#csrf').val(),
                    'patient_id': $('#patient_id').val(),
                    'number': $('#tax_invoice_number').val(),
                    'company_name': $('#tax_invoice_company_name').val(),
                    'address': $('#tax_invoice_address').val(),
                },
                dataType: 'Json',
                success: function (response) {
                    $('#tax_exam_EventModal').modal('hide');
                },
                error: function (request, status, error) {
                    console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

                },
            })


        })

    })


    //문2 선택
    $(".q2_item_select ").change(function () {
        var data_code = $(this).attr('data_code');

        if ($('#pain_location_text_' + data_code).is(':checked') != true) {
            $('#pain_location_text_' + data_code).prop('checked', true);
        }
        

        str = '';
        str += parseInt($('#pain_location_text_' + data_code).val()) + '-';
        str += parseInt($("#q2_item_select1_" + data_code).val()) + '-';
        str += parseInt($("#q2_item_select2_" + data_code).val()) ;

        $('.q2_items').each(function () {

            if ($(this).attr('data_code') == data_code) {
                $(this).hide();
            }
        });
            
        
        $('#q2_items_' + str).show();
    })
    //문2 해제
    $('.pain_location_text').change(function () {
        if ($(this).is(':checked')!= true) {
            var data_code = $(this).attr('data_code');
            str = '';
            str += $('#pain_location_text_' + data_code).val() + '-';
            str += $("#q2_item_select1_" + data_code).val() + '-';
            str += $("#q2_item_select2_" + data_code).val();

            $('#q2_items_' + str).hide();

            $("#q2_item_select1_" + data_code).val($("#q2_item_select1_" + data_code + " option:first").val());
            $("#q2_item_select2_" + data_code).val($("#q2_item_select2_" + data_code + " option:first").val());
        }
        
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
    

    $("#patient_initial_report_click").click(function () {
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
                $('.q2_items').hide();

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
                //vital
                $('#input_vital_height').val(response.vital_height);
                $('#input_vital_weight').val(response.vital_weight);
                $('#input_vital_bmi').val(response.vital_bmi);
                $('#input_vital_bp').val(response.vital_bp);
                $('#input_vital_bt').val(response.vital_bt);


                //2

                var q2_item = response.pain_posi_text.split(',');
                for (var item in q2_item) {
                    if (q2_item[item] == "") {
                    }
                    else {
                        var code = q2_item[item].split('-')
                        if (code.length == 1) {
                            $('#pain_location_text_' + code[0]).prop('checked', true);
                        } else {
                            $('#pain_location_text_' + code[0]).prop('checked', true);
                            $('#q2_item_select1_' + code[0] + ' option[value=' + code[1] + ']').attr('selected', 'selected');
                            $('#q2_item_select2_' + code[0] + ' option[value=' + code[2] + ']').attr('selected', 'selected');

                            $('#q2_items_' + q2_item[item]).show();
                            //$('input[class=pain_location_text]:input[value=' + q2_item[item] + ']').prop("checked", true);
                        }
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
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
        });

        $('#medical_exam_EventModal').modal({ backdrop: 'static', keyboard: false });
        $("#medical_exam_EventModal").scrollTop(0);
        $('#medical_exam_EventModal').modal('show');
    });

    $("#save").click(function () {
        var regex = /^[0-9]*$/;
        //vital sign

        var vital_height = $('#input_vital_height').val();
        var vital_weight = $('#input_vital_weight').val();
        var vital_bmi = $('#input_vital_bmi').val();
        var vital_bp = $('#input_vital_bp').val();
        var vital_bt = $('#input_vital_bt').val();



        //2.
        var q2_item = "";
        var q2_date = "";
        //$('.pain_location_text:checkbox:checked').each(function () {
        //    q2_item += (this.checked ? $(this).val() + "," : "");
        //})

        q2_date = $('#occurred_date').val();
        $('.q2_items:visible').each(function () {
            q2_item += $(this).attr('data_seq') + ',';
        });
        $('#pain_location_text_23, #pain_location_text_24, #pain_location_text_25, #pain_location_text_26, #pain_location_text_27').each(function () {
            q2_item += (this.checked ? $(this).val() + "," : "");
        });


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
            alert(gettext('Question 5 is empty.'));
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
            alert(gettext('Question 8 is empty.'));
            return;
        }

        //9.
        var q9_yn = $(':radio[name="pregnant_radio"]:checked').val();
        if (q9_yn == undefined) {
            alert(gettext('Question 9 is empty.'));
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


                'vital_height': vital_height,
                'vital_weight': vital_weight,
                'vital_bmi': vital_bmi,
                'vital_bp': vital_bp,
                'vital_bt': vital_bt,
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
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        })
    });

    //vital sign
    $("#input_vital_bp, #input_vital_temp, #input_vital_rr, #input_vital_pr").keyup(function () {
        var str = $(this).val();
        $(this).val(str.replace(/[^0-9./]/g, ""));
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


    reception_search();
    new_patient_option(false);


});


$("#reservation_table").click(function () {
    $('#reservation_table > tbody > tr').remove();
    $('#reservation_table > tbody').append('<tr><td>추가된 라인!!</td></tr>');

});

function get_doctor(part, depart = null, selected= null) {
    var part_id = part.attr('id');
    var doctor;
    if (part_id == 'depart_select') {
        doctor = $('#doctor_select');
    } else if (part_id == 'reception_waiting_depart') {
        doctor = $('#reception_waiting_doctor');
    } else if (part_id == 'reservation_depart_select') {
        doctor = $('#reservation_doctor_select');
    } else if (part_id == 'edit_reception_depart') {
        doctor = $('#edit_reception_doctor');
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
            for (var i in response.datas) {
                if (selected == response.datas[i]) {
                    doctor.append("<option value='" + response.datas[i] + "' selected>" + i + "</Option>");
                } else {
                    doctor.append("<option value='" + response.datas[i] + "'>" + i + "</Option>");
                }
                
            }

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}


function new_patient_option(on_off) {
    if (on_off) {
        $('#patient_tax_invoice_click').attr('disabled', false);
        $('#patient_initial_report_click').attr('disabled', false);
        $('#need_medical_report').attr('disabled', false);
        $('#need_invoice').attr('disabled', false);
        $('#need_insurance').attr('disabled', false);

    } else {
        $('#patient_tax_invoice_click').attr('disabled', true);
        $('#patient_initial_report_click').attr('disabled', true);
        $('#need_medical_report').attr('disabled', true);
        $('#need_medical_report').prop('checked', false);
        //$('#need_invoice').attr('disabled', true);
        $('#need_invoice').prop('checked', false);
        //$('#need_insurance').attr('disabled', true);
        $('#need_insurance').prop('checked', false);


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
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

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
    $('#patient_nationality option:eq(0)').prop("selected", true);
    $('#patient_gender option:eq(0)').prop("selected", true);
    $('input:radio[name=gender]').prop('checked', false);
    
}

function set_cancel() {
    earse_inputs();
    new_patient_option(false);
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
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
    
        },
    })
}


function patient_check_required() {
    var $t, t;
    var fields = [$('#patient_name_kor'),
        $('#patient_name_eng'),
        $('#patient_date_of_birth'),
        $('#patient_address'),
        $('#patient_phone'),
        $('#patient_email'),

    ]

    if ($('#patient_gender').val() == '' ){
        alert(gettext("'Gender' is necessary."));
        return false;
    }
    if ($('#patient_nationality').val() == '') {
        alert(gettext("'Nationality' is necessary."));
        return false;
    }

    var result = true;
    $.each(fields,function () {
        $t = jQuery(this);
        if ($t.prop("required")) {
            if (!jQuery.trim($t.val())) {
                t = $t.attr("name");
                $t.focus();
                alert(gettext("'" + t + "'" + "is necessary."));
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
    var gender = $('#patient_gender').val();
    var nationality = $("#patient_nationality").val();
    //var gender = $('input[name="gender"]:checked').val();
    var address = $('#patient_address').val();
    var phone = $('#patient_phone').val();
    var email = $('#patient_email').val();
    var memo = $('#patient_memo').val();
      
    var past_history = $('#history_past').val();
    var family_history = $('#history_family').val();

    var tax_invoice_number = $('#tax_invoice_number').val();
    var tax_invoice_company_name = $('#tax_invoice_company_name').val();
    var tax_invoice_address = $('#tax_invoice_address').val();

    var patient_table_vital_ht = $('#patient_table_vital_ht').val();
    var patient_table_vital_wt = $('#patient_table_vital_wt').val();
    var patient_table_vital_bmi = $('#patient_table_vital_bmi').val();
    var patient_table_vital_bp = $('#patient_table_vital_bp').val();
    var patient_table_vital_bt = $('#patient_table_vital_bt').val();
    var patient_table_vital_pr = $('#patient_table_vital_pr').val();
    var patient_table_vital_breath = $('#patient_table_vital_breath').val();


    $.ajax({
        type: 'POST',
        url: '/receptionist/save_patient/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'id': id,
            'cahrt_no': chart_no,
            'name_kor': name_kor,
            'name_eng': name_eng,
            'date_of_birth': date_of_birth,
            'phone': phone,
            'nationality': nationality,
            'gender': gender,
            'address': address,
            'past_history': past_history,
            'family_history': family_history,
            'email': email,
            'memo': memo,

            'tax_invoice_number': tax_invoice_number,
            'tax_invoice_company_name': tax_invoice_company_name,
            'tax_invoice_address': tax_invoice_address,


            'patient_table_vital_ht': patient_table_vital_ht,
            'patient_table_vital_wt': patient_table_vital_wt,
            'patient_table_vital_bmi': patient_table_vital_bmi,
            'patient_table_vital_bp': patient_table_vital_bp,
            'patient_table_vital_bt ': patient_table_vital_bt,
            'patient_table_vital_pr': patient_table_vital_pr,
            'patient_table_vital_breath': patient_table_vital_breath,

        },
        dataType: 'Json',
        success: function (response) {
            if (response.result == true) {
                alert(gettext('Saved.'));
                earse_inputs();
                set_new_patient(false);


                //검색 리스트에 띄우기
                $('#Patient_Search > tbody ').empty();
                var str = "<tr style='cursor:pointer;' onclick='set_patient_data(" +
                    parseInt(response.id) +
                    ")'><td>" + 1 + "</td>";

                str += "<td>";


                str += response.chart + "</td>" +
                    "<td>" + response.name_kor + '<br/>' + response.name_eng + "</td>" +
                    "<td>" + response.date_of_birth + ' (' + response.gender + '/' + response.age + ")</td>" +
                    "<td>" + response.phonenumber + "</td>" +
                    "<td>" + response.address + "</td></tr>";

                $('#Patient_Search').append(str);
            } else {
                alert(gettext('Failed.'));
            }

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

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
                alert(gettext("'" + t + "'" + "is necessary."));
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

    var id = $('#patient_id').val();
    var chart_no = $('#patient_chart').val();
    var name_kor = $('#patient_name_kor').val();
    var name_eng = $('#patient_name_eng').val();
    var date_of_birth = $('#patient_date_of_birth').val();
    var gender = $('#patient_gender').val();
    var nationality = $("#patient_nationality").val();
    //var gender = $('input[name="gender"]:checked').val();
    var address = $('#patient_address').val();
    var phone = $('#patient_phone').val();
    var email = $('#patient_email').val();
    var memo = $('#patient_memo').val();


    var past_history = $('#history_past').val();
    var family_history = $('#history_family').val();

    var depart = $('#depart_select').val();
    if (depart == '') {
        alert(gettext('Select Depart.'));
        return;
    }

    var doctor = $('#doctor_select').val();
    if (doctor == '') {
        alert(gettext('Select Doctor.'));
        return;
    }
    var chief_complaint = $('#chief_complaint').val();

    var tax_invoice_number = $('#tax_invoice_number').val();
    var tax_invoice_company_name = $('#tax_invoice_company_name').val();
    var tax_invoice_address = $('#tax_invoice_address').val();

    var need_medical_report = $('#need_medical_report').prop("checked");
    var need_invoice = $("#need_invoice").prop("checked");
    var need_insurance = $("#need_insurance").prop("checked");

    var patient_table_vital_ht = $('#patient_table_vital_ht').val();
    var patient_table_vital_wt = $('#patient_table_vital_wt').val();
    var patient_table_vital_bmi = $('#patient_table_vital_bmi').val();
    var patient_table_vital_bp = $('#patient_table_vital_bp').val();
    var patient_table_vital_bt = $('#patient_table_vital_bt').val();
    var patient_table_vital_pr = $('#patient_table_vital_pr').val();
    var patient_table_vital_breath = $('#patient_table_vital_breath').val();


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
            'nationality': nationality,
            'email': email,
            'memo':memo,


            'tax_invoice_number': tax_invoice_number,
            'tax_invoice_company_name': tax_invoice_company_name,
            'tax_invoice_address': tax_invoice_address,

            'need_medical_report': need_medical_report,
            'need_invoice': need_invoice,
            'need_insurance': need_insurance,

            'patient_table_vital_ht': patient_table_vital_ht,
            'patient_table_vital_wt': patient_table_vital_wt,
            'patient_table_vital_bmi': patient_table_vital_bmi,
            'patient_table_vital_bp': patient_table_vital_bp,
            'patient_table_vital_bt': patient_table_vital_bt,
            'patient_table_vital_pr': patient_table_vital_pr,
            'patient_table_vital_breath': patient_table_vital_breath,
        },
        dataType: 'Json',
        success: function (response) {
            if (response.result == true) {
                alert(gettext('has been Recepted.'));
                reception_search(true);
                earse_inputs();
                set_new_patient(false);


                //검색 리스트에 띄우기
                $('#Patient_Search > tbody ').empty();
                var str = "<tr style='cursor:pointer;' onclick='set_patient_data(" +
                    parseInt(response.id) +
                    ")'><td>" + 1 + "</td>";

                str += "<td>";


                str += response.chart + "</td>" +
                    "<td>" + response.name_kor + ' / ' + response.name_eng + "</td>" +
                    "<td>" + response.date_of_birth + ' (' + response.gender + '/' + response.age + ")</td>" +
                    "<td>" + response.phonenumber + "</td>" +
                    "<td>" + response.address + "</td></tr>";

                $('#Patient_Search').append(str);


            } else {
                alert(gettext('failed to recepted.'));
            }


        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

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
            $("#patient_gender").val(response.gender);
            $('#patient_nationality').val(response.nationality);
            $('#patient_email').val(response.email);
            $('#patient_memo').val(response.memo);
            
            $('#history_past').val(response.history_past);
            $('#history_family').val(response.history_family);

            $('input:radio[name=gender]').filter('[value=' + response.gender + ']').prop('checked', true);  

            //tax invoice
            $('#tax_invoice_number').val(response.tax_invoice_number);
            $('#tax_invoice_company_name').val(response.tax_invoice_company_name);
            $('#tax_invoice_address').val(response.tax_invoice_address);
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

    new_patient_option(true);
}


function patient_search(data) {
    //window.location.href = 'reception/' + data;

    var category = $('#patient_search_select option:selected').val();
    var string = $('#patient_search_input').val();

    if (string == null || string == '') {
        alert(gettext('Input search string.'));
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
                $('#Patient_Search').append("<tr><td colspan='8'>" + gettext('No Result !!') + "</td></tr>");
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

                    str += response.datas[i]['chart'] + "</td>" +
                        "<td>" + response.datas[i]['name_kor'] + '<br />' + response.datas[i]['name_eng'] + "</td>" +
                        "<td>" + response.datas[i]['date_of_birth'] + ' (' + response.datas[i]['gender'] + '/' + response.datas[i]['age'] + ")</td>" +
                        "<td>" + response.datas[i]['phonenumber'] + "</td>" +
                        "<td>" + response.datas[i]['depart'] + "</td>" +
                        "<td>" + response.datas[i]['last_visit'] + "</td></tr>";
                        //"<td><a class='btn btn-default btn-xs' href='javascript: void (0);' onclick='delete_database_precedure(" + response.datas[i]['id'] + ")' ><i class='fa fa-lg fa-history'></i></a></td></tr>";

                    $('#Patient_Search').append(str);
                }
            }
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}

function reception_edit(id = null) {

    $('#selected_reception_id').val();

    $('#edit_reception_depart option:eq(0)').prop("selected", true);
    
    $('#edit_reception_title').empty();
    $('#edit_reception_title').append(new Option('---------', ''));
    $('#reception_edit_need_medical_report').prop('checked', false);
    if (id == null) {
        alert(gettext('Abnormal approach'));
        return;
    }


    $.ajax({
        type: 'POST',
        url: '/receptionist/Edit_Reception/get/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'reception_id': id,
        },
        dataType: 'Json',
        success: function (response) {
            //chart no
            $('#edit_reception_chart').val(response['chart']);
            //name
            $('#edit_reception_name').val(response['name_kor'] + "/" + response['name_eng']);
            //date of birth
            $('#edit_reception_date_of_birth').val(response['date_of_birth'] + ' (' + response['gender'] + '/' + response['age'] + ")");

            //depart & doctor
            $('#edit_reception_depart option[value=' + response['depart_id'] + ']').prop("selected", true);
            get_doctor($("#edit_reception_depart"), null, response['doctor_id']);
            
            //$('#edit_reception_doctor option[value=' + response['doctor_id'] + ']').prop("selected", true);


            //chief complaint
            $("#edit_reception_chief_complaint").val(response['chief_complaint']);

            //medical_report
            if (response['medical_report'] == true)
                $('#reception_edit_need_medical_report').prop('checked', true);

            $('#selected_reception_id').val(response['id']);

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    });


    ////////////////////////////////////////////////
    $('#Edit_Reception_EventModal').modal({ backdrop: 'static', keyboard: false });
    $("#Edit_Reception_EventModal").scrollTop(0);
    $('#Edit_Reception_EventModal').modal('show');

}

function reception_search() {
    var date_start, date_end, depart, doctor;

    date_start = $('#reception_waiting_date_start').val().trim();
    date_end = $('#reception_waiting_date_end').val().trim();


    depart = $('#reception_waiting_depart option:selected').val().trim();
   //doctor = $('#reception_waiting_doctor option:selected').val().trim();

    $.ajax({
        type: 'POST',
        url: '/receptionist/reception_search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'date_start': date_start,
            'date_end': date_end,
            'depart': depart,
            'doctor': doctor,
        },
        dataType: 'Json',
        success: function (response) {
            $('#Rectption_Status > tbody ').empty();
            if ( response.datas.length == 0 ) {
                $('#Rectption_Status').append("<tr><td colspan='9'>" + gettext('No Result !!') + "</td></tr>");
            } else {
                for (var i in response.datas) {
                    var str = "<tr><td>" + (parseInt(i) + 1) + "</td>";

                        if (response.datas[i]['has_unpaid']) {
                            str += "<td style=color:rgb(228,97,131);>";
                        } else {
                            str += "<td>";
                        }
                    str += response.datas[i]['chart'] + "</td>" +
                        "<td>" + response.datas[i]['name_kor'] + "<br/>" + response.datas[i]['name_eng'] + "</td>" +
                        "<td>" + response.datas[i]['date_of_birth'] +' ('+ response.datas[i]['gender']+'/' + response.datas[i]['age'] + ")</td>" +
                        "<td>" + response.datas[i]['depart'] + "</td>" +
                        "<td>" + response.datas[i]['doctor'] + "</td>" +
                        "<td>" + response.datas[i]['time'] + "</td>" +
                        "<td> " + response.datas[i]['is_new'] + "</td>" + 
                        "<td> <input type='button' class='btn btn-default' value='Edit' onclick='reception_edit(" + response.datas[i]['id'] + ")'/></td></tr > ";

                    $('#Rectption_Status').append(str);
                }
            }
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

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
                $('#Payment_Status').append("<tr><td colspan='8'>" + gettext('No Result !!') + "</td></tr>");
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
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}


function reservation_search(Today = false) {
    var date, depart, doctor, status;

    //date = today = moment().format('YYYY[-]MM[-]DD');
    date_start = $('#reception_reservation_date_start').val();
    date_end = $('#reception_reservation_date_end').val();
    if (date == '')
        date = today = moment().format('YYYY[-]MM[-]DD');
    depart = $('#reservation_depart_select option:selected').val();
    doctor = $('#reservation_doctor_select option:selected').val();

    $.ajax({
        type: 'POST',
        url: '/receptionist/reservation_search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'date_start': date_start,
            'date_end': date_end,
            'depart': depart,
            'doctor': doctor,
            'status': status,
        },
        dataType: 'Json',
        success: function (response) {
            $('#Reservation_Status > tbody ').empty();
            if (response.datas.length == 0) {
                $('#Reservation_Status').append("<tr><td colspan='8'>" + gettext('No Result !!') + "</td></tr>");
            } else {
                for (var i in response.datas) {
                    var str = "<tr title='" + response.datas[i]['memo'] + "'><td>" + (parseInt(i) + 1) + "</td>";

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
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

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


//Edit Reception Save
function edit_reception_save() {
    rec_id = $('#selected_reception_id').val();
    depart = $('#edit_reception_depart option:selected').val();
    doctor = $('#edit_reception_doctor option:selected').val();
    chief_complaint = $('#edit_reception_chief_complaint').val();
    medical_report = $('#reception_edit_need_medical_report').is(':checked');

    if (depart == '') {
        alert(gettext('Select Depart.'));
        return;
    }
    if (doctor == '') {
        alert(gettext('Select Doctor.'));
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/receptionist/Edit_Reception/save/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'reception_id': rec_id,
            'depart': depart,
            'doctor': doctor,
            'chief_complaint': chief_complaint,
            'medical_report': medical_report,
        },
        dataType: 'Json',
        success: function (response) {
            alert(gettext('Saved.'));
            reception_search();
            $('#Edit_Reception_EventModal').modal('hide');
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        },
    })

}

function edit_reception_del() {
    if (confirm(gettext('Are you sure you want to delete ?'))) {

        rec_id = $('#selected_reception_id').val();
        $.ajax({
            type: 'POST',
            url: '/receptionist/Edit_Reception/delete/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),
                'reception_id': rec_id,
            },
            dataType: 'Json',
            success: function (response) {
                alert(gettext('Deleted.'));
                reception_search();
                $('#Edit_Reception_EventModal').modal('hide');
            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
        })
    }

    

}