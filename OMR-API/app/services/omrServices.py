import cv2
import numpy as np
from fastapi import HTTPException
from app.utils import Utils as utils

def preprocess_image(img, width: int, height: int) -> tuple:
    """
    Loads an image from a file path or accepts an image as input, then preprocesses it.
    Converts the image to grayscale, applies Gaussian blur, and Canny edge detection.
    
    Parameters:
    - img (str or np.ndarray): Path to the image file or the image itself as a numpy array.
    - width (int): Desired width of the image.
    - height (int): Desired height of the image.
    
    Returns:
    - tuple: Resized original image and its Canny edge version. 
    """
    # Check if `img` is a file path (string)
    if isinstance(img, str):
        img = cv2.imread(img)
        if img is None:
            raise FileNotFoundError(f"File not found at path: {img}")

    try:
        # Make sure the iamge is vertical
        img = utils.ensure_vertical_orientation(img)
        # Resize the image
        img = cv2.resize(img, (width, height))
        # Convert to grayscale
        imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        # Apply Gaussian blur
        imgBlur = cv2.GaussianBlur(imgGray, (5, 5), 1)
        # Apply Canny edge detection
        imgCanny = cv2.Canny(imgBlur, 10, 50)
        return img, imgCanny
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in preprocess_image: {e}")

    
def find_contours(imgCanny: np.ndarray) -> list:
    """
    Finds contours from a preprocessed Canny image.
    
    Parameters:
    - imgCanny (np.ndarray): Canny edge image.
    
    Returns:
    - list: List of contours.
    """
    try:
        contours, _ = cv2.findContours(imgCanny, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        return contours
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in find_contours: {e}")
    
def calculate_rectangle_dimensions(biggest_contour: np.ndarray) -> tuple:
    """
    Calculates the height and width of the rectangle contour.
    
    Parameters:
    - biggest_contour (np.ndarray): Biggest rectangle contour.
    
    Returns:
    - tuple: Height and width of the rectangle. or (None, None) if the contour is invalid.
    """
    try:
        if biggest_contour is None or len(biggest_contour) != 4:
            return None, None  # Invalid contour data

        # Assuming points are ordered correctly: top-left, top-right, bottom-right, bottom-left
        top_left = biggest_contour[0]
        top_right = biggest_contour[1]
        bottom_left = biggest_contour[3]

        # Calculate the width as the distance between top-left and top-right
        width = np.linalg.norm(top_right - top_left)

        # Calculate the height as the distance between top-left and bottom-left
        height = np.linalg.norm(bottom_left - top_left)

        return height, width
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in calculate_rectangle_dimensions: {e}")

def find_biggest_contour(contours: list) -> np.ndarray:
    """
    Finds and orders the biggest rectangle contour.
    
    Parameters:
    - contours (list): List of contours.
    
    Returns:
    - np.ndarray: Points of the biggest rectangle contour, or None if not valid contour is found.
    """
    try:
        rectCon = utils.rectCounter(contours)
        if rectCon:
            biggestContour = utils.getConrnerPoints(rectCon[0])
            if biggestContour.size != 0:
                return utils.reorder(biggestContour)
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in find_biggest_contour: {e}")

def find_two_biggest_contours(contours: list) -> list:
    """
    Finds and returns the two biggest rectangle-like contours.
    
    Parameters:
    - contours (list): List of contours.
    
    Returns:
    - list: Two largest rectangle-like contours, ordered.
    """
    try:
        rectCon = utils.rectCounter(contours)  # Get rectangle-like contours sorted by area
        biggest_contours = []

        for i in range(min(2, len(rectCon))):  # Process only up to 2 biggest contours
            contour = utils.getConrnerPoints(rectCon[i])
            if contour.size != 0:
                biggest_contours.append(utils.reorder(contour))
    
        return biggest_contours
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in find_two_biggest_contours: {e}")

def warp_perspective(img: np.ndarray, biggestContour: np.ndarray, width: int, height: int) -> np.ndarray:
    """
    Applies a perspective warp to the image.
    
    Parameters:
    - img (np.ndarray): Input image to warp.
    - biggestContour (np.ndarray): Points of the biggest rectangle contour.
    - width (int): Desired width of the warped image.
    - height (int): Desired height of the warped image.
    
    Returns:
    - np.ndarray: Warped image.
    """
    try:
        pt1 = np.float32(biggestContour)
        pt2 = np.float32([[0, 0], [width, 0], [0, height], [width, height]])
        matrix = cv2.getPerspectiveTransform(pt1, pt2)
        return cv2.warpPerspective(img, matrix, (width, height))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in warp_perspective: {e}")

def apply_threshold(imgWarpColored: np.ndarray) -> np.ndarray:
    """
    Applies a binary inverse threshold to a warped image.

    Parameters:
    - imgWarpColored (np.ndarray): Warped input image.
    
    Returns:
    - np.ndarray: Thresholded image.    
    """
    try:
        imgWarpGray = cv2.cvtColor(imgWarpColored, cv2.COLOR_BGR2GRAY)
        return cv2.threshold(imgWarpGray, 170, 255, cv2.THRESH_BINARY_INV)[1]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in apply_threshold: {e}")

def process_boxes(imgThresh: np.ndarray, num_boxes: int, which_page: int, answers_dict: dict) -> dict:
    """
    Processes boxes in a thresholded image to extract answers.

    Parameters:
    - imgThresh (np.ndarray): Thresholded image.
    - num_boxes (int): Number of boxes in the grid.
    - which_page (int): Page identifier (1 or 2).
    - answers_dict (dict): Dictionary to store the results.

    Returns:
    - dict: Updated answers dictionary.
    """
    
    try:
        # Determine the starting key based on the page number
        start_key = 1 if which_page == 1 else 23

        # Split the thresholded image into boxes
        boxes = utils.splitBoxes(imgThresh, num_boxes)

        # Process each group of 3 boxes
        for i in range(0, len(boxes), 3):
            # Calculate non-zero pixel counts for the current group of boxes
            counts = [
                cv2.countNonZero(boxes[i]),
                cv2.countNonZero(boxes[i + 1]),
                cv2.countNonZero(boxes[i + 2]),
            ]

            # Sort counts in descending order
            counts_sorted = sorted(counts, reverse=True)

            # Determine the selected answer
            if counts_sorted[0] - counts_sorted[1] > 300:  # Valid answer threshold
                selected_box = counts.index(counts_sorted[0]) + 1
                reversed_box = 4 - selected_box  # Reverse the mapping (1->3, 2->2, 3->1)
                answers_dict[start_key] = reversed_box
            else:
                answers_dict[start_key] = 0  # Uncertain or invalid answer

            # Increment the key for the next answer
            start_key += 1

        return answers_dict
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in process_boxes: {e}")

def stack_images(imageArray: list, scale: float) -> np.ndarray:
    """
    Stacks multiple images into a single window.
    
    Parameters:
    - imageArray (list): List of images to stack.
    - scale (float): Scale factor for resizing.
    
    Returns:
    - np.ndarray: Stacked image.
    """
    try:
        return utils.stackImages(imageArray, scale)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in stack_images: {e}")