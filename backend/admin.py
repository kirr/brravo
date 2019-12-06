from flask import Response
from flask_admin import Admin
from flask_admin.contrib.fileadmin import FileAdmin
from flask_admin.contrib.sqla import ModelView
from flask_basicauth import BasicAuth
from werkzeug.exceptions import HTTPException

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
            'form_columns': ('id', 'exercise', 'position'),
            'form_label': 'Exercises',
        }
    ),)


class ExercisesView(BasicAuthView, ModelView):
    column_list = ('id', 'type', 'display_name', 'duration', 'content')
    form_columns = ('id', 'type', 'display_name', 'duration', 'content')


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
