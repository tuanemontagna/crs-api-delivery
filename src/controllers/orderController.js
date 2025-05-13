import Order from '../models/OrderModel.js';
import Cupom from '../models/CupomModel.js';
import User from '../models/UserModel.js';
import OrderProduct from '../models/OrderProductModel.js';

const get = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

    if (!id) {
      const response = await Order.findAll({
        order: [['id', 'desc']],
      });
      
      return res.status(200).send({
        message: 'Dados encontrados',
        data: response,
      });
    }

    const response = await Order.findOne({
      where: {
        id: id
      }
    });

    if (!response) {
      return res.status(404).send('nao achou')
    }

    return res.status(200).send({
      message: 'Dados encontrados',
      data: response,
    })
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
}

const calcularTotal = async (usuario, idCupom) => {
  if (!usuario || !usuario.cart || usuario.cart.length === 0) {
    throw new Error('Carrinho vazio');
  }

  let total = 0;

  usuario.cart.forEach(item => {
    total += item.preco * item.quantidade;
  });

  let totalDiscount = total;

  if (idCupom) {
    const cupom = await Cupom.findOne({ where: { id: idCupom } });

    if (cupom) {
      if (cupom.tipo === 'porcentagem') {
        totalDiscount = total - (total * (cupom.valor / 100));
      } else if (cupom.tipo === 'fixo') {
        totalDiscount = total - cupom.valor;
      }

      if (totalDiscount < 0) totalDiscount = 0;
    } else {
      throw new Error('Cupom inválido');
    }
  }

  return { total, totalDiscount };
};

const create = async (corpo, res) => {
  try {
    const { 
      idUserCustomer,
      idAdress, 
      idCupom, 
      idPayment,
      status,
    } = corpo;
  
    const usuario = await User.findOne({ where: { id: idUserCustomer } });
    if (!usuario || !usuario.cart || usuario.cart.length === 0) {
      return res.status(400).send({ 
        message: 'Carrinho vazio' 
      });
    }

    const { total, totalDiscount } = await calcularTotal(usuario, idCupom);

    const novoPedido = await Order.create({
      status,
      total,
      totalDiscount,
      idUserCustomer,
      idAdress,
      idCupom,
      idPayment
    });
    
    console.log(novoPedido);
  
    for (const item of usuario.cart) {
      await OrderProduct.create({
        priceProducts: item.preco,
        quantity: item.quantidade,
        idOrder: novoPedido.id,
        idProduct: item.idProduto
      });
    }

    usuario.cart = [];
    await usuario.save();

    return res.status(201).send({
      message: 'Compra registrada com sucesso!',
      data: novoPedido
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
}

const update = async (corpo, id) => {
  try {
    const response = await Order.findOne({
      where: {
        id
      }
    });

    if (!response) {
      throw new Error('Nao achou');
    }
    
    Object.keys(corpo).forEach((item) => response[item] = corpo[item]);
    await response.save();

    return response;
  } catch (error) {
    throw new Error(error.message)
  }
}

const persist = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

    if (!id) {
      console.log(req.body);
      
      const response = await create(req.body, res);
      return res.status(201).send({
        message: 'criado com sucesso!',
        data: response
      });
    }

    const response = await update(req.body, id);
    return res.status(201).send({
      message: 'atualizado com sucesso!',
      data: response
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
}

const destroy = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;
    if (!id) {
      return res.status(400).send('informa ai paezao')
    }

    const response = await Order.findOne({
      where: {
        id
      }
    });

    if (!response) {
      return res.status(404).send('nao achou');
    }

    await response.destroy();

    return res.status(200).send({
      message: 'registro excluido',
      data: response
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
}

export default {
  get,
  persist,
  destroy,
  calcularTotal,
}