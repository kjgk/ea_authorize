function centerWindow(url, width, height){
    var l = (screen.width - width) / 2;
    var t = (screen.height - height) / 2;
    var s = 'width=' + width + ', height=' + height + ', top=' + t + ', left=' + l;
    s += ', toolbar=no, scrollbars=no, menubar=no, location=no, resizable=no';
    open(url, '_blank', s);
}

function openModalWindow(url, arg, w, h) {
    return showModalDialog(url, arg, "dialogWidth:" + w + "px; dialogHeight:" + h + "px; status:0;help:no");
}

function inputPlusNumber(){
    if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)
            || event.keyCode == 8 || event.keyCode == 46 || event.keyCode == 37|| event.keyCode == 39 || event.keyCode == 190){
        event.returnValue = true;
    }
    else{
        event.returnValue = false;
    }
}
function forbidInput(){
    event.returnValue = false;
}
function clearListBox(id){
    var o = window.document.getElementById(id);
    if (o != null){
        for (var i = o.options.length; i >= 0; i--)
            o.remove(0);
    }
}
