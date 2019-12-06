import flask
import flask_json

from models.lessons import Lesson
import config


endpoint = flask.Blueprint('rest', __name__)

@endpoint.route('/lessons', methods=['GET'])
@flask_json.as_json
def lessons():
    lessons = Lesson.query.all()
    return sorted([l.serialize() for l in lessons], key=lambda x: x['id'])
