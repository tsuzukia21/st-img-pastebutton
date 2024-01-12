import streamlit as st
from st_img_pastebutton import paste
from io import BytesIO
import base64

st.header("Image Clipboard Example")
st.write("Click the button below to upload an image from your clipboard.")

# カスタムコンポーネントを呼び出し、返された画像データを受け取る
image_data = paste(key="image_clipboard")
a=st.button("pastte image")

# もし画像データが返されたら、それを表示する
if image_data is not None:
    # Base64エンコーディングされたデータを処理する
    header, encoded = image_data.split(",", 1)
    binary_data = base64.b64decode(encoded)
    bytes_data = BytesIO(binary_data)
    st.image(bytes_data, caption="Uploaded Image", use_column_width=True)
else:
    st.write("No image uploaded yet.")
