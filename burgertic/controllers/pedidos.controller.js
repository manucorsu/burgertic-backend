import PedidosService from "../services/pedidos.service.js";
import usuariosService from "../services/usuarios.service.js";

const getPedidos = async (req, res) => {
  // --------------- COMPLETAR ---------------
  /*
        Recordar que para cumplir con toda la funcionalidad deben:

            1. Utilizar el servicio de pedidos para obtener todos los pedidos
            2. Devolver un json con los pedidos (status 200)
            3. Devolver un mensaje de error si algo falló (status 500)
        
    */
  try {
    const pedidos = await PedidosService.getPedidos();
    if (pedidos.length === 0) res.status(404).json({ message: "No se encontraron pedidos." });
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPedidosByUser = async (req, res) => {
  // --------------- COMPLETAR ---------------
  /*
        Recordar que para cumplir con toda la funcionalidad deben:

            1. Utilizar el servicio de pedidos para obtener los pedidos del usuario
            2. Si el usuario no tiene pedidos, devolver una lista vacía (status 200)
            3. Si el usuario tiene pedidos, devolver un json con los pedidos (status 200)
            4. Devolver un mensaje de error si algo falló (status 500)
        
    */
  try {
    const pedidos = await PedidosService.getPedidosByUser(req.id);
    // verifyToken asigna req.id = payload.id
    res.status(200).json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json();
  }
};

const getPedidoById = async (req, res) => {
  // --------------- COMPLETAR ---------------
  /*
        Recordar que para cumplir con toda la funcionalidad deben:

            1. Utilizar el servicio de pedidos para obtener el pedido por id (utilizando el id recibido en los parámetros de la request)
            2. Si el pedido no existe, devolver un mensaje de error (status 404)
            3. Si el pedido existe, devolver un json con el pedido (status 200)
            4. Devolver un mensaje de error si algo falló (status 500)
        
    */
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "No se envió un id!" });
  try {
    const pedido = await PedidosService.getPedidoById(id);
    if (!pedido) return res.status(404).json({ message: `No se encontró un pedido con el id ${id}.` });
    res.status(200).json(pedido);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPedido = async (req, res) => {
  // --------------- COMPLETAR ---------------
  /*
        Recordar que para cumplir con toda la funcionalidad deben:

            1. Verificar que el body de la request tenga el campo platos
            2. Verificar que el campo productos sea un array
            3. Verificar que el array de productos tenga al menos un producto
            4. Verificar que todos los productos tengan un id y una cantidad
            5. Si algo de lo anterior no se cumple, devolver un mensaje de error (status 400)
            6. Crear un pedido con los productos recibidos y el id del usuario (utilizando el servicio de pedidos)
            7. Devolver un mensaje de éxito (status 201)
            8. Devolver un mensaje de error si algo falló (status 500)
        
    */

  const pedido = req.body;
  if (!pedido.platos) return res.status(400).json({ message: "El pedido debe tener platos!" });
  const platos = pedido.platos;
  if (Array.isArray(platos) === false || pedido.platos.length < 0)
    return res.status(400).json({ message: "'platos' debe ser un array de uno o más platos" });

  platos.forEach((p) => {
    if (!p.id || !p.cantidad) {
      return res.status(400).json({ message: "'platos' tiene un plato inválido (le falta id y/o cantidad)" });
    }
  });

  try {
    //req.id = payload.id si no falló el middleware verifyToken
    await PedidosService.createPedido(req.id, platos);
    res.status(201).json({ message: "Pedido creado con éxito." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const aceptarPedido = async (req, res) => {
  // --------------- COMPLETAR ---------------
  /*
        Recordar que para cumplir con toda la funcionalidad deben:

            1. Utilizar el servicio de pedidos para obtener el pedido por id (utilizando el id recibido en los parámetros de la request)
            2. Si el pedido no existe, devolver un mensaje de error (status 404)
            3. Si el pedido existe, verificar que el pedido esté en estado "pendiente"
            4. Si el pedido no está en estado "pendiente", devolver un mensaje de error (status 400)
            5. Si el pedido está en estado "pendiente", actualizar el estado del pedido a "aceptado"
            6. Devolver un mensaje de éxito (status 200)
            7. Devolver un mensaje de error si algo falló (status 500)
        
    */
  const id = req.params.id;

  const pedido = await PedidosService.getPedidoById(id);
  if (pedido === null) return res.status(404).json({ message: `No se encontró un pedido con el id ${id}.` });
  if (pedido.estado !== "pendiente")
    res.status(400).json({ message: "Solo se pueden aceptar pedidos marcados como 'pendiente'." });
  try {
    await PedidosService.updatePedido(id, "aceptado");
    res.status(200).json({ message: "El pedido se aceptó con éxito." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const comenzarPedido = async (req, res) => {
  // --------------- COMPLETAR ---------------
  /*
        Recordar que para cumplir con toda la funcionalidad deben:

            1. Utilizar el servicio de pedidos para obtener el pedido por id (utilizando el id recibido en los parámetros de la request)
            2. Si el pedido no existe, devolver un mensaje de error (status 404)
            3. Si el pedido existe, verificar que el pedido esté en estado "aceptado"
            4. Si el pedido no está en estado "aceptado", devolver un mensaje de error (status 400)
            5. Si el pedido está en estado "aceptado", actualizar el estado del pedido a "en camino"
            6. Devolver un mensaje de éxito (status 200)
            7. Devolver un mensaje de error si algo falló (status 500)
        
    */
  const id = req.params.id;

  const pedido = await PedidosService.getPedidoById(id);
  if (pedido === null) return res.status(404).json({ message: `No se encontró un pedido con el id ${id}.` });
  if (pedido.estado !== "aceptado")
    res.status(400).json({ message: "Solo se pueden comenzar pedidos aceptados." });
  try {
    await PedidosService.updatePedido(id, "en camino");
    res.status(200).json({ message: "El pedido se aceptó con éxito." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const entregarPedido = async (req, res) => {
  // --------------- COMPLETAR ---------------
  /*
        Recordar que para cumplir con toda la funcionalidad deben:

            1. Utilizar el servicio de pedidos para obtener el pedido por id (utilizando el id recibido en los parámetros de la request)
            2. Si el pedido no existe, devolver un mensaje de error (status 404)
            3. Si el pedido existe, verificar que el pedido esté en estado "en camino"
            4. Si el pedido no está en estado "en camino", devolver un mensaje de error (status 400)
            5. Si el pedido está en estado "en camino", actualizar el estado del pedido a "entregado"
            6. Devolver un mensaje de éxito (status 200)
            7. Devolver un mensaje de error si algo falló (status 500)
        
    */
};

const deletePedido = async (req, res) => {
  // --------------- COMPLETAR ---------------
  /*
        Recordar que para cumplir con toda la funcionalidad deben:

            1. Utilizar el servicio de pedidos para obtener el pedido por id (utilizando el id recibido en los parámetros de la request)
            2. Si el pedido no existe, devolver un mensaje de error (status 404)
            3. Si el pedido existe, eliminar el pedido
            4. Devolver un mensaje de éxito (status 200)
            5. Devolver un mensaje de error si algo falló (status 500)
        
    */
};

export default {
  getPedidos,
  getPedidosByUser,
  getPedidoById,
  createPedido,
  aceptarPedido,
  comenzarPedido,
  entregarPedido,
  deletePedido,
};
