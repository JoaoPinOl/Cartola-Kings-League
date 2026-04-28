// Responsabilidade: Centralizar todos os erros da aplicação em um formato JSON padrão
module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erro interno no servidor';

    console.error(`[ERROR] ${statusCode} - ${message}`);

    res.status(statusCode).json({
        error: true,
        message,
        statusCode
    });
};