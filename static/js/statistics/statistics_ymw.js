

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

    var year = $("#contents_filter_year").val();
    var depart = $("#contents_filter_depart").val();

    
    $.ajax({
        type: 'POST',
        url: '/manage/statistics/search_ymw/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'year': year,
            'depart': depart,
        },
        dataType: 'Json',
        success: function (response) {
            console.log(response)

            if (response.datas_year) {
                $('#statistics_table_body_year').empty();
                for (var i = 0; i < response.datas_year.length; i++) {
                    var str = "";
                    if (response.datas_year[i]) {
                        str = "<tr><td>" + response.datas_year[i]['name'] + "</td>" +
                            "<td>" + response.datas_year[i]['count'] + "</td>" +
                            "<td>" + numberWithCommas(response.datas_year[i]['price_sum']) + "</td></tr>";
                    }
                    $('#statistics_table_body_year').append(str);
                }
            }

            if (response.datas_monthly) {
                $('#statistics_table_body_month').empty();
                for (var i = 0; i < response.datas_monthly.length; i++) {
                    var str = "";
                    if (response.datas_monthly[i]) {
                        str = "<tr><td>" + response.datas_monthly[i]['name'] + "</td>" +
                            "<td>" + response.datas_monthly[i]['count'] + "</td>" +
                            "<td>" + numberWithCommas(response.datas_monthly[i]['price_sum']) + "</td></tr>";
                    }
                    $('#statistics_table_body_month').append(str);
                }
            }

            if (response.datas_week) {
                $('#statistics_table_body_dayweek').empty();
                for (var i = 0; i < response.datas_week.length; i++) {
                    var str = "";
                    if (response.datas_week[i]) {
                        str = "<tr><td>" + response.datas_week[i]['name'] + "</td>" +
                            "<td>" + response.datas_week[i]['count'] + "</td>" +
                            "<td>" + numberWithCommas(response.datas_week[i]['price_sum']) + "</td></tr>";
                    }
                    $('#statistics_table_body_dayweek').append(str);
                }
            }

            if (response.datas_hour) {
                $('#statistics_table_body_hour').empty();
                for (var i = 0; i < response.datas_hour.length; i++) {
                    var str = "";
                    
                    str = "<tr><td>" + response.datas_hour[i]['name'] + "</td>" +
                        "<td>" + response.datas_hour[i]['count'] + "</td>" +
                        "<td>" + numberWithCommas(response.datas_hour[i]['price_sum']) + "</td></tr>";
                    
                    $('#statistics_table_body_hour').append(str);
                }
            }


        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}




