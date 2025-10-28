import auth from './auth'
import { createRouter } from '../lib/hono'
import files from './files'
import folders from './folders'
import { share, sharePublic } from './share'

const routes = createRouter()

routes.route('/auth', auth)
routes.route('/files', files)
routes.route('/folders', folders)
routes.route('/share', share)
routes.route('/public/share', sharePublic)

export default routes
