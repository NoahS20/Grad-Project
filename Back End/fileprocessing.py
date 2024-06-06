import base64
import textract
import os
import time

def readFile(filecontent, filepath, filename):
    result = saveFile(filecontent, filepath, filename)
    filepath = 'Temp_Save/'
    #filename = filename.toString()
    filepath = filepath + filename
    print(filepath)
    print(filename)

    '''
    if filename.endswith(('.doc')):
        text = textract.process(file)
    '''
    if(result != "success"):
        return result, 500

    if filename.endswith(('.txt')):
        return(readtxt(filepath, filename))

def readtxt(file_path, filename):
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
            file_path = os.path.join('Temp_Save', file_name)
            with open(file_path, 'wb') as file:
                file.write(file_content)
                return "success"
        except Exception as e:
            return ({"error": str(e)}, e)

#readFile("test123.txt")