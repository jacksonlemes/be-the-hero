const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {

    async index (request, response) {
        const ongs = await connection('ongs').select('*');

        return response.json(ongs);
    },

    async create (request, response) {  // async para deixar a função assíncrona
        const {name, email, whatsapp, city, uf} = request.body;

        const id = crypto.randomBytes(4).toString('HEX');

        await connection('ongs').insert({   // await para aguardar o retorno da inserção do banco para gerar a resposta
            id,
            name,
            email,
            whatsapp,
            city,
            uf,
        });
        return response.json({ id });
    }
};
