

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

    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['interaction', 'dayGrid',],
        header: {
            left: ' ',
            center: 'title',
            right: ''
        },
        //
        //
        // defaultDate: '{% now "Y-m-d" %}',
        // defaultView: 'timeGridWeek',
        // navLinks: true, // can click day/week names to navigate views
        //
        // defaultTimedEventDuration: '00:20',
        // editable: true,
        // height: 'parent',
        // firstDay: 2,
        // eventTextColor: '#000000',
        //eventBorderColor:'#a9dded',
        //eventBackgroundColor:'#d7f0f7',

        eventClick: function (info) {

            //alert('Event: ' + info.event.id);
            //alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
            //alert('View: ' + info.view.type);
        },
        eventDrop: function (eventDropInfo) {
            modifySchedule(eventDropInfo.event);
        },

        events: function (info, successCallback, failureCallback) {
            $.ajax({
                type: 'POST',
                url: '/manage/statistics/search_daily/',
                data: {
                    'csrfmiddlewaretoken': $('#csrf').val(),
                    'year': $("#contents_filter_year").val(),
                    'month': $("#contents_filter_month").val(),

                    'depart': $("#contents_filter_depart").val(),

                },
                dataType: 'Json',
                success: function (response) {
                    console.log(response)

                    successCallback(response.datas_date_count);

                },
                error: function (request, status, error) {
                    console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
                },
            });
        },
    });
    calendar.render();



    $('#contents_filter_year,#contents_filter_month, #contents_filter_depart').change(function () {
        calendar.refetchEvents();

        var year = $("#contents_filter_year").val();
        var month = $("#contents_filter_month").val();

        console.log(year + '-' + month + '-01')

        calendar.gotoDate(year + '-' + leadingZeros(month,2) + '-01')
    })


    
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}




function leadingZeros(n, digits) {
    var zero = '';
    n = n.toString();

    if (n.length < digits) {
        for (var i = 0; i < digits - n.length; i++)
            zero += '0';
    }
    return zero + n;
}

