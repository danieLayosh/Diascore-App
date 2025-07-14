from fastapi import UploadFile, HTTPException
from io import BytesIO
from PIL import Image
import cv2
import numpy as np
from app.services import omrServices as omr

def read_image(file: UploadFile) -> np.ndarray:
    """
    Convert an uploaded image to a numpy array.

    Parameters:
        file (UploadFile): The uploaded image file.

    Returns:
        np.ndarray: The image as a numpy array.
    """
    try:
        image = Image.open(BytesIO(file.file.read()))
        return cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")

def do_omr_two_pages(images: list[np.ndarray]) -> dict[int, int]:
    """
    OMR for two pages. This function is called when the user uploads a file with two pages. Or when the user uploads two images.

    Parameters:
        images (list[np.ndarray]): List of two images as numpy arrays.
    
    Returns:
        dict[int, int]: Dictionary of extracted answers.
    """
    if images is None:
        raise HTTPException(status_code=400, detail="No images were uploaded")
    
    answers = {}
    page_omr(images[0], answers, debug=False)
    
    if len(images) > 1:
        page_omr(images[1], answers, debug=False)
    
    return answers
    

def page_omr(image: np.ndarray, answers: dict[int, int], debug: bool = False):
    """
    Process a single OMR page, updating the answers dictionary.

    Parameters:
        image (np.ndarray): The image as a numpy array.
        answers (dict[int, int]): Dictionary to store extracted answers.
        debug (bool): Whether to visualize intermediate steps.
    
    Returns:
        dict[int, int]: Dictionary of extracted answers.
    """
    
    # Constants for image dimensions
    widthImg = 1240
    heightImg = 1754

    # Step 1: Preprocess the image
    img, imgCanny = omr.preprocess_image(image, widthImg, heightImg)

    # Step 2: Find contours
    contours = omr.find_contours(imgCanny)
    imgContours = img.copy()
    
    # Only draw contours if debug is True
    if debug:
        cv2.drawContours(imgContours, contours, -1, (0, 255, 0), 10)

    # Step 3: Find the two biggest contours
    biggestContours = omr.find_two_biggest_contours(contours)
    if len(biggestContours) < 1:
        return "No contours were detected"
    
    if debug:
        print("Two contours were detected")
    imgBiggestContours = img.copy()
    
    # Only draw the biggest contours if debug is True
    if debug:
        cv2.drawContours(imgBiggestContours, [biggestContours[0]], -1, (0, 255, 0), 20)

    # Step 4: Warp perspective for the first contour
    imgWarpColored = omr.warp_perspective(img, biggestContours[0], widthImg, heightImg)

    # Step 5: Calculate the height of the biggest contour
    biggestContour = omr.find_biggest_contour(contours)
    height, width = omr.calculate_rectangle_dimensions(biggestContour)
    
    # Step 6: Determine the type of page and handle accordingly
    imgCanny2, imgBiggestContours2 = imgWarpColored, imgWarpColored
    if height > 800 and width < 0.5 * height:  # Narrow width relative to height
        if debug:
            print("Type 2 page detected (tall and narrow)")
        num_answers = 41
    elif height > 1000 and width > 0.5 * height:  # A4-like dimensions
        if debug:
            print("A4 page detected")
        imgWarpColored, imgCanny2, imgBiggestContours2 = process_second_contour(imgWarpColored, widthImg, heightImg, debug)
        num_answers = 22
    elif height < 200:
        return "The maximum height of the rectangle is 200, which is too small"
    else:
        if debug:
            print("Answer box detected")
        num_answers = 22

    # Step 7: Apply threshold to warped image
    imgThresh = omr.apply_threshold(imgWarpColored)

    # Step 8: Process boxes to extract answers
    omr.process_boxes(imgThresh, num_answers, (1 if num_answers == 22 else 2), answers)
    # print("Answers:", answers)

    # Step 9: Stack images for visualization
    imageArray = [
        [img, imgContours, imgCanny, imgBiggestContours],
        [imgWarpColored, imgCanny2, imgBiggestContours2, imgThresh]
    ]
    imgStacked = omr.stack_images(imageArray, 0.25)

    # Step 10: Debug Visualization
    if debug:
        cv2.imshow('Stacked Images', imgStacked)
        cv2.waitKey(0)
        cv2.destroyAllWindows()
    
    return answers


def process_second_contour(imgWarpColored, widthImg, heightImg, debug=False):
    """
    Processes the second contour when the rectangle dimensions suggest it is a Type 2 or A4 page.
    """
    img2, imgCanny2 = omr.preprocess_image(imgWarpColored, widthImg, heightImg)
    contours2 = omr.find_contours(imgCanny2)

    imgContours2 = img2.copy()
    
    # Only draw contours if debug is True
    if debug:
        cv2.drawContours(imgContours2, contours2, -1, (0, 255, 0), 10)

    biggestContour2 = omr.find_biggest_contour(contours2)
    if biggestContour2 is not None and len(biggestContour2) >= 1:
        imgBiggestContours2 = img2.copy()
        
        # Only draw the biggest contour if debug is True
        if debug:
            cv2.drawContours(imgBiggestContours2, [biggestContour2], -1, (0, 255, 0), 20)
        imgWarpColored = omr.warp_perspective(img2, biggestContour2, widthImg, heightImg)
        return imgWarpColored, imgCanny2, imgBiggestContours2

    return imgWarpColored, imgCanny2, imgContours2