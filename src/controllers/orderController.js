import Order from '../models/OrderModel.js';
import Cupom from '../models/CupomModel.js';
import User from '../models/UserModel.js';
import OrderProduct from '../models/OrderProductModel.js';
import { sequelize } from '../config/postgres.js';

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

const calcularTotal = async (response, idCupom) => {
  try {
    if (!response || !response.cart || response.cart.length === 0) {
      throw new Error('Carrinho vazio');
    }
    console.log(response.cart);
    
    let total = 0;

    response.cart.forEach(item => {
      total += item.priceProducts * item.quantity;
    });

    let totalDiscount = total;

    if (idCupom) {
      const cupom = await Cupom.findOne({ where: { id: idCupom } });

      if (!cupom) {
        throw new Error('Cupom inválido');
      }

      if (cupom.uses <= 0) {
        throw new Error('Cupom esgotado');
      }

      if (cupom.type === 'porcentagem') {
        totalDiscount = total - (total * (cupom.value / 100));
      } else if (cupom.type === 'fixo') {
        totalDiscount = total - cupom.value;
      }

      if (totalDiscount < 0) totalDiscount = 0;

      cupom.uses -= 1;
      await cupom.save();
    }

    return { total, totalDiscount };
  } catch (error) {
      throw new Error(error.message); 
  }
};

const create = async (corpo, res) => {
  try {
    console.log(corpo);
    
    const { 
      idUserCustomer,
      idAdress, 
      idCupom, 
      idPayment,
      status,
    } = corpo;
  
    const response = await User.findOne({ 
      where: { 
        id: idUserCustomer 
      } 
    });

    if (!response || !response.cart || response.cart.length === 0) {
      return res.status(400).send({ 
        message: 'Carrinho vazio' 
      });
    }

    const { total, totalDiscount } = await calcularTotal(response, idCupom); 

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
  
    for (const item of response.cart) {
      console.log(item)
      await OrderProduct.create({
        priceProducts: item.priceProducts,
        quantity: item.quantity,
        idOrder: novoPedido.id,
        idProduct: item.idProduct
      });
    }

    response.cart = [];
    await response.save();

    return res.status(201).send({
      message: 'Compra registrada com sucesso!',
      data: novoPedido
    });

  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};

const update = async (corpo, id) => {
  try {
    const pedido = await Order.findOne({
      where: { id }
    });

    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }

    const user = await User.findOne({
      where: { id: corpo.idUserCustomer || pedido.idUserCustomer }
    });

    if (!user || !user.cart || user.cart.length === 0) {
      throw new Error('Carrinho vazio ou usuário inválido');
    }

    const { total, totalDiscount } = await calcularTotal(user, corpo.idCupom || pedido.idCupom);

    pedido.total = total;
    pedido.totalDiscount = totalDiscount;

    Object.keys(corpo).forEach((key) => {
      pedido[key] = corpo[key];
    });

    await pedido.save();

    await OrderProduct.destroy({
      where: { idOrder: pedido.id }
    });

    for (const item of user.cart) {
      await OrderProduct.create({
        priceProducts: item.priceProducts,
        quantity: item.quantity,
        idOrder: pedido.id,
        idProduct: item.idProduct
      });
    }

    return pedido;
  } catch (error) {
    throw new Error(error.message);
  }
};

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

const historicoPedidos = async (req, res) => {
  try {
    const { idUserCustomer } = req.params;
    console.log(req.params.idUserCustomer);

    const pedidos = await sequelize.query(`
      SELECT 
          o.id AS order_id,
          o.status,
          o.total,
          o.total_discount,
          o.created_at AS order_created_at,
    
          op.id AS order_product_id,
          op.quantity,
          op.price_products,
    
          p.id AS product_id,
          p.name AS product_name,
          p.price AS product_price,
          p.description AS product_description,
          p.image AS product_image
    
        FROM orders o
        JOIN orders_products op ON op.id_order = o.id
        JOIN products p ON p.id = op.id_product
    
        WHERE o.id_user_customer = :idUserCustomer
        ORDER BY o.created_at DESC;
    `, {
      replacements: { idUserCustomer },
      type: sequelize.QueryTypes.SELECT
    });

    if (!pedidos || pedidos.length === 0) {
      return res.status(404).send({
        message: 'Nenhum pedido encontrado para este cliente.'
      });
    }

    return res.status(200).send({
      message: 'Histórico de pedidos encontrado.',
      data: pedidos
    });

  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};

export default {
  get,
  persist,
  destroy,
  calcularTotal,
  historicoPedidos,
}