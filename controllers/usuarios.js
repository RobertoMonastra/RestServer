const { response } = require('express');
const bcryptjs = require('bcryptjs');
 
const Usuario = require('../models/usuario');




const usuariosGet= async(req, res = response) => {

  const { limite = 5, desde = 0 } = req.query;
  const usuarios = await Usuario.find({estado: true})
    .skip(Number(desde))
    .limit(Number(limite));

    //const total = await usuarios.countDocuments(); no funciona esta funcion

    res.json({
        //total,
        usuarios
    });
  }
  
const usuariosPost = async(req, res = response) => {

  

  const {nombre, correo, password, rol} = req.body;
  const usuario = new Usuario({nombre, correo, password, rol});

  

  //Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync( password, salt );

  //Guardar en DB
  await usuario.save();

    res.json({
        usuario
    });
  }

const usuariosPut= async(req, res = response) => {

  const {id} = req.params;
  const {_id, password, google, correo, ...resto } = req.body;

  //TODO validar contra base de datos
  if( password ){
    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync( password, salt );
  }

  const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json(usuario);
  }

const usuariosPatch = (req, res = response) => {
      res.json({
          msg: "patch API - controlador"
        });
    }
    
const usuariosDelete = async(req, res = response) => {

  const {id} = req.params;

  //Fisicamente lo borramos
  //const usuario = await Usuario.findByIdAndDelete(id);

  //cambiar el estado para que no aparesca, pero sigue en BD
  const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});


    res.json(usuario);
    }




  module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
  }