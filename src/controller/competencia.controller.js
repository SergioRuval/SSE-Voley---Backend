
// Para editar una competencia es necesario obtener el id de dicha competencia
// Validamos que el id no esté vacío
// Luego validamos que los campos no estén vacíos

const Competencia = require("../model/competencia.model");

// Por último hacemos el update de todos los campos menos el id_equipo
exports.editTournament = async (req, res) =>{
    if(!req.params.idCompetencia){
        console.log("ERROR: No puede editarse una competencia con id vacío");
        res.status(400).send(false);
        return;
    }

    // Validamos que el cuerpo no esté vacío
    if(!req.body.nombre || !req.body.fecha_inicio || !req.body.fecha_fin
        || !req.body.id_tipo){
            console.log("ERROR: No puede editarse una competencia vacía");
            res.status(400).send(false);
            return;
        }

    // Buscamos que el id esté en
    const competencia = await Competencia.findAll({
        where: { id: req.params.idCompetencia }
    });

    if(competencia.length === 0){
        console.log("ERROR: Id de competencia no existe");
        res.status(400).send(false);
        return;
    }

    // Una vez validado todo hacemos la actualización
    try {
        const { nombre, activa, fecha_inicio, fecha_fin, id_tipo } = req.body;

        const registrosEditados = await Competencia.update({
            activa: activa,
            fecha_fin: fecha_fin,
            fecha_inicio: fecha_inicio,
            nombre: nombre,
            id_tipo: id_tipo
        },{
            where: { id: req.params.idCompetencia }
        })

        if(registrosEditados.length > 0){
            console.log("Competencia editada satisfactoriamente");
            const competenciaEditada = await Competencia.findAll({
                where: { id: req.params.idCompetencia }
            });

            if(competenciaEditada.length > 0){
                res.status(200).json(competenciaEditada[0]);
            }else{
                console.log("No se pudo obtener la competencia editada");
                res.status(500).send(null);
            }
        }else{
            console.log("ERROR: competencia no editada");
            res.status(500).send(null);
        }
    } catch (error) {
        console.log("ERROR: competencia no editada - " + error.message);
        res.status(500).send(null);
    }
}