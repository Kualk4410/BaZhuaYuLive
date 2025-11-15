import os
import pathlib
from typing import Dict, Optional
from app.utils.path import ROOT_FOLDER


def read(prompt_file: str) -> Dict[str, Optional[str]]:
    """
    从指定目录读取一个HTML格式的提示词文件。
    :param prompt_file: 提示词文件名
    :return:
        一个包含读取状态的字典：
        - 成功时: {"code": 1, "msg": "Success", "data": "文件内容"}
        - 失败时: {"code": 0, "msg": "错误信息", "data": None}
    """
    prompt_path = ROOT_FOLDER / "app" / "static" / "prompts" / prompt_file

    # 检查路径是否存在
    if not prompt_path.exists():
        return {
            "code": 0,
            "msg": f"提示词文件 '{prompt_path}' 不存在。",
            "data": None
        }
    # 检查是否为文件
    if not prompt_path.is_file():
        return {
            "code": 0,
            "msg": f"'{prompt_path}' 不是一个有效的文件。",
            "data": None
        }

    # 读取文件内容
    try:
        with open(prompt_path, "r", encoding="utf-8") as f:
            content = f.read()

        return {
            "code": 1,
            "msg": "Success",
            "data": content
        }

    except UnicodeDecodeError:
        return {
            "code": 0,
            "msg": f"提示词文件 '{prompt_file}' 编码错误，无法以UTF-8格式读取。",
            "data": None
        }
    except IOError as e:
        return {
            "code": 0,
            "msg": f"读取提示词文件 '{prompt_file}' 时发生I/O错误: {e}",
            "data": None
        }
    except Exception as e:
        return {
            "code": 0,
            "msg": f"读取提示词文件 '{prompt_file}' 时发生未知错误: {e}",
            "data": None
        }


def json2html(prompt_json: dict) -> str:
    """
    提示词格式转化
    :param prompt_json: json类型的提示词
    :return: html格式的提示词
    """

    return ""