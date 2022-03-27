import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useSnackbar } from "notistack";
import axiosStrapi from "utils/http-anxios";
import axios from "axios";

//*lodash

//*components
import { Button } from "components/Buttons";
import { CustomIcon } from "./Icons";

//*material-ui
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

import { LinearProgress, Stack } from "@mui/material";

//*lib
import { getStrapiMedialURL } from "lib/media";

function useUploadAttachment(
  maxLength = 3,
  unlimited = true,
  defaultAttachments = [],
  deleteCallbackMutate,
  reset
) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState();
  const [imageUrl, setImageUrl] = useState();
  const { enqueueSnackbar } = useSnackbar();

  //*states

  //*functions
  const getFile = useCallback(() => files, [files]);

  const deleteFile = useCallback(
    (index) => {
      const temp = [...files];
      temp.splice(index, 1);
      setFiles(temp);
    },
    [files]
  );

  const deleteFileFromServer = useCallback(async (id) => {
    await axiosStrapi.delete(`/upload/files/${id}`);
    deleteCallbackMutate();
  }, []);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setUploadError("");
      acceptedFiles.map((acceptedFile) => {
        return setFiles((files) => {
          const sameFile = files.filter(
            (file) => file.name === acceptedFile.name
          );

          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          );

          if (files.length < maxLength || unlimited) {
            if (sameFile.length > 0) {
              return [...files];
            } else return [...files, acceptedFile];
          } else {
            !uploadError && setUploadError(`Maximum ${maxLength} Files`);
            return [...files];
          }
        });
      });
    },
    [maxLength, uploadError, unlimited]
  );

  const getTotalUploadedFiles = useCallback(() => files.length, [files.length]);

  const startUpload = async () => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append(`files`, file, file.name));
      const resData = await axiosStrapi.post("upload", formData);
      setIsUploading(false);
      setFiles([]);
      enqueueSnackbar("Upload Success", {
        variant: "success",
      });
      return resData;
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message, {
        variant: "error",
      });
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: "image/jpeg, image/png, image/jpg",
      maxSize: 5000000,
      multiple: true,
    });

  const getImage = async () => {
    if (!imageUrl) return;

    const fileName = imageUrl.split("/").pop();
    const sameFile = files.filter((file) => file.name === fileName);
    if (sameFile.length > 0) {
      enqueueSnackbar("Same File Exist", {
        variant: "error",
      });
      return;
    }

    try {
      const response = await axios.get(imageUrl, { responseType: "blob" });
      const mimeType = response.headers["content-type"];
      const imageFile = new File([response.data], fileName, {
        type: mimeType,
      });
      Object.assign(imageFile, {
        preview: URL.createObjectURL(imageFile),
      });

      setFiles((files) => {
        return [...files, imageFile];
      });
      setImageUrl("");
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message, {
        variant: "error",
      });
    }
  };

  //*useeffect
  useEffect(() => {
    if (fileRejections?.length > 0)
      setUploadError("*File Must Be JPEG/JPG/PNG & Not More Than 5MB");
  }, [fileRejections]);

  useEffect(() => {
    setFiles([]);
    setImageUrl("");
    setUploadError("");
    setIsUploading(false);
  }, [reset]);

  const uploadBox = (
    <React.Fragment>
      <Grid container>
        {defaultAttachments?.map(({ id, attributes }) => {
          return (
            <Grid item xs={4}>
              <Box p={1}>
                <img
                  src={`${getStrapiMedialURL()}${attributes.url}`}
                  alt={attributes.name}
                  width="100%"
                />
                <Box
                  display="flex"
                  alignItems="center"
                  textAlign="center"
                  justifyContent="space-between"
                >
                  <Typography variant="caption" sx={{ wordBreak: "break-all" }}>
                    {attributes.name}
                  </Typography>
                  <IconButton
                    disabled={isUploading}
                    onClick={() => deleteFileFromServer(id)}
                  >
                    <CustomIcon icon="delete" />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
      <Box border="solid">
        <Grid container style={{ opacity: isUploading && 0.5 }}>
          {isUploading && (
            <Box style={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          )}

          {[...files] &&
            [...files].map((file, index) => {
              return (
                <Grid item xs={4}>
                  <Box p={1}>
                    <img src={file.preview} alt={file.path} width="100%" />
                    <Box
                      display="flex"
                      alignItems="center"
                      textAlign="center"
                      justifyContent="space-between"
                    >
                      <Typography
                        variant="caption"
                        sx={{ wordBreak: "break-all" }}
                      >
                        {file.name}
                      </Typography>
                      <IconButton
                        disabled={isUploading}
                        onClick={() => deleteFile(index)}
                      >
                        <CustomIcon icon="delete" />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
        </Grid>
        <Box
          p={1}
          textAlign="center"
          {...getRootProps()}
          borderColor={isDragActive && "#343c56"}
          color={isDragActive && "#343c56"}
        >
          <Box p={1} border="dotted">
            <input {...getInputProps()} />
            <Typography>
              {maxLength > 1 && !unlimited
                ? `Browse/drop file here (Max ${maxLength} files)`
                : "Browse/drop file here"}
            </Typography>
            <Typography>{"*Only jpeg, jpg, png *File size < 5MB"}</Typography>
          </Box>
        </Box>
        <Box p={1}>
          <Stack spacing={2} direction="row" alignItems="center" width="100%">
            <TextField
              fullWidth
              size="small"
              placeholder="Paste Image Url Here"
              onBlur={(e) => {
                setImageUrl(e.target.value);
                e.target.value = "";
              }}
            />
            <Button onClick={getImage}>Get</Button>
          </Stack>
        </Box>
      </Box>

      {uploadError && (
        <ListItem>
          <ListItemText disableTypography={true}>
            <Typography color="error" variant="caption" component="h1">
              {uploadError}
            </Typography>
          </ListItemText>
        </ListItem>
      )}
    </React.Fragment>
  );

  const uploadAttachment = <Box>{uploadBox}</Box>;

  return {
    startUpload,
    getTotalUploadedFiles,
    uploadAttachment,
    getFile,
    setFiles,
    isUploading,
  };
}

export default useUploadAttachment;
