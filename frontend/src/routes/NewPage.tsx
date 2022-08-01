import PostEditor from "../components/PostEditor/PostEditor";
import { ddbSavePost } from "../grapql";
import "./page.css";

const NewPage = () => {
  return (
    <div className="page-content">
      <PostEditor readOnly={false} onSave={ddbSavePost} />
    </div>
  );
};

export default NewPage;
