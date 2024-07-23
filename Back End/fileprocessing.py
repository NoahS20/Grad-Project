import base64
import textract
import os
import time
import pypdf

def readFile(filecontent, filepath, filename):
    result = saveFile(filecontent, filepath, filename)
    filepath = 'Temp_Save/'
    filepath = filepath + filename
    #print(filepath)
    #print(filename)

    if(result != "success"):
        return result, 500

    if filename.endswith(('.txt')):
        return(readtxt(filepath))
    elif filename.endswith(('.doc','.docx')):
        return readdoc(filepath)
    elif filename.endswith(('.pdf')):
        return readpdf(filepath)
    else:
        return "Invalid filetype. Please enter a file with an extension of .txt, .doc, .docx, or .pdf"

def readtxt(file_path):
    print(os.path.isfile(file_path))
    contents = ""
    checkIfDOne(file_path)
    try:
        with open(file_path, 'r') as file:
            for line in file:
                contents = contents + line.rstrip('\n')
            return contents
    except FileNotFoundError:
        return f"Error: The file at {file_path} was not found."
    except IOError:
        return f"Error: An error occurred while reading the file at {file_path}."
    
def readdoc(file_path):
    contents = ""
    checkIfDOne(file_path)
    try:
      with open(file_path, 'r') as file:
        contents = textract.process(file_path)
        contents = contents.decode("utf8")
        return contents
    except FileNotFoundError:
        return f"Error: The file at {file_path} was not found."
    except IOError:
        return f"Error: An error occurred while reading the file at {file_path}."

def readpdf(file_path):
    contents = ""
    text = ''
    counter = 0
    checkIfDOne(file_path)
    try:
      with open(file_path, 'r') as file:
        contents = pypdf.PdfReader(file_path) 
        while counter < len(contents.pages):
            page = contents.pages[counter] 
            text = text + page.extract_text()
            counter+=1
        return text
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
            return ({"message": str(e)}, e)