

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

    var type = $("#revenue_search_type").val();

    var start = $("#date_start").val();
    var end = $("#date_end").val();
    var depart = $("#contents_filter_depart").val();

    $('#statistics_table_body').empty();
    $.ajax({
        type: 'POST',
        url: '/manage/statistics/search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'type': type,

            'start': start,
            'end': end,
            'depart': depart,
        },
        dataType: 'Json',
        success: function (response) {
            console.log(response)
            if (type == 'MEDICINE') {
                var total_lastest_amount = 0;
                var total_input_amount = 0;
                var total_consuming_fee = 0;
                var total_revenue = 0;
                var total_profit = 0;

                for (var i = 0; i < response.datas.length; i++) {
                    var str = "";

                    if (response.datas[i]) {

                        str = "<tr><td>" + (i+1) + "</td>" +
                            "<td>" + response.datas[i]['name'] + "</td>" +
                            "<td>" + response.datas[i]['unit'] + "</td>" +
                            "<td>" + response.datas[i]['beginning_count'] + "</td>" +
                            "<td>" + numberWithCommas(response.datas[i]['beginning_unit_price']) + "</td>" +
                            "<td>" + numberWithCommas(response.datas[i]['beginning_count'] * response.datas[i]['beginning_unit_price']) + "</td>" +
                            "<td>" + response.datas[i]['input'] + "</td>" +
                            "<td>" + numberWithCommas(response.datas[i]['input_average']) + "</td>" +
                            "<td>" + numberWithCommas(response.datas[i]['input_price']) + "</td>" +
                            "<td>" + numberWithCommas(response.datas[i]['count']) + "</td>" +
                            "<td>" + numberWithCommas(response.datas[i]['count'] * response.datas[i]['input_average'] )+ "</td>" +
                            "<td>" + numberWithCommas(response.datas[i]['price_average'] ) + "</td>" +
                            "<td>" + numberWithCommas(response.datas[i]['price_sum'] )+ "</td>" +
                            "<td>" + numberWithCommas(response.datas[i]['price_sum'] - response.datas[i]['count'] * response.datas[i]['input_average']) + "</td></tr>"


                        total_lastest_amount += response.datas[i]['beginning_count'] * response.datas[i]['beginning_unit_price'];
                        total_input_amount += response.datas[i]['input_price'];
                        total_consuming_fee += response.datas[i]['count'] * response.datas[i]['input_average'];
                        total_revenue += response.datas[i]['price_sum'];
                        total_profit += response.datas[i]['price_sum'] - response.datas[i]['count'] * response.datas[i]['input_average'];

                    }
                    $('#statistics_table_body').append(str);


                }

                $("#total_lastest_amount").html(numberWithCommas(total_lastest_amount));
                $("#total_input_amount").html(numberWithCommas(total_input_amount));
                $("#total_consuming_fee").html(numberWithCommas(total_consuming_fee));
                $("#total_revenue").html(numberWithCommas(total_revenue));
                $("#total_profit").html(numberWithCommas(total_profit));



                //$(".total_div span:nth-child(2)").html(numberWithCommas(response.total_purchace))

                //$(".total_div span:nth-child(4)").html(numberWithCommas(response.total_revenue))

            } else {
                for (var i = 0; i < response.datas.length; i++) {
                    var str = "";

                    if (response.datas[i]) {

                        str = "<tr><td>" + response.datas[i]['name'] + "</td>" +
                            "<td>" + response.datas[i]['count'] + "</td>" +
                            "<td>" + numberWithCommas(response.datas[i]['price_sum']) + "</td></tr>"

                    }
                    $('#statistics_table_body').append(str);
                }


                $(".total_div span:nth-child(2)").html(numberWithCommas(response.total_revenue))
            }

            

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}



function database_search_medicine(page = null) {

   

    var start = $("#date_start").val();
    var end = $("#date_end").val();
    var depart = $("#contents_filter_depart").val();

    $('#statistics_table_body').empty();
    $.ajax({
        type: 'POST',
        url: '/manage/statistics/search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'type': 'MEDICINE',

            'start': start,
            'end': end,
            'depart': depart,
        },
        dataType: 'Json',
        success: function (response) {
            console.log(response)
            

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}