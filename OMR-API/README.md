# Diascore OMR-API Documentation

This document provides detailed information about using the **Diascore OMR-API**, including example requests to process OMR sheets.

---

## Endpoint Details

**URL:**  
`POST http://127.0.0.1:8001/api/v1/omr/process-omr`

**Description:**  
Processes Optical Mark Recognition (OMR) sheets from uploaded images. This endpoint supports form-data requests containing multiple images and form fields.

**Form Parameters:**

| Parameter Name | Type   | Description                                                                             |
| -------------- | ------ | --------------------------------------------------------------------------------------- |
| `files`        | `File` | One or more images representing OMR sheets to process.                                  |
| `pORt`         | `Text` | Specify `p` for parent or `t` for teacher (role of the user requesting the process).    |
| `kORs`         | `Text` | Specify `kids` for kindergarten/child-related tests or `school` for school-based tests. |

**Response Format:**

```json
{
  "answers": {
    "question_number": "selected_answer"
  }
}
```

## Example API Requests

### Example 1: Processing Kindergarten Parent Test Sheets

This example demonstrates a request for processing two OMR sheet images of a kindergarten parent test.

**Request URL:**  
`http://127.0.0.1:8001/api/v1/omr/process-omr`

**cURL Request:**

```bash
curl --location 'http://127.0.0.1:8001/api/v1/omr/process-omr' \
--form 'files=@"path/to/briefP_Second_Page.JPG"' \
--form 'files=@"path/to/briefP_First_Page.JPG"' \
--form 'pORt="p"' \
--form 'kORs="kids"'
```

### Example 2: Processing School Teacher Test Sheets

This example demonstrates a request for processing OMR sheet images of a school teacher test.

**Request URL:**
`http://127.0.0.1:8001/api/v1/omr/process-omr`

**cURL Request:**

```bash
curl --location 'http://127.0.0.1:8001/api/v1/omr/process-omr' \
--form 'files=@"path/to/school_test_Page_1.JPG"' \
--form 'files=@"path/to/school_test_Page_2.JPG"' \
--form 'pORt="t"' \
--form 'kORs="school"'
```

**_need to create .env file with API_KEY_**
**Every request must have x-api-key in the header**
