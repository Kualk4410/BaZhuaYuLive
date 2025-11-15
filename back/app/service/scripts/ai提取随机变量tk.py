# coding=utf-8
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from volcenginesdkarkruntime import Ark
import openpyxl
import yaml
import os
import threading

yaml_path = "../../../config.yml"
configs = {}
entry_widgets = {}


def cmd(content):
    try:
        client = Ark(
            base_url=configs['base_url'],
            api_key=configs['api_key'],
        )
        completion = client.chat.completions.create(
            model=configs['module'],
            messages=[
                {"role": "system", "content": configs['system_prompt']},
                {"role": "user", "content": content}
            ]
        )
        ans = completion.choices[0].message.content
        XLSX_PATH = configs['xlsx_path']

        if not XLSX_PATH:
            messagebox.showerror("错误", "请配置Excel文件路径！")
            return

        ans = ans.splitlines()
        try:
            workbook = openpyxl.load_workbook(XLSX_PATH)
        except FileNotFoundError:
            workbook = openpyxl.Workbook()

        sheet = workbook.active
        for line in ans:
            line = line.strip()
            if line:
                words = line.split("|")
                print(words)
                sheet.append(words)

        workbook.save(XLSX_PATH)
        print("finished")
        messagebox.showinfo("成功", f"提取完成！共 {len(ans)} 行数据已写入Excel。")

    except KeyError as e:
        messagebox.showerror("错误", f"配置项缺失：{e}，请检查配置文件！")
    except Exception as e:
        messagebox.showerror("错误", f"执行失败：{str(e)}")


def load_config():
    global configs
    try:
        if os.path.exists(yaml_path):
            with open(yaml_path, encoding="utf-8") as r:
                configs = yaml.safe_load(r.read()) or {}
        else:
            p = """<role>\n    经验丰富的直播间带货主播\n</role>\n\n<task>\n    从我给的口播文本中，提取出可以被完全替换的文字变量，替换完之后与原文意思一摸一样。\n</task>\n\n<requirements>\n    -不要替换数量词\n    - 不要替换时间词\n</requirements>\n\n<example>\n    - 口播内容：今天工厂补贴200米，数量有限先到先得。我们首次在抖音开播，这个价格只限今天。助理查一下库存还剩多少。\n    -输出：补贴|福利|优惠\n有限|不多了\n这个|现在这个\n后台|运营|助理|小助理|后台小哥|运营小哥\n</example>\n\n<format>\n    每行输出一个可以被替换的内容变量\n</format>"""
            default_config = {
                "module": "deepseek-v3-250324", "base_url": "https://ark.cn-beijing.volces.com/api/v3",
                "api_key": "输入你自己的api_key",
                "xlsx_path": "随机变量.xlsx", "system_prompt": p
            }
            with open(yaml_path, "w", encoding="utf-8") as w:
                yaml.dump(default_config, w, allow_unicode=True, sort_keys=False)
            configs = default_config
    except Exception as e:
        messagebox.showerror("错误", f"加载配置失败: {e}")


def save_config():
    try:
        for key, entry in entry_widgets.items():
            configs[key] = entry.get()
        with open(yaml_path, "w", encoding="utf-8") as w:
            yaml.dump(configs, w, allow_unicode=True, sort_keys=False)
        messagebox.showinfo("成功", "配置已保存！")
    except Exception as e:
        messagebox.showerror("错误", f"保存配置失败: {e}")


def browse_file():
    filepath = filedialog.askopenfilename(
        title="选择Excel文件",
        filetypes=[("Excel files", "*.xlsx;*.xls"), ("All files", "*.*")]
    )
    if filepath:
        entry_widgets["xlsx_path"].delete(0, tk.END)
        entry_widgets["xlsx_path"].insert(0, filepath)


def extract_content():
    content = text_input.get("1.0", tk.END).strip()
    if not content:
        messagebox.showwarning("提示", "文本框内容为空！")
        return

    def run_cmd():
        extract_btn.config(state=tk.DISABLED)
        try:
            cmd(content)
        finally:
            extract_btn.config(state=tk.NORMAL)

    thread = threading.Thread(target=run_cmd)
    thread.daemon = True
    thread.start()


def create_widgets():
    main_frame = ttk.Frame(window, padding="10")
    main_frame.pack(fill=tk.BOTH, expand=True)

    # --- 配置项板块 ---
    config_frame = ttk.LabelFrame(main_frame, text="配置项", padding="10")
    config_frame.pack(fill=tk.X, pady=5)
    config_frame.columnconfigure(1, weight=1)

    row = 0
    for key, value in configs.items():
        ttk.Label(config_frame, text=key + ":", width=15, anchor="w").grid(
            row=row, column=0, padx=5, pady=5, sticky="w")

        # --- 关键修改在这里 ---
        # 如果是 'api_key' 字段，创建一个密码框
        if key == "api_key":
            entry = ttk.Entry(config_frame, show="*")  # 使用 show="*" 来隐藏输入的字符
        else:
            entry = ttk.Entry(config_frame)

        entry.insert(0, value)
        entry.grid(row=row, column=1, padx=5, pady=5, sticky="ew")
        entry_widgets[key] = entry

        if key == "xlsx_path":
            ttk.Button(config_frame, text="浏览...", command=browse_file).grid(
                row=row, column=2, padx=5, pady=5)
        row += 1

    # --- 配置项板块内的按钮 ---
    config_button_frame = ttk.Frame(config_frame, padding="5 10 5 5")
    config_button_frame.grid(row=row, column=0, columnspan=3, pady=5, sticky="e")

    ttk.Button(config_button_frame, text="保存配置", command=save_config).pack(side=tk.RIGHT, padx=5)
    ttk.Button(config_button_frame, text="重置", command=lambda: [
        entry.delete(0, tk.END) or entry.insert(0, configs[key])
        for key, entry in entry_widgets.items()
    ]).pack(side=tk.RIGHT)

    # --- 内容提取板块 ---
    extract_frame = ttk.LabelFrame(main_frame, text="输入口播内容", padding="10")
    extract_frame.pack(fill=tk.BOTH, expand=True, pady=10)
    extract_frame.columnconfigure(0, weight=1)
    extract_frame.rowconfigure(0, weight=1)

    global text_input
    text_input = tk.Text(extract_frame, height=15, wrap=tk.WORD)
    text_input.grid(row=0, column=0, columnspan=2, sticky="nsew")

    scrollbar = ttk.Scrollbar(extract_frame, orient=tk.VERTICAL, command=text_input.yview)
    scrollbar.grid(row=0, column=2, sticky="ns")
    text_input.config(yscrollcommand=scrollbar.set)

    # --- 内容提取板块的按钮 ---
    extract_button_frame = ttk.Frame(extract_frame, padding="5 10 5 5")
    extract_button_frame.grid(row=1, column=0, columnspan=3, pady=5)

    global extract_btn
    extract_btn = ttk.Button(extract_button_frame, text="提取", command=extract_content)
    extract_btn.pack(side=tk.LEFT, padx=5)


if __name__ == "__main__":
    window = tk.Tk()
    window.title("随机变量提取工具")
    window.geometry("850x700")
    load_config()
    create_widgets()
    window.mainloop()