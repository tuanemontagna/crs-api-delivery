import productController from "../controllers/productController.js";

export default (app) => {
  app.get('/product', productController.get);
  app.get('/product/:id', productController.get);
  app.get('/product/category/:idCategory', productController.getByCategory);
  app.post('/product', productController.persist);
  app.patch('/product/:id', productController.persist);
  app.delete('/product/:id', productController.destroy);
}