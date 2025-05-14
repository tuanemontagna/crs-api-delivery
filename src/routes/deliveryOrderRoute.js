import deliveryOrderController from "../controllers/deliveryOrderController.js";

export default (app) => {
    app.get('/delivery/pedidos-disponiveis', deliveryOrderController.listarPedidosDisponiveis);
    app.post('/delivery/aceitar-pedido/:idPedido', deliveryOrderController.aceitarPedido);
    app.post('/delivery/marcar-entregue/:idPedido', deliveryOrderController.marcarComoEntregue);
  }