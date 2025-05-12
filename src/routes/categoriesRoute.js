import categoriesController from "../controllers/categoriesController.js";

export default (app) => {
  app.get('/categories', categoriesController.get);
  app.get('/categories/:id', categoriesController.get);
  app.post('/categories', categoriesController.persist);
  app.patch('/categories/:id', categoriesController.persist);
  app.delete('/categories/:id', categoriesController.destroy);
}