jQuery.browser = {};
$(function () {
    var _oldShow = $.fn.show;
    var _oldHide = $.fn.hide;
    $.fn.show = function (speed, oldCallback) {
        return $(this).each(function () {
            var obj = $(this),
                newCallback = function () {
                    if ($.isFunction(oldCallback)) {
                        oldCallback.apply(obj);
                    }
                    obj.trigger('afterShow');
                };
            // you can trigger a before show if you want
            obj.trigger('beforeShow');
            // now use the old function to show the element passing the new callback
            _oldShow.apply(obj, [speed, newCallback]);
        });
    }
    $.fn.hide = function (speed, oldCallback) {
        return $(this).each(function () {
            var obj = $(this),
                newCallback = function () {
                    if ($.isFunction(oldCallback)) {
                        oldCallback.apply(obj);
                    }
                    obj.trigger('afterHide');
                };
            // you can trigger a before show if you want
            obj.trigger('beforeHide');
            // now use the old function to show the element passing the new callback
            _oldHide.apply(obj, [speed, newCallback]);
        });
    }

    // init start
    reception_waiting(true);

    $('.diagnosis_select_contents').hide();
    $('#diagnosis_select_exam_contents').show();
    $('.diagnosis_select_title input').click(function () {
        $('.diagnosis_select_contents').hide();
        id = $(this).attr('id');
        if (id == 'diagnosis_select_exam_title') {
            $('#diagnosis_select_exam_contents').show();
        }
        if (id == 'diagnosis_select_test_title') {
            $('#diagnosis_select_test_contents').show();
        }
        else if (id == 'diagnosis_select_precedure_title') {
            $('#diagnosis_select_precedure_contents').show();
        }
        else if (id == 'diagnosis_select_medicine_title') {
            $('#diagnosis_select_medicine_contents').show();
        }
    });


    //select and set methods
    $('.contents_items tr').click(function (event) {
        if (event.target.nodeName.toLowerCase() == 'td') {
            //diagnosis_select_test_contents
            $(event.target.parentElement.parentElement.parentElement.parentElement).attr('id');
            
            var str = "<tr><td style='width:3vw;'>" + $(this).find('td:nth-child(2)').text().trim() + "<input type='hidden' value=''/></td>";

            if (event.target.parentElement.parentElement.parentElement.parentElement.id == 'diagnosis_select_medicine_contents') {
                str += "<td>" + $(this).find('td:nth-child(3)').text().trim() + "<input type='hidden' value=''/></td><td>" +
                    "<input type='number' min='0' class='diagnosis_selected_input_number' id='volume'/></td><td>" +
                    "<input type='number' min='0' class='diagnosis_selected_input_number' id='amount'/></td><td>" +
                    "<input type='number' min='0' class='diagnosis_selected_input_number' id='days'/></td><td>" +
                    "<input type='text' class='diagnosis_selected_input_number' id='memo'/></td>";
            } else {
                str += "<td colspan='5'>" + $(this).find('td:nth-child(3)').text().trim() + "<input type='hidden' value=''/></td>";
            } 
            str += "<td style='cursor:pointer' onclick='delete_this_td(this)'>" + "x" + "</td></tr>";

            var what_class = $(event.target.parentElement.parentElement.parentElement.parentElement).attr('id');

            if (what_class == 'diagnosis_select_exam_contents')
                $('#diagnosis_selected_exam').append(str);
            if (what_class == 'diagnosis_select_test_contents')
                $('#diagnosis_selected_test').append(str);
            else if (what_class == 'diagnosis_select_precedure_contents')
                $('#diagnosis_selected_precedure').append(str);
            else if (what_class == 'diagnosis_select_medicine_contents')
               $('#diagnosis_selected_medicine').append(str);
        }
    });

    if ($("#patient_date_of_birth").length > 0) {
        $("#patient_date_of_birth").datepicker({
            changeMonth: true,
            changeYear: true,
            nextText: '다음 달',
            prevText: '이전 달',
            currentText: '오늘',
            closeText: '닫기',
            monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            dateFormat: "yy-mm-dd",
            yearRange: '1900:2100',
        });
    }

    $('#reception_waiting_date').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        drops: "up",
        locale: {
            format: 'YYYY-MM-DD', 
        },
    });
    worker_on(true);
    $('#reception_waiting_date').on('apply.daterangepicker', function () {
        today = moment().format('YYYY[-]MM[-]DD');
        date = $('#reception_waiting_date').val();
        if (date == today) {
            worker_on(true);
        } else {
            worker_on(false);
        }
    });



    $('#past_diagnosis_calendar').daterangepicker();

    $('#reservation_date').daterangepicker({
        autoUpdateInput: false,
        singleDatePicker: true,
        timePicker: true,
        timePicker24Hour: true,
        timePickerIncrement: 10,
        showDropdowns: true,
        drops: "up",
        locale: {
            format: 'YYYY-MM-DD HH:mm:ss',
            locale: { cancelLabel: 'Clear' }
        },
    }).on('show.daterangepicker', function (ev, picker) {
        picker.container.find(".hourselect").empty()
        picker.container.find(".hourselect").append('<option value = "9" > 9</option>');
        picker.container.find(".hourselect").append('<option value = "10" > 10</option>' );
        picker.container.find(".hourselect").append('<option value = "11" > 11</option>' );
        picker.container.find(".hourselect").append('<option value = "12" > 12</option>' );
        picker.container.find(".hourselect").append('<option value = "13" > 13</option>' );
        picker.container.find(".hourselect").append('<option value = "14" > 14</option>' );
        picker.container.find(".hourselect").append('<option value = "15" > 15</option>' );
        picker.container.find(".hourselect").append('<option value = "16" > 16</option>');
        picker.container.find(".hourselect").append('<option value = "17" > 17</option>');
    });

    $('#reservation_date').on('apply.daterangepicker', function (ev, picker) {
        $('#reservation_date').val(picker.startDate.format('YYYY-MM-DD HH:mm:ss'));
    });
    $('#reservation_date').on('cancel.daterangepicker', function(ev, picker) {
        $('#reservation_date').val('');
    });



    $(".show_list_btn").click(function () {
        $(".show_list_contents").slideToggle("slow");
    });

    $('.vital_input').keypress(function (key) {
        if (key.keyCode == 13) {
            if ($(this).parent().is(':last-child')) {
                if (confirm('Save?')) {
                    set_vital();
                }
            } else {
                $(this).parent().next().children('input').focus();
            }
        }
    });

    $('.contents_items').change(function () {
        alert();
    })
    
    $('.contents_class').click(function () {
        $(this).parent().next('.contents_items').toggle()
        if ($(this).parent().next('.contents_items').is(':visible')) {
            $(this).children().children('label').html('-');
        } else {
            $(this).children().children('label').html('+');
        }
        $('.contents_class').parent().next('.contents_items').not($(this).parent().next('.contents_items')).hide();
        $('.contents_class').children().children('label').not($(this).children().children('label')).html('+');
    });

    $('#order_search').keyup(function () {
        var k = $(this).val();
        $('.contents_class').children().children('label').not($(this).children().children('label')).html('+');
        if (k == '') {
            $(".contents_items").hide();
            $('.contents_items tr').show();
            $('#diagnosis_select_medicine_contents .contents_items, #diagnosis_select_exam_contents .contents_items').show();
        }
        else {
            $(".contents_items, .contents_items tr").hide();
            
            var temp = $(".contents_items > tr > td:nth-child(3):contains('" + k + "')");

            $(temp).parent().parent().show();
            $(temp).parent().parent().prev().children().children().children('label').html('-');
            $(temp).parent().show();
        }

    })

});

function selected_table_title(title) {
    //off
    $('.table_title').attr('style', 'border:2px solid #adadad;border-right:0px solid #adadad;');
    $('.table_title').next('th').attr('class', 'diagonal');

    //on
    $(title).attr('style', 'border:4px solid #adadad;border-right:0px solid #adadad;border-bottom:0px solid #adadad;');
    $(title).next('th').attr('class', 'diagonal_selected');
}



function get_all_diagnosis() {
    $('#diagnosis_table tbody').empty();
    $.ajax({
        type: 'POST',
        url: '/doctor/diagnosis_past/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'all':'all',
            'patient_id': $('#patient_chart').val(),
        },
        dataType: 'Json',
        success: function (response) {
            for (var i in response.datas) {
                var str = "<tr style='background:#94ee90'><td colspan='5'>" + response.datas[i]['date'] + "(" + response.datas[i]['day'] + ")[" + response.datas[i]['doctor'] + "]</td>" +
                    "</td></tr>" +
                    "<tr><td colspan='5'>History:" + response.datas[i]['diagnosis'] + "</td></tr>";

                for (var j in response.datas[i]['exams']) {
                    str += "<tr><td>" + response.datas[i]['exams'][j]['name'] + "</td><td>" +
                        "</td><td>" +
                        "</td><td>" +
                        "</td><td>" +
                        "</td></tr>";
                }

                for (var j in response.datas[i]['tests']) {
                    str += "<tr><td>" + response.datas[i]['tests'][j]['name'] + "</td><td>" +
                        "</td><td>" +
                        "</td><td>" +
                        "</td><td>" +
                        "</td></tr>";
                }
                for (var j in response.datas[i]['precedures']) {
                    str += "<tr><td>" + response.datas[i]['precedures'][j]['name'] + "</td><td>" +
                        "</td><td>" +
                        "</td><td>" +
                        "</td><td>" +
                        "</td></tr >";
                }
                for (var j in response.datas[i]['medicines']) {
                    str += "<tr><td>" + response.datas[i]['medicines'][j]['name'] + "</td><td>" +
                        response.datas[i]['medicines'][j]['volume'] + "</td><td>" +
                        response.datas[i]['medicines'][j]['amount'] + "</td><td>" +
                        response.datas[i]['medicines'][j]['days'] + "</td><td>" +
                        response.datas[i]['medicines'][j]['memo'] + "</td></tr >";
                }

                $('#diagnosis_table tbody').append(str);
            }
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        },
    })




}


function set_all_empty() {
    $('input').empty();
}


function set_past_diagnosis_date(element) {
    if (event.keyCode == 13) {
        date = $(element).next('.doctor_past_diagnosis_calendar');
        if (date.length == 0)
            date = $(element).next().next('.doctor_past_diagnosis_calendar');
        date.datepicker('setDate', $(element).val());
    }
}



function reception_select(reception_id) {
    $.ajax({
        type: 'POST',
        url: '/doctor/reception_select/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'reception_id': reception_id,
        },
        dataType: 'Json',
        success: function (response) {
            $('#patient_chart').val(response.chart);
            $('#patient_name_kor').val(response.name_kor + ' / ' + response.name_eng);
            $('#patient_date_of_birth').val(response.date_of_birth);
            $('#patient_address').val(response.address);
            $('#patient_phone').val(response.phone);

            $('#history_past').val(response.history_past);
            $('#history_family').val(response.history_family);

            $('input:radio[name=gender]').filter('[value=' + response.gender + ']').prop('checked', true);
            $('#chief_complaint').val(response.chief_complaint);

            $('#selected_reception').val(response.reception_id);
            $('#reservation_date').val(response.reservation)

            $('#assessment').val(response.assessment);
            $('#objective_data').val(response.objective_data);
            $('#plan').val(response.plan);
            $('#diagnosis').val(response.diagnosis);

            get_vital();
            get_all_diagnosis();
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        },
    })


}




function get_vital() {
    $.ajax({
        type: 'POST',
        url: '/doctor/get_vital/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'patient_id': $('#patient_chart').val(),
        },
        dataType: 'Json',
        success: function (response) {
            $('#vital_get_body').empty();
            for (var i in response.datas) {
                var str = "<tr><td>" + response.datas[i]['date'] + "</td>" +
                    "<td>" + response.datas[i]['weight'] + "</td>" +
                    "<td>" + response.datas[i]['height'] +
                    "<td>" + response.datas[i]['blood_pressure'] + "</td>" +
                    "<td>" + response.datas[i]['blood_temperature'] + "</td>" +
                    "<td>" + response.datas[i]['breath'] + "</td>" +
                    "<td>" + response.datas[i]['purse_rate']  + "</td></tr>";

                $('#Vitial_table').append(str);
            }
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        },
    })
}

function set_vital() {
    if ($('#selected_reception').val().trim() == '') {
        alert('환자 먼저 선택');
        return;
    }
    $.ajax({
        type: 'POST',
        url: '/doctor/set_vital/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'reception_id': $('#selected_reception').val(),
            'vital_date': $('#vital_set_body tr td:first-child').html(),
            'weight': $('#vital_input_weight').val(),
            'height': $('#vital_input_height').val(),
            'blood_pressure': $('#vital_input_blood_pressure').val(),
            'blood_temperature': $('#vital_input_blood_temperature').val(),
            'breath': $('#vital_input_breath').val(),
            'purse_rate': $('#vital_input_purse_rate').val(),
        },
        dataType: 'Json',
        success: function (response) {
            get_vital();
            set_vital_clear();
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        },
    })
}

function set_vital_clear() {
    $('#vital_input_weight').val('');
    $('#vital_input_height').val('');
    $('#vital_input_blood_pressure').val('');
    $('#vital_input_blood_temperature').val('');
    $('#vital_input_breath').val('');
    $('#vital_input_purse_rate').val('');
}

function get_diagnosis(reception_no) {
    $.ajax({
        type: 'POST',
        url: '/doctor/get_diagnosis/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'reception_no': reception_no,
        },
        dataType: 'Json',
        success: function (response) {
            
            $('#diagnosis').val(response.datas['diagnosis']);
            $('#diagnosis_selected tbody').empty();

            for (var j in response.datas['exams']) {
                var str = "<tr><td>" + response.datas['exams'][j]['code'] + "<input type='hidden' value='" +
                    response.datas['exams'][j]['id'] + "'/></td><td>" +
                    response.datas['exams'][j]['name'] + "</td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td style='cursor:pointer' onclick='delete_this_td(this)'>" + "x" + "</td></tr>";
                $('#diagnosis_selected_exam').append(str);
            }

            for (var j in response.datas['tests']) {
                    
                var str = "<tr><td>" + response.datas['tests'][j]['code'] + "<input type='hidden' value='" +
                    response.datas['tests'][j]['id'] + "'/></td><td>" +
                    response.datas['tests'][j]['name'] + "</td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td style='cursor:pointer' onclick='delete_this_td(this)'>" + "x" + "</td></tr>";
                $('#diagnosis_selected_test').append(str);
            }
                
            for (var j in response.datas['precedures']) {
                var str = "<tr><td>" + response.datas['precedures'][j]['code'] + "<input type='hidden' value='" +
                    response.datas['precedures'][j]['id'] + "'/></td><td>" +
                    response.datas['precedures'][j]['name'] + "</td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td style='cursor:pointer' onclick='delete_this_td(this)'>" + "x" + "</td></tr>";
                $('#diagnosis_selected_precedure').append(str);
            }
                
            for (var j in response.datas['medicines']) {
                var str = "<tr><td>" + response.datas['medicines'][j]['code'] + "<input type='hidden' value='" +
                    response.datas['medicines'][j]['id'] + "'/></td><td>" +
                    response.datas['medicines'][j]['name'] + "</td>" +
                    "<td><input type='text' class='diagnosis_selected_input_number' id='volume' value='" +
                    response.datas['medicines'][j]['volume'] + "'>" + "</td>" +
                    "<td><input type='text' class='diagnosis_selected_input_number' id='amount' value='" +
                    response.datas['medicines'][j]['amount'] + "'>" + "</td>" +
                    "<td><input type='text' class='diagnosis_selected_input_number' id='days' value='" +
                    response.datas['medicines'][j]['days'] + "'>" + "</td>" +
                    "<td><input type='text' class='diagnosis_selected_input' id='memo' value='" +
                    response.datas['medicines'][j]['memo'] + "'>" + "</td>" +
                    "<td style='cursor:pointer' onclick='delete_this_td(this)'>" + "x" + "</td></tr>";
                $('#diagnosis_selected_medicine').append(str);
            }

            $('.diagnosis_selected_input_number').change(function () {
                var regexp = /^[0-9]*$/;
                v = $(this).val();
                if (!regexp.test(v)) {
                    $(this).val(v.replace(/[^0-9]/g, ''));
                }

            })
                
            
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        },
    })
}


function reception_waiting(Today = false) {
    var date;

    progress = $('#reception_progress').val();

    date = $('#reception_waiting_date').val();
 

    $.ajax({
        type: 'POST',
        url: '/doctor/reception_waiting/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'date': date,
            'progress': progress,
        },
        dataType: 'Json',
        success: function (response) {
            $('#Rectption_Status > tbody ').empty();
            if (response.datas.length == 0) {
                $('#Rectption_Status').append("<tr><td colspan='8'>None Result !!</td></tr>");
            } else {
                for (var i in response.datas) {
                    var color;
                    $('#status').val(response.datas[i]['status']);
                    if (response.datas[i]['status'] == 'new')
                        tr_class = "class ='success'"
                    else if (response.datas[i]['status'] == 'hold')
                        tr_class = "class ='warning'"
                    else if (response.datas[i]['status'] == 'done')
                        tr_class = "class ='danger'"

                    var str = "<tr style='cursor:pointer;'" + tr_class + " onclick='reception_select(" +
                        response.datas[i]['reception_no'] +
                        ");" +
                        "get_diagnosis(" + response.datas[i]['reception_no'] +
                        ");'><td>" + (parseInt(i) + 1) + "</td>" +
                        "<td>" + response.datas[i]['chart'] + "</td>" +
                        "<td>" + response.datas[i]['name_kor'] + "/" + response.datas[i]['name_eng'] + "</td>" +
                        "<td>" + response.datas[i]['date_of_birth'] + ' (' + response.datas[i]['age'] + '/' +response.datas[i]['gender'] + ")</td>" +
                        "<td>" + response.datas[i]['reception_time'] + "</td></tr>";

                    $('#Rectption_Status').append(str);
                }
            }
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}


function diagnosis_report() {
    if ($('#selected_reception').val().trim() == '') {
        alert('환자 먼저 선택');
        return;
    }
    window.open('/doctor/show_medical_report/' + $('#selected_reception').val().trim()+ '?', 'Medical Report', 'width=920,height=465,left=0,top=100,resizable=no,location=no,status=no,scrollbars=yes');

}



function worker_on(path) {
    if ($("input:checkbox[id='work_on']").is(":checked") == true) {
        if (window.Worker) {
            w = new Worker(path);
            w.onmessage = function (event) {
                reception_waiting(true);
            };

        } else {
        }
    } else {
        w.terminate();
        w = undefined;
    }
}


function delete_this_td(x) {
    $(x).parent().remove();
}


function diagnosis_save(set) {
    if ($('#selected_reception').val().trim() == '') {
        alert('환자 먼저 선택');
        return;
    }
    
    if ($('#diagnosis').val().trim() == '') {
        alert('진료 창이 비어있습니다.');
        return;
    }


    chief_complaint = $('#chief_complaint').val();
    date = $("#reservation_date").val();
    datas = [];
    var table = $('#diagnosis_selected');
    table.find('tbody tr').each(function (i, el) {
        var $tds = $(this).find('td');
        temp_data = {};

        what_class = $tds.parent().parent().attr('id')
        if (what_class == 'diagnosis_selected_exam') 
            temp_data['type'] = 'Exam';
        else if (what_class == 'diagnosis_selected_test') 
            temp_data['type'] = 'Test';
        else if (what_class == 'diagnosis_selected_precedure')
            temp_data['type'] = 'Precedure';
        else if (what_class == 'diagnosis_selected_medicine')
            temp_data['type'] = 'Medicine';
        temp_data['code'] = $tds.eq(0).text();
        temp_data['id'] = $tds.eq(0).children('input').val();
        temp_data['name']= $tds.eq(1).text();
        temp_data['volume']= $tds.eq(2).children('input').val();
        temp_data['amount']= $tds.eq(3).children('input').val();
        temp_data['days']= $tds.eq(4).children('input').val();
        temp_data['memo'] = $tds.eq(5).children('input').val();

        datas.push(temp_data);
    });



    $.ajax({
        type: 'POST',
        url: '/doctor/diagnosis_save/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'reception_id': $('#selected_reception').val(),
            'diagnosis': $('#diagnosis').val(),
            'objective_data': $('#objective_data').val(),
            'assessment': $('#assessment').val(),
            'plan': $('#plan').val(),
            'datas': datas,
            'set': set,
            'date': date,
        },
        dataType: 'Json',
        success: function (response) {
            if (response.result == false) {
                alert('저장에 실패 했습니다. \n이미 정산 중이거나 정산이 끝났습니다.')
            } else {
                alert('저장 했습니다.');
                set_all_empty();
            }


        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}

function get_test_contents(category_id) {
    $.ajax({
        type: 'POST',
        url: '/doctor/get_test_contents/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'category_id': $('#category_id').val(),
        },
        dataType: 'Json',
        success: function (response) {
            $('#diagnosis_select_table tbody').empty();


        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}





function page_diagnosis(data) {
    window.location.href = 'diagnosis/' + data;
}





function makeHtml() {
    const obj = { html: '' };
    let html = '<div class="printPop">';

    html += '</div>';
    obj.html = html;
    return obj;
};

$('#print_test').on('click', function () {
    const completeParam = makeHtml();
    reportPrint(completeParam);


});



