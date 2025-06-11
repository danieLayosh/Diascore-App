export const omrRequest = async (file1, file2, pORt, kORs) => {
  const apiKey = window.env.VITE_OMR_API_KEY; 
  const url = window.env.VITE_OMR_API_URL;

  // Convert blob URLs to actual files
  const convertBlobToFile = async (blobUrl) => {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      return new File([blob], "file", { type: blob.type });
  };

  const file1Obj = await convertBlobToFile(file1);
  const file2Obj = await convertBlobToFile(file2);

  const formData = new FormData();
  formData.append("files", file1Obj);
  formData.append("files", file2Obj);
  formData.append("pORt", pORt);
  formData.append("kORs", kORs);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      'x-api-key': apiKey,
    },
    body: formData,
  });

  return response.json();
};
