# encoding=utf-8
# 大模型相关的接口
from app.service import llm_service
from flask import Blueprint, request, jsonify


llm_bp = Blueprint('llm', __name__)

@llm_bp.route('/single_chat', methods=["POST"])
def single_chat():
    """
    单次聊天
    :return: 生成的文本内容
    """
    user_prompt = request.json['user_prompt']
    ans = llm_service.single_chat(_user_prompt=user_prompt)
    return jsonify({
        "code": 1,
        "msg": "ok",
        "data": ans
    })

