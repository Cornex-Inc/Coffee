
var canvas = null
var signaturePad = null;

var max_width = 800;
var max_height= 400;

$(function () {

    canvas = document.getElementById("sign");
    signaturePad = new SignaturePad(canvas);
    signaturePad.backgroundColor = "rgb(0,0,0,0)";
    canvas.width = max_width;
    canvas.height = max_height

    //var tmp = ""
    //var dataURL = signaturePad.fromDataURL(tmp);


    function resizeCanvas() {
        //var ratio = Math.max(window.devicePixelRatio || 1, 1);
        //canvas.width = canvas.offsetWidth * ratio;
        //canvas.height = canvas.offsetHeight * ratio;
        //canvas.getContext("2d").scale(ratio, ratio);
        //signaturePad.clear(); // otherwise isEmpty() might return incorrect value

        canvas.width = window.innerWidth - 30;
        canvas.height = window.innerHeight;
        //if (max_width > window.innerWidth)
        //    canvas.width = window.innerWidth - 30;
        //else
        //    canvas.max_width = max_width;
        //
        //if (max_height > window.innerHeight)
        //    canvas.height = window.innerHeight;
        //else 
        //    canvas.height = max_height
        
    }


    //window.addEventListener("resize", resizeCanvas);
    //resizeCanvas();

    search_waiting_sign();
});



function search_waiting_sign() {

    $.ajax({
        type: 'POST',
        url: '/search_waiting_sign/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),


        },
        dataType: 'Json',
        success: function (response) {
            console.log(response)
            $('#sign_waiting_list_table > tbody ').empty();
            if (response.datas.length == 0) {
                $('#Reservation_Status').append("<tr><td colspan='8'>" + gettext('No Result !!') + "</td></tr>");
            } else {
                for (var i = 0; i < response.datas.length; i++) {
                    var str = "<tr style='cursor:pointer;' onclick='selected_sign(this," + response.datas[i]['id'] + ")'>";
                    str += "<td>" + (i + 1) + "</td>" +
                        "<td>" + response.datas[i]['chart'] + "</td>" +
                        "<td>" + response.datas[i]['name_kor'] + ' / ' + response.datas[i]['name_eng'] + "</td>" +
                        "<td>" + response.datas[i]['date_of_birth'] + ' (' + response.datas[i]['gender'] + '/' + response.datas[i]['age'] + ")</td>" +
                        "<td></td>" +
                        "</tr>";

                    $('#sign_waiting_list_table > tbody').append(str);
                }
            }

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    });


    $("#clear").click(function () {
        signaturePad.clear();
    });
    $("#undo").click(function () {})
}


function selected_sign(obj, id = null) {
    $("#sign_waiting_list_table tr").removeClass('danger');
    $("#selected_id").val('');


    if (id == null) { return; }

    
    $(obj).addClass('danger');
    $("#selected_id").val(id);
}


function save() {
    var id = $("#selected_id").val();
    if (id == '') {
        alert(gettext('Select Patient first.'));
        return;
    }

    var sign_data = signaturePad.toDataURL();
    $.ajax({
        type: 'POST',
        url: '/save_sign/',
        data: {
            'csrfmiddlewaretoken': $('#csrf').val(),

            'id': id,
            'sign_data': sign_data,
        },
        dataType: 'Json',
        success: function (response) {
            alert(gettext('Saved.'));
            search_waiting_sign();
            $("#selected_id").val('');
            signaturePad.clear();


        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        },
    });

}