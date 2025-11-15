# Python 3.7+
from volcenginesdkarkruntime import Ark
from app.utils import prompt, config


class LLM:
    module: str
    base_url: str
    api_key: str
    client: Ark

    def __init__(self):
        try:
            CONFIGS = config.read()
            self.module = CONFIGS['module']
            self.base_url = CONFIGS['base_url']
            self.api_key = CONFIGS['api_key']
        except KeyError as e:
            raise ValueError(f"配置文件中缺少必要的键: {e}") from e
        self.client = Ark(base_url=self.base_url, api_key=self.api_key)

    def single_chat(self, _user_prompt: str, _system_prompt: str = "你是直播带货相关的人工智能助手"):
        completion = self.client.chat.completions.create(
            model=self.module,
            messages=[
                {"role": "system", "content": _system_prompt},
                {"role": "user", "content": _user_prompt}
            ]
        )
        return completion.choices[0].message.content

    def polish_prompt(self):
        pass


if __name__ == '__main__':
    user_p = prompt.read("temp_gen_live_content.html")
    llm = LLM()
    if user_p['code'] == 1:
        print(llm.single_chat(user_p['data']))
    else:
        print(user_p['msg'])

