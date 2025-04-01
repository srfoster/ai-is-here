import { Avatar, AvatarGroup, Stack } from '@mui/material';
import {Link} from 'react-router-dom';
import authorsData from '../data/authors'; // Import the authors JSON

export default function DynamicAvatar({ authorInfos }) {
  if(!authorInfos.length)
    authorInfos = [authorInfos];

  authorInfos = authorInfos.map((a) => {
    if(typeof a == "string")
      return authorsData.find((x) => x.slug == a);
    return a
  }).filter(x => x);



  return <AvatarGroup max={authorInfos.length}>
    {authorInfos.map((author, i) => {
      return <Link style={{marginRight: -10}} to={"/authors/" + author.slug}>
        <Avatar key={i} src={ author.avatar } />
      </Link>
    })}
  </AvatarGroup>
}
