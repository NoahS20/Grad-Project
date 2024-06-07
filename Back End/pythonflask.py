import base64
import os
from flask import Flask, jsonify, redirect, request
from flask_cors import CORS
import fileprocessing
from OpenSSL import SSL
from flask_sslify import SSLify
import ssl

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
sslify = SSLify(app)

@app.before_request
def before_request():
    if not request.is_secure:
        return redirect(request.url.replace("http://", "https://", 1))

@app.route('/api/data', methods=['GET'])
def get_data():
    data = {"message": "Hello from Flask!"}
    return jsonify(data)

@app.route('/api/data', methods=['POST'])
def post_data():
    if request.is_json:
        data = request.get_json()
        response = {"received_data": data}
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
        '''
        try:
            file_content = base64.b64decode(file_content)
            file_path = os.path.join('Temp_Save', file_name)
            with open(file_path, 'wb') as file:
                file.write(file_content)
                content = fileprocessing.readFile(file_name)
                send = {"message": content}
                return jsonify(send)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        '''
        file_path = os.path.join('Temp_Save', file_name)
        content = jsonify({"FileData" : fileprocessing.readFile(file_content, file_path, file_name)})
        os.remove(file_path)
        return content

    else:
        return jsonify({"error": "Invalid content type, must be application/json"}), 400

if __name__ == '__main__':
    context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
    context.load_cert_chain(certfile='ssl/server.crt', keyfile='ssl/server.key')
    app.run(debug=True, host='0.0.0.0', port=5000, ssl_context=context)
