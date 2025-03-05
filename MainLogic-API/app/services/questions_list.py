def get_questions_list(pORt: str, kORs: str) -> list[str]:
    if kORs == "kids":
        with open(r"data\brief-tests-texts\briefP\briefp.txt", encoding="utf-8") as file:
            questions_list = [line.strip() for line in file]
            if len(questions_list) == 63:
                return questions_list
            else:
                raise Exception("Questions list is not of the expected length")
    elif kORs == "school":
        if pORt =="p":
            with open(r"data\brief-tests-texts\briefSchool\Parents\brief.txt", encoding="utf-8") as file:
                questions_list = [line.strip() for line in file]
                if len(questions_list) == 86:
                    return questions_list
                else:
                    raise Exception("Questions list is not of the expected length")
        elif pORt =="t":
            with open(r"data\brief-tests-texts\briefSchool\Teachers\brief.txt", encoding="utf-8") as file:
                questions_list = [line.strip() for line in file]
                if len(questions_list) == 86:
                    return questions_list
                else:
                    raise Exception("Questions list is not of the expected length")