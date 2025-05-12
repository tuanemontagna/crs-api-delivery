import userRoute from "./userRoute.js";
import categoriesRoute from "./categoriesRoute.js";
import productRoute from "./productRoute.js";
import paymentRoute from "./paymentRoute.js";
import cupomRoute from "./cupomRoute.js";
import adressRoute from "./adressRoute.js";
import orderRoute from "./orderRoute.js";
import orderProductRoute from "./orderProductRoute.js";

function Routes(app) {
  userRoute(app);
  categoriesRoute(app);
  productRoute(app);
  paymentRoute(app);
  cupomRoute(app);
  adressRoute(app);
  orderRoute(app);
  orderProductRoute(app);
}

export default Routes;