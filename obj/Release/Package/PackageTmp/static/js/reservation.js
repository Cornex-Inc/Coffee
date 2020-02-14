
$(function () {
    //reservation_date.daterangepicker({
    //    autoUpdateInput: false,
    //    singleDatePicker: true,
    //    timePicker: true,
    //    timePicker24Hour: true,
    //    timePickerIncrement: 10,
    //    showDropdowns: true,
    //    drops: "up",
    //    locale: {
    //        format: 'YYYY-MM-DD HH:mm:ss',
    //        locale: { cancelLabel: 'Clear' }
    //    },
    //});
    //$('#Datepicker_reservation').on('apply.daterangepicker', function (ev, picker) {
    //    $('#Datepicker_reservation').val(picker.startDate.format('YYYY-MM-DD HH:mm:ss'));
    //});
    //$('#Datepicker_reservation').on('cancel.daterangepicker', function (ev, picker) {
    //    $('#Datepicker_reservation').val('');
    //});

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

