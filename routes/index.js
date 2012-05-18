var ctrl = require("../atheme.js"),
    xml = require('xmlrpc'),
    uuid = require('node-uuid'),
    util = require('util');

var au = {
    login: function(req, res)
    {
        var client;
        if (req.body.uuid)
        {
            if (req.params.verb == "check")
            {
                client = clients[req.body.uuid];
                if (client != undefined) res.send({authcookie:client.authcookie, uuid:req.body.uuid});
                else res.send({authcookie: -1});
                return;
            }
        }

        if (req.params.verb == "do")
        {
            client = ctrl.create(xml.createClient({host:'scylla.unlink.nswier.edu.au', port: 8080, path: '/xmlrpc'}),
                    req.body.user, req.connection.remoteAddress);
            var id = uuid.v4(null, null, 16);
            clients[id] = client;

            ctrl.login(client, req.body.pass);
            res.send({authcookie:client.authcookie, uuid:id});

            return;
        }
    },

    check: function(req, res)
    {
        if (req.params.service === "memoserv")
        {
            if (req.params.command === "list")
                return au.services.memoserv.list.check(req, res);
        }
    },

    go: function(req, res)
    {
        if (req.params.service === "memoserv")
        {
            if (req.params.command === "list")
            {
                return au.services.memoserv.list.go(req, res);
            }
        }
    },

    services: {
                  memoserv: {
                                list: {
                                          check: function(req, res) {
                                                     res.send({list:clients[req.body.uuid].data.memoserv.list});
                                                     return;
                                                 },
                                          go:    function(req, res) {
                                                     if (clients[req.body.uuid] === undefined){
                                                         console.log("lol undefined");
                                                         return;
                                                     }
                                                     ctrl.memoserv.list(clients[req.body.uuid]);
                                                     res.send({list:null});
                                                     return;
                                                 }
                                      }
                            }
              }
}


/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.dashboard = function(req, res){
    //res.render('dashboard', {words: "piss shit dicks", title: 'AWP Dashboard'});
    res.render('dashboard', {title: 'AWP Dashboard', words: JSON.stringify('words: ["piss", "shit", "dicks"]')});
};

exports.lols = function(req, res)
{
    res.send('user' + req.body.id);
}

var clients = new Object();

exports.atheme = function(req, res)
{
    console.log("exports.atheme() called");
    console.log(util.inspect(req.body, true, null, true));
    if (req.params.service === "core" && req.params.command === "login")
    {
        au.login(req, res);
        return;
    }

    if (req.params.verb === "check")
    {
        if (req.body.uuid === undefined || clients[req.body.uuid] === undefined)
            return;
        return au.check(req, res);
    }
    else if (req.params.verb === "do")
    {
        return au.go(req, res);
    }

    else res.send("Fail.");
}



