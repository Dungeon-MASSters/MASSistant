import {
    AudioFileRounded,
    UploadFileRounded,
    Save,
    ExpandMore,
    PlayArrow
} from "@mui/icons-material";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    CircularProgress,
    FormControl,
    Input,
    Paper,
    Stack,
    Typography,
    styled,
    CardMedia,
    Toolbar,
    LinearProgress,
    IconButton,
    Link,
    Slider,
    createTheme
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import { createRef, useRef, useState } from "react";
import { useQuery } from "react-query";
import { apiUrl } from "./utils/api";
import moment from "moment";
import { PlayCircle } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { KonspektPlayer } from "./konspekt_player";
import "./konspekt-page.css";
import EditIcon from '@mui/icons-material/Edit';
import H5AudioPlayer from "react-h5-audio-player";

const uploadKonspekt = (audio: File) => {
    const url = apiUrl + "/konspekt";

    let formData = new FormData();
    formData.append("audio", audio);

    return axios.post(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
        params: {
            mode: "fast"
        }
    });
};

const getKonspektsList = () => {
    const url = apiUrl + "/konspekt";
    return axios.get(url).then((resp) => resp.data);
};

const KonspektCard = styled(Paper)(({ theme }) => ({
    // height: 200,
    // width: "80%",
    padding: theme.spacing(2),
    ...theme.typography.body2
}));

const getTime = (timestamp: number): string => {
    const date = new Date(1000 * timestamp); // unix timestamp in seconds to milliseconds conversion
    const time = date.toTimeString();
    return time.substring(3, 8);
};

const GlossaryItem = ({
    word,
    definition,
    timestamp,
    audio,
    handleTimeclick
}: {
    word: string;
    definition: string;
    timestamp: number;
    audio: { id: number; filename: string };
    handleTimeclick: (
        audio: { id: number; filename: string },
        timestamp: number
    ) => void;
}) => {
    return (
        <Stack direction="row" justifyContent="space-between">
            <span>
                {word} - {definition}
            </span>
            <Link
                variant="button"
                onClick={() => handleTimeclick(audio, timestamp)}
            >
                {getTime(timestamp)}
            </Link>
        </Stack>
    );
};

export const KonspektPage = (props) => {
    const [audioName, setAudio] = useState<string>("");
    const [audioId, setAudioId] = useState<number | null>(null);
    const [uploadState, setUploadState] = useState("");
    const scrollTarget = useRef<HTMLDivElement | null>(null);

    const getKonspektsQuery = useQuery(
        ["get-konspekts"],
        () => getKonspektsList(),
        {}
    );

    // const handleDownload = (id) => {
    //     axios.get(`${apiUrl}/konspekt/${id}/download`);
    // };

    const handleDelete = (id) => {
        axios
            .delete(`${apiUrl}/konspekt/${id}`)
            .then(() => getKonspektsQuery.refetch());
    };

    const handleEdit = (id) => {

    };

    // const player = createRef<H5AudioPlayer>();

    const handlePlayClick = (id: any, filename: string) => {
        if (id != audioId) {
            setAudioId(id);
            setAudio(filename);
        }
    };

    const handleTimeclick = (
        { id, filename }: { id: number; filename: string },
        timestamp: number
    ) => {
        handlePlayClick(id, filename);
        // const htmlAudio = player.current?.audio.current
        // if (htmlAudio) {
        //     htmlAudio.currentTime = 33;
        // }
    };

    return (
        <>
            {getKonspektsQuery.isLoading ? (
                <CircularProgress sx={{ pt: 3 }} />
            ) : (
                <Stack spacing={"1em"} sx={{ pt: 3 }}>
                    {getKonspektsQuery.data.map((item: any, index) => {
                        return (
                            <Accordion
                                key={item.id}
                                className="list-accordion cheat"
                                sx={{
                                    borderRadius: "16px"
                                }}
                                disableGutters
                            >
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            width: "100%"
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                width: "100%"
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexGrow: 1,
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        maxWidth: "25em"
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h6"
                                                        noWrap
                                                    >
                                                        {item.original_filename}
                                                    </Typography>
                                                    <IconButton
                                                        sx={{
                                                            ml: 1
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handlePlayClick(
                                                                item.id,
                                                                item.filename
                                                            );
                                                        }}
                                                    >
                                                        <PlayCircle />
                                                    </IconButton>
                                                </div>
                                                <span
                                                    style={{
                                                        fontSize: "1em",
                                                        color: "#8d46f4",
                                                        opacity: 0.75
                                                    }}
                                                >
                                                    {moment(
                                                        item.created_at
                                                    ).calendar()}
                                                </span>
                                            </div>
                                            <IconButton
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </div>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Accordion
                                        sx={{ boxShadow: "none" }}
                                        disableGutters
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMore />}
                                        >
                                            <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        maxWidth: "25em"
                                                    }}
                                                >
                                            <span
                                                style={{
                                                    fontWeight: "bold",
                                                    fontSize: "1em",
                                                    opacity: 0.8,
                                                }}
                                            >
                                                Транскрибация
                                            </span>
                                            <IconButton
                                                onClick={() =>
                                                    handleEdit(item.id)
                                                }
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            </div>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                {item.trans_text ? (
                                                    <p>
                                                        Текст: {item.trans_text}
                                                    </p>
                                                ) : (
                                                    <LinearProgress />
                                                )}
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion
                                        sx={{ boxShadow: "none" }}
                                        disableGutters
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMore />}
                                        >
                                            <span
                                                style={{
                                                    fontWeight: "bold",
                                                    fontSize: "1em",
                                                    opacity: 0.8
                                                }}
                                            >
                                                Глоссарий
                                            </span>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                <ul>
                                                    {item.glossary?.terms?.map(
                                                        (term) => (
                                                            <li>
                                                                <GlossaryItem
                                                                    word={
                                                                        term.term ??
                                                                        "???"
                                                                    }
                                                                    definition={
                                                                        term.meaning ??
                                                                        "???"
                                                                    }
                                                                    timestamp={
                                                                        term.timestamp
                                                                    }
                                                                    audio={{
                                                                        id: item.id,
                                                                        filename:
                                                                            item.filename
                                                                    }}
                                                                    handleTimeclick={
                                                                        handleTimeclick
                                                                    }
                                                                />
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion
                                        sx={{ boxShadow: "none" }}
                                        disableGutters
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMore />}
                                        >
                                            <span
                                                style={{
                                                    fontWeight: "bold",
                                                    fontSize: "1em",
                                                    opacity: 0.8
                                                }}
                                            >
                                                Краткое содержание
                                            </span>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {item.summary && (
                                                <Typography>
                                                    <h3>Введение</h3>
                                                    <p>
                                                        {
                                                            item.summary[
                                                                "introduction"
                                                            ]
                                                        }
                                                    </p>


                                                    <h3>Основаная часть</h3>
                                                    <p>
                                                        {
                                                            item.summary[
                                                                "main_part"
                                                            ]
                                                        }
                                                    </p>


                                                    <h3>Заключение</h3>
                                                    <p>
                                                        {
                                                            item.summary[
                                                                "conclusion"
                                                            ]
                                                        }
                                                    </p>
                                                </Typography>
                                            )}
                                        </AccordionDetails>
                                    </Accordion>
                                    <Link
                                        style={{
                                            margin: "10px",
                                            float: "right"
                                        }}
                                        variant="button"
                                        href={`${apiUrl}/konspekt/${item.id}/download`}
                                    >
                                        Скачать
                                    </Link>
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}

                    <div ref={scrollTarget}></div>
                </Stack>
            )}
            {audioId != null && (
                <div
                    style={{
                        height: "4em"
                    }}
                ></div>
            )}
            <div
                style={{ display: audioId === null ? "none" : "block" }}
                className="player-container"
            >
                <KonspektPlayer
                    filename={audioName}
                    // playerRef={player}
                ></KonspektPlayer>
            </div>
            <LoadingButton
                variant="contained"
                component="label"
                sx={{
                    position: "fixed",
                    right: 32,
                    bottom: audioId === null ? 32 : 120,
                    padding: 2
                }}
                loading={uploadState === "uploading"}
                startIcon={<AudioFileRounded />}
            >
                <span>Загрузить запись лекции</span>

                <input
                    id="audio-file"
                    type="file"
                    hidden
                    accept="audio/*"
                    onChange={async (e) => {
                        setUploadState("uploading");

                        try {
                            if (e.target.files === null) {
                                setUploadState("error");
                                return;
                            }

                            let res = await uploadKonspekt(e.target.files[0]);
                            console.log(res);
                            setUploadState("done");
                            getKonspektsQuery.refetch().then(() => {
                                scrollTarget.current?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "end"
                                });
                            });
                        } catch (e) {
                            console.error(e);
                            setUploadState("error");
                        }
                    }}
                />
            </LoadingButton>
        </>
    );
};

/**
                <InputLabel htmlFor="audio-input">Запись лекции</InputLabel>
                <Input
                    id="audio-input"
                    aria-describedby="audio-input-helper"
                    type="file"
                />
                <FormHelperText id="audio-input-helper">
                    Загрузи сюда запись лекции и я сделаю конспект
                </FormHelperText>

*/
