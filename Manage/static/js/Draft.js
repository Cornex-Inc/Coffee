jQuery.browser = {};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
$(function () {




    //추가 버튼
    $("#btn_new").click(function () {
        show_new_edit_draft('N');
    })


});



function show_new_edit_draft(type = null) {
     if (type == 'N') { //새로 등록

    } else if (type == 'E') { // 수정

    }else {
        return;
    } 

    $('#new_edit_draft').modal({ backdrop: 'static', keyboard: false });
    $('#new_edit_draft').modal('show');


}