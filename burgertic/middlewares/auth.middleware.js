import jwt from "jsonwebtoken";
import UsuariosService from "../services/usuarios.service.js";

export const verifyToken = async (req, res, next) => {
    // --------------- COMPLETAR ---------------
    /*

        Recordar que para cumplir con toda la funcionalidad deben:

            1. Verificar si hay un token en los headers de autorización
            2. Verificar que el token esté en el formato correcto (Bearer <token>)
            3. Verificar que el token sea válido (utilizando la librería jsonwebtoken)
            4. Verificar que tenga un id de usuario al decodificarlo
    
        Recordar también que si sucede cualquier error en este proceso, deben devolver un error 401 (Unauthorized)
    */
    const authorization = req.headers.authorization;
    if (!authorization) return res.status(401).json({ message: "No se envió un header de autorización!!" });
    else if (!authorization.startsWith("Bearer ")) return res.status(401).json({ message: "El token no es válido." });
    else try {
        const token = authorization.slice(7);
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (!payload.id) return res.status(401).json({ message: "El token no es válido." });
        else {
            req.id = payload.id;
            next();
        }
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: error.message })
    }
};

export const verifyAdmin = async (req, res, next) => {
    // --------------- COMPLETAR ---------------
    /*

        Recordar que para cumplir con toda la funcionalidad deben:

            1. Verificar que el id de usuario en la request es un administrador (utilizando el servicio de usuarios)
            2. Si no lo es, devolver un error 403 (Forbidden)
    
    */
    const authorization = req.headers.authorization;
    if (!authorization) return res.status(401).json({ message: "No se envió un header de autorización!!" });
    if (authorization.startsWith("Bearer") === false){console.error("adm: malformed"); return res.status(401).json({ message: "El token no es válido." });}
    try {
        const payload = jwt.verify(authorization.slice(7), process.env.JWT_SECRET);
        if (!payload.admin) { console.error("adm: no adm in payload"); return res.status(401).json({ message: "El token no es válido." }) };
        if (payload.admin === false) return res.status(403).json({ message: "El usuario no es administrador." });
        else {
            req.admin = payload.admin;
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: error.message })
    }

};
