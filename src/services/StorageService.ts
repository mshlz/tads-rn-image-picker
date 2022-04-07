import * as FileSystem from 'expo-file-system';

class StorageService {

    async saveFile(fromUri: string) {
        const filename = fromUri.split('/').slice(-1)[0]
        const destination = FileSystem.documentDirectory + filename

        await FileSystem.copyAsync({
            from: fromUri,
            to: destination
        })

        return destination
    }

    async getFileUri(uri: string) {
        const result = await FileSystem.getInfoAsync(uri)

        if (result.exists && !result.isDirectory) {
            return result.uri
        } else {
            return null
        }
    }

    async deleteFile(uri: string) {
        await FileSystem.deleteAsync(uri, { idempotent: true })
        return true
    }

}

export default new StorageService()