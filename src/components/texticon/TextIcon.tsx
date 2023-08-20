import React from 'react';
import { IconSolid, Text, availableIcon } from 'prixa-design-kit/dist';

interface TextIconProps {
  color: string;
  icon: typeof availableIcon[number];
  text: string;
  scale: 'feedbackLink2' | 'questionLink2';
}

const TextIcon = (props: TextIconProps) => {
  return (
    <IconSolid
      backgroundColor={props.color}
      backgroundSize="18px"
      color="white"
      margin="0px"
      type={props.icon}
      width="8px"
    >
      <Text className="margin-microL" scale={props.scale}>
        {props.text}
      </Text>
    </IconSolid>
  );
};

export default TextIcon;
