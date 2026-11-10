const DashboardModel = require('../models/Dashboard.model');

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await DashboardModel.getStats();
    return res.status(200).json({
      sucesso: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
