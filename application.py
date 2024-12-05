from flask import Flask, jsonify, render_template, send_from_directory
from flask_cors import CORS
from lipstick.lipstick import lipstick_app
from ornaments.ornaments import ornaments_app
from homepage.homepage import homepage_app
from blush.blush import blush_app
# from deeptagging.deeptagging import deeptagging_app
from foundation.foundation import foundation_app

ar_app = Flask(__name__, template_folder='hometemplate', static_folder='static', static_url_path='/static')
CORS(ar_app)

ar_app.register_blueprint(lipstick_app, url_prefix='/lipstick')
ar_app.register_blueprint(ornaments_app, url_prefix='/jwellery')
ar_app.register_blueprint(homepage_app, url_prefix='/')
ar_app.register_blueprint(blush_app, url_prefix='/blush')
# ar_app.register_blueprint(deeptagging_app, url_prefix='/tagging')
ar_app.register_blueprint(foundation_app, url_prefix='/foundation')


if __name__ == '__main__':
    ar_app.run(host='0.0.0.0', port=5000, debug=True)