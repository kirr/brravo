import enum
import json

from appfactory import db


class Exercise(db.Model):
    __tablename__ = 'exercises'

    class Type(enum.Enum):
        Story = 1,
        Automatition = 2
        Gymnastics = 3

    id = db.Column(db.String(64), primary_key=True)
    display_name = db.Column(db.String(64))
    duration = db.Column(db.Integer())
    type = db.Column(db.String(32), nullable=False)
    content = db.Column(db.Text())

    def serialize(self):
        return {
            'id': self.id,
            'name': self.display_name,
            'duration': self.duration,
            'type': self.type,
            'content': json.loads(self.content)
        }


class LessonsExercises(db.Model):
    __tablename__ = 'lessons_exercises'

    id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    exercise_id = db.Column(db.String(64), db.ForeignKey('exercises.id', ondelete='CASCADE'))
    lesson_id = db.Column(db.String(64), db.ForeignKey('lessons.id', ondelete='CASCADE'))
    position = db.Column(db.Integer())

    exercise = db.relationship('Exercise', backref='exercises')
    lesson = db.relationship('Lesson', backref='lessons')


class Lesson(db.Model):
    __tablename__ = 'lessons'

    id = db.Column(db.String(64), primary_key=True)
    display_name = db.Column(db.String(64))
    exercises = db.relationship('Exercise', secondary="lessons_exercises",
                                backref=db.backref('exercise', lazy='dynamic'),
                                order_by=LessonsExercises.__table__.c.position,
                                viewonly=True)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.display_name,
            'exercises': [e.serialize() for e in self.exercises]
        }
