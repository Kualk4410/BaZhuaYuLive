from volcenginesdkarkruntime import Ark
import os
import openpyxl
import yaml
import tkinter

with open("../../../config.yml", encoding="utf-8", mode="r") as r:
    configs = yaml.load(r.read(), Loader=yaml.FullLoader)

print(os.environ.get("ARK_API_KEY"))
print(type(os.environ.get("ARK_API_KEY")))
client = Ark(
    base_url=configs['base_url'],
    api_key=os.environ.get("ARK_API_KEY"),
)

q = str(input("请输入口播内容："))

completion = client.chat.completions.create(
    model=configs['module'],  # 模型的 ID
    messages=[
        {"role": "system", "content": configs['system_prompt']},
        {"role": "user", "content": q}
    ]
)
ans = completion.choices[0].message.content

XLSX_PATH = configs['xlsx_path']
ans = ans.splitlines()
for line in ans:
    words = line.split("|")
    print(words)
    try:
        workbook = openpyxl.load_workbook(XLSX_PATH)
    except FileNotFoundError:
        workbook = openpyxl.Workbook()

    sheet = workbook.active
    sheet.append(words)
    workbook.save(XLSX_PATH)

print("finished")
