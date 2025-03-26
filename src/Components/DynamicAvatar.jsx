import { Avatar, AvatarGroup, Stack } from '@mui/material';

export default function DynamicAvatar({ avatarInfo }) {
  if (avatarInfo == undefined || avatarInfo.length === 0) {
    return <div style={{width: 50, height: 50, backgroundColor: "black"}}></div>
  }

  let size = 50 / avatarInfo.length;

  if (!avatarInfo.length) {
      return <Avatar style={{ width: size, height: size }} src={ avatarInfo} />
  } else {
    return <AvatarGroup max={avatarInfo.length}>
      {avatarInfo.map((avatar, i) => {
          return <Avatar key={i} src={ avatar } />
      })}
    </AvatarGroup>
  }
}
