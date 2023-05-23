import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

export default function Gallery() {
  const [imageList, setImageList] = useState([]);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      setImageList([photo, ...imageList]);
      setCameraVisible(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageList([result, ...imageList]);
    }
  };

  const handleCameraPress = async () => {
    console.log("handleCameraPress")
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    setCameraVisible(true);
  };

  const renderImage = ({ item }) => {
    return (
        <TouchableOpacity onPress={() => console.log(item)}>
          <Image source={{ uri: item.uri }} style={styles.image} />
        </TouchableOpacity>
    );
  };

  return (
      <View style={styles.container}>
        <Modal animationType='slide' visible={cameraVisible}>
          <View style={styles.cameraContainer}>
            <Camera
                ref={ref => setCamera(ref)}
                style={styles.camera}
                type={Camera.Constants.Type.back}
                ratio='4:3'
                autoFocus={Camera.Constants.AutoFocus.on}
                whiteBalance={Camera.Constants.WhiteBalance.auto}
                zoom={0}
            >
              <TouchableOpacity style={styles.closeButton} onPress={() => setCameraVisible(false)}>
                <Ionicons name='close' size={40} color='white' />
              </TouchableOpacity>
              <TouchableOpacity style={styles.takePictureButton} onPress={takePicture}>
                <Ionicons name='camera' size={40} color='white' />
              </TouchableOpacity>
            </Camera>
          </View>
        </Modal>
        <FlatList
            data={imageList}
            numColumns={3}
            renderItem={renderImage}
            keyExtractor={(item, index) => index.toString()}
        />
        <TouchableOpacity style={styles.cameraButton} onPress={handleCameraPress}>
          <Ionicons name='camera' size={40} color='white' />
        </TouchableOpacity>
        <TouchableOpacity style={styles.libraryButton} onPress={pickImage}>
          <Ionicons name='image' size={40} color='white' />
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'gray',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  takePictureButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  libraryButton: {
    position: 'absolute',
    bottom: 20,
    right: 90,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
});

