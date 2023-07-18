import {editViewValidator} from '../../../../admin/extensions/utils/validation';

export default {
  async beforeUpdate(event) {
    const {params, model} = event;

    const validator = editViewValidator[model.uid];
    const error = validator?.(params.data);
    if (error) {
      throw new Error(error.error);
    }
  },
};
