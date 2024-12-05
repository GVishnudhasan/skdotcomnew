from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound
import yaml


homepage_app = Blueprint('homepage', __name__, template_folder='hometemplate', static_folder='static', static_url_path='/static/homepage')
config_file = open('configuration.yaml')
config = yaml.safe_load(config_file)

@homepage_app.route('/', methods=['GET'])
def index():
    """
    """

    homepage_images = config.get('service', {}).get('homepage', {}).get('images', {})

    return render_template(
        'home.html',
        model_img=homepage_images.get('model'),
        sec1_img=homepage_images.get('sec1'),
        sec2_img=homepage_images.get('sec2'),
        sec3_img=homepage_images.get('sec3'),
        sec4_img=homepage_images.get('sec4'),
        spotwik_img=homepage_images.get('spotwik')
    )