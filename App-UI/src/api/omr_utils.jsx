
// Usefull function to communicate with the OMR API
export const omrRequest = async (file1, file2, pORt, kORs) => {
    const apiKey = import.meta.env.VITE_OMR_API_KEY; 
    const url = import.meta.env.VITE_OMR_API_URL;

    const formData = new FormData();
    formData.append("files", file1);
    formData.append("files", file2); 
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