import os.path
import json

import flask
import flask_json
from werkzeug.utils import secure_filename

import config


endpoint = flask.Blueprint('rest', __name__)
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])


def allowed_file(filename):
    return ('.' in filename and
            os.path.splitext(filename)[1].lower() in ALLOWED_EXTENSIONS)


@endpoint.route('/upload_static', methods=['POST'])
@flask_json.as_json
def upload_static():
    if 'file' not in flask.request.files:
        return {'error': 'Missing file'}, 400

    file = flask.request.files['file']
    # if user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
        return {'error': 'Missing filename'}, 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(config.FLASK['UPLOAD_FOLDER'], filename))
        return url_for('uploaded_file', filename=filename)
    return {'error': 'Unsupported extension'}, 400


@endpoint.route('/lessons', methods=['GET'])
@flask_json.as_json
def lessons():
    lessons_path = os.path.join(os.path.dirname(__file__), '..', '..', 'frontend', 'src', 'lessons.json')
    with open(lessons_path) as f:
        lessons = json.load(f)
    return lessons["lessons"]
