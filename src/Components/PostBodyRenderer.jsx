import MarkdownRenderer from "./MarkdownRenderer"

export default function PostBodyRenderer({ resource }) {
  if( typeof (resource.content) == "string")
    return <MarkdownRenderer>{resource.content}</MarkdownRenderer>

  if( resource.content.map )
    return resource.content.map((c) => {
       if(typeof(c) == "string") 
         return <MarkdownRenderer>{c}</MarkdownRenderer>
       return c
    })

  return <span style={{color: "red"}}>{JSON.stringify(resource.content)}</span>
}