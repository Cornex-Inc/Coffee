
$(function () {

    $('#reservation_search_date').daterangepicker({
        autoUpdateInput: true,
        singleDatePicker: true,
        showDropdowns: true,
        drops: "down",
        locale: {
            format: 'YYYY-MM-DD HH:mm:ss',
            locale: { cancelLabel: 'Clear' }
        },
    });


    $('#reservation_search_doctor').empty();
    $('#reservation_search_doctor').append(new Option('---------', ''));
    $("#reservation_search_depart").change(function () {
        if (this.value == '') {
            $('#reservation_search_doctor').empty();
            return;
        }
        $.ajax({
            type: 'POST',
            url: '/receptionist/get_depart_doctor/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),
                'depart': this.value
            },
            dataType: 'Json',
            success: function (response) {
                $('#reservation_search_doctor').empty();
                $('#reservation_search_doctor').append(new Option('---------', ''));
                for (var i in response.datas)
                    $('#reservation_search_doctor').append("<option value='" + response.datas[i] + "'>" + i + "</Option>");

            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        })
    });



});


function get_doctor(part, depart = null) {
    var part_id = part.attr('id');
    var doctor;
    if (part_id == 'reservation_search_depart') {
        doctor = $('#reservation_search_doctor');
    } else if (part_id == 'reservation_depart') {
        doctor = $('#reservation_doctor');
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