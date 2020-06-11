import React, { useEffect, useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  margin: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  min-width: 40vw;
  font-family: poppins;
  border: 1px solid #bdbdbd;
  border-radius: 5px;
  padding-left: 5px;
  padding: 10px;
`;

const H3 = styled.h3`
  font-family: Montaga;
  font-weight: normal;
  font-size: 3.3vh;
`;

const Button = styled.button`
  font-family: Poppins;
  font-weight: normal;
  background-color: #bdbdbd;
  border: 1px solid white;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 5px;
  margin: 3%;
`;

const SearchResult = styled.div`
  word-wrap: break-word;
  font-family: Poppins;
  min-width: 45vw;
  :hover {
    background-color: rgb(240, 240, 240);
  }
`;

const SearchBook = () => {
  const [bookFound, setBookFound] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  let history = useHistory();

  const searchBook = async () => {
    console.log("search");
    let url = new URL("https://www.googleapis.com/books/v1/volumes?");
    url.searchParams.append("q", searchValue);
    console.log(url);
    let response = await fetch(url);
    let answer = await response.json();
    console.log(answer);
    setBookFound(answer.items);
  };

  const checkBook = async (book) => {
    console.log("checkbook", book.id);
    let response = await axios.post(
      `${process.env.REACT_APP_API_URL}/books/getonebook`,
      {
        isbn: book.volumeInfo.industryIdentifiers[1].identifier,
      }
    );
    console.log("response", response);
    if (response.data == "") {
      console.log("made it through");
      let response = await axios.post(
        `${process.env.REACT_APP_API_URL}/books`,
        {
          isbn: book.volumeInfo.industryIdentifiers[1].identifier,
          name: book.volumeInfo.title,
          author: book.volumeInfo.authors,
        }
      );
      history.push({ pathname: "/add-review/" + response.data.id });
    } else {
      history.push({ pathname: "/add-review/" + response.data.id });
    }
  };

  return (
    <Container>
      <H3>Search for a book:</H3>
      <br />
      <div style={{ display: "flex", alignItems: "center" }}>
        <Input
          placeholder="Search by book, author, or ISBN"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Button onClick={searchBook}>Submit</Button>
      </div>
      {bookFound != null ? (
        <div>
          {bookFound.map((b, i) => (
            <SearchResult onClick={() => checkBook(b)}>
              <div key={i}>{b.volumeInfo.title}</div>
              {b.volumeInfo.authors != undefined ? (
                <div style={{ display: "flex", fontSize: "12px" }}>
                  By
                  <div style={{ display: "flex" }}>
                    {b.volumeInfo.authors.map((a, i) => (
                      <div key={i}>&nbsp; {a}</div>
                    ))}
                  </div>
                </div>
              ) : (
                <div />
              )}
              <hr />
            </SearchResult>
          ))}
        </div>
      ) : (
        <div />
      )}
    </Container>
  );
};

export default SearchBook;