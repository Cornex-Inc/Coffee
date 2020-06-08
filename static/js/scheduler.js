

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
        defaultView: 'dayGridMonth',
        header: {
            left: 'prev,next',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay',
        },
        //
        //
        // defaultDate: '{% now "Y-m-d" %}',
        // defaultView: 'timeGridWeek',
         navLinks: true, // can click day/week names to navigate views
        //
        // defaultTimedEventDuration: '00:20',
         editable: false,
        // height: 'parent',
        // firstDay: 2,
        eventTextColor: '#000000',
        //eventBorderColor:'#a9dded',
        //eventBackgroundColor:'#d7f0f7',

        eventClick: function (info) {

            //alert('Event: ' + info.event.id);
            //alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
            //alert('View: ' + info.view.type);
        },
        eventDrop: function (eventDropInfo) {
            //modifySchedule(eventDropInfo.event);
        },
        events: function (info, successCallback, failureCallback) {
            $.ajax({
                type: 'POST',
                url: '/KBL/scheduler_events/',
                data: {
                    'csrfmiddlewaretoken': $('#csrf').val(),
                    'date_start': info.startStr,
                    'date_end': info.endStr,

                    'filter_type': $("#filter_type").val(),

                },
                dataType: 'Json',
                success: function (response) {
                    successCallback(response.list_project);

                },
                error: function (request, status, error) {
                    console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
                },
            });
        },
        eventRender: function (event) {
            
            //event.el.find('.fc-title').prepend('<span class="glyphicon">s</span> ');
        },
        eventLimit: true,

    })
    calendar.render();



    $('#contents_filter_year,#contents_filter_month, #filter_type').change(function () {
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

