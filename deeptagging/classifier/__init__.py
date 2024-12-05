from deeptagging.classifier.cloth_classifier import ClothesClassifier
from deeptagging.classifier.gender_classifier import GenderClassifer


categories = {
    "men": ['Shirts', 'Sunglasses', 'Tshirts', 'Jackets', 'Sweaters', 'watches', 'Trousers'],
    'women': ["Blouses", "Handbags",  "Kurtis",  "Shirts",  "Sunglasses",  "Tops", "Tshirts", "Dupatta",  "Jackets",   "saree",   "Skirts",  "Sweaters",    "Trousers",  "watches"],
    'unisex': ['Sunglasses', 'Jackets', 'watches', 'Tshirts']
}

def initialize(image_path):
    """
    """

    gender, cloth = GenderClassifer(image_path).gender_lable(), ClothesClassifier(image_path).predict()

    print(gender, cloth)
    gender = gender[0] if gender else 'unisex'
    return {'gender': gender, 'cloth_data': cloth}