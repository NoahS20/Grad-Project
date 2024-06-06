from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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
    if request.is_json:
        data = request.get_json()
        app.logger.debug(f"Request data: {data}")
        file_name = data.get('fileName')
        file_content = data.get('fileContent')

        if not file_name or not file_content:
            return jsonify({"error": "Invalid request, missing fileName or fileContent"}), 400
        return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
 