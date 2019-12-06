import logging
from logging.handlers import RotatingFileHandler, SysLogHandler
import datetime as dt

import flask
from flask_basicauth import BasicAuth
import flask_json
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

import config


FILE_LOG_FORMAT = ('%(name)s [%(asctime)s] {%(pathname)s:%(lineno)d} '
                   '%(levelname)s: %(message)s')
SYS_LOG_FORMAT = ('flask.app: %(levelname)s: %(message)s')

db = None

def flaskjson_serializer(obj):
    if isinstance(obj, dt.datetime):
        return dt2ts(obj)


def create_app(flask_init_kwargs_overrides={}):
    flask_config = config.FLASK

    app = flask.Flask(__name__,
                      # template_folder='views/templates',
                      **flask_init_kwargs_overrides)
    app.config.update(flask_config)

    flaskjson = flask_json.FlaskJSON(app)
    flaskjson.encoder(flaskjson_serializer)

    if not app.debug:
        logging_handler = RotatingFileHandler(
            flask_config['LOG_FILE'],
            maxBytes=flask_config['LOG_MAX_BYTES'],
            backupCount=flask_config['LOG_BACKUP_COUNT'],
        )
        logging_handler.setFormatter(logging.Formatter(FILE_LOG_FORMAT))
        logging_handler.setLevel(flask_config['LOG_LEVEL'])
        app.logger.addHandler(logging_handler)

    global db
    db = SQLAlchemy(app)

    global auth
    auth = BasicAuth(app)

    import rest
    app.register_blueprint(rest.endpoint, url_prefix='/rest')
    CORS(app)

    import admin
    admin.init_flask_admin(app, db, auth)

    return app
