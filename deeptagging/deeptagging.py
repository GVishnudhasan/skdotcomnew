from flask import Blueprint, render_template, abort, jsonify, request
from jinja2 import TemplateNotFound
from werkzeug.utils import secure_filename
import os
from deeptagging.classifier import initialize

deeptagging_app = Blueprint('tagging', __name__, template_folder='taggingtemplate', static_folder='static', static_url_path='/static/taggingpage')


UPLOAD_FOLDER = './nfs-image'  # Local directory where images will be saved


if not os.path.exists(UPLOAD_FOLDER): os.makedirs(UPLOAD_FOLDER)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@deeptagging_app.route('/tagging', methods=['POST'])
def predict_taggings():
    """
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']

    if not file or not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type'}), 400
    
    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    gendata = initialize(filepath)
    
    os.remove(filepath)
    return jsonify(gendata), 200