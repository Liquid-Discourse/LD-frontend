import React, { useEffect, useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import styled from "styled-components";
import { useAuth0 } from "../react-auth0-spa";
import TagSelect from "../components/tag-select";
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
const Text = styled.textarea`
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
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 5px;
  margin: 3%;
`;

const AddReview = (props) => {
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState("5");
  const [reviewTopicTags, setReviewTopicTags] = useState([]);
  const [affairTopicTags, setAffairTopicTags] = useState([]);
  const [countryTopicTags, setCountryTopicTags] = useState([]);
  const [genreTopicTags, setGenreTopicTags] = useState([]);
  const [book, setBook] = useState(null);
  const { getTokenSilently, user } = useAuth0();
  const history = useHistory();

  const createSelectTagFromBackendTag = (backendTag) => {
    return {
      value: backendTag.id,
      label: backendTag.name,
    };
  };

  useEffect(() => {
    const getBook = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/books/${props.match.params.bookId}`
      );
      setBook(response.data);
    };

    const getExistingInformation = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/book-reviews`,
        {
          params: {
            userId: user?.database?.id,
            bookId: props.match.params.bookId,
          },
        }
      );
      if (await (response.data && response.data.length)) {
        console.log("made it");
        const review = await response.data[0];
        await console.log("REVIEW", review);
        await setReviewRating(review.ratingOutOfTen.toString());
        await setReviewTopicTags(
          review.suggestedTags.length
            ? review.suggestedTags
                .filter((tag) => tag.type === "TOPIC")
                .map((tag) => {
                  createSelectTagFromBackendTag(tag);
                })
            : []
        );
        await setAffairTopicTags(
          review.suggestedTags.length
            ? review.suggestedTags
                .filter((tag) => tag.type === "AFFAIR")
                .map((tag) => createSelectTagFromBackendTag(tag))
            : []
        );
        await setCountryTopicTags(
          review.suggestedTags.length
            ? review.suggestedTags.map((tag) => {
                if (tag.type === "COUNTRY") {
                  return createSelectTagFromBackendTag(tag);
                }
              })
            : []
        );
        await setGenreTopicTags(
          review.suggestedTags.length
            ? review.suggestedTags.map((tag) => {
                if (tag.type === "GENRE") {
                  return createSelectTagFromBackendTag(tag);
                }
              })
            : []
        );
      }
    };

    getExistingInformation();
    getBook();
  }, []);

  const submit = async () => {
    const token = await getTokenSilently();

    const body = {
      bookId: props.match.params.bookId,
      ratingOutOfTen: parseInt(reviewRating),
      suggestedTags: reviewTopicTags.length
        ? reviewTopicTags.map((tag) => tag.value)
        : [],
    };

    await fetch(`${process.env.REACT_APP_API_URL}/book-reviews`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    history.push({ pathname: "/users/" + user?.database?.username });
  };

  return (
    <Container>
      <H3>Review "{book?.name}"</H3>
      <div style={{ display: "flex", justifyContent: "center", padding: "3%" }}>
        <input
          type="radio"
          checked={reviewRating === "1"}
          value={1}
          onClick={(e) => setReviewRating(e.target.value)}
        />
        <input
          type="radio"
          checked={reviewRating === "2"}
          value={2}
          onClick={(e) => setReviewRating(e.target.value)}
        />
        <input
          type="radio"
          checked={reviewRating === "3"}
          value={3}
          onClick={(e) => setReviewRating(e.target.value)}
        />
        <input
          type="radio"
          checked={reviewRating === "4"}
          value={4}
          onClick={(e) => setReviewRating(e.target.value)}
        />
        <input
          type="radio"
          checked={reviewRating === "5"}
          value={5}
          onClick={(e) => setReviewRating(e.target.value)}
        />
        <div>Review Rating: {reviewRating}</div>
      </div>
      <Text
        placeholder="Full text review"
        onChange={(e) => setReviewText(e.currentTarget.value)}
      />
      <div style={{ width: "500px" }}>
        <TagSelect
          type="AFFAIR"
          value={affairTopicTags}
          onChange={setAffairTopicTags}
        />
      </div>
      <div style={{ width: "500px" }}>
        <TagSelect
          type="TOPIC"
          value={reviewTopicTags}
          onChange={setReviewTopicTags}
        />
      </div>
      <div style={{ width: "500px" }}>
        <TagSelect
          type="COUNTRY"
          value={countryTopicTags}
          onChange={setCountryTopicTags}
        />
      </div>
      <div style={{ width: "500px" }}>
        <TagSelect
          type="GENRE"
          value={genreTopicTags}
          onChange={setGenreTopicTags}
        />
      </div>
      <Button onClick={submit}>Submit</Button>
    </Container>
  );
};

export default withRouter(AddReview);
