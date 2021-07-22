import React from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { Box } from "@material-ui/core";
import { BOOKS_GENRE } from "./../config";

const CategoryList = () => {
  return (
    <>
      <div className="full-height bg-grey">
        <Box className="pattern" pt={7} pb={3}>
          <Container maxWidth={"md"}>
            <Box className="heading-main">Gutenberg Project</Box>
            <Box mt={1} className="free-text">
              A social cataloging website that allows you to freely search its
              database of books, annotations, and reviews.
            </Box>
          </Container>
        </Box>
        <Box pt={3}>
          <Container maxWidth="md">
            <Grid container>
              {BOOKS_GENRE &&
                BOOKS_GENRE.map((gen, index) => {
                  return (
                    <Box
                      component={Grid}
                      md={6}
                      xs={12}
                      sm={12}
                      item
                      key={index}
                    >
                      <Box
                        m={2}
                        onClick={() => (window.location.pathname = `/${gen}`)}
                        className="genre-card"
                      >
                        <img
                          className="side-icons"
                          alt={gen}
                          src={`./images/${gen}.svg`}
                        ></img>
                        <span className="genre-name">{gen.toUpperCase()}</span>
                        <img
                          className="side-icons"
                          alt="back"
                          src={`./images/Next.svg`}
                        ></img>
                      </Box>
                    </Box>
                  );
                })}
            </Grid>
          </Container>
        </Box>
      </div>
    </>
  );
};

export default CategoryList;
