const { Recording } = require('../models');

exports.getRecordings = async (req, res) => {
    try {
        const { subject_id } = req.query;
        
        // Si mandan el subject_id, filtramos por esa materia. Si no, traemos todas.
        const queryOptions = subject_id ? { where: { subjectId: subject_id } } : {};
        
        const recordings = await Recording.findAll(queryOptions);
        
        res.json({ success: true, data: recordings });
    } catch (error) {
        console.error("Error al obtener las grabaciones:", error);
        res.status(500).json({ 
            success: false, 
            message: "No se pudo cargar la grabación en este momento. Por favor, reintente más tarde." 
        });
    }
};