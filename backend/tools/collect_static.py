#!/usr/bin/python
import sys
import os
import os.path as op
import shutil
import flask_admin


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: %s <destination>' % sys.argv[0])
        sys.exit(-1)

    dst = sys.argv[1]

    # Copy Flask-Admin files
    print('Copying flask-admin ...')
    src = op.join(op.dirname(flask_admin.__file__), 'static')
    shutil.copytree(src, dst)

    print('Done.')
