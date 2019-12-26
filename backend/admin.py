import json

from flask import Response
from flask_admin import Admin
from flask_admin.contrib.fileadmin import FileAdmin
from flask_admin.contrib.sqla import ModelView
from flask_basicauth import BasicAuth
from werkzeug.exceptions import HTTPException
import wtforms

from models import lessons
import config


auth = None


class AuthException(HTTPException):
    def __init__(self, message):
        super(AuthException, self).__init__(message, Response(
            message, 401,
            {'WWW-Authenticate': 'Basic realm="Login Required"'}
        ))


#TODO: Auth on metaclasses, remove global variables
class BasicAuthView():
    def is_accessible(self):
        if not auth.authenticate():
            raise AuthException('Not authenticated. Refresh the page.')
        else:
            return True

    def inaccessible_callback(self, name, **kwargs):
        return auth.challenge()


class LessonsView(BasicAuthView, ModelView):
    column_list = ('id', 'display_name', 'exercises')
    form_columns = ('id', 'display_name')
    column_hide_backrefs = False
    inline_models = ((
        lessons.LessonsExercises,
        {
            'form_columns': ('id', 'exercise', 'position', 'group_name'),
            'form_label': 'Exercises',
        }
    ),)


def content_formatter(exercise_type, content):
    if exercise_type == 'story':
        json_data = json.loads(content)
        screens = json_data['screens']
        return '\n<screen_brake/>\n'.join(screens)
    elif exercise_type == 'gymnastics':
        return json.loads(content)['html']
    return content


def parse_content(form):
    if not form.content.data:
        return ''

    if form.type.data == 'story':
        html_str = form.content.data
        screens = html_str.split('<screen_brake/>')
        screens = [s.strip() for s in screens]
        return json.dumps({'screens': screens})
    elif form.type.data == 'gymnastics':
        return json.dumps({'html': form.content.data})

    return form.content.data


class ExercisesView(BasicAuthView, ModelView):
    column_list = ('id', 'type', 'display_name', 'duration', 'content')
    form_columns = ('id', 'type', 'display_name', 'duration', 'content')
    form_widget_args = {
        'content': {'rows': 20},
    }
    form_args = {
        'type': {'choices': [(v.name.lower(), v.name) for v in lessons.Exercise.Type] }
    }
    form_overrides = { 'type': wtforms.fields.SelectField }
    column_formatters = {
        'content': lambda v, c, m, p: content_formatter(m.type, m.content)
    }

    def on_form_prefill(self, form, id):
        if not form.content.data:
            return
        form.content.data = content_formatter(form.type.data, form.content.data)

    def on_model_change(self, form, exercise, is_created):
        exercise.content = parse_content(form)


class FileAdminAuthView(BasicAuthView, FileAdmin):
    pass


def init_flask_admin(app, db, app_auth):
    global auth
    auth = app_auth

    admin = Admin(app, name='brravo', template_mode='bootstrap3')
    admin.add_view(LessonsView(lessons.Lesson, db.session))
    admin.add_view(ExercisesView(lessons.Exercise, db.session))
    admin.add_view(FileAdminAuthView(config.FLASK['UPLOAD_FOLDER'],
                                     '/data/static/', name='Uploads'))
