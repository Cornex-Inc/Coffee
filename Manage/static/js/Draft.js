jQuery.browser = {};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
$(function () {




    //�߰� ��ư
    $("#btn_new").click(function () {
        show_new_edit_draft('N');
    })


});



function show_new_edit_draft(type = null) {
     if (type == 'N') { //���� ���

    } else if (type == 'E') { // ����

    }else {
        return;
    } 

    $('#new_edit_draft').modal({ backdrop: 'static', keyboard: false });
    $('#new_edit_draft').modal('show');


}