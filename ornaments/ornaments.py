from flask import Blueprint, render_template, abort, request
from jinja2 import TemplateNotFound
import yaml, re

ornaments_app = Blueprint('ornaments', __name__, template_folder='template', static_folder='static', static_url_path='/static/ornaments')
config_file = open('configuration.yaml')
config = yaml.safe_load(config_file)


def is_mobile_user_agent(user_agent):
    mobile_regex = (
        "iphone|ipod|android|blackberry|windows phone|webos|mobile|opera mini|mobi|mini|tablet"
    )
    return re.search(mobile_regex, user_agent, re.IGNORECASE) is not None

@ornaments_app.route('/', methods=['GET'])
def index():
    """
    """

    user_agent = request.headers.get('User-Agent')
    print(user_agent, is_mobile_user_agent(user_agent))

    images = config.get('service', {}).get('jwellery', {}).get('images', [])
    assets = config.get('service', {})
    images_funcs = [
        {
            "src": i,
            "func": f"tryJwel('{i}')"
        }
        for i in images
    ]
    print(images_funcs)

    template = 'mobile-jwel.html' if is_mobile_user_agent(user_agent) else 'desktop-jwel.html'
    
    return render_template(
        template,
        images_funcs=images_funcs,
        lipstick_icon=assets.get('lipstick', {}).get("icon"),
        blush_icon=assets.get('blush', {}).get("icon"),
        jewelry_icon=assets.get('jwellery', {}).get("icon"),
        foundation_icon=assets.get('foundation', {}).get("icon")
    )