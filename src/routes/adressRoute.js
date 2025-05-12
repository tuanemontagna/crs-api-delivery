import adressController from "../controllers/adressController.js";

export default (app) => {
  app.get('/adress', adressController.get);
  app.get('/adress/:id', adressController.get);
  app.post('/adress', adressController.persist);
  app.patch('/adress/:id', adressController.persist);
  app.delete('/adress/:id', adressController.destroy);
}