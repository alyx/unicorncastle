$("#waiting").modal({
    keyboard: false,
    backdrop: "static",
    show: true
});

console.log("Cookie UUID: " + $.cookie("awp_uuid"));

$.ajax({
    url: '/atheme/do/memoserv/list',
    type: 'POST',
    data: 'uuid=' + $.cookie("awp_uuid"),
    dataType: 'json',
    success: function(res) {
        console.log("Succes!")
        if (res.list === null)
        {
            console.log("Checked..");
            window.setTimeout(250, checkMemos());
        }
    }
});

function checkMemos()
{
    $.ajax({
        url: '/atheme/check/memoserv/list',
        type: 'POST',
        data: 'uuid=' + $.cookie("awp_uuid"),
        dataType: 'json',
        success: function(res) {
            if (res.list === undefined)
            {
                console.log("Rechecking");
                window.setTimeout(250, checkMemos());
                return;
            }
            else if (res.list === -1)
            {
                console.log("List obtaining failed!");
                return;
            }
            else
            {
                console.log("Looping");
                console.log(res.list);
                res.messages.forEach(function(element) {
                    $("<p>" + element + "<p>").insertAfter($('h1'));
                    console.log(element);
                });
                $("#waiting").modal("hide");
            }
        }
    });
}
