import Markdown from "markdown-to-jsx";
import './PostContent.css';

interface PostContentProps {
  content: string;
}

export default function PostContent(props: PostContentProps) {
  return (
    <Markdown>
      {props.content}
    </Markdown>
  );

}
