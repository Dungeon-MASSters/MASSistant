import { AudioFileRounded, UploadFileRounded, Save } from "@mui/icons-material";
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    Input,
    Paper,
    Stack,
    styled
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { apiUrl } from "./utils/api";

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
    height: 200,
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
                <Stack spacing={2}>
                    {getKonspektsQuery.data.map((item: any) => {
                        return (
                            <KonspektCard variant="outlined" key={item.id}>
                                <Stack>
                                    <span>{item.original_filename}</span>
                                    <audio
                                        controls
                                        src={`${apiUrl}/konspekt/audio/${item.filename}`}
                                        preload="none"
                                    />
                                </Stack>
                            </KonspektCard>
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
