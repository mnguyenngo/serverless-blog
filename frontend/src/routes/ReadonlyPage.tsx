import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AccountContext } from "../components/User/Accounts";
import "./page.css";
import { ddbGetPost } from "../grapql";
import ReadOnlyPost from "../components/PostEditor/ReadOnlyPost";

const ReadonlyPage = () => {
  const [title, setTitle] = useState(null);
  const [value, setValue] = useState(null);

  let params = useParams();

  const { loggedInUser } = useContext(AccountContext);

  let navigate = useNavigate();

  const postId = params.postId || "";

  useEffect(() => {
    const fetchData = async () => {
      const post = await ddbGetPost(postId);
      // console.log(`data from GraphQL in ReadOnly: ${JSON.stringify(data, null, 2)}`);
      // @ts-ignore
      const content = JSON.parse(post.content);
      // console.log(`content in ReadOnly: ${JSON.stringify(content, null, 2)}`);
      setValue(content);
      // @ts-ignore
      setTitle(post.title);
    };
    if (postId && !title && !value) {
      console.log(`fetching data for postId: ${postId}`);
      fetchData();
    }
  }, [postId, title, value]);

  console.log("Rendering ReadonlyPage");
  return (
    <>
      {loggedInUser && (
        <button
          className="edit-page-link"
          onClick={() => navigate(`/editpage/${params.postId}`)}
        >
          Edit this page
        </button>
      )}
      <div className="page-content">
        {title && <h2>{title}</h2>}
        {value && <ReadOnlyPost children={value} />}
      </div>
    </>
  );
};

export default ReadonlyPage;
