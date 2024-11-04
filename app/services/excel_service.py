import pandas as pd
import os
from fastapi import HTTPException
from .file_service import get_fileName_full_path

def load_excel_file(gender: str, age: float, file_type: str, pORt: str, kORs: str) -> pd.DataFrame:
    """Loads the appropriate Excel file based on gender, age, and file type."""
    file_path = get_fileName_full_path(gender, age, file_type, pORt, kORs)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"File {file_path} not found")
    try:
        return pd.read_excel(file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading Excel file: {e}")

def return_scores(score_dict: dict, total_df: pd.DataFrame, combind_df: pd.DataFrame, normal_df: pd.DataFrame) -> dict:
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

def get_score_from_column(df: pd.DataFrame, column_name: str, score_value) -> int:
    """Retrieves the score for a specified column based on the raw score."""
    if column_name not in df.columns:
        raise ValueError(f"Column '{column_name}' not found in the DataFrame")
    
    # Ensure 'raw score' column exists
    if 'raw score' not in df.columns:
        raise ValueError("Column 'raw score' not found in the DataFrame")
    
    # Check if the score_value exists in the 'raw score' column
    if score_value not in df['raw score'].values:
        raise ValueError(f"Raw score {score_value} not found in the DataFrame")
    
    res = df[df['raw score'] == score_value]
    
    if res.empty:
        raise ValueError(f"No matching entry found for {column_name}: {score_value}")
    
    # Check if the value is not NaN before returning it
    if pd.notna(res[column_name].values[0]):
        return int(res[column_name].values[0])
    else:
        raise ValueError(f"The score for {column_name} with raw score {score_value} is NaN")

def get_total_score(score_dict: dict, df: pd.DataFrame) -> int:
    """Returns the total score based on the raw score."""
    raw_score = score_dict['total']
    df.columns = df.columns.str.strip().str.lower()
    
    if 'raw score' not in df.columns:
        raise ValueError("Column 'raw score' not found in the DataFrame")
    
    # Check if the raw_score exists in the 'raw score' column
    if raw_score not in df['raw score'].values:
        raise ValueError(f"Raw score {raw_score} not found in the DataFrame")

    res = df[df['raw score'] == raw_score]

    if res.empty:
        raise ValueError(f"No matching entry found for raw score: {raw_score}")
    
    if pd.notna(res['t score'].values[0]):
        return int(res['t score'].values[0])
    else:
        raise ValueError(f"The score for 't score' with raw score {raw_score} is NaN")

def get_normal_score(scores: dict, df: pd.DataFrame) -> int:
    """Returns the normal score based on the raw score."""
    if not scores:
        return 0
    
    key = list(scores.keys())[0] # Assuming only one key in the dictionary
    raw_score = scores[key]
    
    df.columns = df.columns.str.strip().str.lower()
    
    if 'raw score' not in df.columns:
        raise ValueError("Column 'raw score' not found in the DataFrame")
    
    # Check if the raw_score exists in the 'raw score' column
    if raw_score not in df['raw score'].values:
        raise ValueError(f"Raw score {raw_score} not found in the DataFrame")
    
    if key not in df.columns:
        raise ValueError(f"Column '{key}' not found in the DataFrame")
    
    res = df[df['raw score'] == raw_score]
    
    if res.empty:
        raise ValueError(f"No matching entry found for raw score: {raw_score}")
    
    if pd.notna(res[key].values[0]):
        return int(res[key].values[0])
    else:
        raise ValueError(f"The score for {key} with raw score {raw_score} is NaN")
