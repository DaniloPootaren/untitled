export const downloadCSVFile = (csvString, filename, type: string) => {
  const blob = new Blob([csvString], {type});
  const objectURL = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', objectURL);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getFileNameFromContentDisposition = (headers: any): string => {
  let fileName = '';

  const contentDisposition = headers['content-disposition'];
  if (contentDisposition) {
    const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = fileNameRegex.exec(contentDisposition);
    if (matches && matches[1]) {
      fileName = matches[1].replace(/['"]/g, '');
    }
  }

  return fileName;
};
