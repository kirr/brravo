import logging
from logging.handlers import RotatingFileHandler, SysLogHandler

import flask
import flask_json
from flask_cors import CORS

import config
import rest


FILE_LOG_FORMAT = ('%(name)s [%(asctime)s] {%(pathname)s:%(lineno)d} '
                   '%(levelname)s: %(message)s')
SYS_LOG_FORMAT = ('flask.app: %(levelname)s: %(message)s')


def flaskjson_serializer(obj):
    if isinstance(obj, dt.datetime):
        return dt2ts(obj)
    if isinstance(obj, bson.objectid.ObjectId):
        return str(obj)


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

    app.register_blueprint(rest.endpoint, url_prefix='/rest')
    CORS(app)

    return app;
