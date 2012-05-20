var uuid;

$("#register").click(function() {
    window.setTimeout(function() {
        $("div.register").fadeIn(1000);
    }, 500);
    $("#options").fadeOut(500, function(){});
});

$("#login").click(function(){
    window.setTimeout(function() {
        $("div.login").fadeIn(1000);
    }, 500);

    $("#options").fadeOut(500, function(){});
});

$("#authenticating").modal({
    keyboard: false,
    backdrop: "static",
    show: false
});

$("input.login").click(function(){
    var user = $('input[id=user]');
    var pass = $('input[id=pass]');

    var data = "user=" + user.val() + "&pass=" + pass.val();
    console.log("User: " + user.val());
    console.log("Pass: " + pass.val());
    
    $("#authenticating").modal("show");

    $.ajax({
        url: '/atheme/do/core/login',
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function(res) {
            if (res.authcookie === undefined)
            {
                uuid = res.uuid;
                $.cookie("awp_uuid", uuid);
                window.setTimeout(250, checkLogin());
            }
            else console.log("Something fucked up.");
        }
    });
});

function checkLogin()
{
    $.ajax({
        url: '/atheme/check/core/login',
        type: 'POST',
        data: 'uuid=' + uuid,
        dataType:'json',
        success: function(res) {
            if (res.authcookie === undefined)
            {
                window.setTimeout(250, checkLogin());
                return;
            }
            else if (res.authcookie === -1)
            {
                console.log("Authentication failed!");
                return;
            }
            else
            {
                console.log("Authcookie: " + res.authcookie);
                window.location.href = "/dash";
            }
        }
    });
}

