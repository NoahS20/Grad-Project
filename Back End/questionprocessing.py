import base64
import os
import time
import getAIResponse

def readFile(filecontent, filepath, filename):
    filepath = 'Temp_Save/'
    filepath = filepath + filename
    print(filepath)
    print(filename)

    if(result != "success"):
        return result, 500

    if filename.endswith(('.txt')):
        result = saveFile(filecontent, filepath, filename)
        #question = readtxt('Back End/Temp_Save/questions.txt')
        #result = getAIResponse.send_request(question)
        return result
    else:
        return "Invalid filetype for question. Please enter a file with an extension of .txt"

def readtxt(file_path):
    print(os.path.isfile(file_path))
    contents = ""
    checkIfDOne(file_path)
    try:
        with open(file_path, 'r') as file:
            for line in file:
                contents = contents + line.rstrip('\n')
            print(contents)
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
            file_path = './Temp_Save/questions.txt'
            with open(file_path, 'w') as file:
                file.write(file_content)
                return "Question Uploaded"
        except Exception as e:
            return ({"message": str(e)}, e)