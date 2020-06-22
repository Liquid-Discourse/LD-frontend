import React from "react";
import styled from "styled-components";
import useBook from "hooks/book-hook";

const Name = styled.div`
  font-size: 3.3vh;
  font-family: Montaga;
  margin-bottom: 10px;
`;

const Subtitle = styled.div`
  font-size: 13px;
  font-family: Poppins;
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  font-size: 15px;
  font-family: Poppins;
  display: flex;
  border-bottom: 1px solid grey;
  width: 100%;
  padding: 10px 12px;
`;

const Tag = styled.div`
  background-color: rgb(240, 240, 240);
  padding: 2px 3px;
  border-radius: 2px;
  margin: 5px;
`;

const Save = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  :hover {
    background-color: #64d8cb;
    padding: 5px;
    border-radius: 5px;
    opacity: 70%;
  }
`;

const Review = styled.div`
  font-family: Poppins;
  //box-shadow: 2px 2px 8px rgb(230, 230, 230);
  background-color: #efebe9;
  border-radius: 10px;
  width: 100%;
  margin-top: 2%;
  padding: 10px 12px;
  position: relative;
`;

const Book = (props) => {
  const { book, addToBookshelf } = useBook(props.match.params.id);

  return (
    <div style={{ marginRight: "10%", marginLeft: "10%", marginTop: "5%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "5%",
        }}
      >
        <div>
          <Name>{book?.name}</Name>
          <Subtitle>
            By:{" "}
            {book?.authors?.map((t, i) => (
              <div style={{ marginLeft: "3px" }} key={i}>
                {t}{" "}
              </div>
            ))}
          </Subtitle>
          <br />
          <Subtitle>ISBN: {book?.isbn}</Subtitle>
          <Subtitle>
            Topics:{" "}
            {book?.tags?.map((t, i) => (
              <Tag key={i}>{t.name} </Tag>
            ))}
          </Subtitle>
        </div>
        <Save onClick={addToBookshelf}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z" />
          </svg>
          <Subtitle>Save Book</Subtitle>
        </Save>
      </div>
      <div>
        <Title>Reviews </Title>
        {book?.reviews?.map((t, i) => (
          <Review key={i}>
            <div>
              {t.userWhoReviewed.firstName} {t.userWhoReviewed.restOfName}
            </div>
            <br />
            <div>Rating: {t.ratingOutOfFive}/5</div>
            <div>Description:</div>
            <div>{t.description}</div>
          </Review>
        ))}
      </div>
    </div>
  );
};

export default Book;