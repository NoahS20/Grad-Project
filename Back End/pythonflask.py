import base64
import os
from flask import Flask, jsonify, redirect, request
from flask_cors import CORS
import fileprocessing
import questionprocessing
import sendToModel
from OpenSSL import SSL
from flask_sslify import SSLify
import ssl

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
sslify = SSLify(app)
message_data = ""

@app.before_request
def before_request():
    if not request.is_secure:
        return redirect(request.url.replace("http://", "https://", 1))

@app.route('/api/data', methods=['POST'])
def post_data():
    if request.is_json:
        data = request.get_json()
        data = sendToModel.sendTypedResponse_and_ChatGPTResponse(data)
        response = {"Verdict": data}
        return jsonify(response)
    else:
        return jsonify({"error": "Invalid content type, must be application/json"}), 400

@app.route('/api/upload', methods=['POST'])
def upload_file():
    content = ""
    if request.is_json:
        data = request.get_json()
        app.logger.debug(f"Request data: {data}")
        file_name = data.get('fileName')
        file_content = data.get('fileContent')
        if not file_name or not file_content:
            return jsonify({"error": "Invalid request, missing fileName or fileContent"}), 400
        file_path = os.path.join('Temp_Save', file_name)
        content = fileprocessing.readFile(file_content, file_path, file_name)
        verdict = sendToModel.sendFile_and_ChatGPTResponse(content)
        os.remove(file_path)
        return jsonify({"Verdict": verdict})
    else:
        return jsonify({"error": "Invalid content type, must be application/json"}), 400

@app.route('/api/question', methods=['POST'])
def upload_question():
    if request.is_json:
        data = request.get_json()
        app.logger.debug(f"Request data: {data}")
        file_name = data.get('fileName')
        file_content = data.get('fileContent')  
        if not file_name or not file_content:
            return jsonify({"error": "Invalid request, missing fileName or fileContent"}), 400
        file_path = os.path.join('Temp_Save', file_name)
        result = questionprocessing.readFile(file_content, file_path, file_name)
        os.remove(file_path)
        return jsonify({"Result": result})
    else:
        return jsonify({"error": "Invalid content type, must be application/json"}), 400

@app.route('/api/upload_python', methods=['POST'])
def upload_file_with_python():
    content = ""
    if request.is_json:
        data = request.get_json()
        print(data)
        file_name = data.get('question_name')
        file_content = data.get('question_content')
        file_path = os.path.join('Temp_Save', file_name)
        if not file_name or not file_content:
            return jsonify({"error": "Invalid request, missing fileName or fileContent"}), 400
        result = questionprocessing.readFile(file_content, file_path, file_name)
        os.remove(file_path)
        
        file_name = data.get('answer_name')
        file_content = data.get('answer_content')
        file_path = os.path.join('Temp_Save', file_name)
        if not file_name or not file_content:
            return jsonify({"error": "Invalid request, missing fileName or fileContent"}), 400
        content = fileprocessing.readFile(file_content, file_path, file_name)
        verdict = sendToModel.sendFile_and_ChatGPTResponse(content)
        os.remove(file_path)
        return jsonify({"Verdict": verdict})
    else:
        return jsonify({"error": "Invalid content type, must be application/json"}), 400
    
if __name__ == '__main__':
    context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
    context.load_cert_chain(certfile='ssl/server.crt', keyfile='ssl/server.key')
    app.run(debug=True, host='0.0.0.0', port=5000, ssl_context=context)