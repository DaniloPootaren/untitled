export const getErrorMessage = (type: string): string => {
  switch (type) {
    case 'required':
      return 'This field is required!';
    default:
      return '';
  }
};
