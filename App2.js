import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      setPhoto(photo.uri);
    }
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
      <View style={styles.container}>
        <View style={styles.cameraContainer}>
          <Camera
              style={styles.camera}
              type={type}
              ref={(ref) => setCamera(ref)}
              ratio={'4:3'}
          />
          {photo && <Image source={{ uri: photo }} style={styles.preview} />}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setType(
                    type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                );
              }}>
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}> Snap </Text>
          </TouchableOpacity>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  preview: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    top: 0,
  },
  buttonContainer: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: "blue",
  },
  button: {
    flex: 0.4,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: "red",
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
