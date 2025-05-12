import orderProductController from "../controllers/orderProductController.js";

export default (app) => {
  app.get('/order-product', orderProductController.get);
  app.get('/order-product/:id', orderProductController.get);
  app.post('/order-product', orderProductController.persist);
  app.patch('/order-product/:id', orderProductController.persist);
  app.delete('/order-product/:id', orderProductController.destroy);
}