jQuery.browser = {};

var timer_count = 0;

$(function () {
    $('#selected_test_manage').val('');
    $('#selected_image').val('');
    


    $('#patient_date_start, #patient_date_end').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        drops: "down",
        locale: {
            format: 'YYYY-MM-DD',
        },
    });


    //언어 별 날짜 출력
    //초기값
    if ($("#language").val() == 'vi') {
        var today = moment().format('DD[/]MM[/]YYYY');
        $('#patient_date_start, #patient_date_end').val(today);
    }
    //선택 시 
    $('#patient_date_start, #patient_date_end').on('apply.daterangepicker', function (ev, picker) {
        var today = moment().format('YYYY[-]MM[-]DD');
        if ($("#language").val() == 'vi') {
            $(this).val(picker.startDate.format('DD/MM/YYYY'));
            today = moment().format('DD[/]MM[/]YYYY');
        }
        date = $(this).val();
        if (date == today) {
            worker_on(true);
        } else {
            worker_on(false);
        }
    });
    worker_on(true);



    $('#patient_search_btn').click(function () {
        waiting_list();
    });
        
    $('#zoom').click(function () {
        if ($('#selected_img_id').val() == '') {
            alert(gettext('Image Select or save First.'));
            return;
        }

        window.open('/radiation/zoom_in/' + $('#selected_img_id').val(), 'Zoom in', 'height = ' + screen.height + ', width = ' + screen.width + 'fullscreen = yes')
    });

    //$('#save').click(function () {
    //    $.ajax({
    //        type: 'POST',
    //        url: '/radiation/',
    //        data: {
    //            'csrfmiddlewaretoken': $('#csrf').val(),
    //            'selected_test_manage': $('#selected_test_manage').val(),
    //            'id': $('#id').val(),
    //        },
    //        dataType: 'Json',
    //        success: function (response) {

    //        },
    //        error: function (request, status, error) {
    //            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

    //        },
    //    })
    //})
});

//알람
function play_alarm() {
    var x = document.getElementById("audio").play();


    if (x !== undefined) {
        x.then(_ => {
            console.log(_);
            // Autoplay started!
        }).catch(error => {
            console.log(error);
            // Autoplay was prevented.
            // Show a "Play" button so that user can start playback.
        });
    }
}

function show_popup() {
    window.open('/radiation/zoom_in/' + $('#selected_img_id').val(), 'Zoom in', 'height = ' + screen.height + ', width = ' + screen.width + 'fullscreen = yes')
}

function waiting_selected(manage_id) {
    upload_new();
    $('#radiation_image_list_ul').empty();
    $.ajax({
        type: 'POST',
        url: '/radiation/waiting_selected/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'radi_manage_id': manage_id,
        },
        dataType: 'Json',
        success: function (response) {
            $('.radiation_patient_info input ').empty();

            $('#radi_control_name').val(response['Name']);
            $('#Date_of_birth').val(response['Date_of_birth']);
            $('#radi_control_depart').val(response['Depart']);
            $('#radi_control_service').val(response['Lab']);

            $('#selected_test_manage').val(manage_id);

            $('#radiation_image_list_ul').empty();
            string = ''
            for (var i in response.datas) {
                string += '<ul style="padding-left:0px; list-style:none;">' + i;
                for (var j = 0; j < response.datas[i].length; j++) {
                    string += '<li style="cursor:pointer;" title="' + response.datas[i][j].service + '" onclick="get_image(' + response.datas[i][j].id + ')">' +
                        '<div class="image_clsoe" onclick="delete_image(' + response.datas[i][j].id + ',this)" background-image="/static/img/mage_close.png"></div>' +
                        '<img style="width:80%;" src="' + response.datas[i][j].path + '"/></li > ';
                }
                string += '</ul>';
            }
            $('#radiation_image_list_ul').append(string);
            //for (var i = 0; i < response.datas.length; i++) {
            //    string += '<li style="cursor:pointer;" title="' + response.datas[i].service + '" onclick="get_image(' + response.datas[i].id + ',this)">' +
            //        '<div class="image_clsoe" onclick="delete_image(' + response.datas[i].id + ')" background-image="/static/img/mage_close.png"></div>' + 
            //        '<img style="width:80%;" src="' + response.datas[i].path + '"/> ' + 
            //        response.datas[i].date_ordered + '</li > ';
            //    
            //}
            //$('#radiation_image_list_ul').append(string);
            //datas


            
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}

function upload_new() {
    $('#selected_img_id').val('');
    $('#load_img').attr('src', '');
    $('#load_img').attr('onclick', '');
}

function get_image(manage_id) {

    $.ajax({
        type: 'POST',
        url: '/radiation/get_image/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'manage_id': manage_id,
        },
        dataType: 'Json',
        success: function (response) {
            $('#load_img').attr('src', response.path);
            $('#load_img').attr('onclick', 'show_popup()');
            $('#load_img').attr('style', '');
            $('#selected_img_id').val(response.id);
            $('#remark').val(response.remark);
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}

function delete_image(image_id,li) {
    if (confirm('delete?')) {
        $.ajax({
            type: 'POST',
            url: '/radiation/delete_image/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),
                'image_id': image_id,
            },
            dataType: 'Json',
            success: function (response) {
                if (response.result == 'success') {
                    alert(gettext('deleted.'));
                    var parent_ul = $(li).parent();
                    $(li).parent().remove();
                    if ($(li).parent().length == 1)
                        $(li).parent().parent().html('');
                    $('#load_img').attr('src','');
                    return;
                }
            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        })
    }
}



function waiting_list(Today = false, alarm = false) {
    var start, end;
    
    start = $('#patient_date_start').val();
    end = $('#patient_date_end').val();
    //언어에 따라 날짜가 다르기 때문에 서버 형식에 맞게 재설정 후 전송
    if ($("#language").val() == 'vi') {
        start = moment(start, 'DD/MM/YYYY').format('YYYY-MM-DD');
        end = moment(end, 'DD/MM/YYYY').format('YYYY-MM-DD');
    }


    $.ajax({
        type: 'POST',
        url: '/radiation/waiting_list/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'start_date': start,
            'end_date': end,
            'Radiation': 'Radiation',
            'filter': $('#radiology_search_select option:selected').val(),
            'input': $('#patient_search').val(),
            'depart_id': $("#depart_select").val(),
        },
        dataType: 'Json',
        success: function (response) {
            $('#radiation_list_table > tbody ').empty();
            for (var i=0 ; i < response.datas.length; i++) {
                var tr_class = "";
                if (response.datas[i]['progress'] == 'new') {
                    tr_class = "class ='success'";
                    var is_new = true;
                }
                    
                else if (response.datas[i]['progress'] == 'done')
                    tr_class = "class ='danger'"

                var str = "<tr " + tr_class + "style='cursor:pointer' onclick='waiting_selected(" + response.datas[i]['precedure_manage_id'] + ")'>" +
                    "<td>" + parseInt(i + 1) + "</td>" +
                    "<td>" + response.datas[i]['chart'] + "</td>" +
                    "<td>" + response.datas[i]['name_kor'] + '<br/>' + response.datas[i]['name_eng'] + "</td>" +
                    "<td>" + response.datas[i]['Date_of_Birth'] + '<br/>' + response.datas[i]['Gender/Age'] + "</td>" +
                    "<td>" + response.datas[i]['Depart'] + '<br/>' + response.datas[i]['Doctor'] + "</td>" +
                    "<td>" + response.datas[i]['name_service'] + "</td></tr>";

                $('#radiation_list_table').append(str);


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

var w = undefined
function worker_on(is_run) {
    if (is_run) {
        if (window.Worker) {
            path = get_listener_path();
            w = new Worker(path);
            w.onmessage = function (event) {
                console.log(timer_count);
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