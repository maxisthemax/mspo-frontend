import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useSnackbar } from "notistack";
import axiosStrapi from "utils/http-anxios";

//*lodash

//*components
import { CustomIcon } from "./Icons";

//*material-ui
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import { LinearProgress } from "@mui/material";

//*lib
import { getStrapiMedialURL } from "lib/media";

function useUploadAttachment(
  maxLength = 3,
  unlimited = true,
  defaultAttachments = [],
  deleteCallbackMutate
) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState();
  const { enqueueSnackbar } = useSnackbar();

  //*states

  //*useeffect
  useEffect(() => {
    setFiles([]);
  }, [defaultAttachments]);

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
      accept: "image/jpeg, image/png, image/jpg, application/pdf",
      maxSize: 5000000,
      multiple: true,
    });

  useEffect(() => {
    if (fileRejections?.length > 0)
      setUploadError("*File Must Be JPEG/JPG/PNG/PDF & Not More Than 5MB");
  }, [fileRejections]);

  const uploadBox = (
    <React.Fragment>
      <Grid container style={{ opacity: isUploading && 0.5 }}>
        {isUploading && (
          <Box style={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        )}
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
                  <Typography variant="caption">{attributes.name}</Typography>
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
                    <Typography variant="caption">{file.name}</Typography>
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
        <Box border="dotted" p={1}>
          <input {...getInputProps()} />
          <Typography>
            {maxLength > 1 && !unlimited
              ? `Browse file here (Max ${maxLength} files)`
              : "Browse file here"}
          </Typography>
          <Typography>{"*Only jpeg, jpg, png *File size < 5MB"}</Typography>
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
