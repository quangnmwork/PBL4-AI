from re import I
from flask import Flask
from flask_cors import CORS, cross_origin
from flask import request
from flask import render_template, jsonify
from torch_utils import transform_image, get_prediction
import numpy as np
import base64
import requests

base_URL = 'http://192.168.0.103/'

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}


def allowed_file(filename):
    # xxx.png
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


app = Flask(__name__)

# Apply Flask CORS
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


def make_URL(checked, device):
    url = ""
    if (checked == True):
        url = base_URL + 'onD' + str(device)
    else:
        url = base_URL + 'offD' + str(device)
    return url


def post_request(device, action):
    map_device_to_int = {
        'Fan': 0,
        'Light': 1,
        'One': 2,
        'Two': 3,
    }
    if action == 'On':
        url = make_URL(True, map_device_to_int[device])
    elif action == 'Off':
        url = make_URL(False, map_device_to_int[device])
    requests.post(url, data={})


@app.route('/upload', methods=['POST'])
@cross_origin(origin='*')
def upload_gesture():
    device = request.json.get('device')
    action = request.json.get('action')
    post_request(device,action)
    print(device, action)
    return jsonify(device, action)


@app.route('/', methods=['GET'])
@cross_origin(origin='*')
def mainpage():
    return render_template('index.html')


def chuyen_base64_sang_anh(anh_base64):
    try:
        anh_base64 = np.frombuffer(
            base64.b64decode(anh_base64), dtype=np.uint8)
        # anh_base64 = cv2.imdecode(anh_base64, cv2.IMREAD_ANYCOLOR)
    except:
        return None
    return anh_base64


@app.route('/', methods=['POST'])
@cross_origin(origin='*')
def classification():
    if request.method == 'POST':
        file = request.form.get('content').split(',')[1]
        if file is None:
            return jsonify({'Error': 'No file'})
        image = chuyen_base64_sang_anh(file)
        try:
            tensor = transform_image(image)
            prediction, percent = get_prediction(tensor)
            data = {'Class Name': prediction, 'Percent': percent*100}
            print(prediction)
            return jsonify(data)
        except:
            return jsonify({'Error': 'Error during prediction'})


# Start Backend
if __name__ == '__main__':
    app.run(port='3000', debug=True)
