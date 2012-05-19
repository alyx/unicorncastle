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
            window.setTimeout(checkMemos, 250);
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
            if (res.list === undefined || res.list === null)
            {
                console.log("Rechecking");
                window.setTimeout(checkMemos, 250);
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
                res.list.messages.forEach(function(element) {
                    $("<p>" + element + "<p>").insertAfter($('h1'));
                    console.log(element);
                });
                $("#waiting").modal("hide");
            }
        }
    });
}
