import UsuariosService from "../services/usuarios.service.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  // --------------- COMPLETAR ---------------
  /*
 
        Recordar que para cumplir con toda la funcionalidad deben:
 
            1. Verificar que el body de la request tenga el campo usuario
            2. Verificar que el campo usuario tenga los campos nombre, apellido, email y password
            3. Verificar que no exista un usuario con el mismo email (utilizando el servicio de usuario)
            4. Devolver un mensaje de error si algo falló hasta el momento (status 400)
            5. Hashear la contraseña antes de guardarla en la base de datos
            6. Guardar el usuario en la base de datos (utilizando el servicio de usuario)
            7. Devolver un mensaje de éxito si todo salió bien (status 201)
            8. Devolver un mensaje de error si algo falló guardando al usuario (status 500)
    */
  const usuario = req.body;
  if (!usuario) {
    return res.status(400).json({ message: "No se envió un usuario." });
  }
  if (!usuario.nombre || !usuario.apellido || !usuario.email || !usuario.password) {
    return res.status(400).json({ message: "El usuario tiene datos incompletos." });
  }
  if (usuario.nombre.length > 60 || usuario.apellido.length > 60 || usuario.email.length > 255) {
    return res.status(400).json({ message: "El nombre, apellido y/o email del usuario excede el límite de caracteres." })
  } // no lo pide la consigna pero notamos que en pgadmin aparece que estos campos son character varying(60/60/255) respectivamente
  if ((await UsuariosService.getUsuarioByEmail(usuario.email)) === null) {
    try {
      const hashedPwd = await bcrypt.hash(usuario.password, 10);
      usuario.password = hashedPwd;
      await UsuariosService.createUsuario(usuario);
      res.status(201).json({ message: "Usuario registrado con éxito." })
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message })
    }
  }
  else {
    return res.status(400).json({ message: "Ya existe un usuario con ese mail." })
  }
}

const login = async (req, res) => {
  // --------------- COMPLETAR ---------------
  /*
 
        Recordar que para cumplir con toda la funcionalidad deben:
 
            1. Verificar que el body de la request tenga el campo email y password
            2. Buscar un usuario con el email recibido
            3. Verificar que el usuario exista
            4. Verificar que la contraseña recibida sea correcta
            5. Devolver un mensaje de error si algo falló hasta el momento (status 400)
            6. Crear un token con el id del usuario y firmarlo con la clave secreta (utilizando la librería jsonwebtoken)
            7. Devolver un json con el usuario y el token (status 200)
            8. Devolver un mensaje de error si algo falló (status 500)
        
    */
  const usuario = req.body;
  if (!usuario) return res.status(400).json({ message: "No se envió un usuario." });
  if (!usuario.email || !usuario.password) {
    return res.status(400).json({ message: "El usuario tiene datos incompletos." });
  }
  const usuarioDb = await UsuariosService.getUsuarioByEmail(usuario.email);
  if (usuarioDb === null) {
    return res.status(400).json({ message: "No hay un usuario registrado con ese email." });
  }
  else {
    const matches = await bcrypt.compare(usuario.password, usuarioDb.password);
    if (matches) {
      const token = jwt.sign({ id: usuarioDb.id, admin: usuarioDb.admin }, process.env.JWT_SECRET, { expiresIn: "30m" });
      return res.status(200).json({
        nombre: usuarioDb.nombre,
        apellido: usuarioDb.apellido,
        email: usuarioDb.email,
        admin: usuarioDb.admin,
        token: token
      });
    }
    else {
      return res.status(400).json({ message: "Usuario o contraseña incorrecta." });
    }
  }
};

export default { register, login };
