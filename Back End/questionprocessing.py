import base64
import os
import time
import getAIResponse

def readFile(filecontent, filepath, filename):
    filepath = 'Temp_Save/'
    filepath = filepath + filename
    #print(filepath)
    #print(filename)

    if filename.endswith(('.txt')):
        result = saveFile(filecontent, filepath, filename)
        if(result != "success"):
            return result
        #question = readtxt('Back End/Temp_Save/questions.txt')
        #result = getAIResponse.send_request(question)
        return result
    else:
        return "Invalid filetype for question. Please enter a file with an extension of .txt"

def readtxt(file_path):
    #print(os.path.isfile(file_path))
    contents = ""
    checkIfDOne(file_path)
    try:
        with open(file_path, 'r') as file:
            for line in file:
                contents = contents + line.rstrip('\n')
            #print(contents)
            return contents
    except FileNotFoundError:
        return f"Error: The file at {file_path} was not found."
    except IOError:
        return f"Error: An error occurred while reading the file at {file_path}."

def checkIfDOne(file_path):
    while (os.path.isfile(file_path) == False):
        time.sleep(5)

def saveFile(file_content, file_path, file_name):
        try:
            file_content = base64.b64decode(file_content)
            file_path = os.path.join('Temp_Save', file_name)
            with open(file_path, 'wb') as file:
                checkIfDOne(file_path)
                file.write(file_content)
                #print(file_content)
                saveQuestion(file_path, file_content)
                return "Question upload success"
        except Exception as e:
            return ({"message": str(e)}, e)
        
def saveQuestion(file_path, file_content):
    try:
        question_path = os.path.join('Temp_Save', 'questionsFORAI129.txt')
        question_file = open(question_path, 'wb')
        print(file_path)
        print(file_content)
        question_file.write(file_content)
    except Exception as e:
        return ({"message": str(e)}, e)