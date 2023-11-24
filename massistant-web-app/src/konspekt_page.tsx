import {
    AudioFileRounded,
    UploadFileRounded,
    Save,
    ExpandMore
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
    LinearProgress
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { apiUrl } from "./utils/api";
import moment from "moment";

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

export const KonspektPage = () => {
    const [audio, setAudio] = useState<File | null>(null);
    const [uploadState, setUploadState] = useState("");
    const scrollTarget = useRef<HTMLDivElement | null>(null);

    const getKonspektsQuery = useQuery(
        ["get-konspekts"],
        () => getKonspektsList(),
        {}
    );

    return (
        <>
            {getKonspektsQuery.isLoading ? (
                <CircularProgress />
            ) : (
                <Stack>
                    {getKonspektsQuery.data.map((item: any) => {
                        return (
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography>
                                        <h2>{item.original_filename}</h2>
                                        <span>
                                            {moment(item.created_at).calendar()}
                                        </span>
                                        <h6 />
                                    </Typography>
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
                                    <Button style={{margin: '10px', float: 'right'}} variant="contained">Скачать</Button>
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
