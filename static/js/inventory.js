

jQuery.browser = {};
$(function () {
    pharmacy_database_search();
    $('.database_control input[type=text],input[type=number]').each(function () {
        //this.className += 'form-control';

    })

    $("#search_depart").change(function () {
        pharmacy_database_search();
    });

    $('#medicine_search_input').keypress(function (key) {
        if (key.keyCode == 13) {
            pharmacy_database_search();
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
    $('#inventory_history_date').on('apply.daterangepicker', function () {
        
        get_inentory_history();
    });


    
    //expiry date
    $('#inventory_add').click(function () {
        id = $('#inventory_history_selected').val();
        if (id == null || id == '') {
            alert(gettext('Select Item.'));
            return;
        }


        $('#add_medicine_database').on('shown.bs.modal', function () {
            console.log(1);
            var today = new Date();
            $('#add_medicine_database_id').val(0);
            $('#add_medicine_reg').data('daterangepicker').setStartDate(moment(today));
            $('#add_medicine_expiry').data('daterangepicker').setStartDate(moment(today));

            $("#add_medicine_changes").prop("disabled", false);
            $("#add_medicine_changes").val(0);
            $('#add_medicine_memo').val('');
        })

        $('#add_medicine_database').modal({ backdrop: 'static', keyboard: false });
        $('#add_medicine_database').modal('show');
    });

    $('#add_medicine_reg').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        locale: {
            format: 'YYYY-MM-DD'
        }
    });
    $('#add_medicine_expiry').daterangepicker({
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

function pharmacy_database_search(page = null) {
    var context_in_page = 30;

    var string = $('#medicine_search_input').val();
    //var filter = $('#precedure_search_select').val();
    var class_id = $("#search_depart").val();

    $('#inventory_database_table > tbody ').empty();
    $.ajax({
        type: 'POST',
        url: '/pharmacy/medicine_search/',
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
                if (response.datas[i]) {
                    if (response.datas[i].alaert_expiry == true) {
                        var str = "<tr class='danger'"
                    }
                    else {
                        var str = "<tr"
                    }
                    str += " style='cursor: pointer;' onclick='get_inentory_history(" + response.datas[i]['id'] + ",\"" + response.datas[i]['name'] + "\");get_expiry_date();'><td>" + response.datas[i]['code'] + "</td>" +
                        "<td>" + response.datas[i]['name'] + "</td>" +
                        "<td title='" + response.datas[i]['ingredient'] + "'>" + response.datas[i]['ingredient'] + "</td>" +
                        "<td title='" + response.datas[i]['company'] + "'>" + response.datas[i]['company'] + "</td>" +
                        "<td>" + response.datas[i]['country'] + "</td>" +
                        "<td>" + response.datas[i]['unit'] + "</td>" +
                        "<td>" + numberWithCommas(response.datas[i]['price']) + "</td>" +
                        "<td>" + response.datas[i]['count'] + "</td>" +
                        "<td>" +
                        "<a class='btn btn-default btn-xs' style='margin-right:5px;' href='javascript: void (0);' onclick='edit_database_medicine(" + response.datas[i]['id'] + ")' ><i class='fa fa-lg fa-pencil'></i></a>" +
                        "<a class='btn btn-danger btn-xs' href='javascript: void (0);' onclick='delete_database_medicine(" + response.datas[i]['id'] + ")' ><i class='fa fa-lg fa-trash'></i></a></tr> ";
                        
                } else {
                    var str = "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                }
                $('#inventory_database_table > tbody').append(str);
            }


            //페이징
            $('#medicine_pagnation').html('');
            str = '';
            if (response.has_previous == true) {
                str += '<li> <a onclick="pharmacy_database_search(' + (response.page_number - 1) + ')">&laquo;</a></li>';
            } else {
                str += '<li class="disabled"><span>&laquo;</span></li>';
            }

            for (var i = response.page_range_start; i < response.page_range_stop; i++) {
                if (response.page_number == i) {
                    str += '<li class="active"><span>' + i + ' <span class="sr-only">(current)</span></span></li>';
                }
                else if (response.page_number + 5 > i && response.page_number - 5 < i) {
                    str += '<li> <a onclick="pharmacy_database_search(' + i + ')">' + i + '</a></li>';
                }
                else {
                }

            }
            if (response.has_next == true) {
                str += '<li><a onclick="pharmacy_database_search(' + (response.page_number + 1) + ')">&raquo;</a></li>';
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


function edit_database_medicine(id = null) {
    $("#add_edit_database_header").html(gettext('New Medicine'));
    $('#add_edit_database input').val('');
    $('#add_edit_database input[type=number]').val('0');
    $("#add_edit_database_class option:first").prop("selected", true);
    $("#add_edit_database_type option:first").prop("selected", true);
    $("#add_edit_database_multiple_level option:first").prop("selected", true);


    if (id != null) {
        $("#add_edit_database_header").html(gettext('Edit Data'));
        $.ajax({
            type: 'POST',
            url: '/pharmacy/medicine_add_edit_get/',
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
                    $("#add_edit_database_ingredient").val(response.ingredient);
                    $("#add_edit_database_ingredient_vie").val(response.ingredient_vie);
                    $("#add_edit_database_unit").val(response.unit);
                    $("#add_edit_database_unit_vie").val(response.unit_vie);
                    $("#add_edit_database_country").val(response.country);
                    $("#add_edit_database_country_vie").val(response.country_vie);
                    $("#add_edit_database_company").val(response.company);
                    $("#add_edit_database_name_display").val(response.name_display);
                    $("#add_edit_database_price_input").val(response.price_input);
                    $("#add_edit_database_multiple_level option:contains('" + response.multiple_level+ "')").attr("selected", "selected");
                    $("#add_edit_database_price_output").val(response.price);
                    $("#add_edit_database_price_dollar").val(response.price_dollar);
                    $("#add_edit_database_type").val(response.type);
                    $("#add_edit_database_class").val(response.medicine_class_id);


                    

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


function save_database_medicine(id = null) {
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
    var ingredient = $("#add_edit_database_ingredient").val();
    var ingredient_vie = $("#add_edit_database_ingredient_vie").val();
    var unit = $("#add_edit_database_unit").val();
    var unit_vie = $("#add_edit_database_unit_vie").val();
    var country = $("#add_edit_database_country").val();
    var country_vie = $("#add_edit_database_country_vie").val();
    var company = $("#add_edit_database_company").val();
    var name_display = $("#add_edit_database_name_display").val();
    var price_input = $("#add_edit_database_price_input").val();
    var multiple_level = $("#add_edit_database_multiple_level").val();
    var price = $("#add_edit_database_price_output").val();
    var price_dollar = $("#add_edit_database_price_dollar").val();

    var medicine_class = $("#add_edit_database_class").val();
    var type = $("#add_edit_database_type").val();



    $.ajax({
        type: 'POST',
        url: '/pharmacy/medicine_add_edit_set/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'id': id,
            'type': type,
            'medicine_class': medicine_class,
            'name': name,
            'name_vie': name_vie,
            'ingredient': ingredient,
            'ingredient_vie': ingredient_vie,
            'unit': unit,
            'unit_vie': unit_vie,
            'country': country,
            'country_vie': country_vie,
            'company': company,
            'name_display': name_display,
            'price_input': price_input,
            'multiple_level': multiple_level,
            'price': price,
            'price_dollar': price_dollar,

        },
        dataType: 'Json',
        success: function (response) {
            if (response.result == true) {
                pharmacy_database_search();

                $("#add_edit_database").modal('hide');
            } else {
                alert(gettext('Please Refresh this page.'));
            }
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })


    //'inventory_count': medicine.inventory_count,
    
    

}



function get_inentory_history(id = null,name=null) {

    if (id == null) {
        id = $('#inventory_history_selected').val();
        if (id == '')
            return;
    }
    else {
        $('#inventory_history_selected').val(id);
    }
    $("#inventory_history_date").prop("disabled", false);
    date = $("#inventory_history_date").val();

    $('#add_medicine_database_header').html(name);
    $('#add_medicine_database_header').attr("title", name);
    $.ajax({
        type: 'POST',
        url: '/pharmacy/get_inventory_history/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'id': id,
            'date': date

        },
        dataType: 'Json',
        success: function (response) {
            $("#inventory_history_tbody").empty();
            $("#inventory_history_total").html(response.count);
            for (var i = 0; i < response.datas.length; i++) {
                str = '';
                if (response.datas[i].type == 'add') {
                    str = '<tr class="success">'
                }
                else if (response.datas[i].type == 'dec') {
                    str = '<tr class="danger">'
                }
                else if (response.datas[i].type == 'del') {
                    str = '<tr class="danger">'
                }
                str += '<td>' + (i + 1) + "</td>" +
                    "<td>" + response.datas[i].date + "</td>";
                if (response.datas[i].type == 'dec' || response.datas[i].type == 'del') {
                    str += "<td> -" + response.datas[i].changes + "</td>";
                } else {
                    str += "<td>" + response.datas[i].changes + "</td>";
                }

                str +="<td>" + response.datas[i].type + "</td>" + 
                    "<td>" + response.datas[i].memo + "</td></tr>"

                $("#inventory_history_tbody").append(str);  
                
                
            }

            $("#inventory_history_selected").val(id);
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })

}



function delete_database_medicine(id = null) {
    if (id == null) {
        alert(gettext('Select Item.'));
        return;
    }
    else {
        if (confirm(gettext('Are you sure you want to delete ?'))) {
            $.ajax({
                type: 'POST',
                url: '/pharmacy/medicine_add_edit_delete/',
                data: {
                    'csrfmiddlewaretoken': $('#csrf').val(),
                    'id': id,

                },
                dataType: 'Json',
                success: function (response) {
                    if (response.result == true) {
                        alert(gettext('Deleted'));
                        pharmacy_database_search();
                    }
                },
                error: function (request, status, error) {
                    console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

                },
            })
        }

    }

}



function save_database_add_medicine() {
    id = $('#inventory_history_selected').val();
    registration_date = $('#add_medicine_reg').val();
    expiry_date = $('#add_medicine_expiry').val();
    changes = $('#add_medicine_changes').val();
    memo = $('#add_medicine_memo').val();



    $.ajax({
        type: 'POST',
        url: '/pharmacy/save_database_add_medicine/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'id': id,
            'registration_date': registration_date,
            'expiry_date': expiry_date,
            'changes': changes,
            'memo': memo,
            'check': $("#add_medicine_database_id").val(),
        },
        dataType: 'Json',
        success: function (response) {
            if (response.result == true) {
                get_inentory_history();
                get_expiry_date();
                pharmacy_database_search();
                $("#add_medicine_database").modal('hide');
            }
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}


function get_expiry_date() {
    id = $('#inventory_history_selected').val();

    $.ajax({
        type: 'POST',
        url: '/pharmacy/get_expiry_date/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'id': id,
        },
        dataType: 'Json',
        success: function (response) {
            if (response.result == true) {
                $("#inventory_expiry_tbody").empty();

                for (var i = 0; i < response.datas.length; i++) {
                    str = '';
                    

                    if (response.datas[i].expiry_date != 0) {
                        var arr1 = response.datas[i].expiry_date.split('-');
                        var date1 = new Date(arr1[0], arr1[1] - 1, arr1[2]);
                       
                        var now = new Date();

                        var betweenDay = Math.ceil((date1.getTime() - now.getTime()) / (1000 * 3600 * 24));
                        

                        if (betweenDay > 180) {
                            str = '<tr class="success">';
                        }
                        else if (betweenDay <= 180 || betweenDay > 0) {
                            str = '<tr class="danger">';
                        }
                        else {
                            str = '<tr>';
                        }
                    }
                    else {
                        str = '<tr>';
                        betweenDay = 0;
                    }

                    str += '<td>' + (i + 1) + "</td>" +
                        "<td>" + response.datas[i].date + "</td>" +
                        "<td>" + response.datas[i].expiry_date + "</td>" +
                        "<td>" + response.datas[i].tmp_count + "</td>" +
                        "<td>" + betweenDay + "</td>" + 
                        "<td><a class='btn btn-default btn-xs' style='margin-right:5px;' href='javascript: void (0);' onclick='show_edit_database_add_medicine(" + response.datas[i]['id'] + ")' ><i class='fa fa-lg fa-pencil'></i></a>" +
                        "<a class='btn btn-danger btn-xs' href='javascript: void (0);' onclick='disposal_edit_database_add_medicine(" + response.datas[i]['id'] + ")' ><i class='fa fa-lg fa-trash'></i></a></tr> "; +"</tr > "

                    $("#inventory_expiry_tbody").append(str);
                }
            }
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    })
}




function show_edit_database_add_medicine(id) {
    $('#add_medicine_database').on('shown.bs.modal', function () {
        $.ajax({
            type: 'POST',
            url: '/pharmacy/get_edit_database_add_medicine/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),
                'id': id,
            },
            dataType: 'Json',
            success: function (response) {
                console.log(response.data)
                if (response.result == true) {
                    $('#add_medicine_database_id').val(response.data.id);

                    $('#add_medicine_reg').data('daterangepicker').setStartDate(response.data.date);
                    $('#add_medicine_expiry').data('daterangepicker').setStartDate(response.data.expiry_date);

                    $("#add_medicine_changes").prop("disabled", true);
                    $("#add_medicine_changes").val(response.data.tmp_count);
                    $('#add_medicine_memo').val(response.data.memo);

                }
            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
        })
    })

    $('#add_medicine_database').modal({ backdrop: 'static', keyboard: false });
    $('#add_medicine_database').modal('show');
}


function disposal_edit_database_add_medicine(id) {
    $.ajax({
        type: 'POST',
        url: '/pharmacy/get_edit_database_add_medicine/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),
            'id': id,
        },
        dataType: 'Json',
        success: function (response) {
            console.log(response.data)
            if (response.result == true) {
                $('#disposal_medicine_table_id').val(id);

                $("#disposal_medicine_changes").val(response.data.tmp_count);
                $('#disposal_medicine_memo').val(response.data.memo);
            }
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        },
    })

    $('#disposal_medicine').modal({ backdrop: 'static', keyboard: false });
    $('#disposal_medicine').modal('show');
    
}

function save_database_disposal_medicine() {


    if (confirm(gettext('You really want to disposal medicines?'))) {
        $.ajax({
            type: 'POST',
            url: '/pharmacy/save_database_disposal_medicine/',
            data: {
                'csrfmiddlewaretoken': $('#csrf').val(),
                'id': $('#disposal_medicine_table_id').val(),
                'disposial': $('#disposal_medicine_changes').val(),
                'memo': $('#disposal_medicine_memo').val(),
            },
            dataType: 'Json',
            success: function (response) {
                console.log(response.data)
                if (response.result == true) {
                    alert(gettext('deleted'));

                    get_inentory_history();
                    get_expiry_date();
                    pharmacy_database_search();

                    $("#disposal_medicine").modal('hide');



                }
                else {
                    if (response.msg == 1) {
                        alert(gettext('Count is more than left')); // 삭제 하려는게 남아있는것 보다 많다.
                    }

                }
            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
        })
    }
    
}


function edit_database_add_medicine(id) {

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