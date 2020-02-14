
$(function () {


    $('#patient_date').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        drops: "down",
        locale: {
            format: 'YYYY-MM-DD',
        },
    });
    worker_on(true);
    $('#patient_date').on('apply.daterangepicker', function () {
        today = moment().format('YYYY[-]MM[-]DD');

        date = $('#patient_date').val();
        if (date == today) {
            worker_on(true);
        } else {
            worker_on(false);
        }
    });

    $('#patient_search_btn').click(function () {
        waiting_list();
    });
        
    $('#zoom').click(function () {
        if ($('#selected_img_id').val() == '') {
            alert('Image Select or save First');
            return;
        }

        window.open('/radiation/zoom_in/' + $('#selected_img_id').val(), 'Zoom in', 'height = ' + screen.height + ', width = ' + screen.width + 'fullscreen = yes')
    });
});



function waiting_selected(manage_id) {
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
                    $('#selected_img_id').val(response.id);
                },
                error: function (request, status, error) {
                    alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

                },
            })
            
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}


function waiting_list() {
    var date, start, end;

    date = $('#patient_date').val();
    
    start = date.split(' - ')[0];
    end = date.split(' - ')[1];


    $.ajax({
        type: 'POST',
        url: '/radiation/waiting_list/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'start_date': start,
            'end_date': end,
            'Radiation': 'Radiation',
            'filter': $('#laboratory_search_select option:selected').val(),
            'input': $('#patient_search').val(),
        },
        dataType: 'Json',
        success: function (response) {
            $('#radiation_list_table > tbody ').empty();
            for (var i in response.datas) {
                var tr_class = "";
                if (response.datas[i]['progress'] == 'new')
                    tr_class = "class ='success'"
                else if (response.datas[i]['progress'] == 'done')
                    tr_class = "class ='danger'"

                var str = "<tr " + tr_class + "style='cursor:pointer' onclick='waiting_selected(" + response.datas[i]['radi_manage_id'] + ")'>" +
                    "<td>" + Number(i + 1) + "</td>" +
                    "<td>" + response.datas[i]['chart'] + "</td>" +
                    "<td>" + response.datas[i]['name_kor'] + '<br/>' + response.datas[i]['name_eng'] + "</td>" +
                    "<td>" + response.datas[i]['Date_of_Birth'] + '<br/>' + response.datas[i]['Gender/Age'] + "</td>" +
                    "<td>" + response.datas[i]['Depart'] + '<br/>' + response.datas[i]['Doctor'] + "</td>" +
                    "<td>" + response.datas[i]['name_service'] + "</td></tr>";

                $('#radiation_list_table').append(str);
            }
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}

