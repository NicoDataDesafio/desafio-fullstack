const user = require('../models/client.model');

// Create a new client (segundo formulario)
const createClient = async (req, res) => {
    console.log("req.body");
    const client = req.body; // { nombre, apellidos, fecha_nac, dni, nacionalidad, domicilio, ciudad, provincia, id_pais_origen, cp, telefono, email, colegio, curso, id_servicio, id_pais_destino }
    try {
        const result = await user.createClient(client);
        res.status(201).json({ message: 'Cliente creado con éxito', result });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el cliente' });
    }
};







// Get client by email
const getClient = async (req, res) => {
    const client = req.body; // { email } se filtra por email para acceder a los datos previamente introducidos
    const response = await user.getClient(client);
    res.status(201).json({
        "client_fetched": response,
        data: client
    });
};

const updateClient = async (req, res) => { };

const deleteClient = async (req, res) => { };

module.exports = {
    createClient,
    getClient,
    updateClient,
    deleteClient,
};  