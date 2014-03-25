var emailjs = require('emailjs');

// TODO: pasarle un DAO
var Controller = function() {

    var mongo = require('mongodb');

    var Server = mongo.Server,
        Db = mongo.Db,
        BSON = mongo.BSONPure;

    var server = new Server('127.0.0.1', 27017, {auto_reconnect: true});
    db = new Db('cafe', server, { safe: true });

    // meter el codigo dentro de la conexion...
    db.open(function(err, db) {
        if(!err) {
            console.log("Connected to 'cafe' database");
        }
        else {
            console.log("Unable to connecto to 'cafe' database");
        }
    });

    this.index = function(req, res) {
        // console.log('HOLA, chaval!');
        res.render('index', {title: 'Consulta de Precios', username: req.user.username});
    };

    this.getLogin = function(req, res) {
        res.render('login', {title: 'Login'});
    };

    this.logout = function(req, res) {
        console.log(req.user.username + ' is about to log out.');
        req.logout();
        res.redirect('/');
    };

    this.newUser = function(req, res) {
        var email = req.body.email;
        var password = req.body.password;
        var actividad = req.body.actividad;
        var empresa = req.body.empresa;
        if(!email || !password || !actividad || !empresa){
            res.send('No se recibieron los datos necesarios para crear la cuenta nueva.');
            console.log('No se recibieron los datos necesarios para crear la cuenta nueva.');
            return;
        }
        db.collection('solicitudes', function(err, collection) {
            if(err) {
                res.send('Error: '+err);
                console.log('Error: '+err);
                return;
            }
            var date = new Date();
            var solicitud = {
                email: email,
                password: password,
                actividad: actividad,
                empresa: empresa,
                fechaSolicitud: date
            };
            collection.insert(solicitud, function (err) {
                if(err){
                    res.send('Error: '+err);
                    console.log('Error: '+err);
                    return;
                }
                var emailServer = emailjs.server.connect({
                    user: "tarifaconfidencial@gmail.com",
                    password: "xqufgrgszlxjkqae",
                    host: "smtp.gmail.com",
                    ssl: true
                });
                var message = {
                    text: "Un usuario de la empresa " + empresa.toUpperCase() + " con actividad " + actividad.toUpperCase() + " ha solicitado una cuenta."
                        + "\nSu correo es " + email + " y su contraseña deseada es:  \"" + password + "\"  (sin las comillas de los extremos)",
                    from: "tarifaconfidencial@gmail.com",
                    to: "nicodeboni@gmail.com",
                    subject: "Expresso: Nueva Solicitud de Usuario"
                }
                emailServer.send(message, function(err, response) {
                    if(err) {
                        console.log('Error: ' + err);
                        res.send('Ha ocurrido un error intentando enviar un correo a ' + email);
                    }
                    else {
                        console.log('Mensaje enviado a ' + email);
                        res.send('Si estás finalmente aceptado recibirás un correo en la direccion ' + email);
                    }
                });
            });
        });
    };


    this.precio = function(req, res) {
        var familia = req.query.familia;
        var tintas = req.query.tintas;
        var parsedTintas = parseInt(tintas);
        var query = {
            familia: familia,
            tintas: parsedTintas
        };
        var material = req.query.material;
        if(material) {
            query.material = material;
        }

        db.collection('precios', function(err, collection) {
           collection.find(query).toArray(function(err, data) {
                if(err) {
                    console.log('ERROR');
                    return;
                }
                res.send(data);
            });
        });
    };
};

module.exports = Controller;