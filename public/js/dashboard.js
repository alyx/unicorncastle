$("#waiting").modal({
    keyboard: false,
    backdrop: "static",
    show: true
});

$.ajax({
    url: '/atheme/do/memoserv/list',
    type: 'POST',
    data: 'uuid=' + $.cookie("awp_uuid"),
    dataType: 'json',
    success: function(res) {
        console.log(res);
        if (res.list === null)
        {
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
                var listing = JSON.parse(res.list);
                listing.messages.forEach(function(element) {
                    var listEl = $("<li>" + element.from + " [" + element.when + "]</li>");
                    $("#memos").append(listEl);
                });
                $("#waiting").modal("hide");
            }
        }
    });
}
