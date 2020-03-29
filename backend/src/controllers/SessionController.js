const connection = require('../database/connection');

module.exports = {
    async create (require, response){
        const { id } = require.body;

        const ong = await connection('ongs')
        .where('id', id).select('name').first(); //first retorna o dado e não um array

        if (!ong){  // se não houver ong com este id
            return response.status(400).json({error:"ID não encontrado"});  //400 bad request
        }

        return response.json(ong);
    }
}