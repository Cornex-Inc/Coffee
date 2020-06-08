jQuery.browser = {};
var timer_count = 0;
$(function () {


    $('#laboratory_list_calendar_start,#laboratory_list_calendar_end').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        locale: {
            format: 'YYYY-MM-DD'
        }
    });

    //언어 별 날짜 출력
    //초기값
    if ($("#language").val() == 'vi') {
        var today = moment().format('DD[/]MM[/]YYYY');
        $('#laboratory_list_calendar_start,#laboratory_list_calendar_end').val(today);
    }
    //선택 시 
    $('#laboratory_list_calendar_start, #laboratory_list_calendar_end').on('apply.daterangepicker', function (ev, picker) {
        var today = moment().format('YYYY[-]MM[-]DD');
        if ($("#language").val() == 'vi') {
            $(this).val(picker.startDate.format('DD/MM/YYYY'));
            today = moment().format('DD[/]MM[/]YYYY');
        }
        date = $('#reception_waiting_date').val();
        if (date == today) {
            worker_on(true);
        } else {
            worker_on(false);
        }
    });
    worker_on(true);


    $('#date_examination').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        timePicker24Hour: true,
        timePickerIncrement: 10,
        showDropdowns: true,
        drops: "down",
        locale: {
            format: 'YYYY-MM-DD HH:mm:ss',
            locale: { cancelLabel: 'Clear' }
        },
    });
    $('#date_examination').on('apply.daterangepicker', function (ev, picker) {
        $('#date_examination').val(picker.startDate.format('YYYY-MM-DD HH:mm:ss'));
    });
    $('#date_examination').on('cancel.daterangepicker', function (ev, picker) {
        $('#date_examination').val('');
    });



    $('#date_expected').daterangepicker({
        autoUpdateInput: false,
        singleDatePicker: true,
        showDropdowns: true,
        drops: "down",
        locale: {
            format: 'YYYY-MM-DD HH:mm:ss',
            locale: { cancelLabel: 'Clear' }
        },
    });
    $('#date_expected').on('apply.daterangepicker', function (ev, picker) {
        $('#date_expected').val(picker.startDate.format('YYYY-MM-DD'));
    });
    $('#date_expected').on('cancel.daterangepicker', function (ev, picker) {
        $('#date_expected').val('');
    });
});

//알람
function play_alarm() {
    var x = document.getElementById("audio").play();


    if (x !== undefined) {
        x.then(_ => {
            //console.log(_);
            // Autoplay started!
        }).catch(error => {
            console.log(error);
            // Autoplay was prevented.
            // Show a "Play" button so that user can start playback.
        });
    }
}

function laboratory_control_save(Done = false) {
    var selected_test_manage = $('#selected_test_manage').val();
    if (selected_test_manage.trim() == '') {
        alert(gettext('Select test first.'));
        return;
    }

    if (Done)
        status = 'done';
    else
        status = 'hold';

    $.ajax({
        type: 'POST',
        url: '/laboratory/save/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'status': status,
            'test_manage_id': selected_test_manage,
            'test_examination':$('#date_examination').val(),
            'test_expected':$('#date_expected').val(),
            'test_result': $('#lab_control_result').val(),

        },
        dataType: 'Json',
        success: function (response) {
            alert(gettext("Saved."));
            $('#laboratory_control input ').empty();
            waiting_list();
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}

function get_test_manage(test_manage_id) {
    $.ajax({
        type: 'POST',
        url: '/laboratory/get_test_manage/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'test_manage_id': test_manage_id,
        },
        dataType: 'Json',
        success: function (response) {
            $('.laboratory_control_table input').val('');

            $('#selected_test_manage').val(test_manage_id);


            $('#lab_control_chart').val(response['chart']);
            $('#lab_control_name').val(response['Name']);
            $('#lab_control_date_of_birth').val(response['Date_of_birth']);
            $('#lab_control_labname').val(response['Lab']);
            $('#date_ordered').val(response['date_ordered']);
            $('#date_expected').val(response['date_expected']);
            //$('#date_examination').val(response['test_examination']);
            //$('#date_reservation').val(response['test_reservation']);
            
            $('#lab_control_result').val(response['result']);
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}

function waiting_selected(manage_id) {



    $.ajax({
        type: 'POST',
        url: '/laboratory/waiting_selected/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'test_manage_id': manage_id,
        },
        dataType: 'Json',
        success: function (response) {
            $('#laboratory_control input ').empty();

            $('#lab_control_chart').val(response.chart);
            $('#lab_control_name').val(response.Name);
            $('#lab_control_date_of_birth').val(response.Date_of_birth);
            $('#lab_control_labname').val(response.Lab);
            $('#date_ordered').val(response.date_ordered);
            $('#date_examination').val(response.date_examination);
            $('#date_expected').val(response.date_expected);
            $('#lab_control_result').val(response.result);
            $('#unit').html(response.unit)
            $('#selected_test_manage').val(manage_id);

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}

function waiting_list(Today = false, alarm = false) {
    var date, start, end;

    start = $('#laboratory_list_calendar_start').val();
    end = $('#laboratory_list_calendar_end').val();

    //언어에 따라 날짜가 다르기 때문에 서버 형식에 맞게 재설정 후 전송
    if ($("#language").val() == 'vi') {
        start = moment(start, 'DD/MM/YYYY').format('YYYY-MM-DD');
        end = moment(end, 'DD/MM/YYYY').format('YYYY-MM-DD');
    }


    $.ajax({
        type: 'POST',
        url: '/laboratory/waiting_list/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'start_date': start,
            'end_date': end,
            'depart_id': $('#depart_select').val(),
            'filter': $('#laboratory_search_select option:selected').val(),
            'input': $('#laboratory_search_input').val(),
        },
        dataType: 'Json',
        success: function (response) {
            $('#laboratory_list_table > tbody ').empty();
            for (var i in response.datas) {

                //is_new << 완료 처리 해야함

                var str = "<tr  onclick='get_test_list(this," + response.datas[i]['id'] + ")'>" +
                    "<td>" + (parseInt(i) + 1) + "</td>" +
                    "<td>" + response.datas[i]['chart'] + "</td>" +
                    "<td>" + response.datas[i]['Name'] + "</td>" +
                    "<td>" + response.datas[i]['Date_of_Birth'] + "</td>" +
                    "<td>" + response.datas[i]['Depart'] + "</td></tr>";


                $('#laboratory_list_table').append(str);
            }

            //알람 
            if (alarm && is_new)
                play_alarm();
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}

function get_test_list(obj,diagnosis_id) {

    //$("#estimate_list_table tr").removeClass('danger');
    //$(obj).addClass('danger');

    $.ajax({
        type: 'POST',
        url: '/laboratory/get_test_list/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'diagnosis_id': diagnosis_id,
        },
        dataType: 'Json',
        success: function (response) {
            $('#laboratory_test_list_table > tbody ').empty();
            for (var i in response.datas) {
                var str = "<tr  onclick='get_test_manage(" + response.datas[i]['id'] + ")'>" +
                    "<td>" + (parseInt(i) + 1) + "</td>" +
                    "<td>" + response.datas[i]['name_service'] + "</td>" +
                    "<td>" + response.datas[i]['date_ordered'] + "</td>";

                str += "<td>";
                for (var j = 0; j < response.datas[i]['list_interval'].length; j++) {
                    if (response.datas[i]['list_interval'][j]['name'] != '') {
                        str += response.datas[i]['list_interval'][j]['name'] + ' : ';
                    }
                    str += response.datas[i]['list_interval'][j]['minimum'] + ' < ';
                    str += response.datas[i]['list_interval'][j]['maximum'] + ' ' ;
                    str += '( ' + response.datas[i]['list_interval'][j]['unit'] + ' )';


                    if (response.datas[i]['list_interval'].length != i + 1) {
                        str += "<br />";
                    }
                   
                }
                str += "</td>";
                str += "<td>" + response.datas[i]['result'] + "</td>" +
                    "<td>" + response.datas[i]['date_expected'] + "</td></tr>";

                
                $('#laboratory_test_list_table').append(str);
            }

            $("#patient_chart").val(response.chart);
            $("#patient_name").val(response.Name);
            $('input:radio[name=gender]').filter('[value=' + response.gender + ']').prop('checked', true);
            $("#patient_dob").val(response.Date_of_Birth);
            $("#patient_depart").val(response.Depart);
            $("#patient_phone").val(response.phone);

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}


var w = undefined
function worker_on(is_run) {
    if (is_run) {
        if (window.Worker) {
            path = get_listener_path();
            w = new Worker(path);
            w.onmessage = function (event) {
                //console.log(timer_count);
                timer_count += 1;
                if (timer_count >= 18) {
                    timer_count = 0;
                    waiting_list(true, true);
                } else {
                    waiting_list(true, false);
                }
            };
        }
    } else {
        timer_count = 0;

        if (w != undefined) {
            w.terminate();
            w = undefined;
        }
    }
}