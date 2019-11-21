from appfactory import create_app

if __name__ == '__main__':
    create_app(flask_init_kwargs_overrides={
        'static_folder': 'static',
    }).run(debug=True, host= '127.0.0.1')
