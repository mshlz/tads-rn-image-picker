import { useNavigation } from "@react-navigation/native"
import { useEffect } from "react"
import { useState } from "react"
import { Alert, AlertButton, Button, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native"
import { LoadingOverlay } from "../components/LoadingOverlay"
import { Book } from "../models/Book"
import { BookService } from "../services/BookService"


export const BookListScreen = () => {
    const navigation = useNavigation()

    const [isRefreshing, setIsRefreshing] = useState(true)
    const [books, setBooks] = useState<Book[]>([])

    useEffect(() => {
        loadBooks()
    }, [])

    const loadBooks = async () => {
        setIsRefreshing(true)
        const result = await BookService.findAll()
        setBooks(result)
        setIsRefreshing(false)
    }

    const deleteBook = (book: Book) => {
        const cancelBtn: AlertButton = { text: 'Cancelar' }
        const deleteBtn: AlertButton = {
            text: 'Apagar',
            onPress: () => {
                BookService.delete(book).then(() => loadBooks())
            }
        }

        Alert.alert(`Apagar livro "${book.name}?"`, 'Essa ação não pode ser desfeita!', [deleteBtn, cancelBtn])
    }

    const editBook = (book: Book) => {
        navigation.navigate('Book Form', { bookId: book.id })
    }

    const renderBook = ({ item }: { item: Book }) => {
        return <View style={styles.itemCard} key={item.id}>
            <Pressable
                style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent' }, styles.listItem]}
                onLongPress={() => deleteBook(item)}
                onPress={() => { editBook(item) }}
            >
                <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
                <View>
                    <Text>ID: {item.id}</Text>
                    <Text>Nome: {item.name}</Text>
                    <Text>Autor: {item.author}</Text>
                    <Text>Editora: {item.publisher}</Text>
                </View>
            </Pressable>
        </View>
    }

    return <View style={styles.container}>
        {books.length === 0 &&
            <View>
                <Text style={styles.emptyList}>Nenhum registro!</Text>
                <Button title="Adicionar novo" onPress={() => navigation.navigate({ name: "Book Form" })} />
            </View>
        }

        <FlatList
            data={books}
            renderItem={renderBook}
            keyExtractor={item => item.id.toString()}

            onRefresh={() => loadBooks()}
            refreshing={isRefreshing}
        />
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    emptyList: {
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        fontSize: 16
    },
    itemCard: {
        backgroundColor: '#fff',
        shadowColor: '#222222',
        shadowOffset: { height: 1, width: 1 },
    },
    itemImage: {
        width: 64,
        height: 64,
        marginLeft: 10,
        marginRight: 15,
        backgroundColor: '#eee'
    }
})