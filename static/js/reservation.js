
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
                alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        })
    });



});
