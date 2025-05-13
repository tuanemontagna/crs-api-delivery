import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).send({ message: 'Token não fornecido ou mal formatado' });
        }
    
        const token = authHeader.split(' ')[1];

        if(!token) {
            return res.status(400).send({ 
                message: 'token nao existe' 
            });
        }

        const user = jwt.verify(token, process.env.TOKEN_KEY);

        req.user = user;
        next();
        console.log('funcionou');

    } catch (error) {
        return res.status(401).send({
            message: 'token inválido',
            error: error.message
        });
    }
}