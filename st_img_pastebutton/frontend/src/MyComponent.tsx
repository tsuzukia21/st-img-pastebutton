import React from "react";
import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib";

interface State {
  imageData: string | null;
  error: string | null;
}

class ImageClipboardComponent extends StreamlitComponentBase<State> {
  public state: State = { imageData: null, error: null };

  private handleButtonClick = async (): Promise<void> => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      let imageFound = false;
      for (const clipboardItem of clipboardItems) {
        // Check for common image formats
        const imageType = clipboardItem.types.find(type => type.startsWith("image/"));
        if (imageType) {
          const blob = await clipboardItem.getType(imageType);
          const reader = new FileReader();
          reader.onloadend = () => {
            this.setState({ imageData: reader.result as string, error: null }, () => {
              Streamlit.setComponentValue(this.state.imageData);
            });
          };
          reader.readAsDataURL(blob);
          imageFound = true;
          break;
        }
      }

      if (!imageFound) {
        this.setState({ error: "No image found in the clipboard." });
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        // Ignore the error if it's a user cancellation or permission denial
        console.log("Clipboard access denied or cancelled by the user.");
      } else if (err instanceof Error) {
        // If it's an Error instance, we can get a detailed error message
        this.setState({ error: "Failed to read the image. Details: " + err.message });
        console.error("Failed to read clipboard contents: ", err.message);
      } else {
        // If it's not an Error instance, display a generic error message
        this.setState({ error: "Failed to read the image." });
        console.error("Failed to read clipboard contents");
      }
    }
  };

  public render = (): React.ReactNode => {
    const { error } = this.state;

    // Style definition resembling Streamlit's default button style
    const buttonStyle = {
      backgroundColor: "#ffffff", // background color (white)
      color: "black", // text color (black)
      padding: "9px 12px",
      border: "1px solid #cccccc", // border color (grey)
      borderRadius: "8px", // rounded corners
      cursor: "pointer",
      fontSize: "14px",
      outline: "none", // disable outline on focus
      transition: "color 0.3s, border-color 0.3s", // add transition for color and border color
    };

    // Hover style
    const buttonHoverStyle = {
      color: "red", // text color on hover (red)
      borderColor: "red", // border color on hover (red)
    };

    return (
      <div>
        <button
          onClick={this.handleButtonClick}
          style={buttonStyle}
          onMouseEnter={e => {
            Object.assign(e.currentTarget.style, buttonHoverStyle);
          }}
          onMouseLeave={e => {
            Object.assign(e.currentTarget.style, buttonStyle);
          }}
        >
          Paste from Clipboard
        </button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    );
  };  
}

export default withStreamlitConnection(ImageClipboardComponent);
