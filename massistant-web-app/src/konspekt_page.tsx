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
    createTheme,
    TextareaAutosize,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormLabel,
    FormControlLabel,
    Radio,
    RadioGroup
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import { ChangeEvent, createRef, useRef, useState } from "react";
import { useQuery } from "react-query";
import { apiUrl } from "./utils/api";
import moment from "moment";
import { PlayCircle } from "@mui/icons-material";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from "@mui/icons-material/Delete";
import { KonspektPlayer } from "./konspekt_player";
import "./konspekt-page.css";
import EditIcon from "@mui/icons-material/Edit";
import H5AudioPlayer from "react-h5-audio-player";
import { MuiFileInput } from "mui-file-input";

const uploadKonspekt = (audio: File, mode: string) => {
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
            <Button
                variant="text"
                onClick={() => handleTimeclick(audio, timestamp)}
            >
                {getTime(timestamp)}
            </Button>
        </Stack>
    );
};

export const KonspektPage = (props) => {
    const [audioName, setAudio] = useState<string>("");
    const [audioId, setAudioId] = useState<number | null>(null);
    const [uploadState, setUploadState] = useState("");
    const scrollTarget = useRef<HTMLDivElement | null>(null);

    const [editItemID, setEditItemID] = useState<number | undefined>(undefined);
    const [editItemText, setEditItemText] = useState<string | undefined>(
        undefined
    );

    const [openDialog, setOpenDialog] = useState(false);
    const [file, changeFile] = useState<File | null | undefined>(null);
    const [mode, changeMode] = useState('fast');

    const handleFileChange = (newValue: File | null) => {
        changeFile(newValue);
    }

    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleModeChange = (e: ChangeEvent, newValue: string) => {
        changeMode(newValue);
    }

    const handleSubmit = async () => {
        handleCloseDialog();
        setUploadState("uploading");

        try {
            if (file === null || file === undefined) {
                setUploadState("error");
                return;
            }

            let res = await uploadKonspekt(file, mode);
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
    }

    const getKonspektsQuery = useQuery(
        ["get-konspekts"],
        () => getKonspektsList(),
        {
            refetchInterval: 500
        }
    );

    // const handleDownload = (id) => {
    //     axios.get(`${apiUrl}/konspekt/${id}/download`);
    // };

    const handleDelete = (id) => {
        axios
            .delete(`${apiUrl}/konspekt/${id}`)
            .then(() => getKonspektsQuery.refetch());
    };

    const player = createRef<H5AudioPlayer>();
    const handleEdit = (id, text) => {
        setEditItemID(id);
        setEditItemText(text);
    };

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
        const htmlAudio = player.current?.audio.current;
        if (htmlAudio) {
            htmlAudio.currentTime = timestamp;
        }
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
                                                        opacity: 0.8
                                                    }}
                                                >
                                                    Транскрибация
                                                </span>
                                                <IconButton
                                                    onClick={() =>
                                                        handleEdit(
                                                            item.id,
                                                            item.trans_text
                                                        )
                                                    }
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </div>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                {item.trans_text ? (
                                                    item.id === editItemID ? (
                                                        <TextareaAutosize
                                                            minRows={10}
                                                            style={{
                                                                width: "100%"
                                                            }}
                                                            value={editItemText}
                                                        />
                                                    ) : (
                                                        <p>{item.trans_text}</p>
                                                    )
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

                                                    <h3>Основная часть</h3>
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
                    playerRef={player}
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
                onClick={handleClickOpenDialog}
            >
                <span>Загрузить запись лекции</span>
            </LoadingButton>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Загрузить аудио</DialogTitle>
                <DialogContent sx={{display: 'flex', flexDirection: 'column'}}>
                    <FormLabel>Файл аудиозаписи</FormLabel>
                    <MuiFileInput
                        placeholder="Нажмите, чтобы выбрать файл"
                        value={file} onChange={handleFileChange}
                        clearIconButtonProps={{
                            children: <CloseIcon fontSize="small" />
                        }}
                        inputProps={{
                            accept: 'audio/*',
                            startAdornment: <AttachFileIcon />
                        }}>
                    </MuiFileInput>
                    <div style={{ margin: '1em 0' }}></div>
                    <FormLabel>Режим транскрибирования</FormLabel>
                    <RadioGroup
                        row
                        defaultValue="fast"
                        name="radio-buttons-group"
                        onChange={handleModeChange}
                    >
                        <FormControlLabel value="fast" control={<Radio />} label="Быстрый" />
                        <FormControlLabel value="precise" control={<Radio />} label="Точный" />
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={handleCloseDialog}>Отмена</Button>
                    <Button onClick={handleSubmit}>Загрузить</Button>
                </DialogActions>
            </Dialog>
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
