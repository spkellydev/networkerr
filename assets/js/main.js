let dismissable = document.querySelectorAll('dismissable');

var alerts = [...document.querySelectorAll(".alert")];
alerts.forEach(function(btn){
btn.onclick = function() {
    var modal = btn.closest('.dismissable');
    modal.parentNode.removeChild(modal);
}
});