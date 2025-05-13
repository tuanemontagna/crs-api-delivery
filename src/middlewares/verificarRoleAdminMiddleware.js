import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

export async function admin(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(400).send({ 
        message: 'Token não existe' 
      });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    const user = await User.findOne({
      where: { id: decoded.id } 
    });

    if (!user) {
      return res.status(404).send({ 
        message: 'Usuário não encontrado' 
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).send({
        message: 'Sem permissão'
      });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(500).send({
      error: error.message
    });
  }
}
