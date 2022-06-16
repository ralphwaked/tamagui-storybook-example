import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from 'tamagui'
// todo: try with dummy component if you like
// import { View as Button } from 'react-native-web'

export default {
  title: 'Demo',
  component: Button
} as ComponentMeta<typeof Button>;


// note: the error may not show, it may just show empty screen
// changing name of component gets it to show up
export const MyButton = () => <Button>Text</Button>
