const { TablePosition } = require('../../models');
const { throwBadRequest } = require('../../utils/errorHandling');

const getTablePosition = async (tablePositionId) => {
  const table = await TablePosition.findById(tablePositionId);
  throwBadRequest(!table, 'Không tìm thấy vị trí bàn');
  return table;
};

const createTablePosition = async (createBody) => {
  const table = await TablePosition.create(createBody);
  return table;
};

const updateTablePosition = async (tablePositionId, updateBody) => {
  const table = await TablePosition.findByIdAndUpdate(tablePositionId, { $set: updateBody }, { new: true });
  throwBadRequest(!table, 'Không tìm thấy vị trí bàn');
  return table;
};

const deleteTablePosition = async (tablePositionId) => {
  await TablePosition.deleteOne({ _id: tablePositionId });
};

const getTablesPosition = async () => {};

module.exports = {
  getTablePosition,
  createTablePosition,
  updateTablePosition,
  deleteTablePosition,
  getTablesPosition,
};
