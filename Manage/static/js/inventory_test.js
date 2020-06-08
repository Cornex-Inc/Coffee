

jQuery.browser = {};
$(function () {
    test_database_search();
    $('.database_control input[type=text],input[type=number]').each(function () {
        //this.className += 'form-control';

    })


    $("#search_depart").change(function () {
        test_database_search();

    });
    $('#precedure_search_input').keypress(function (key) {
        if (key.keyCode == 13) {
            test_database_search();
        }
    });

    //inventory history
    $("#inventory_history_date").prop("disabled", true);
    $('#inventory_history_date').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        locale: {
            format: 'YYYY-MM-DD'
        }
    });



    $('#add_medicine_reg').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        locale: {
            format: 'YYYY-MM-DD'
        }
    });


    //ADD , Edit 


    ////Level 자동 계산
    function set_level_price_multi() {
        var price_input = $("#add_edit_database_price_input").val();
        var level = $('#add_edit_database_multiple_level option:selected').val();

        $("#add_edit_database_price_output").val(Math.ceil(price_input * level));
    }
    $("#add_edit_database_price_input, #add_edit_database_multiple_level").change(function () {
        set_level_price_multi();
    });

    $("#add_edit_database_price_input, #add_edit_database_multiple_level").keyup(function () {
        set_level_price_multi();
    });

    $("#add_edit_database_price_output").keyup(function () {
        $('#add_edit_database_multiple_level').val("0");
    });

    
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function save_data_control() {
    if ($('#selected_option').val() == '') {
        alert(gettext("Select medicine first."));
        return;
    }
    if (isNaN($('#medicine_search_changes').val()) == true) {
        alert(gettext('Amount should be number'));
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/pharmacy/save_data_control/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'selected_option': $('#selected_option').val(),
            'name': $('#medicine_control_name').val(),
            'company': $('#medicine_search_company').val(),
            'country': $('#medicine_search_country').val(),
            'ingredient': $('#medicine_search_ingredient').val(),
            'unit': $('#medicine_search_unit').val(),
            'price': $('#medicine_control_price').val(),
            'changes': $('#medicine_search_changes').val(),
        },
        dataType: 'Json',
        success: function (response) {
            alert(gettext('Saved.'));
            $('.database_control input').each(function () {
                if ($(this).attr('type') == 'button')
                    return;
                $(this).val('');
            })
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}

function set_data_control(medicine_id) {
    $('#selected_option').val(medicine_id);

    $.ajax({
        type: 'POST',
        url: '/pharmacy/set_data_control/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'medicine_id': medicine_id,
        },
        dataType: 'Json',
        success: function (response) {
            $('#medicine_control_name').val(response.name);
            $('#medicine_search_company').val(response.company);
            $('#medicine_search_country ').val(response.country);
            $('#medicine_search_ingredient').val(response.ingredient);
            $('#medicine_search_unit').val(response.unit);
            $('#medicine_control_price').val(response.price);
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}



function pharmacy_control_save(Done = false) {
    var diagnosis_id = $('#selected_diagnosis').val();
    if (diagnosis_id.trim() == '') {
        alert(gettext('Select patient first.'));
        return;
    }
    if ($('#selected_diagnosis_status').val() == 'done') {
        alert(gettext('Already done.'));
        return;
    }

    if (Done)
        status = 'done';
    else
        status = 'hold';

    $.ajax({
        type: 'POST',
        url: '/pharmacy/save/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'status': status,
            'diagnosis_id': diagnosis_id,
        },
        dataType: 'Json',
        success: function (response) {
            alert(gettext("Saved."));
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}


function test_database_search(page = null) {
    var context_in_page = 30;

    var string = $('#precedure_search_input').val();
    //var filter = $('#precedure_search_select').val();
    var class_id = $("#search_depart").val();


    $('#inventory_database_table > tbody ').empty();
    $.ajax({
        type: 'POST',
        url: '/manage/test_search/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'string': string,
            //'filter': filter,
            'class_id': class_id,
            'page': page,
            'context_in_page': context_in_page,
        },
        dataType: 'Json',
        success: function (response) {
            for (var i = 0; i < context_in_page; i++) {
                var str = "";
                if (response.datas[i]) {

                    str = "<tr style='cursor: pointer;'><td>" + response.datas[i]['code'] + "</td>" +
                        "<td title='" + response.datas[i]['class'] + "'>" + response.datas[i]['class'] + "</td>" +
                        "<td title='" + response.datas[i]['name'] + "'>" + response.datas[i]['name'] + "</td>" +
                        "<td>" + /*response.datas[i]['unit'] +*/ "</td>" +
                        "<td>" + numberWithCommas(response.datas[i]['price']) + "</td>" +
                        "<td>" +
                        "<a class='btn btn-default btn-xs' style='margin-right:10px;' href='javascript: void (0);' onclick='edit_database_test(" + response.datas[i]['id'] + ")' ><i class='fa fa-lg fa-pencil'></i></a>" +
                        "<a class='btn btn-danger btn-xs' href='javascript: void (0);' onclick='delete_database_precedure(" + response.datas[i]['id'] + ")' ><i class='fa fa-lg fa-trash'></i></a></tr> ";


                } else {
                    var str = "<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                }
                $('#inventory_database_table > tbody').append(str);
            }


            //페이징
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

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}


function edit_database_test(id = null) {
    $("#add_edit_database_header").html(gettext('New Test'));
    $('#add_edit_database input').val('');
    $('#add_edit_database input[type=number]').val('0');
    $("#add_edit_database_class option:first").prop("selected", true);
    $("#add_edit_database_type option:first").prop("selected", true);
    $("#add_edit_database_multiple_level option:first").prop("selected", true);

    $("#interval_div").hide();
    if (id != null) {
        $("#interval_div").show();
        $("#add_edit_database_header").html(gettext('Edit Data'));
        $.ajax({
            type: 'POST',
            url: '/manage/test_add_edit_get/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),
                'id': id,
            },
            dataType: 'Json',
            success: function (response) {
                if (response.result == true) {
                    $("#add_edit_database_id").val(response.id);
                    $("#add_edit_database_name").val(response.name);
                    $("#add_edit_database_name_vie").val(response.name_vie);
                    $("#add_edit_database_price_output").val(response.price);
                    $("#add_edit_database_price_dollar").val(response.price_dollar);
                    $("#add_edit_database_class").val(response.precedure_class_id);

                    get_test_interval(id)
                } else {
                    alert(gettext('Please Refresh this page.'));
                }
            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            },
        })
    }
    $('#add_edit_database').modal({ backdrop: 'static', keyboard: false });
    $('#add_edit_database').modal('show');
}

function get_test_interval(test_id = null) {
    if (test_id == null)
        return;

    $.ajax({
        type: 'POST',
        url: '/manage/test_get_interval_list/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'test_id': test_id,
        },
        dataType: 'Json',
        success: function (response) {
                $("#test_interval_table > tbody").empty();

                for (var i = 0; i < response.datas.length; i++) {
                    var str = '<tr>' +
                        '<td>' + response.datas[i].name + '</td>' +
                        '<td>' + response.datas[i].minimum + '</td>' +
                        '<td>' + response.datas[i].sign + '</td>' +
                        '<td>' + response.datas[i].maximum + '</td>' +
                        '<td>' + response.datas[i].unit + '</td>' +
                        '<td>' +
                        "<a class='btn btn-default btn-xs' style='margin-right:10px;' href='javascript: void (0);' onclick='interval_modal(" + response.datas[i]['id'] + ")' ><i class='fa fa-lg fa-pencil'></i></a>" +
                        "<a class='btn btn-danger btn-xs' href='javascript: void (0);' onclick='delete_interval(" + response.datas[i]['id'] + ")' ><i class='fa fa-lg fa-trash'></i></a>" +
                        '</td>' +
                        '</tr>';

                    $("#test_interval_table > tbody").append(str);
                }

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        },
    })
}

function interval_modal(id = null) {
    $("#interval_selected").val('');
    $("#interval_remark").val('');
    $("#interval_remark_vi").val('');
    $("#interval_unit").val('');
    $("#interval_unit_vi").val('');
    $("#interval_minimum").val('');
    $("#interval_maximum").val('');
    $("#interval_sign").val('');

    if (id != null) {
        $.ajax({
            type: 'POST',
            url: '/manage/test_get_interval/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),
                'id': id,
            },
            dataType: 'Json',
            success: function (response) {
                $("#interval_selected").val(response.id);
                $("#interval_remark").val(response.name);
                $("#interval_remark_vi").val(response.name_vie);
                $("#interval_unit").val(response.unit);
                $("#interval_unit_vi").val(response.unit_vie);
                $("#interval_minimum").val(response.minimum);
                $("#interval_maximum").val(response.maximum);
                $("#interval_sign").val(response.sign);

            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
        })
    }

    $('#add_edit_interval').modal({ backdrop: 'static', keyboard: false });
    $("#add_edit_interval").modal('show');
}

function save_interval() {

    var selected_test = $("#add_edit_database_id").val();

    var id = $("#interval_selected").val();
    var remark = $("#interval_remark").val();
    var remark_vi = $("#interval_remark_vi").val();
    var unit = $("#interval_unit").val();
    var unit_vi = $("#interval_unit_vi").val();
    var minimum = $("#interval_minimum").val();
    var maximum = $("#interval_maximum").val();
    var sign = $("#interval_sign").val();

    $.ajax({
        type: 'POST',
        url: '/manage/test_save_interval/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'selected_test': selected_test,
            'id': id,
            'remark': remark,
            'remark_vi': remark_vi,
            'unit': unit,
            'unit_vi': unit_vi,
            'minimum': minimum,
            'maximum': maximum,
            'sign': sign,
        },
        dataType: 'Json',
        success: function (response) {

            alert(gettext('Saved.'));
            $("#add_edit_interval").modal('hide');
            edit_database_test($("#add_edit_database_id").val());

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        },
    })


}

function delete_interval(id = null) {
    if (id == null) return;

    if (confirm(gettext('Do you want to delete?'))) {

        $.ajax({
            type: 'POST',
            url: '/manage/test_delete_interval/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),
                'id': id,
            },
            dataType: 'Json',
            success: function (response) {
                alert(gettext('Deleted.'));
                edit_database_test($("#add_edit_database_id").val());

            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
        })

    }


}

function save_database_test(id = null) {
    var id = $("#add_edit_database_id").val();
    if (id == null || id == '') {
        id = 0;
    }

    var name = $("#add_edit_database_name").val();
    if (name == '' || name == null) {
        alert(gettext('Name is necessary! '));
        return;
    }
    var name_vie = $("#add_edit_database_name_vie").val();
    if (name_vie == '' || name_vie == null) {
        alert(gettext('Name in Vietnamese is necessary! '));
        return;
    }
    var price = $("#add_edit_database_price_output").val();
    var price_dollar = $("#add_edit_database_price_dollar").val();

    var test_class = $("#add_edit_database_class").val();
    var type = $("#add_edit_database_type").val();



    $.ajax({
        type: 'POST',
        url: '/manage/test_add_edit_set/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'id': id,
            'type': type,
            'test_class': test_class,
            'name': name,
            'name_vie': name_vie,
            'price': price,
            'price_dollar': price_dollar,

        },
        dataType: 'Json',
        success: function (response) {
            if (response.result == true) {
                test_database_search();

                $("#add_edit_database").modal('hide');
            } else {
                alert(gettext('Please Refresh this page.'));
            }
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}



function delete_database_precedure(id = null) {
    if (id == null) {
        alert(gettext('Select Item.'));
        return;
    }
    else {
        if (confirm(gettext('Are you sure you want to delete ?'))) {
            $.ajax({
                type: 'POST',
                url: '/manage/test_add_edit_delete/',
                data: {
                    'csrfmiddlewaretoken': $('#csrf').val(),
                    'id': id,

                },
                dataType: 'Json',
                success: function (response) {
                    if (response.result == true) {
                        alert(gettext('Deleted'));
                        test_database_search();
                    }
                },
                error: function (request, status, error) {
                    console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

                },
            })
        }
    }
}





function worker_on(path) {
    if ($("input:checkbox[id='pharmacy_list_auto']").is(":checked") == true) {
        if (window.Worker) {
            w = new Worker(path);
            w.onmessage = function (event) {
                waiting_list(true);
            };


        } else {
        }
    } else {
        w.terminate();
        w = undefined;
        $('#pharmacy_list_search').prop('disabled', false);

    }
}

function add_result_line() {
    var str = $("#test_result_tbody").html();

    str += '<tr><td><input class="test_result_input"/></td>' + 
            '<td> <input class="test_result_input" /></td >' +
            '<td><input class="test_result_input" /></td>' + 
            '<td><input class="test_result_input" /></td>' + 
            '<td><input class="test_result_input" /></td>' + 
            '<td><input class="test_result_input" /></td>' + 
            '<td><a class="btn btn-danger btn-xs" href="javascript: void (0);" ><i class="fa fa-lg fa-trash"></i></a></td>' + 
        '<td style="display:none"></td></tr>';

    $("#test_result_tbody").html(str);
    $("#test_result_div").scrollTop($("#test_result_div")[0].scrollHeight);
    $('html, body').scrollTop(document.body.scrollHeight)

    $('#test_result_div').scrollTop($('#test_result_div').prop('scrollHeight'));
}