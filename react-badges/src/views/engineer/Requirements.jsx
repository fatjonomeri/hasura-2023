import React, { useContext, useEffect, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import { AuthContext } from "../../state/with-auth";

const GET_USER = gql`
  query MyQuery($id: Int!) {
    users(where: { id: { _eq: $id } }) {
      name
    }
  }
`;

const GET_CANDIDATURES = gql`
  query MyQuery($engineer_name: String!) {
    badge_candidature_view(where: { engineer_name: { _eq: $engineer_name } }) {
      badge_requirements
      id
      engineer_name
      badge_title
      badge_description
    }
  }
`;

const Requirements = () => {
  const { id } = useContext(AuthContext);
  const [name, setName] = useState("");

  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: id }
  });

  useEffect(() => {
    if (data) {
      setName(data.users[0].name);
    }
  }, [data]);

  const canditatures = useQuery(GET_CANDIDATURES, {
    variables: { engineer_name: name }
  });

  console.log("candidatures", canditatures);

  return (
    <BasicPage fullpage title="New Connection" subtitle="Requirements">
      {id}
      <div></div>
      {name}
      <div></div>
      {canditatures?.data?.badge_candidature_view[0]?.badge_requirements.map(
        (req, index) => {
          return (
            <React.Fragment key={index}>
              <h2>
                {req.id} {req.title}
              </h2>
              <div></div>
              <h6>{req.description}</h6>
            </React.Fragment>
          );
        }
      )}
      {/* <button onClick={handleClick}>get candidatures</button> */}
    </BasicPage>
  );
};

export default Requirements;
