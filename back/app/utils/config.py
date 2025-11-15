import yaml
import os
from typing import Dict, Any
from app.utils.path import ROOT_FOLDER

class ConfigError(Exception):
    """配置文件读取或解析时发生的异常"""
    pass


def read(config_path: str = ROOT_FOLDER / "config.yml") -> Dict[str, Any]:
    """
    安全地从指定路径读取并解析YAML配置文件
    :param config_path: YAML配置文件的路径
    :return: 解析后的配置字典
    """

    # 检查路径是否存在且为文件
    if not os.path.exists(config_path):
        raise ConfigError(f"配置文件未找到: {os.path.abspath(config_path)}")
    if not os.path.isfile(config_path):
        raise ConfigError(f"指定路径不是一个文件: {os.path.abspath(config_path)}")

    # 读取并解析文件
    try:
        with open(config_path, mode="r", encoding="utf-8") as f:
            configs = yaml.safe_load(f)

        # 确保返回的是一个字典
        if not isinstance(configs, dict):
            raise ConfigError(f"配置文件内容格式不正确，应为YAML对象（字典）。")

        return configs

    except yaml.YAMLError as e:
        raise ConfigError(f"YAML配置文件解析失败: {e}") from e
    except UnicodeDecodeError:
        raise ConfigError(f"配置文件 '{config_path}' 编码错误，无法以UTF-8格式读取。")
    except IOError as e:
        raise ConfigError(f"读取配置文件 '{config_path}' 时发生I/O错误: {e}") from e
    except Exception as e:
        raise ConfigError(f"处理配置文件 '{config_path}' 时发生未知错误: {e}") from e
