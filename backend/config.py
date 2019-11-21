import os

FLASK = {
    'DEBUG': True,
    'CSRF_ENABLED': True,
    'SECRET_KEY': os.getenv('FLASK_SECRET', 'seckey'),
    'MAX_CONTENT_LENGTH': 10 * 1024 * 1024,
    'LOGGER_NAME': 'flask.app',
    'LOG_FILE': '/var/log/brravo/flask.log',
    'LOG_MAX_BYTES': 30 * 1024 * 1024,
    'LOG_BACKUP_COUNT': 5,
    'LOG_LEVEL': 'DEBUG',

    'UPLOAD_FOLDER': os.getenv('UPLOAD_FOLDER', '/uploads')
}
