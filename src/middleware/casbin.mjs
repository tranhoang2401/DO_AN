import casbin from 'casbin';
import Roles from '../app/models/Roles.mjs';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import path from 'path';

const enforcer = await casbin.newEnforcer(
  path.join(__dirname, '../config/cashbinConfig/cashbinConfig.conf'),
  path.join(__dirname, '../config/cashbinConfig/cashbinConfig.csv')
);

const cashbin = async (req, res, next) => {
  try {
    const userRole = await Roles.findById(req.user.roleID);
    const resource = req.originalUrl;

    const allowed = await enforcer.enforce(userRole.name, resource, req.method);

    if (allowed) {
      next();
    } else {
      return res
        .status(403)
        .json({ success: false, message: 'You do not have access to this resource.' });
    }
  } catch (error) {
    return res.status(500).json({success: false, message: 'Server Error.' });
  }
};

export default cashbin;
