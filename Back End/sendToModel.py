import getAIResponse
import pythonflask
import questionprocessing
import fileprocessing
import time
import os
import replicateLlama3APICall

def sendFile_and_ChatGPTResponse(file_content):
    questions = readtxt('.\Temp_Save\questionsFORAI129.txt')
    if(questions == ""):
        return "Please upload a question before sending answers."
    #print(questions)
    AIresponse = getAIResponse.send_request(questions)
    #AIresponse = "The sun appears to be yellow to our eyes because of the way Earth's atmosphere scatters sunlight. The sunlight is made up of various colors, and when it enters our atmosphere, shorter wavelengths like blue and violet are scattered more widely, while longer wavelengths like red, orange, and yellow pass through and reach our eyes. This scattering effect causes the sun to appear more yellow or orange when it is low in the sky, as the light has to pass through a greater distance of the atmosphere. Ultimately, the sun's true color is white, but our eyes perceive it as yellow due to atmospheric scattering."
    verdict = replicateLlama3APICall.askLlama3(file_content, AIresponse, questions)
    return verdict

def sendTypedResponse_and_ChatGPTResponse(student_answer):
    questions = readtxt('.\Temp_Save\questionsFORAI129.txt')
    if(questions == ""):
        return "Please upload a question before sending answers."
    #print(questions)
    AIresponse = getAIResponse.send_request(questions)
    #print(AIresponse)
    #AIresponse = "The sun appears to be yellow to our eyes because of the way Earth's atmosphere scatters sunlight. The sunlight is made up of various colors, and when it enters our atmosphere, shorter wavelengths like blue and violet are scattered more widely, while longer wavelengths like red, orange, and yellow pass through and reach our eyes. This scattering effect causes the sun to appear more yellow or orange when it is low in the sky, as the light has to pass through a greater distance of the atmosphere. Ultimately, the sun's true color is white, but our eyes perceive it as yellow due to atmospheric scattering."
    verdict = replicateLlama3APICall.askLlama3(student_answer, AIresponse, questions)
    return verdict

def readtxt(file_path):
    print(os.path.isfile(file_path))
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
