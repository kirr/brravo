from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView

from models import lessons


class LessonsView(ModelView):
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


class ExercisesView(ModelView):
    column_list = ('id', 'type', 'display_name', 'duration', 'content')
    form_columns = ('id', 'type', 'display_name', 'duration', 'content')


def init_flask_admin(app, db):
    admin = Admin(app, name='brravo', template_mode='bootstrap3')
    admin.add_view(LessonsView(lessons.Lesson, db.session))
    admin.add_view(ExercisesView(lessons.Exercise, db.session))
