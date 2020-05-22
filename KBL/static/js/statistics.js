

jQuery.browser = {};
$(function () {



    //inventory history
    $('.date_input').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        locale: {
            format: 'YYYY-MM-DD'
        }
    });
    $("#date_start").val(moment().subtract(7, 'd').format('YYYY-MM-DD'));
    $('.date_input, #contents_filter_depart').change(function () {
        database_search();
    })

    database_search();

    
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



function database_search(page = null) {

    var start = $("#date_start").val();
    var end = $("#date_end").val();
    //var type = $("#contents_filter_type").val();

    $('#statistics_table_body').empty();
    $.ajax({
        type: 'POST',
        url: '/KBL/statistics_search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'start': start,
            'end': end,
            //'type': type,
        },
        dataType: 'Json',
        success: function (response) {
            console.log(response)
            for (var i = 0; i < response.datas.length; i++) {
                var str = "";
                
                if (response.datas[i]) {

                    str = "<tr><td>" + response.datas[i]['name'] + "</td>" +
                        "<td>" + response.datas[i]['quantity'] + "</td>" +
                        "<td>" + numberWithCommas(response.datas[i]['service_fee']) + "</td>" +
                        "<td>" + numberWithCommas(response.datas[i]['service_fee_vat']) + "</td>" +
                        "<td>" + numberWithCommas(response.datas[i]['service_fee_total']) + "</td></tr>";

                }
                $('#statistics_table_body').append(str);
            }

            $("#total_service_fee").html(numberWithCommas(response.total_service_fee));
            $("#total_service_fee_vat").html(numberWithCommas(response.total_service_fee_vat));
            $("#total_service_fee_total").html(numberWithCommas(response.total_service_fee_total));
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}




