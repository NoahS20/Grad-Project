import getAIResponse
import pythonflask
import questionprocessing
import fileprocessing
import time
import os

def sendFile_and_ChatGPTResponse(file_content):
    questions = readtxt('.\Temp_Save\questionsFORAI129.txt')
    if(questions == ""):
        return "Please upload question before sending answers."
    print(questions)
    #AIresponse = getAIResponse.send_request(questions)
    return "Send to model file success"

def sendTypedResponse_and_ChatGPTResponse(student_answer):
    questions = readtxt('.\Temp_Save\questionsFORAI129.txt')
    if(questions == ""):
        return "Please upload question before sending answers."
    print(questions)
    #AIresponse = getAIResponse.send_request(questions)
    return "Send to model typed success"


def readtxt(file_path):
    #print(os.path.isfile(file_path))
    contents = ""
    #checkIfDOne(file_path)
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
