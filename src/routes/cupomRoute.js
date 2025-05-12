import cupomController from "../controllers/cupomController.js";

export default (app) => {
  app.get('/cupom', cupomController.get);
  app.get('/cupom/:id', cupomController.get);
  app.post('/cupom', cupomController.persist);
  app.patch('/cupom/:id', cupomController.persist);
  app.delete('/cupom/:id', cupomController.destroy);
}