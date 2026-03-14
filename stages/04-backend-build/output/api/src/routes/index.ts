import { Router } from 'express'
import eventsRouter  from './events'
import metricsRouter from './metrics'
import funnelsRouter from './funnels'
import reportsRouter from './reports'
import cohortsRouter from './cohorts'

const router = Router()

router.use('/events',  eventsRouter)
router.use('/metrics', metricsRouter)
router.use('/funnels', funnelsRouter)
router.use('/reports', reportsRouter)
router.use('/cohorts', cohortsRouter)

export default router
