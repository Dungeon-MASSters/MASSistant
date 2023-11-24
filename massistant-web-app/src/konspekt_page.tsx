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
    Slider
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import { useRef, useState } from "react";
import { useQuery } from "react-query";
import { apiUrl } from "./utils/api";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import { KonspektPlayer } from "./konspekt_player";

const uploadKonspekt = (audio: File) => {
    const url = apiUrl + "/konspekt";

    let formData = new FormData();
    formData.append("audio", audio);

    return axios.post(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
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

const GlossaryItem = ({
    word,
    definition,
    timestamp
}: {
    word: string;
    definition: string;
    timestamp: number;
}) => {
    return (
        <Stack direction="row" justifyContent="space-between">
            <span>
                {word} - {definition}
            </span>
            <span>00:00</span>
        </Stack>
    );
};

export const KonspektPage = (props) => {
    const [audio, setAudio] = useState<File | null>(null);
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

    return (
        <>
            {getKonspektsQuery.isLoading ? (
                <CircularProgress />
            ) : (
                <Stack>
                    {getKonspektsQuery.data.map((item: any, index) => {
                        return (
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Stack sx={{ width: "100%" }} spacing={1}>
                                        <Typography>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "start",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <h2>
                                                    {item.original_filename}
                                                </h2>
                                                <IconButton
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </div>
                                            <span>
                                                {moment(
                                                    item.created_at
                                                ).calendar()}
                                            </span>
                                        </Typography>

                                        <KonspektPlayer
                                            filename={item.filename}
                                        ></KonspektPlayer>
                                    </Stack>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Accordion variant="outlined">
                                        <AccordionSummary
                                            expandIcon={<ExpandMore />}
                                        >
                                            <h3>
                                                Транскрибация (прям свежая с
                                                бекенда)
                                            </h3>
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
                                    <Accordion variant="outlined">
                                        <AccordionSummary
                                            expandIcon={<ExpandMore />}
                                        >
                                            <h3>Глоссарий</h3>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                <ul>
                                                    <li>
                                                        <GlossaryItem
                                                            word="Lorem"
                                                            definition="Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat."
                                                            timestamp={30}
                                                        />
                                                    </li>
                                                </ul>
                                            </Typography>
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

            <LoadingButton
                variant="contained"
                component="label"
                sx={{
                    position: "fixed",
                    right: 32,
                    bottom: 32,
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
