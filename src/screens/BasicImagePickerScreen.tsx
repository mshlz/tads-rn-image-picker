import Constants from "expo-constants"
import * as ImagePicker from "expo-image-picker"
import { useEffect, useState } from "react"
import { Button, Image, Platform, StyleSheet, Text, View } from "react-native"
import StorageService from "../services/StorageService"
import * as Sharing from 'expo-sharing'

export function BasicImagePickerScreen() {
  const [imageUri, setImage] = useState(null)

  useEffect(() => {
    checkPermissions()
  }, [])

  const checkPermissions = async () => {
    if (Constants.platform.ios) {
      const cameraRollStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync()

      if (
        cameraRollStatus.status !== "granted" ||
        cameraStatus.status !== "granted"
      ) {
        alert("Ops, você precisa permitir o acesso a camera/galeria para funcionar!")
      }
    }
  }

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      allowsEditing: true
    });

    handleImagePicked(result);
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      allowsEditing: true,
      quality: 1,
    });

    handleImagePicked(result);
  }

  const handleImagePicked = async (pickerResult: ImagePicker.ImagePickerResult) => {
    try {
      if (pickerResult.cancelled) {
        alert("Operação cancelada")
      } else {
        const result = pickerResult as ImagePicker.ImageInfo

        const saveResult = await StorageService.saveFile(result.uri)
        setImage(saveResult)
      }
    } catch (e) {
      console.log(e)
      alert("Falha ao salvar imagem")
    }
  }

  const shareImage = async () => {
    if (Platform.OS === 'web') {
      alert(`Ops, função compartilhar não é compativel com WEB`);
      return
    }

    await Sharing.shareAsync(imageUri);
  }

  return (
    <View style={styles.container}>
      {imageUri && (
        <View>
          <Text style={styles.result} onLongPress={shareImage}>
            <Image
              source={{ uri: imageUri }}
              style={{ width: 250, height: 250 }}
            />
          </Text>
          <Text>Segure a imagem para compartilhar...</Text>
        </View>
      )}

      <Button onPress={pickImage} title="Pick an image from camera roll" />
      <Button onPress={takePhoto} title="Take a photo" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  result: {
    paddingTop: 5,
  },
})