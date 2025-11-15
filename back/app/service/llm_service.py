# Python 3.7+
from volcenginesdkarkruntime import Ark
from app.utils import config

# 获取全局配置
try:
    CONFIGS = config.read()
except KeyError as e:
    raise ValueError(f"配置文件中缺少必要的键: {e}") from e
# 缓存客户端实例，防止重复初始化
_client = Ark(base_url=CONFIGS['base_url'], api_key=CONFIGS['api_key'])


def single_chat(_user_prompt: str, _system_prompt: str = "你是直播带货相关的人工智能助手"):

    completion = _client.chat.completions.create(
        model=CONFIGS['module'],
        messages=[
            {"role": "system", "content": _system_prompt},
            {"role": "user", "content": _user_prompt}
        ]
    )

    return completion.choices[0].message.content

def polish_prompt():
    pass

