const connection = require('../database/connection');

module.exports = {
    async index (request, response) {
        const {page = 1} = request.query;

        const [cont] = await connection("incidents").count(); //[] para pegar o primeiro indice

        const incidents = await connection('incidents')
        .join('ongs', "ongs.id", "=", "incidents.ong_id")
        .limit(5)
        .offset((page - 1) * 5)
        .select(['incidents.*', 'ongs.name', 'ongs.email', 'ongs.whatsapp', 'ongs.city', 'ongs.uf']);

        response.header('X-Total-Count', cont['count(*)']);

        return response.json(incidents);
    },

    async create (request, response) {  // async para deixar a função assíncrona
        const {title, description, value} = request.body;

        const ong_id = request.headers.authorization;

        const [id] = await connection('incidents').insert({   // await para aguardar o retorno da inserção do banco para gerar a resposta
            title,
            description,
            value,
            ong_id,
        });
        return response.json({ id });
    },

    async delete (request, response){
        const {id} = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
        .where('id', id)
        .select('ong_id')
        .first();  // retorna somente os dados ao invés de um array
        
        if (incident.ong_id != ong_id){  // verifica se o authorization é o mesmo ong_id do incidendente
            return response.status(401).json({ error: 'Operation not permitted'});
        }

        await connection('incidents').where('id', id).delete();

        return response.status(204).send();
        
    
    }




}