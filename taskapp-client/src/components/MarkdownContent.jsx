import React from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";

function MarkdownContent({ title, content }) {
  return (
    <>
      <MarkdownPreview
        source={content}
        wrapperElement={{
          "data-color-mode": "light",
        }}
        components={{
          h1(props) {
            const { node, ...rest } = props;
            return <div className="h1" {...rest} />;
          },
          h2(props) {
            const { node, ...rest } = props;
            return <div className="h2" {...rest} />;
          },
        }}
      />
    </>
  );
}

export default MarkdownContent;
