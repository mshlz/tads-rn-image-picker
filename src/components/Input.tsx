import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native"

interface InputProps extends TextInputProps {
    label?: string
    error?: string
}

export const Input = (props: InputProps) => {
    return <View style={styles.container}>
        {props.label && <Text style={styles.label}>{props.label}</Text>}
        <TextInput
            style={[styles.input, props.error && { borderColor: 'red' }]}
            {...props}
        />
        {props.error && <Text style={styles.error}>{props.error}</Text>}
    </View>
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold'
    },
    error: {
        color: 'red',
        fontSize: 12
    }
})