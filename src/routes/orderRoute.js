import orderController from "../controllers/orderController.js";

export default (app) => {
  app.get('/order', orderController.get);
  app.get('/order/:id', orderController.get);
  app.post('/order', orderController.persist);
  app.patch('/order/:id', orderController.persist);
  app.delete('/order/:id', orderController.destroy);
}