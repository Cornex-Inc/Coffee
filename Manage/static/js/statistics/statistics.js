

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
            for (var i = 0; i < response.datas.length; i++) {
                var str = "";
                
                if (response.datas[i]) {

                    str = "<tr><td>" + response.datas[i]['name'] + "</td>" +
                        "<td>" + response.datas[i]['count'] + "</td>" +
                        "<td>" + numberWithCommas(response.datas[i]['price_sum']) + "</td></tr>"

                }
                $('#statistics_table_body').append(str);
            }


            //∆‰¿Ã¬°
            $('#medicine_pagnation').html('');
            str = '';
            if (response.has_previous == true) {
                str += '<li> <a onclick="test_database_search(' + (response.page_number - 1) + ')">&laquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&laquo;</span></li>';
            }

            for (var i = response.page_range_start; i < response.page_range_stop; i++) {
                if (response.page_number == i) {
                    str += '<li class="active"><span>' + i + ' <span class="sr-only">(current)</span></span></li>';
                }
                else if (response.page_number + 5 > i && response.page_number - 5 < i) {
                    str += '<li> <a onclick="test_database_search(' + i + ')">' + i + '</a></li>';
                }
                else {
                }

            }
            if (response.has_next == true) {
                str += '<li><a onclick="test_database_search(' + (response.page_number + 1) + ')">&raquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&raquo;</span></li>';
            }
            $('#medicine_pagnation').html(str);


            $(".total_div span:nth-child(2)").html(numberWithCommas(response.total_revenue) )

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}




