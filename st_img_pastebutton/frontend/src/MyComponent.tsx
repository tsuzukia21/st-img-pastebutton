import React from "react";
import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
  Theme,
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
        console.log("Clipboard access denied or cancelled by the user.");
      } else if (err instanceof Error) {
        this.setState({ error: "Failed to read the image. Details: " + err.message });
        console.error("Failed to read clipboard contents: ", err.message);
      } else {
        this.setState({ error: "Failed to read the image." });
        console.error("Failed to read clipboard contents");
      }
    }
  };

  public render = (): React.ReactNode => {
    const label = String(this.props.args["label"])
    const { error } = this.state;
    const theme: Theme | undefined = this.props.theme;

    const buttonStyle = {
      backgroundColor: "transparent",
      color: theme.textColor,
      padding: "5px 10px",
      border: `1px solid ${theme.textColor}40`,
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      outline: "none",
      transition: "color 0.3s, border-color 0.3s",
      display: "inline-block",
      height: "40px",
      lineHeight: "27px",
    };

    const buttonHoverStyle = {
      color: theme.primaryColor,
      borderColor: theme.primaryColor,
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
          <label>{label}</label>
        </button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    );
  };
}

export default withStreamlitConnection(ImageClipboardComponent);
