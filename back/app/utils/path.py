import pathlib
from pathlib import WindowsPath, Path


def get_root_folder() -> Path:
    return pathlib.Path(__file__).parents[2]


def get_static_folder() -> Path:
    return get_root_folder() / "app" / "static"


ROOT_FOLDER = get_root_folder()
SRC_FOLDER = get_static_folder()

if __name__ == '__main__':
    print(ROOT_FOLDER)
