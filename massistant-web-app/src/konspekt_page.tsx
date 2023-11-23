import { AudioFileRounded, UploadFileRounded, Save } from "@mui/icons-material";
import { Box, Button, FormControl, Input, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useQuery } from "react-query";

type konspektInputs = {
    audio: FileList;
};

const uploadKonspekt = (audio: File) => {
    const url = import.meta.env.VITE_API_ROOT + "/konspekt";

    let formData = new FormData();
    formData.append("audio", audio);

    return axios.post(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

export const KonspektPage = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        getValues
    } = useForm<konspektInputs>();

    const submitKonspektQuery = useQuery(
        ["upload-konspekt"],
        () => {
            let files = getValues().audio;
            uploadKonspekt(files[0]);
        },
        {
            enabled: false,
            onSuccess: (data) => {
                alert("ok");
            },
            onError: (data) => {
                alert("error");
            }
        }
    );

    const onKonspektFormSubmit: SubmitHandler<konspektInputs> = (_) => {
        submitKonspektQuery.refetch();
    };

    return (
        <>
            <div>this is a konspekt page</div>

            <form onSubmit={() => false}>
                <Stack spacing={1} sx={{ width: 400 }}>
                    <Button variant="outlined" component="label">
                        <Box sx={{ display: "flex", gap: "0.25rem" }}>
                            <AudioFileRounded />
                            <span>Запись лекции</span>
                        </Box>
                        <input
                            id="audio-file"
                            type="file"
                            hidden
                            accept="audio/*"
                            {...register("audio", { required: true })}
                        />
                    </Button>
                    {submitKonspektQuery.isFetching ? (
                        <LoadingButton
                            loading
                            loadingPosition="start"
                            startIcon={<Save />}
                            variant="outlined"
                        >
                            Загрузка...
                        </LoadingButton>
                    ) : (
                        <Button
                            variant="contained"
                            type="submit"
                            onClick={handleSubmit(onKonspektFormSubmit)}
                        >
                            <UploadFileRounded />
                            <span>Загрузить</span>
                        </Button>
                    )}
                </Stack>
            </form>
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
