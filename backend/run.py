import os

from appfactory import create_app

if __name__ == '__main__':
    os.environ['FLASK_DEBUG'] = '1'
    create_app().run(debug=True, host= '127.0.0.1')
