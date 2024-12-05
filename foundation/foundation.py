
from flask import Blueprint, render_template, abort, jsonify, request
from jinja2 import TemplateNotFound
import yaml

foundation_app = Blueprint('foundation', __name__, template_folder='foundtemplate', static_folder='static', static_url_path='/static/foundation')
config_file = open('configuration.yaml')
config = yaml.safe_load(config_file)

@foundation_app.route('/', methods=['GET'])
def index():
    """
    """

    colors = config.get('service', {}).get('foundation', {}).get('colors', [])
    assets = config.get('service', {})
    colours_funcs = [
        {
            "style": f"background: {i}",
            "func": f"tryOnCamera('{i}')"
        }
        for i in colors
    ]
    return render_template(
        'foundation.html',
        colours_funcs=colours_funcs,
        lipstick_icon=assets.get('lipstick', {}).get("icon"),
        blush_icon=assets.get('blush', {}).get("icon"),
        jewelry_icon=assets.get('jwellery', {}).get("icon"),
        foundation_icon=assets.get('foundation', {}).get("icon")
    )