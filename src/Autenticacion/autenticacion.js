const passport = require('passport');
const estrategisLocal = require('passport-local');
const bcrypt = require('bcrypt-nodejs');

//Usuarios a autenticar
const Cliente = require('../Modelos/Cliente');
const Administrador = require('../Modelos/Administrador');

passport.serializeUser((usuario, callBack)=>{
    callBack(null, usuario._id);
});

passport.deserializeUser(async(_idUser, callBack)=>{
    /* Buscar usuario en las collecciones administrador o cliente */
    const cliente = await Cliente.findById(_idUser);
    if(!cliente){
       const administrador = await administrador.findById(_idUser);
       return callBack(null, administrador);
    }else{
        return callBack(null, cliente);
    }
});

function validarContraseña(contraseñaValidar, contraseñaUsuario){
    return bcrypt.compareSync(contraseñaValidar, contraseñaUsuario);
}

passport.use(new estrategisLocal({

    usernameField: 'correo',
    passwordField: 'contraseña'

}, async(correo, contraseña, callBack)=>{
    
    const cliente = await Cliente.findOne({correo: correo});

    /* Se verifica la existencia del cliente en la base de datos. */
    if(!cliente){

       const administrador = await administrador.findOne({correo: correo});

       /*Si no existe un cliente, se busca entonces un administrador. */
        if(!administrador){
            /* Si no es tampoco un administrador, quiere decir que el usuario no existe. */

            /* Retornamos null (No hay un error), false (No existe un usuario), null (No hay un usuario) */
            return callBack(null, false, null);

        }else{
            /*Si existe el administrador, se procede a validar la contraseña. */
            if(!validarContraseña(contraseña, administrador.contraseña)){
                /*De no coincidir, no podrá iniciar sesion */
                return callBack(null, false, null);

            }else{
                /* Existe el usuario y la contraseña es valida */
                return callBack(null, true, administrador);

            }
        }
    }else{
        /*Si existe un cliente, se procede a validar la contraseña. */
        if(!validarContraseña(contraseña, cliente.contraseña)){
            /*De no coincidir, no podrá iniciar sesion */
            return callBack(null, false, null);
        }else{
            /* Existe el usuario y la contraseña es valida */
            return callBack(null, true, cliente);
        }
    }
}))