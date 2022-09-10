import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PiButton from './src/components/AddToCartButton';

export default function App() {
  const [render, setRender] = useState(false);
  const functionArray = useMemo(() => [
    () => { alert(0) },
    () => { alert(1) },
    () => { alert(2) },
    () => { alert(3) },
    () => { alert(4) },
    () => { alert(5) },
    () => { alert(6) },
    () => { alert(7) },
    () => { alert(8) },
    () => { alert(9) }
  ], [])

  const mainFunction = useCallback(() => { alert('Main button pressed.') }, [])

  return (
    <View style={styles.container}>
      <Other />
      <View style={{ zIndex: 100 }}>
        {/* When all buttons show up, some button may be blocked by other views. If it's a problem for you, try using zIndex or Portals. */}
        <PiButton
          numberOfButtons={10}
          mainButtonFunction={mainFunction}
          functionArray={functionArray}
        />
      </View>
      <Other {...{ setRender }} />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

const Other = ({ setRender }) => {
  return (
    <View
      onTouchStart={() => { setRender(prev => !prev) }}
      style={{ width: '100%', height: 250, backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center', }}>
      <Text>Something else</Text>
    </View>
  )
}