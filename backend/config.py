import os

FLASK = {
    'CSRF_ENABLED': True,
    'SECRET_KEY': os.getenv('FLASK_SECRET', 'seckey'),
    'MAX_CONTENT_LENGTH': 10 * 1024 * 1024,
    'LOGGER_NAME': 'flask.app',
    'LOG_FILE': '/var/log/www/brravo/flask.log',
    'LOG_MAX_BYTES': 30 * 1024 * 1024,
    'LOG_BACKUP_COUNT': 5,
    'LOG_LEVEL': 'DEBUG',

    'UPLOAD_FOLDER': os.getenv('UPLOAD_FOLDER', '/uploads'),

    'FLASK_ADMIN_SWATCH': 'cerulean',

    'SQLALCHEMY_DATABASE_URI': (os.getenv('BRRAVO_DB_CONNECTION') or
                                'sqlite:////data/brravo.db'),
    'SQLALCHEMY_TRACK_MODIFICATIONS': False,

    'BASIC_AUTH_USERNAME': os.getenv('FLASK_ADMIN_LOGIN') or 'speech',
    'BASIC_AUTH_PASSWORD': os.getenv('FLASK_ADMIN_PASSWORD') or '125521',
}
