import requests
import base64
import json

def sendQuestionAnswer(url, question_name, question_content, answer_name, answer_content):
    headers = {'Content-Type': 'application/json'}
    
    # Encode contents in base64
    encoded_question_content = base64.b64encode(question_content.encode('utf-8')).decode('utf-8')
    encoded_answer_content = base64.b64encode(answer_content.encode('utf-8')).decode('utf-8')
    
    data = {
        'question_name': question_name,
        'question_content': encoded_question_content,
        'answer_name': answer_name,
        'answer_content': encoded_answer_content,
    }
    
    print("Request to /api/upload_python")
    try:
        response = requests.post(
            url=url + '/api/upload_python',
            data=json.dumps(data),
            headers=headers,
            verify='ssl/server.pem'
        )
        response.raise_for_status()  # Raise an exception for HTTP errors
        response_json = response.json()
        return(response_json.get('Verdict', 'No verdict in response'))
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")

def readtxt(file_path):
    contents = ""
    try:
        with open(file_path, 'r') as file:
            for line in file:
                contents = contents + line.rstrip('\n')
            return contents
    except FileNotFoundError:
        return f"Error: The file at {file_path} was not found."
    except IOError:
        return f"Error: An error occurred while reading the file at {file_path}."

def sendFile(question_file_name, question_file_path, answer_file_name, answer_fle_path):
    url = 'https://localhost:5000'
    print(url + '/api/upload_python')

    # Read file contents
    questioncontent = readtxt(question_file_path)
    answercontent = readtxt(answer_fle_path)
    
    response = sendQuestionAnswer(url, question_file_name, questioncontent, answer_file_name, answercontent)
    return response

#response = sendFile('./questiontest2.txt', 'questiontest2.txt', './answertest.txt', 'answertest.txt')
#print(response)
