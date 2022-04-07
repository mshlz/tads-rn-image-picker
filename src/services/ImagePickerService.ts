import Constants from "expo-constants"
import * as ImagePicker from "expo-image-picker"
import StorageService from "./StorageService"

class ImagePickerService {

    async checkPermissions() {
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


    async takePhoto() {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            allowsEditing: true
        });

        return this.handleImagePicked(result)
    }

    async pickImage() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            allowsEditing: true,
            quality: 1,
        });

        return this.handleImagePicked(result)
    }

    private async handleImagePicked(pickerResult: ImagePicker.ImagePickerResult) {
        try {
            if (pickerResult.cancelled) {
                alert("Operação cancelada")
                return null
            } else {
                return pickerResult as ImagePicker.ImageInfo
            }
        } catch (e) {
            console.log(e)
            alert("Falha ao pegar imagem")
            return null
        }
    }
}

export default new ImagePickerService()