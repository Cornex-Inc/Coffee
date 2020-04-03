jQuery.browser = {};
$(function () {


    $('#laboratory_list_calendar').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        locale: {
            format: 'YYYY-MM-DD'
        }
    });
    worker_on(true);
    $('#laboratory_list_calendar').on('apply.daterangepicker', function () {
        today = moment().format('YYYY[-]MM[-]DD');
        date = $('#laboratory_list_calendar').val();
        if (date == today) {
            worker_on(true);
        } else {
            worker_on(false);
        }
    });


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
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

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
            $('#selected_test_manage').val(test_manage_id);
            $('#laboratory_control input ').empty();
            for (var i in response.datas) {
                $('#lab_control_chart').val(response.datas['patient_chart']);
                $('#lab_control_name').val(response.datas['patient_name']);
                $('#lab_control_age').val(response.datas['patient_age']);
                $('#lab_control_gender').val(response.datas['patient_gender']);
                $('#date_ordered').val(response.datas['test_ordered']);
                $('#date_examination').val(response.datas['test_examination']);
                $('#date_reservation').val(response.datas['test_reservation']);
                $('#date_expected').val(response.datas['test_expected']);
                $('#lab_control_result').val(response.datas['test_result']);
            }
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

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
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}

function waiting_list(Today = false) {
    var date, start, end;

    date = $('#laboratory_list_calendar').val();

    start = date.split(' - ')[0];
    end = date.split(' - ')[1];


    $.ajax({
        type: 'POST',
        url: '/laboratory/waiting_list/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'start_date': start,
            'end_date': end,
            'filter': $('#laboratory_search_select option:selected').val(),
            'input': $('#laboratory_search_input').val(),
        },
        dataType: 'Json',
        success: function (response) {
            $('#laboratory_list_table > tbody ').empty();
            for (var i in response.datas) {
                var tr_class = "";
                if (response.datas[i]['progress'] == 'done')
                    if (response.datas[i]['is_interval'] == true)
                        tr_class = "class ='success'"
                    else
                        tr_class = "class ='danger'"

                var str = "<tr " + tr_class + " onclick='waiting_selected(" + response.datas[i]['test_manage_id'] + ")'>" +
                    "<td>" + (parseInt(i) + 1) + "</td>" +
                    "<td>" + response.datas[i]['chart'] + "</td>" +
                    "<td>" + response.datas[i]['Name'] + "</td>" +
                    "<td>" + response.datas[i]['Date_of_Birth'] + "</td>" +
                    "<td>" + response.datas[i]['Depart'] + "</td>" +
                    "<td>" + response.datas[i]['name_service'] + "</td>" +
                    "<td>" + response.datas[i]['date_ordered'] + "</td>";


                if (response.datas[i]['reference_interval'].length == 0) {
                    str += "<td></td>";
                }
                else {
                    str += "<td>";
                    for (var j = 0; j < response.datas[i]['reference_interval'].length; j++) {
                        

                        //name
                        if (response.datas[i]['reference_interval'][j]['name'] == undefined || response.datas[i]['reference_interval'][j]['name'] == '') {
                            str += '';
                        } else {
                            str += response.datas[i]['reference_interval'][j]['name'] + ' : ';
                        }
                            
                        //range
                        if (response.datas[i]['reference_interval'][j]['normal_range'] == undefined || response.datas[i]['reference_interval'][j]['normal_range'] == '') {
                            str += '';
                        } else {
                            str += response.datas[i]['reference_interval'][j]['normal_range'] ;
                        }

                        //unit
                        if (response.datas[i]['reference_interval'][j]['unit'] == undefined || response.datas[i]['reference_interval'][j]['unit'] == '') {
                            str += '<br/>';
                        } else {
                            str += ' ' + response.datas[i]['reference_interval'][j]['unit'] + '<br/>';
                        }
                    }
                    str += "</td>";
                }

                
                   
                str += "<td>" + response.datas[i]['result'] + "</td>" +
                    "<td>" + response.datas[i]['date_expected'] + "</td></tr>";

                $('#laboratory_list_table').append(str);
            }
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}

function worker_on(path) {
    if ($("input:checkbox[id='laboratory_list_auto']").is(":checked") == true) {
        if (window.Worker) {
            w = new Worker(path);
            w.onmessage = function (event) {
                waiting_list(true);
            };

            $('#laboratory_list_search').prop('disabled', true);
        } else {
        }
    } else {
        w.terminate();
        w = undefined;
        $('#laboratory_list_search').prop('disabled', false);

    }
}