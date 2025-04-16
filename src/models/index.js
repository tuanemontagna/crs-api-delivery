import Cliente from "./ClienteModel.js";
import Emprestimo from "./EmprestimoModel.js";

(async () => {
  await Cliente.sync({ force:true });
  await Emprestimo.sync({ force: true })
})();