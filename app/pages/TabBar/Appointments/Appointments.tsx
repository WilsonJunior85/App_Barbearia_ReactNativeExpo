import { View, Text } from 'react-native';
import BottomMenu from '../../../../components/BottomMenu';

export default function Appointments() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#63c2d1',
      }}>
      <Text>Appointments</Text>
      <BottomMenu />
    </View>
  );
}
