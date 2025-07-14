from fastapi import HTTPException
from typing import List, Dict

ROWS_CONFIG = {
    't': {
        'inconsistency_A': [27, 36, 42, 45, 46, 47, 48, 55, 57, 69],
        'inconsistency_B': [26, 39, 43, 9, 65, 58, 66, 57, 46, 65],
        'negativity': [13, 14, 24, 32, 64, 68, 71, 82, 84],
        'inhibition': [9, 38, 42, 43, 45, 47, 57, 58, 59, 69],
        'shifting': [4, 5, 6, 13, 14, 24, 30, 40, 53, 62],
        'emotional_control': [1, 7, 26, 27, 48, 51, 64, 66, 72],
        'initiative': [3, 10, 19, 34, 50, 63, 70],
        'working_memory': [2, 8, 18, 21, 25, 28, 31, 32, 39, 60],
        'plan_org': [12, 17, 23, 29, 35, 37, 41, 49, 52, 56],
        'org_of_mat': [11, 16, 20, 67, 68, 71, 73],
        'monitor': [15, 22, 33, 36, 44, 46, 54, 55, 61, 65]
    },
    'p': {
        'inconsistency_A': [7, 11, 27, 33, 38, 41, 42, 44, 53, 55],
        'inconsistency_B': [25, 22, 17, 32, 59, 65, 63, 54, 60, 44],
        'negativity': [8, 13, 23, 30, 62, 71, 80, 83, 85],
        'inhibition': [38, 41, 43, 44, 49, 54, 55, 56, 59, 65],
        'shifting': [5, 6, 8, 12, 13, 23, 30, 39],
        'emotional_control': [1, 7, 20, 25, 26, 45, 50, 62, 64, 70],
        'initiative': [3, 10, 16, 47, 48, 61, 66, 71],
        'working_memory': [2, 9, 17, 20, 24, 27, 32, 33, 37, 57],
        'plan_org': [11, 15, 18, 22, 28, 35, 36, 40, 46, 51, 53, 58],
        'org_of_mat': [4, 29, 67, 68, 69, 72],
        'monitor': [14, 21, 31, 34, 42, 52, 60, 63]
    }
}

def check_questions(answers: List[int], pORt: str):  
    # Check if all questions have been answered
    if len(answers) != 86:
        raise HTTPException(status_code=400, detail=f"All questions must be answered, only {len(answers)} questions were answered")
    
    scores = {}
    
    # Sum all the scores
    scores['inhibition'] = sum(answers[row - 1] for row in ROWS_CONFIG[pORt]['inhibition'])
    scores['shifting'] = sum(answers[row - 1] for row in ROWS_CONFIG[pORt]['shifting'])
    scores['emotional control'] = sum(answers[row - 1] for row in ROWS_CONFIG[pORt]['emotional_control'])
    scores['initiative'] = sum(answers[row - 1] for row in ROWS_CONFIG[pORt]['initiative'])
    scores['working memory'] = sum(answers[row - 1] for row in ROWS_CONFIG[pORt]['working_memory'])
    scores['plan/org'] = sum(answers[row - 1] for row in ROWS_CONFIG[pORt]['plan_org'])
    scores['org environment'] = sum(answers[row - 1] for row in ROWS_CONFIG[pORt]['org_of_mat'])
    scores['monitor'] = sum(answers[row - 1] for row in ROWS_CONFIG[pORt]['monitor'])
    
    # Calculate the combination scores
    scores['bri'] = scores['inhibition'] + scores['shifting'] + scores['emotional control']
    scores['mi'] = scores['initiative'] + scores['working memory'] + scores['plan/org'] + scores['org environment'] + scores['monitor']
    scores['total'] = scores['bri'] + scores['mi']
    
    # Check if the scores dict is empty
    if not scores:
        raise HTTPException(status_code=400, detail="An error occurred while calculating the scores for school")
    
    inconsistency_value = check_inconsistency(answers, ROWS_CONFIG[pORt]['inconsistency_A'], ROWS_CONFIG[pORt]['inconsistency_B'])
    negativity_count = check_negativity(answers, ROWS_CONFIG[pORt]['negativity'])
    
    scores['negativity_count'] = negativity_count
    scores['inconsistency'] = inconsistency_value
    
    if len(scores) != 13:
        raise HTTPException(status_code=400, detail=f"An error occurred while calculating the scores, expected 13 scores, got {len(scores)}")
    
    return scores
        
    
def check_negativity(answers, NEGATIVITY_ROWS: List[int]):
    """Check for negativity in the answers"""
    
    # count how many questions were answered with 3
    negativity_count = sum(1 for row in NEGATIVITY_ROWS if answers[row - 1] == 3)
    return negativity_count

def check_inconsistency(answers, INCONSISTENCY_ROWS_A: List[int], INCONSISTENCY_ROWS_B: List[int]):
    """Check for inconsistency in the answers"""
    
    # Check for valid indices
    if len(INCONSISTENCY_ROWS_A) != len(INCONSISTENCY_ROWS_B):
        raise HTTPException(status_code=400, detail="Inconsistency row lists must have the same length")
    
    # Calculate the inconsistency
    num_list = []
    for i in range(len(INCONSISTENCY_ROWS_A)):
        if (INCONSISTENCY_ROWS_A[i] - 1) < len(answers) and (INCONSISTENCY_ROWS_B[i] - 1) < len(answers):
            inconsistency_value = answers[INCONSISTENCY_ROWS_A[i] - 1] - answers[INCONSISTENCY_ROWS_B[i] - 1]
            num_list.append(inconsistency_value)
            
    return sum(abs(num) for num in num_list)