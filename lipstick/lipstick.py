from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound
import yaml

lipstick_app = Blueprint('lipstick', __name__, template_folder='templates', static_folder='static', static_url_path='/static/lipstick')
config_file = open('configuration.yaml')
config = yaml.safe_load(config_file)


@lipstick_app.route('/', methods=['GET'])
def index():
    """
    """

    colors = config.get('service', {}).get('lipstick', {}).get('colors', [])
    assets = config.get('service', {})
    colours_funcs = [
        {
            "style": f"background: {i}",
            "func": f"tryOnCamera('{i}')"
        }
        for i in colors
    ]
    return render_template(
        'desktop.html',
        colours_funcs=colours_funcs,
        lipstick_icon=assets.get('lipstick', {}).get("icon"),
        blush_icon=assets.get('blush', {}).get("icon"),
        jewelry_icon=assets.get('jwellery', {}).get("icon"),
        foundation_icon=assets.get('foundation', {}).get("icon")
    )