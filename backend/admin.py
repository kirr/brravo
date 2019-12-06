from flask import Response
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_basicauth import BasicAuth
from werkzeug.exceptions import HTTPException

from models import lessons

class AuthException(HTTPException):
    def __init__(self, message):
        super(AuthException, self).__init__(message, Response(
            message, 401,
            {'WWW-Authenticate': 'Basic realm="Login Required"'}
        ))


class BasicAuthView(ModelView):
    def __init__(self, auth, *args, **kwargs):
        self.auth = auth
        super(BasicAuthView, self).__init__(*args, **kwargs)

    def is_accessible(self):
        if not self.auth.authenticate():
            raise AuthException('Not authenticated. Refresh the page.')
        else:
            return True

    def inaccessible_callback(self, name, **kwargs):
        return self.auth.challenge()


class LessonsView(BasicAuthView):
    column_list = ('id', 'display_name', 'exercises')
    form_columns = ('id', 'display_name')
    column_hide_backrefs = False
    inline_models = ((
        lessons.LessonsExercises,
        {
            'form_columns': ('id', 'exercise', 'position'),
            'form_label': 'Exercises',
        }
    ),)


class ExercisesView(BasicAuthView):
    column_list = ('id', 'type', 'display_name', 'duration', 'content')
    form_columns = ('id', 'type', 'display_name', 'duration', 'content')


def init_flask_admin(app, db, auth):
    admin = Admin(app, name='brravo', template_mode='bootstrap3')
    admin.add_view(LessonsView(auth, lessons.Lesson, db.session))
    admin.add_view(ExercisesView(auth, lessons.Exercise, db.session))
