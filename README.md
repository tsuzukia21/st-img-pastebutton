# streamlit-custom-component

Streamlit component that allows you to create button to paste image from clipboard.

![Videotogif (21)](https://github.com/tsuzukia21/st-img-pastebutton/assets/132349459/cf3f9564-2fdf-4aef-a2dc-15b75be1f55b)

confirmed that it works with chrome,safari,edge. it doesn't work with firefox

## Installation instructions

```sh
pip install st_img_pastebutton
```

or

```sh
pip install st_img_pastebutton --upgrade
```


## Usage instructions

```python
import streamlit as st
from st_img_pastebutton import paste
from io import BytesIO
import base64

st.header("Image Clipboard Example")
st.write("Click the button below to upload an image from your clipboard.")

image_data = paste(label="paste from clipboard",key="image_clipboard")

if image_data is not None:
    header, encoded = image_data.split(",", 1)
    binary_data = base64.b64decode(encoded)
    bytes_data = BytesIO(binary_data)
    st.image(bytes_data, caption="Uploaded Image", use_column_width=True)
else:
    st.write("No image uploaded yet.")
```

run
```python
streamlt run examle.py
```
