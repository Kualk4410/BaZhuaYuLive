from flask import Flask, request, jsonify
from flask_cors import CORS
from app.service.scripts import module
from app.controller import llm_controller
from app.utils.path import ROOT_FOLDER

app = Flask(__name__)
CORS(app)

app.register_blueprint(
    llm_controller.llm_bp,
    url_prefix='/api/v1/llm',
    static_folder=ROOT_FOLDER / "app" / "static"
)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
