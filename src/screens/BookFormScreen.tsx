import { CommonActions, useNavigation, useRoute } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { Button, Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, ToastAndroid, View } from "react-native"
import { ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler"
import { Input } from "../components/Input"
import { Book } from "../models/Book"
import { BookService } from "../services/BookService"
import ImagePickerService from "../services/ImagePickerService"


export const BookFormScreen = () => {
    const route = useRoute()
    const navigation = useNavigation()
    const bookId = route && route.params && route.params['bookId']

    const [data, setData] = useState<Partial<Book>>({})
    const [formErrors, setErrors] = useState({})

    useEffect(() => {
        if (bookId) {
            navigation.setParams({} as never)
            BookService.findById(bookId).then(setData)
        }
    }, [bookId])


    const saveBook = async () => {
        // clear errors
        setErrors({})

        // validation
        const errors = {}
        if (!data.name || !data.name.trim()) {
            errors['name'] = 'Nome é obrigatório'
        }
        if (!data.author || !data.author.trim()) {
            errors['author'] = 'Autor é obrigatório'
        }
        if (!data.description || !data.description.trim()) {
            errors['description'] = 'Descrição é obrigatória'
        }
        if (!data.publisher || !data.publisher.trim()) {
            errors['publisher'] = 'Editora é obrigatória'
        }

        // has errors
        if (Object.keys(errors).length) {
            setErrors(errors)
            return
        }

        // if has id is update
        if (data.id) {
            const book = new Book(data)
            const result = await BookService.update(book)
            ToastAndroid.show('Livro atualizado!', ToastAndroid.SHORT)
        } else {
            // is create
            const obj = new Book(data)
            const book = await BookService.create(obj)
            setData(book)
            ToastAndroid.show('Livro criado!', ToastAndroid.SHORT)
        }
    }

    const clearForm = () => {
        setData({})
    }

    const pickImage = async () => {
        const result = await ImagePickerService.pickImage()

        if (result) {
            setData({ ...data, imageUri: result.uri })
        }
    }
    const takePhoto = async () => {
        const result = await ImagePickerService.takePhoto()

        if (result) {
            setData({ ...data, imageUri: result.uri })
        }
    }

    return <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView>
                <View style={styles.container2}>
                    <Text style={styles.title}>{data.id ? 'Editar livro' : 'Add novo livro'}</Text>

                    <View style={{ alignItems: 'center', marginBottom: 5 }}>
                        <Image
                            source={{ uri: data.imageUri }}
                            style={{ width: 150, height: 150, backgroundColor: '#ddd' }}
                        />
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <Button onPress={pickImage} title="Escolher foto" />
                            <Button onPress={takePhoto} title="Abrir camera" />
                        </View>
                    </View>

                    <Input
                        label="Nome"
                        placeholder="nome..."
                        defaultValue={data.name}
                        onChangeText={val => setData({ ...data, name: val })}
                        error={formErrors['name']}
                    />
                    <Input
                        label="Descrição"
                        placeholder="descricao..."
                        defaultValue={data.description}
                        onChangeText={val => setData({ ...data, description: val })}
                        error={formErrors['description']}
                    />
                    <Input
                        label="Autor"
                        placeholder="autor..."
                        defaultValue={data.author}
                        onChangeText={val => setData({ ...data, author: val })}
                        error={formErrors['author']}
                    />
                    <Input
                        label="Editora"
                        placeholder="editora..."
                        defaultValue={data.publisher}
                        onChangeText={val => setData({ ...data, publisher: val })}
                        error={formErrors['publisher']}
                    />

                    <Button title="Salvar" onPress={saveBook} />
                    <Button title="Limpar" color={"#333"} onPress={clearForm} />
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    container2: {
        width: '100%',
        padding: 10
    },
    title: {
        fontSize: 20,
        marginBottom: 14
    },
    image: {
        height: 60
    }
})
