import os
import streamlit.components.v1 as components

_RELEASE = False

# if not _RELEASE:
#     _image_clipboard = components.declare_component(
#         "st_paste",
#         url=" http://localhost:3000",
#     )
# else:
parent_dir = os.path.dirname(os.path.abspath(__file__))
build_dir = os.path.join(parent_dir, "frontend/build")
_image_clipboard = components.declare_component("st_img_pastebutton", path=build_dir)

def paste(label,key=None):
    return _image_clipboard(label=label,key=key)
