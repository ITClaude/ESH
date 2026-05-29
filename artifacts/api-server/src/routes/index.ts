import { Router, type IRouter } from "express";
import healthRouter from "./health";
import slidesRouter from "./slides";
import newsRouter from "./news";
import eventsRouter from "./events";
import galleryRouter from "./gallery";
import staffRouter from "./staff";
import classesRouter from "./classes";
import downloadsRouter from "./downloads";
import contactRouter from "./contact";
import adminRouter from "./admin";
import settingsRouter from "./settings";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(slidesRouter);
router.use(newsRouter);
router.use(eventsRouter);
router.use(galleryRouter);
router.use(staffRouter);
router.use(classesRouter);
router.use(downloadsRouter);
router.use(contactRouter);
router.use(adminRouter);
router.use(settingsRouter);
router.use(dashboardRouter);

export default router;
