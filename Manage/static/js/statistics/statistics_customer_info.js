

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

    
    $.ajax({
        type: 'POST',
        url: '/manage/statistics/search_customer_info/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'start': start,
            'end': end,
            'depart': depart,
        },
        dataType: 'Json',
        success: function (response) {
            console.log(response)
            if (response.datas_gender) {
                $('#statistics_table_body_gender').empty();
                for (var i = 0; i < response.datas_gender.length; i++) {
                    var str = "";
                    if (response.datas_gender[i]) {
                        str = "<tr><td>" + response.datas_gender[i]['name'] + "</td>" +
                            "<td>" + response.datas_gender[i]['count'] + "</td>" +
                            "<td>" + numberWithCommas(response.datas_gender[i]['price_sum']) + "</td></tr>";
                    }
                    $('#statistics_table_body_gender').append(str);
                }
            }

            if (response.datas_nation) {
                $('#statistics_table_body_nation').empty();
                for (var i = 0; i < response.datas_nation.length; i++) {
                    var str = "";
                    if (response.datas_nation[i]) {
                        str = "<tr><td>" + response.datas_nation[i]['name'] + "</td>" +
                            "<td>" + response.datas_nation[i]['count'] + "</td>" +
                            "<td>" + numberWithCommas(response.datas_nation[i]['price_sum']) + "</td></tr>";
                    }
                    $('#statistics_table_body_nation').append(str);
                }
            }

            if (response.datas_payment_method) {
                $('#statistics_table_body_payment_method').empty();
                for (var i = 0; i < response.datas_payment_method.length; i++) {
                    var str = "";
                    if (response.datas_payment_method[i]) {
                        str = "<tr><td>" + response.datas_payment_method[i]['name'] + "</td>" +
                            "<td>" + response.datas_payment_method[i]['count'] + "</td>" +
                            "<td>" + numberWithCommas(response.datas_payment_method[i]['price_sum']) + "</td></tr>";
                    }
                    $('#statistics_table_body_payment_method').append(str);
                }
            }

            if (response.datas_age) {
                $('#statistics_table_body_age').empty();
                for (var i = 0; i < response.datas_age.length; i++) {
                    var str = "";
                    
                    str = "<tr><td>" + response.datas_age[i]['name'] + "</td>" +
                        "<td>" + response.datas_age[i]['count'] + "</td>" +
                        "<td>" + numberWithCommas(response.datas_age[i]['price_sum']) + "</td></tr>";
                    
                    $('#statistics_table_body_age').append(str);
                }
            }

            if (response.datas_top20) {
                $('#statistics_table_body_top20').empty();
                for (var i = 0; i < response.datas_top20.length; i++) {
                    var str = "";

                    str = "<tr><td>" + (i + 1) + "</td>" +
                        "<td>" + response.datas_top20[i]['name'] + "</td>" +
                        "<td>" + response.datas_top20[i]['date_of_birth'] + "</td>" +
                        "<td>" + response.datas_top20[i]['gender'] + "</td>" +
                        "<td>" + response.datas_top20[i]['phone'] + "</td>" +
                        "<td>" + response.datas_top20[i]['last_visit'] + "</td>" +
                        "<td>" + numberWithCommas(response.datas_top20[i]['total_amount']) + "</td></tr>";

                    $('#statistics_table_body_top20').append(str);
                }
            }


        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}




