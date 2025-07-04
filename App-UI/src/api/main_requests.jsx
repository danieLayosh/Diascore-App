export const mainRequest = async (gender, age, pORt, kORs, answers) => {
  const apiKey = import.meta.env.VITE_MAIN_LOGIC_KEY;
  let url = import.meta.env.VITE_MAIN_API_URL;
  url = `${url}questions/sum`;

  // Convert answers object to a list (array)
  const answersArray = Object.values(answers);

  // Create a JSON object instead of FormData
  const requestData = {
    gender: gender,
    age: parseFloat(age), // Ensure age is a number
    pORt: pORt,
    kORs: kORs,
    answers: answersArray, // Ensure answers is an object
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json', // Set JSON content type
        'x-api-key': apiKey,
      },
      body: JSON.stringify(requestData), // Convert object to JSON string
    });

    // Check if response is OK (status 2xx)
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    // Parse the JSON response
    const responseJson = await response.json();
    return responseJson;

  } catch (error) {
    console.error("Error in mainRequest:", error);
    throw error; // Rethrow error to be handled by the caller
  }
};

export const getDiagnosisQuestions = async (kORs, pORt) => {
  console.log("getDiagnosisQuestions", kORs, pORt);

  const apiKey = import.meta.env.VITE_MAIN_LOGIC_KEY;
  let url = import.meta.env.VITE_MAIN_API_URL;
  if (kORs === "kids" || kORs === "school" && pORt === "p" || pORt === "t") {
    url = `${url}questions/test/?pORt=${pORt}&kORs=${kORs}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json', 
          'x-api-key': apiKey,
        },
      });
  
      // Check if response is OK (status 2xx)
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
  
      // Parse the JSON response
      const responseJson = await response.json();
      return responseJson;
  
    } catch (error) {
      console.error("Error in mainRequest:", error);
      throw error; // Rethrow error to be handled by the caller
    }

  }
};