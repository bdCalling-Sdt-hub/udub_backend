import httpStatus from 'http-status';
import catchAsync from '../../utilities/catchasync';
import sendResponse from '../../utilities/sendResponse';
import MaterialServices from './material.service';

const addMaterial = catchAsync(async (req, res) => {
  const result = await MaterialServices.createMaterial(req.user, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Material added successfully',
    data: result,
  });
});
const updateMaterial = catchAsync(async (req, res) => {
  const result = await MaterialServices.updateMaterial(
    req.user,
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Material updated successfully',
    data: result,
  });
});
const getAllMatetial = catchAsync(async (req, res) => {
  const result = await MaterialServices.getProjectMaterial(
    req.params.id,
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Material retrieved successfully',
    data: result,
  });
});
const getSingleMaterial = catchAsync(async (req, res) => {
  const result = await MaterialServices.getSingleMaterial(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Material retrieved successfully',
    data: result,
  });
});

const MaterialController = {
  addMaterial,
  updateMaterial,
  getAllMatetial,
  getSingleMaterial,
};
export default MaterialController;
