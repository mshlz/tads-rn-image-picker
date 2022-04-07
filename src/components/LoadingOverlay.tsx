import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export function LoadingOverlay() {
    return <View
        style={[
            StyleSheet.absoluteFill,
            {
                backgroundColor: "rgba(0,0,0,0.4)",
                alignItems: "center",
                justifyContent: "center",
            },
        ]}
    >
        <ActivityIndicator color="#fff" animating size="large" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Carregando...</Text>
    </View>
}