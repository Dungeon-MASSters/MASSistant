import { apiUrl } from "./utils/api";
import { useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

export const KonspektPlayer = ({ filename }: { filename: string }) => {
    const [play, setPlay] = useState(false);
    const [progress, setProgress] = useState(0);

    return (
        <AudioPlayer
            autoPlay={false}
            src={`${apiUrl}/konspekt/audio/${filename}`}
            onPlay={(e) => console.log("onPlay")}
            // other props here
        />
    );
};
