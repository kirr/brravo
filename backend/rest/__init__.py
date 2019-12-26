import flask
import flask_json

from models.lessons import Lesson
import config


endpoint = flask.Blueprint('rest', __name__)

def serialize_group(e, exercise_by_id):
    for sub_ex in e['content']['links']:
        linked = exercise_by_id.get(sub_ex)
        if linked:
            if linked.type == 'group':
                serialize_group(linked, exercise_by_id)
            e['content']['items'].append[linked.serialize()]


@endpoint.route('/lessons', methods=['GET'])
@flask_json.as_json
def lessons():
    lessons = Lesson.query.all()
    return sorted([l.serialize() for l in lessons], key=lambda x: x['id'])
