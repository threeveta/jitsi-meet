import { StyleSheet } from "react-native";

import { ColorSchemeRegistry, schemeColor } from "../../base/color-scheme";

/**
 * Size for the Avatar.
 */
export const AVATAR_SIZE = 200;

export default {
    largeVideoContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    waitingMessageContainer: {
        position: "absolute",
        padding: 15,
        backgroundColor: "#FF6926",
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    waitingMessageText: {
        color: 'white',
    },
};

/**
 * Color schemed styles for the @{LargeVideo} component.
 */
ColorSchemeRegistry.register("LargeVideo", {
    /**
     * Large video container style.
     */
    largeVideo: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "stretch",
        backgroundColor: schemeColor("background"),
        flex: 1,
        justifyContent: "center",
    },
});
