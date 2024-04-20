require('./connections')
const routes = require('./routes')

const app = async (req, res) => {
  routes(req,res)
};


module.exports = app