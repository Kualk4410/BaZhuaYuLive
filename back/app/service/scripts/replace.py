import openpyxl


def add_random_variables(ori_text, excel_path):
    """
    从Excel读取随机变量组，并用 | 连接后包裹 {} 替换原始文本中的匹配项。

    :param ori_text: 原始文本
    :param excel_path: Excel文件路径
    :return: 替换后的文本
    """
    # 加载Excel工作簿和活动工作表
    wb = openpyxl.load_workbook(excel_path)
    sheet = wb.active

    # 遍历Excel中的每一行
    for row in sheet.iter_rows(values_only=True):
        # 收集当前行所有非空的随机变量
        # values_only=True 直接获取单元格的值，而不是单元格对象
        variables = [str(cell_value) for cell_value in row if cell_value is not None]

        # 如果当前行没有有效变量，则跳过
        if not variables:
            continue

        # 关键优化：为防止部分替换（如用“大米”替换“稻花香大米”中的“大米”）
        # 导致更长的变量无法匹配，应优先尝试匹配更长的文本
        variables.sort(key=len, reverse=True)

        # 构建替换后的目标字符串，例如 "{A|B|C}"
        replacement_string = "{" + "|".join(variables) + "}"

        # 标记当前行是否已经进行过替换
        replaced_in_this_row = False

        # 遍历当前行的每个变量，尝试在原始文本中找到并替换
        for var in variables:
            if var in ori_text:
                # 执行替换，将所有找到的匹配项一次性替换
                ori_text = ori_text.replace(var, replacement_string)
                replaced_in_this_row = True
                # 重要：一旦替换，就跳出当前行的循环，避免同一行的其他变量在新文本上重复替换
                break

        # 打印替换信息，方便调试
        if replaced_in_this_row:
            print(f"已处理变量组: {variables} -> 替换为: {replacement_string}")

    wb.close()
    return ori_text


# --- 主程序 ---
if __name__ == "__main__":
    # 原始文本
    ori = "家人们晚上好！今天给大家推荐一款东北五常稻花香大米，咱们这可是正宗的五常核心产区，黑土地种植，山泉水灌溉，一年只产一季，满满的原生态！看这大米，颗粒饱满圆润，颜色洁白透亮，闻起来有淡淡的米香，煮饭的时候整个屋子都是香味！我给大家说说口感，煮出来的米饭软糯香甜，粒粒分明，嚼起来有回甘，就算没有菜也能吃两碗，而且剩饭不回生、不发硬，第二天做蛋炒饭照样好吃！咱们这大米没有添加任何香精、防腐剂，都是自然晾晒脱壳，保留了大米的原汁原味，老人小孩吃都特别健康！超市一斤正宗五常大米要 10 块钱，今天直播间 5 斤只要 45.9，10 斤只要 86.9，还送真空包装，方便储存！全部产地直供，假一赔十，支持大家扫码溯源！想要吃好米、吃健康米的家人，赶紧点击下方小黄车 3 号链接，库存有限，先拍先得，错过可就没这个价啦！"

    # Excel文件路径
    path = "../../static/random_variables/all.xlsx"

    try:
        # 执行替换操作
        result_text = add_random_variables(ori, path)

        # 打印最终结果
        print("\n" + "=" * 50)
        print("替换后的最终文本：")
        print("=" * 50)
        print(result_text)

        # （可选）将结果保存到文件
        with open("../flask/v1/result.txt", "w", encoding="utf-8") as f:
            f.write(result_text)
        print("\n结果已保存到 result.txt 文件中。")

    except FileNotFoundError:
        print(f"错误：找不到文件 '{path}'。请确保文件存在于脚本相同目录下。")
    except Exception as e:
        print(f"处理过程中发生错误: {e}")