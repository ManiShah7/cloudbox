import auth from './auth'
import { createRouter } from '../lib/hono'
import files from './files'
import folders from './folders'

const routes = createRouter()

routes.route('/auth', auth)
routes.route('/files', files)
routes.route('/folders', folders)

export default routes
