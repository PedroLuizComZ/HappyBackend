import { Router } from "express";
import multer from "multer";

import OrphanagesController from "./controllers/OrphanagesController";
import UsersController from "./controllers/UsersController";
import uploadConfig from "./config/upload";

const routes = Router();
const upload = multer(uploadConfig);

routes.get("/orphanages", OrphanagesController.index);
routes.get("/orphanages/:id", OrphanagesController.show);
routes.get("/orphanages_pendent", OrphanagesController.showPendent);
routes.get("/orphanages_aproved", OrphanagesController.showAproved);
routes.post("/orphanage_aproved/:id", OrphanagesController.aprove);

routes.delete("/orphanages/:id", OrphanagesController.delete);
routes.post("/orphanages", upload.array("images"), OrphanagesController.create);
routes.put("/orphanages", upload.array("images"), OrphanagesController.update);

routes.post("/check_token", UsersController.validate);
routes.post("/check_user", UsersController.index);
routes.post("/users", UsersController.create);

export default routes;
