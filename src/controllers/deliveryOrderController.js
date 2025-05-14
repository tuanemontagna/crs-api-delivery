import Order from '../models/OrderModel.js';

const listarPedidosDisponiveis = async (req, res) => {
  try {
    const pedidos = await Order.findAll({
      where: {
        status: 'pedido pronto',
        idUserDelivery: null,
      },
    });

    if (pedidos.length === 0) {
      return res.status(404).send({ message: 'Não há pedidos disponíveis para entrega.' });
    }

    return res.status(200).send({
      message: 'Pedidos encontrados.',
      data: pedidos,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};

const aceitarPedido = async (req, res) => {
  try {
    const { idUserDelivery } = req.body;
    const { idPedido } = req.params;

    const pedido = await Order.findOne({
      where: {
        id: idPedido,
        status: 'pedido pronto',
        idUserDelivery: null, 
      },
    });

    if (!pedido) {
      return res.status(404).send({
        message: 'Pedido não encontrado ou já atribuído.',
      });
    }

    pedido.idUserDelivery = idUserDelivery;
    pedido.status = 'em rota'; 
    await pedido.save();

    return res.status(200).send({
      message: 'Pedido aceito para entrega.',
      data: pedido,
    });

  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const marcarComoEntregue = async (req, res) => {
  try {
    const { idUserDelivery } = req.body;
    const { idPedido } = req.params;

    const pedido = await Order.findOne({
      where: {
        id: idPedido,
        idUserDelivery,
        status: 'em rota',
      },
    });

    if (!pedido) {
      return res.status(404).send({
        message: 'Pedido não encontrado ou não atribuído a este entregador.'
      });
    }

    pedido.status = 'entregue';
    pedido.dataEntrega = new Date();
    await pedido.save();

    return res.status(200).send({
      message: 'Pedido entregue com sucesso.',
      data: pedido,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};

export default {
  listarPedidosDisponiveis,
  aceitarPedido,
  marcarComoEntregue,
};
