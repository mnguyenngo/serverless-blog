import { useEffect } from "react";
import { useState } from "react";
import { SavePostProps } from "../../grapql";
import Editor from "../lexical/Editor";

type PostEditorProps = {
  // onSave: (title: string, content: string) => void;
  onSave: (post: SavePostProps) => void;
  readOnly: boolean;
  title?: string;
  children?: any;
  postId?: string;
};

const PostEditor = (props: PostEditorProps) => {
  const [postId, setPostId] = useState("");
  const [title, setTitle] = useState("");
  const [children, setChildren]: any = useState(props.children);
  const [successfulSave, setSuccessfulSave] = useState(false);

  useEffect(() => {
    if (props.title) {
      setTitle(props.title);
    }
    if (props.children) {
      setChildren(props.children);
    }
    if (props.postId) {
      setPostId(props.postId);
    }
  }, [props.title, props.children, props.postId]);

  const handleSave = () => {
    // console.log(JSON.stringify(editorJson, null, 2));
    if (title && children) {
      console.log("onSave called");
      // console.log(`children: ${JSON.stringify(children, null, 2)}`);
      console.log(`onSave called with postId: ${postId}`);
      props.onSave({ title, content: children, postId });
      setSuccessfulSave(true);
    } else {
      console.log("onSave called but title or children are empty");
    }
  };

  const handleChange = (children: any) => {
    // console.log(`children: ${JSON.stringify(children, null, 2)}`);
    setChildren(children);
  };

  console.log("Rendering PostEditor");
  return (
    <div>
      {successfulSave && <span>Successfully saved</span>}
      <button onClick={handleSave}>Save</button>
      <div className="title-input">
        <label htmlFor="title">Title</label>
        <br />
        <input
          type="text"
          id="title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        ></input>
      </div>
      <Editor
        readOnly={props.readOnly}
        onChange={handleChange}
        children={children}
      />
    </div>
  );
};

export default PostEditor;
