import Markdown from "markdown-to-jsx";

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
