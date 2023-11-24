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
    styled, CardMedia, Toolbar
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
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>
                                        <h2>{item.original_filename}</h2>
                                        <span>
                                            {moment(item.created_at).calendar()}
                                        </span>
                                        <h6/>
                                    </Typography>
                                    <CardMedia component="audio"
                                          autoPlay
                                          controls
                                          src="../audio.mp3"
                                        />
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        Lorem ipsum dolor sit amet, officia
                                        excepteur ex fugiat reprehenderit enim
                                        labore culpa sint ad nisi Lorem pariatur
                                        mollit ex esse exercitation amet. Nisi
                                        anim cupidatat excepteur officia.
                                        Reprehenderit nostrud nostrud ipsum
                                        Lorem est aliquip amet voluptate
                                        voluptate dolor minim nulla est
                                        proident. Nostrud officia pariatur ut
                                        officia. Sit irure elit esse ea nulla
                                        sunt ex occaecat reprehenderit commodo
                                        officia dolor Lorem duis laboris
                                        cupidatat officia voluptate. Culpa
                                        proident adipisicing id nulla nisi
                                        laboris ex in Lorem sunt duis officia
                                        eiusmod. Aliqua reprehenderit commodo ex
                                        non excepteur duis sunt velit enim.
                                        Voluptate laboris sint cupidatat ullamco
                                        ut ea consectetur et est culpa et culpa
                                        duis. Lorem ipsum dolor sit amet,
                                        officia excepteur ex fugiat
                                        reprehenderit enim labore culpa sint ad
                                        nisi Lorem pariatur mollit ex esse
                                        exercitation amet. Nisi anim cupidatat
                                        excepteur officia. Reprehenderit nostrud
                                        nostrud ipsum Lorem est aliquip amet
                                        voluptate voluptate dolor minim nulla
                                        est proident. Nostrud officia pariatur
                                        ut officia. Sit irure elit esse ea nulla
                                        sunt ex occaecat reprehenderit commodo
                                        officia dolor Lorem duis laboris
                                        cupidatat officia voluptate. Culpa
                                        proident adipisicing id nulla nisi
                                        laboris ex in Lorem sunt duis officia
                                        eiusmod. Aliqua reprehenderit commodo ex
                                        non excepteur duis sunt velit enim.
                                        Voluptate laboris sint cupidatat ullamco
                                        ut ea consectetur et est culpa et culpa
                                        duis.
                                    </Typography>
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
