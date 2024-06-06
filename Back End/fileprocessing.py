import textract
import os

def readFile(filename):
    filepath = 'Temp_Save/'
    #filename = filename.toString()
    filepath = filepath + filename
    print(filepath)
    print(filename)
    '''
    if filename.endswith(('.doc')):
        text = textract.process(file)
    '''
    if filename.endswith(('.txt')):
        return(readtxt(filepath))

def readtxt(file_path):
    contents = ""
    try:
        with open(file_path, 'r') as file:
            for line in file:
                #contents = contents + line.rstrip('\n')
                contents = contents + line
        print(contents)
        return contents
    except FileNotFoundError:
        return f"Error: The file at {file_path} was not found."
    except IOError:
        return f"Error: An error occurred while reading the file at {file_path}."

#readFile("test123.txt") 