import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
} from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import image from "./bg.png";
const axios = require("axios").default;

const useStyles = makeStyles((theme) => ({
  grow: { flexGrow: 1 },
  root: { maxWidth: 345, flexGrow: 1 },
  media: { height: 400 },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  gridContainer: {
    justifyContent: "center",
    padding: "4em 1em 0 1em",
  },
  mainContainer: {
    backgroundImage: `url(${image})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    height: "93vh",
    marginTop: "8px",
  },
  imageCard: {
    margin: "auto",
    maxWidth: 400,
    height: 'auto',
    backgroundColor: 'transparent',
    boxShadow: '0px 9px 70px 0px rgb(0 0 0 / 30%) !important',
    borderRadius: '15px',
  },
  imageCardEmpty: {
    height: 'auto',
  },
  tableContainer: {
    backgroundColor: 'transparent !important',
    boxShadow: 'none !important',
  },
  tableCell: {
    fontSize: '22px',
    backgroundColor: 'transparent !important',
    color: '#000000a6 !important',
    fontWeight: 'bolder',
    padding: '1px 24px 1px 16px',
  },
  tableCell1: {
    fontSize: '14px',
    backgroundColor: 'transparent !important',
    color: '#000000a6 !important',
    fontWeight: 'bolder',
    padding: '1px 24px 1px 16px',
  },
  text: {
    color: 'white !important',
    textAlign: 'center',
  },
  detail: {
    backgroundColor: 'white',
  },
  appbar: {
    background: '#be6a77',
    boxShadow: 'none',
    color: 'white'
  },
  clearButton: {
    marginTop: theme.spacing(2),
    backgroundColor: '#be6a77',
    color: 'white',
    '&:hover': {
      backgroundColor: '#a94f5c',
    },
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  let confidence = 0;

  const sendFile = useCallback(() => {
    const upload = async () => {
      if (image && selectedFile) {
        let formData = new FormData();
        formData.append("file", selectedFile);
        try {
          const res = await axios.post(process.env.REACT_APP_API_URL, formData);
          if (res.status === 200) {
            setData(res.data);
          }
        } catch (err) {
          console.error("Error uploading image:", err);
        }
      }
    };
    upload();
  }, [image, selectedFile]);

  useEffect(() => {
    if (!preview) return;
    sendFile();
  }, [preview, sendFile]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setPreview(URL.createObjectURL(files[0]));
    setData(undefined);
    setImage(true);
  };

  const handleClear = () => {
    setSelectedFile(undefined);
    setPreview(undefined);
    setData(undefined);
    setImage(false);
  };

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            Potato Disease Classification
          </Typography>
          <div className={classes.grow} />
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} className={classes.mainContainer} disableGutters={true}>
        <Grid
          className={classes.gridContainer}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={12}>
            <Card className={`${classes.imageCard} ${!image ? classes.imageCardEmpty : ''}`} style={{height:"100%"}}>
              {image && (
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={preview}
                    component="img"
                    title="Potato Leaf"
                  />
                </CardActionArea>
              )}

              {!image && (
                <CardContent className={classes.content}>
                  <DropzoneArea
                    acceptedFiles={['image/*']}
                    dropzoneText={"Drag and drop an image of a potato plant leaf to process"}
                    onChange={onSelectFile}
                  />
                </CardContent>
              )}

              {data && (
                <CardContent className={classes.detail}>
                  <Typography
                    variant="h6"
                    align="center"
                    style={{ fontWeight: 'bold', color: '#4a4a4a', marginBottom: '8px' }}
                  >
                    Classification Result
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    align="center"
                    style={{ color: '#3c3c3c' }}
                  >
                    <strong>Label:</strong> {data.class}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    align="center"
                    style={{ color: '#3c3c3c' }}
                  >
                    <strong>Confidence:</strong> {confidence}%
                  </Typography>
                </CardContent>
              )}


              {image && (
                <Button className={classes.clearButton} onClick={handleClear}>
                  Clear
                </Button>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};
