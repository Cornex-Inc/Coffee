$(function () {

        document.addEventListener('DOMContentLoaded', function() {
        var calendarEl = document.getElementById('calendar');

        var calendar = new FullCalendar.Calendar(calendarEl, {
            plugins: [ 'interaction', 'dayGrid', 'timeGrid', ],
            header: {
            left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
        },
            defaultDate: '{% now "Y-m-d" %}',
        navLinks: true, // can click day/week names to navigate views
        businessHours: true,
        slotDuration: '00:05',
        Duration : "09:00:00",
        defaultTimedEventDuration:'00:10',
        editable: false,
        events: [

                {
            id : 1,
                title:'{{ data.patient.name_kor }} / {{ data.doctor }}',
                start:'{{ data.date | date:"Y-m-j"}}T17:10:00',
        color: '#257e4a' //
        },

        ],

            eventClick: function(info) {
            //alert('Event: ' + info.event.id);
            //alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
            //alert('View: ' + info.view.type);
        },



    });

    calendar.render();
});



});

