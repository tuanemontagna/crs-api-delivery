import orderController from "../controllers/orderController.js";

export default (app) => {
  app.get('/order', orderController.get);
  app.get('/order/:id', orderController.get);
  app.get('/order/historico-pedidos/:idUserCustomer', orderController.historicoPedidos);
  app.post('/order', orderController.persist);
  app.post('/order/calcular-total', orderController.calcularTotal);
  app.patch('/order/:id', orderController.persist);
  app.delete('/order/:id', orderController.destroy);
}