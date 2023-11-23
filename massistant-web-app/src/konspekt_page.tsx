import { AudioFileRounded, UploadFileRounded } from "@mui/icons-material";
import { Box, Button, FormControl, Input, Stack } from "@mui/material";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type konspektInputs = {
    audio: FileList;
};

export const KonspektPage = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<konspektInputs>();
    const onKonspektFormSubmit: SubmitHandler<konspektInputs> = (data) =>
        console.log(data);

    console.log(watch("audio"))

    return (
        <>
            <div>this is a konspekt page</div>

            <form onSubmit={handleSubmit(onKonspektFormSubmit)}>
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
                    <Button
                        variant="contained"
                        type="submit"
                        onClick={handleSubmit(onKonspektFormSubmit)}
                    >
                        <UploadFileRounded />
                        <span>Загрузить</span>
                    </Button>
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
