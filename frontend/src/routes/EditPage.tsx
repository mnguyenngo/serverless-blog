import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostEditor from "../components/PostEditor/PostEditor";
import { ddbUpdatePost, ddbGetPost } from "../grapql";
import "./page.css";

const EditPage = () => {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState(null);

  let params = useParams();

  let navigate = useNavigate();

  const postId = params.postId || "";

  useEffect(() => {
    const fetchData = async () => {
      const post = await ddbGetPost(postId);
      // console.log(`data from GraphQL in ReadOnly: ${JSON.stringify(data, null, 2)}`);
      // @ts-ignore
      const content = JSON.parse(post.content);
      setValue(content);
      // @ts-ignore
      setTitle(post.title);
    };
    if (postId && !title && !value) {
      console.log(`fetching data for postId: ${postId}`);
      fetchData();
    }
  }, [postId, title, value]);

  // const outerValue: any = {
  //   title,
  //   body: value,
  // };

  // console.log(`value: ${JSON.stringify(value, null, 2)}`);

  return (
    <>
      <button
        className="view-page-link"
        onClick={() => navigate(`/readonly/${params.postId}`)}
      >
        View this page
      </button>
      <div className="page-content">
        {title && value && (
          <PostEditor
            readOnly={false}
            onSave={ddbUpdatePost}
            children={value}
            title={title}
            postId={postId}
          />
        )}
      </div>
      {/* <pre className="show-json">{JSON.stringify(outerValue, null, 2)}</pre> */}
    </>
  );
};

export default EditPage;
