

$(function () {
    //초기 불러오기
    $.ajax({
        type: 'POST',
        url: '/receptionist/Question/get/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'patient_id': $('#patient_id').val(),
        },
        dataType: 'Json',
        success: function (response) {
            if (response.result == false) {
                return;
            }

            //2
            
            var q2_item = response.pain_posi_text.split(',');
            for (var item in q2_item) {
                if (q2_item[item] == "") {
                    
                }
                else {
                    $('input[class=pain_location_text]:input[value=' + q2_item[item] + ']').attr("checked", true);
                }
            }
            $('#occurred_date').val(response.sick_date);
            //3
            if (response.cure_yn == "true") {
                $('#treatment_history_yn').attr("checked", true);
            } 
            if (response.cure_phy_yn == "true") {
                $('#physiotherapy_yn').attr("checked", true);
                $("#physiotherapy_count").prop('disabled', false);
                $('#physiotherapy_count').val(response.cure_phy_cnt);
            }
            if (response.cure_inject_yn == "true") {
                $('#injection_treatment_yn').attr("checked", true);
                $("#injection_treatment_count").prop('disabled', false);
                $('#injection_treatment_count').val(response.cure_inject_cnt);
            }
            if (response.cure_medi_yn == "true") {
                $('#taking_medicine_yn').attr("checked", true);
                $("#taking_medicine_count").prop('disabled', false);
                $('#taking_medicine_count').val(response.cure_medi_cnt);
            }
            if (response.cure_needle_yn == "true") {
                $('#acupuncture_yn').attr("checked", true);
                $("#acupuncture_count").prop('disabled', false);
                $('#acupuncture_count').val(response.cure_needle_cnt);
            }
  
            

            

            //4
            $('#pain_level').val(response.pain_level);
            
            //5
            $("input:radio[name=operation_yn]:input[value=" + response.surgery_yn + " ]").attr("checked", true);
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
                    $('input[class=test_kinds]:input[value=' + q6_item[item] + ']').attr("checked", true);
                }
            }
            
            $('#test_etc').val(response.exam_etc);
            var q6_film = response.cd_film_yn.split(',');
            for (var item in q6_film) {
                if (q6_film[item] == "") {
                }
                else {
                    $('input[class=cd_film_yn]:input[value=' + q6_film[item] + ']').attr("checked", true);
                }
            }
            
            //7
            var q7_item = response.disease_kind.split(',');
            for (var item in q7_item) {
                if (q7_item[item] == "") {
                }
                else {
                    $('input[class=disease_history_kinds]:input[value=' + q7_item[item] + ']').attr("checked", true);
                }
            }
            $('#disease_etc').val(response.disease_etc);
            $('#medication').val(response.medication);
            //8
            $("input:radio[name=medicine_side_effects]:input[value=" + response.side_effect_yn + " ]").attr("checked", true);
            //9
            $("input:radio[name=pregnant_radio]:input[value=" + response.pregnant_yn + " ]").attr("checked", true);

            //10
            $('#visit_motiv').val(response.visit_motiv);

            
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })


    $("#save").click(function () {
        var regex = /^[0-9]*$/;
        //2.
        var q2_item = "";
        var q2_date = "";
        $('.pain_location_text:checkbox:checked').each(function () {
            q2_item += (this.checked ? $(this).val()+"," : "");
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
        var q4 = $("#pain_level").children("option:selected").val();

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
        var q7_itme = '';
        var q7_etc = $('#disease_etc').val();
        var q7_medi = $('#medication').val();
        $('.disease_history_kinds:checkbox:checked').each(function () {
            q7_itme += (this.checked ? $(this).val() + "," : "");
        });

        //8.
        var q8_yn = $(':radio[name="medicine_side_effects"]:checked').val();
        if(q8_yn == undefined){
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
        var q10 = $('#visit_motiv').val();


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
                'disease_kind': q7_itme,
                'disease_etc': q7_etc,
                'medication': q7_medi,
                'side_effect_yn': q8_yn,
                'pregnant_yn': q9_yn,
                'visit_motiv': q10,
            },
            dataType: 'Json',
            success: function (response) {
                window.close();
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