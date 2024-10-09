import axios from 'axios';
import { showAlert } from './alert';

export const updateData = async (data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMe',
      data: data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Updated successfully');
      window.setTimeout(() => {
        location.reload(true);
      }, 5000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updatePassword = async (oldPassword, newPassword, newPasswordConfirm) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updatePassword',
      data: {
        oldPassword: oldPassword,
        newPassword: newPassword,
        newPasswordConfirm: newPasswordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Updated successfully');
      window.setTimeout(() => {
        location.reload(true);
      }, 5000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
