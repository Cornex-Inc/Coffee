$(function () {

    var is_register = false;
    $('.register_user').hide();
    $('.register_doctor').hide();
    $('.register_btn').hide();
    $('#need_register').click(function () {
        if (!is_register) {
            //$('body').attr('style', 'overflow-y:auto');
            $('.register_user').show();
            $('.register_doctor').show();
            $('.register_btn').show();
            is_register = true;
        }
        else {
            //$('body').attr('style', 'overflow-y:none;');
            $('.register_user').hide();
            $('.register_doctor').hide();
            $('.register_btn').hide();
            is_register = false;
        }
            
    });

    $("#btn_register_btn").click(function () {
        id = $('#register_id').val();
        password = $('#register_pw').val();
        password_check = $('#register_pw_ch').val();

        if (!/^[a-z0-9_+.-]+@([a-z0-9-]+\.)+[a-z0-9]{2,4}$/.test(id)) {
            alert('이메일 형식이 아닙니다.');
            return false;
        }
        if (!/^[a-zA-Z0-9]{8,16}$/.test(password)) {
            alert('숫자와 영문자 조합으로 8~16자리를 사용해야 합니다.');
            return false;
        }

        depart = $('#register_doctor_depart').val();
        if (depart == '') {
            alert('과를 선택해야 합니다.');
            return false;
        }


        $.ajax({
            type: 'POST',
            url: '/register/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),
                'id' : id,
                'password': password,
                'name_kor': name_kor,
                'name_eng': name_eng,
                'name_short': name_short,
                'depart': depart,
            },
            dataType: 'Json',
            success: function (response) {
                
            },
            error: function (request, status, error) {
                alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        })
    });


    $("#register_class").change(function () {
        var choice = $("#register_class option:selected").val();
        if (choice == 'DOCTOR') {
            $('.doctor_depart_select').show();
        } else {
            $('.doctor_depart_select').hide();
        }

    })

});
