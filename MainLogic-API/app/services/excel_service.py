import pandas as pd
import os
from fastapi import HTTPException
from .file_service import get_fileName_full_path
from models.MainLogicRequest import AnswerSumRuqestWithCred, processrequestDone

def load_excel_file(gender: str, age: float, file_type: str, pORt: str, kORs: str) -> pd.DataFrame:
    """Loads the appropriate Excel file based on gender, age, and file type."""
    file_path = get_fileName_full_path(gender, age, file_type, pORt, kORs)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"File {file_path} not found")
    try:
        return pd.read_excel(file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading Excel file: {e}")
    
def process_all_scores(request: AnswerSumRuqestWithCred) -> processrequestDone:
    #Extract parameters from thr request
    scores = request.preprocessed_scores # Dict of scores before calculating
    gender = request.gender # boy or girl
    age = request.age # Age og the child
    pORt = request.pORt # p for parent, t for teacher
    kORs = request.kORs # kids or school        
    
    # Load the correct Excel file based on gender, age, and file type
    total_df = load_excel_file(gender.lower(), age, "gen", pORt, kORs)
    indexes_df = load_excel_file(gender.lower(), age, "I", pORt, kORs)
    scale_df = load_excel_file(gender.lower(), age, "S", pORt, kORs)
    
    if kORs == 'kids':
        res_dict = convert_scores_kids(scores, total_df, indexes_df, scale_df)
    elif kORs == 'school':
        res_dict = convert_scores_school(scores, total_df, indexes_df, scale_df)
    
    result = processrequestDone(
        # **request.model_dump(),
        converted_scores=res_dict
    )
    
    return result

def convert_scores_kids(score_dict: dict, total_df: pd.DataFrame, combind_df: pd.DataFrame, normal_df: pd.DataFrame) -> dict:
    """Returns the scores as a dictionary."""
    result = {}
    
    if 'total' in score_dict:
        result['total_score'] = int(get_total_score(score_dict, total_df))

    if 'isci' in score_dict and 'fi' in score_dict and 'emi' in score_dict:        
        # Get individual scores for ISCI, FI, and EMI
        result['isci_score'] = int(get_score_from_column(combind_df, 'isci', score_dict['isci']))
        result['fi_score'] = int(get_score_from_column(combind_df, 'fi', score_dict['fi']))
        result['emi_score'] = int(get_score_from_column(combind_df, 'emi', score_dict['emi']))
                        
    # Checking for normal scores
    normal_keys = ['inhibition', 'shifting', 'emotional control', 'working memory', 'plan/org']
    for key in normal_keys:
        if key in score_dict:
            result[f'{key}_score'] = int(get_normal_score({key: score_dict[key]}, normal_df))

    return result

def convert_scores_school(score_dict: dict, total_df: pd.DataFrame, combind_df: pd.DataFrame, normal_df: pd.DataFrame) -> dict:
    """Returns the scores as a dictionary."""
    result = {}
    
    if 'total' in score_dict:
        result['total_score'] = int(get_total_score(score_dict, total_df))

    if 'bri' in score_dict and 'mi' in score_dict:        
        result['bri_score'] = int(get_score_from_column(combind_df, 'bri', score_dict['bri']))
        result['mi_score'] = int(get_score_from_column(combind_df, 'mi', score_dict['mi']))
                        
    # Checking for normal scores
    normal_keys = ['inhibition', 'shifting', 'emotional control', 'initiative', 'working memory', 'plan/org', 'org environment', 'monitor']
    for key in normal_keys:
        if key in score_dict:
            result[f'{key}_score'] = int(get_normal_score({key: score_dict[key]}, normal_df))

    return result

def get_score_from_column(df: pd.DataFrame, column_name: str, score_value) -> int:
    """Retrieves the score for a specified column based on the raw score."""
    if column_name not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{column_name}' not found in the DataFrame")
    
    # Ensure 'raw score' column exists
    if 'raw score' not in df.columns:
        raise HTTPException(status_code=400, detail="Column 'raw score' not found in the DataFrame")
    
    # Check if the score_value exists in the 'raw score' column
    if score_value not in df['raw score'].values:
        raise HTTPException(status_code=404, detail=f"Raw score {score_value} not found in the DataFrame")
    
    res = df[df['raw score'] == score_value]
    
    if res.empty:
        raise HTTPException(status_code=404, detail=f"No matching entry found for {column_name}: {score_value}")
    
    # Check if the value is not NaN before returning it
    if pd.notna(res[column_name].values[0]):
        return int(res[column_name].values[0])
    else:
        raise HTTPException(status_code=400, detail=f"The score for {column_name} with raw score {score_value} is NaN")

def get_total_score(score_dict: dict, df: pd.DataFrame) -> int:
    """Returns the total score based on the raw score."""
    raw_score = score_dict['total']
    df.columns = df.columns.str.strip().str.lower()
    
    if 'raw score' not in df.columns:
        raise HTTPException(status_code=400, detail="Column 'raw score' not found in the DataFrame")
    
    # Check if the raw_score exists in the 'raw score' column
    if raw_score not in df['raw score'].values:
        raise HTTPException(status_code=404, detail=f"Raw score {raw_score} not found in the DataFrame")

    res = df[df['raw score'] == raw_score]

    if res.empty:
        raise HTTPException(status_code=404, detail=f"No matching entry found for raw score: {raw_score}")
    
    if pd.notna(res['t score'].values[0]):
        return int(res['t score'].values[0])
    else:
        raise HTTPException(status_code=400, detail=f"The score for 't score' with raw score {raw_score} is NaN")

def get_normal_score(scores: dict, df: pd.DataFrame) -> int:
    """Returns the normal score based on the raw score."""
    if not scores:
        return 0
    
    key = list(scores.keys())[0] # Assuming only one key in the dictionary
    raw_score = scores[key]
    
    df.columns = df.columns.str.strip().str.lower()
    
    if 'raw score' not in df.columns:
        raise HTTPException(status_code=400, detail="Column 'raw score' not found in the DataFrame")
    
    # Check if the raw_score exists in the 'raw score' column
    if raw_score not in df['raw score'].values:
        raise HTTPException(status_code=404, detail=f"Raw score {raw_score} not found in the DataFrame")
    
    if key not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{key}' not found in the DataFrame")
    
    res = df[df['raw score'] == raw_score]
    
    if res.empty:
        raise HTTPException(status_code=404, detail=f"No matching entry found for raw score: {raw_score}")
    
    if pd.notna(res[key].values[0]):
        return int(res[key].values[0])
    else:
        raise HTTPException(status_code=400, detail=f"The score for {key} with raw score {raw_score} is NaN")
