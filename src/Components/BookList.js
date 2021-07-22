import Container from "@material-ui/core/Container";
import { Box } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import CloseIcon from "@material-ui/icons/Close";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { GET_BOOKS_API, BOOK_TOPIC, BOOK_SEARCH } from "./../config";
import axios from "axios";
import { Waypoint } from "react-waypoint";
import { findValueByPrefix } from "./../utils";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "block ",
    textAlign: "center",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "inherit",
  },
}));
const BookList = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  //state array for list of books to be displayed
  const [bookData, setBookData] = useState([]);
  //state variable for page number which will be required for getting next page data
  const [page, setPage] = useState(1);
  //state variable for checking if next page is present
  const [isNextPage, setNext] = useState(true);
  //state variable  for filtering booklist
  const [searchText, setSearchText] = useState("");

  //search books by author or title
  const handleSearch = (event) => {
    var value = event.target.value;
    //update searchText variable
    setSearchText(value);
    setPage(1);
  };
  const handleClose = () => {
    document.getElementById("searchBox").value = "";
    setSearchText("");
    setPage(1);
  };

  var { genre } = props;

  useEffect(() => {
    getListData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const getListData = (isFilter) => {
    if (!isNextPage && page > 1) return;
    if (isFilter) setOpen(true);
    axios
      .get(
        GET_BOOKS_API.replace("[PAGE]", page) +
          BOOK_TOPIC.replace("[TOPIC]", genre) +
          BOOK_SEARCH.replace("[SEARCH]", searchText)
      )
      .then((response) => {
        //create a temp array from existing booklist state array
        var bookList = bookData.slice();
        //add the updated data to the temp array
        bookList = bookList.concat(response.data.results);
        //update the booklist state with updated temp array
        setBookData(isFilter ? response.data.results : bookList);
        //update the page number
        setPage((page) => page + 1);
        //update isNext state
        setNext(response.data.next !== null);
        setOpen(false);
      });
  };

  const loadNextData = () => {
    if (page > 1) getListData();
  };

  return (
    <>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress />
      </Backdrop>
      <Box key="box1" pt={7} pb={3}>
        <Container maxWidth={"md"}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
            }}
            className="sub-heading text-capitalize"
          >
            <img
              className="side-icons"
              alt="back"
              src={`./images/Back.svg`}
              onClick={() => (window.location.pathname = `/`)}
              style={{ cursor: "pointer" }}
            ></img>
            <Box ml={2}>{genre}</Box>
          </div>
          <FormControl fullWidth variant="outlined">
            <OutlinedInput
              id="searchBox"
              onChange={(value) => handleSearch(value)}
              className="txt-box"
              placeholder="Search"
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment
                  style={{ cursor: "pointer" }}
                  onClick={() => handleClose()}
                  position="end"
                >
                  <CloseIcon />
                </InputAdornment>
              }
              labelWidth={0}
            />
          </FormControl>
        </Container>
      </Box>
      <Box key="box2" pt={2} pb={2} className="bg-grey">
        <Container maxWidth={"md"}>
          <Box component={Grid} container>
            {bookData &&
              bookData.map((book, index) => {
                return <BookCard key={Math.random() + index} {...book} />;
              })}
            {isNextPage && (
              <Waypoint onEnter={loadNextData} bottomOffset="-200px">
                <Box component={Grid} item xs={12} key="spinner" lg={12}>
                  <div key={Math.random()} className={classes.root}>
                    {!open ? <CircularProgress /> : null}
                  </div>
                </Box>
              </Waypoint>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

const BookCard = ({ formats, authors, subject, title }) => {
  const handleNewTab = (urls) => {
    var href = "";
    var mediaType = ["text/html", "application/pdf", "text/plain"];
    var hrefArr = mediaType.map((fileType) => {
      href = findValueByPrefix(urls, fileType);
      var isZip = href
        ? href.split(".")[href.split(".").length - 1] === "zip"
        : false;
      return !isZip ? href : "";
    });
    if (hrefArr.some((href) => href && href !== "")) {
      for (let redirect of hrefArr) {
        if (redirect && redirect !== "") {
          window.open(redirect, "_blank");
          return;
        }
      }
    } else {
      alert("No viewable version available");
    }
  };
  return (
    <Box component={Grid} item xs={4} md={2} lg={2}>
      <div className="book-card" onClick={() => handleNewTab(formats)}>
        <img
          className="book-cover"
          src={findValueByPrefix(formats, "image")}
          alt="bookcover"
        ></img>
        <div className="book-name">{title}</div>
        <div className="book-author">
          {authors.map((auth, index) => {
            return <div key={index}> {auth.name}</div>;
          })}
        </div>
      </div>
    </Box>
  );
};

export default BookList;
