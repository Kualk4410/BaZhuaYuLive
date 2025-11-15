# encoding=utf-8
from app.utils.path import SRC_FOLDER
import openpyxl
from pathlib import WindowsPath
import re

def insert_random_variables(_content: str,
                            _vars_path: WindowsPath = SRC_FOLDER / "random_variables" / "all.xlsx") -> str:
    """
    使用随机变量库给内容添加随机变量
    :param _vars_path: 随机变量的文件路径
    :param _content: 待处理的文本
    :return: 添加了随机变量后的文本
    """
    # TODO: BUG只有最后一个被替换了，文本覆盖了
    modified = _content
    xlsx = openpyxl.load_workbook(str(_vars_path))
    similar_vars = list(xlsx[xlsx.sheetnames[0]].values)
    for rows in similar_vars:
        keywords = [i for i in rows if i]
        pattern = "|".join([re.escape(i) for i in keywords])
        replacement = '{' + '|'.join(keywords) + '}'
        modified = re.sub(pattern, replacement, _content)
    return modified


if __name__ == '__main__':
    origin = "家人们晚上好呀！欢迎走进咱们原产地直供直播间～ 今天给大家带来的是陕西眉县核心产区的徐香猕猴桃！看这一箱箱刚从果园摘下来的果子，表皮带着自然的绒毛，摸起来沙沙的，完全没有打保鲜剂！咱们果农都是凌晨五点就上山采摘，只选直径 55mm 以上的大果，每一颗都晒足 180 天阳光，甜度能达到 16-18 度！我给大家切一个看看，果肉翠绿饱满，汁水直接往下滴，咬一口酸甜爆浆，一点不涩口！不管是老人小孩，还是孕期宝妈都能吃，补充维生素 C 比喝果汁还管用～ 平时超市一斤要 15 块，今天直播间宠粉价，5 斤大果只要 29.9！前 100 单下单再送 1 斤，相当于 30 块钱带走 6 斤！都是现摘现发，顺丰包邮到家，收到有任何坏果直接包赔！喜欢吃软一点的家人收到可以放两天，硬果脆甜，软果蜜甜，两种口感都绝了！库存只有 300 箱，拍完直接下架，想要的家人赶紧点击下方小黄车 1 号链接，手慢无呀！"
    print("origin: ", origin)
    print("\n")
    replaced = insert_random_variables(origin)
    print("replaced: ", replaced)
