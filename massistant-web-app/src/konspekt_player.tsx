import { apiUrl } from "./utils/api";
import { RefObject, createRef, useState } from "react";
import H5AudioPlayer from "react-h5-audio-player";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

export const KonspektPlayer = ({ filename, playerRef }: { filename: string, playerRef?: RefObject<H5AudioPlayer>}) => {
    const [play, setPlay] = useState(false);
    const [progress, setProgress] = useState(0);

    return (
        <AudioPlayer
            autoPlay={false}
            // ref={playerRef}
            src={`${apiUrl}/konspekt/audio/${filename}`}
            onPlay={(e) => console.log("onPlay")}
            onSeeking={(e) => {
                console.log("onSeek");
            }}
            onChangeCurrentTimeError={() => console.log("bruh")}
            // other props here
        />
    );
};
