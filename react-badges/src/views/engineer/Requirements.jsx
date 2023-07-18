import React, { lazy, useContext, useEffect, useState } from "react";
import {
  gql,
  useQuery,
  useMutation,
  useApolloClient,
  useLazyQuery
} from "@apollo/client";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import { AuthContext } from "../../state/with-auth";
import { Button, TextField } from "@mui/material";
// import { useForm } from "react-hook-form";
// import { DevTool } from "@hookform/devtools";
import { v4 as uuidv4 } from "uuid";

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

const GET_EVIDENCES = gql`
  query MyQuery($id: Int!) {
    badge_candidature_request(where: { id: { _eq: $id } }) {
      candidature_evidences
    }
  }
`;

const APPEND_EVIDENCE = gql`
  mutation MyMutation($candidature_evidences: jsonb, $id: Int!) {
    update_badge_candidature_request(
      where: { id: { _eq: $id } }
      _append: { candidature_evidences: $candidature_evidences }
    ) {
      returning {
        candidature_evidences
      }
    }
  }
`;

const SET_EVIDENCE = gql`
  mutation SetEvidence($candidature_evidences: jsonb, $id: Int!) {
    update_badge_candidature_request(
      where: { id: { _eq: $id } }
      _set: { candidature_evidences: $candidature_evidences }
    ) {
      returning {
        candidature_evidences
      }
    }
  }
`;

const Requirements = () => {
  const { user_id } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [evidenceDescription, setEvidenceDescription] = useState([]);
  const [showTextField, setShowTextField] = useState([]);
  const [showEvidences, setShowEvidences] = useState([]);
  const [showEditField, setShowEditField] = useState([]);
  const [evidenceEdit, setEvidenceEdit] = useState([]);
  // const { register, handleSubmit, setValue } = useForm();
  const client = useApolloClient();

  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: user_id }
  });

  useEffect(() => {
    if (data) {
      setName(data.users[0].name);
    }
  }, [data]);

  const candidatures = useQuery(GET_CANDIDATURES, {
    variables: { engineer_name: name }
  });

  console.log("candidatures", candidatures);

  const [appendEvidence] = useMutation(APPEND_EVIDENCE);
  const [setEvidence] = useMutation(SET_EVIDENCE);

  const updateTextFieldState = (index, value) => {
    setShowTextField((prevArray) => {
      // Create a new array with the same length as the previous state
      const newArray = [...prevArray];
      // Update the value of the specific element
      newArray[index] = value;
      return newArray;
    });
    console.log("textfieldstate", showTextField);
  };

  // const [lazyEvidences, { data: evidences, refetch }] =
  //   useLazyQuery(GET_EVIDENCES);

  // useEffect(() => {
  //   lazyEvidences({ variables: { id: 1 } }).then((result) => {
  //     setShowEvidences(
  //       result.badge_candidature_request[0].candidature_evidences
  //     );
  //     console.log("lazyev", result);
  //   });
  // }, [evidences]);

  const { data: evidences, refetch: refetchEvidences } = useQuery(
    GET_EVIDENCES,
    {
      variables: { id: 1 },
      fetchPolicy: "network-only"
    }
  );

  useEffect(() => {
    if (evidences) {
      setShowEvidences(
        evidences.badge_candidature_request[0].candidature_evidences
      );
      console.log(
        "inittial ev",
        evidences.badge_candidature_request[0].candidature_evidences
      );
    }
  }, [evidences]);

  const updateEvidenceShow = async (id) => {
    const { data: evidences } = await client.query({
      query: GET_EVIDENCES,
      variables: { id: id },
      fetchPolicy: "network-only"
    });

    setShowEvidences(
      evidences.badge_candidature_request[0].candidature_evidences
    );
  };

  const addEvidences = async (id, reqId, index) => {
    const { data: evidences } = await client.query({
      query: GET_EVIDENCES,
      variables: { id: id },
      fetchPolicy: "network-only"
    });

    setShowEvidences(
      evidences.badge_candidature_request[0].candidature_evidences
    );

    console.log(
      "evvv",
      evidences.badge_candidature_request[0].candidature_evidences
    );
    if (evidences.badge_candidature_request[0].candidature_evidences !== null) {
      console.log(
        "evidences: ",
        evidences.badge_candidature_request[0].candidature_evidences
      );
      appendEvidence({
        variables: {
          candidature_evidences: {
            id: uuidv4(),
            reqId: reqId,
            description: evidenceDescription[index]
          },
          id: id
        }
      }).then((result) => {
        setShowEvidences(
          result.data.update_badge_candidature_request.candidature_evidences
        );
        refetchEvidences();
      });
      console.log("appending");
    } else {
      setEvidence({
        variables: {
          candidature_evidences: [
            {
              id: uuidv4(),
              reqId: reqId,
              description: evidenceDescription[index]
            }
          ],
          id: id
        }
      }).then((result) => {
        setShowEvidences(
          result.data.update_badge_candidature_request.candidature_evidences
        );
        refetchEvidences();
      });
      console.log("setting");
    }
    updateTextFieldState(index, false);
    const updatedDescriptions = [...evidenceDescription];
    updatedDescriptions[index] = "";
    setEvidenceDescription(updatedDescriptions);
    updateEvidenceShow(id);
    console.log("evidencesss", showEvidences);
  };

  const handleEvidenceChange = (event, index) => {
    const updatedDescriptions = [...evidenceDescription];
    updatedDescriptions[index] = event.target.value;
    console.log("updatedDescriptions", updatedDescriptions);
    setEvidenceDescription(updatedDescriptions);
  };

  const handleEvidenceEditChange = (event, evidenceID, reqID) => {
    const newEdit = {
      id: evidenceID,
      reqId: reqID,
      description: event.target.value
    };

    const updatedEdits = [...evidenceEdit, newEdit];

    const updatedEdits1 = updatedEdits.filter((obj) => obj.id !== evidenceID);
    updatedEdits1.push(newEdit);

    console.log("updatedEdits1", updatedEdits1);
    //const updatedEdits = [...evidenceEdit, newEdit];
    // updatedEdits[evidenceID] = event.target.value;
    // console.log("updatedEdits[evidenceID]", event.target.value);
    //console.log("updatedEdits", updatedEdits);
    setEvidenceEdit(updatedEdits1);
  };

  const handleEvidenceEdit = (index, value) => {
    setShowEditField((prevArray) => {
      const newArray = [...prevArray];
      newArray[index] = value;
      return newArray;
    });
  };

  const finishEditEvidences = (id, candidature_viewID) => {
    console.log("evidenceEdit", evidenceEdit);
    let i = 0;
    const updatedEvidences = showEvidences.map((evidence, index) => {
      if (evidence.id === id) {
        const _ = evidenceEdit[i];
        i = i + 1;
        return _;
      }
      return evidence;
    });

    console.log("updatedEvidences", updatedEvidences);

    setEvidence({
      variables: {
        candidature_evidences: updatedEvidences,
        id: candidature_viewID
      }
    });
    console.log("edited evidence");
  };

  const handleEvidenceDelete = (evidenceID, id) => {
    const evidencesAfterDelete = showEvidences.filter(
      (ev) => ev.id !== evidenceID
    );
    console.log("evidencesAfterDelete", showEvidences);
    setEvidence({
      variables: {
        candidature_evidences: evidencesAfterDelete,
        id: id
      }
    });
    refetchEvidences();
  };

  return (
    <BasicPage fullpage title="New Connection" subtitle="Requirements">
      {user_id}
      <div></div>
      {name}
      <div></div>
      {candidatures?.data?.badge_candidature_view?.map((candidature_view) => {
        return candidature_view.badge_requirements.map((req, index) => {
          return (
            <React.Fragment key={index}>
              <h2>
                {req.id} {req.title}
              </h2>
              <div></div>
              <h6>{req.description}</h6>
              {showTextField[index] && (
                <>
                  <TextField
                    id={`outlined-basic-${req.id}`}
                    label="Evidence Description"
                    variant="outlined"
                    value={evidenceDescription[index] || ""}
                    onChange={(event) => handleEvidenceChange(event, index)}
                  />
                  <Button
                    onClick={() =>
                      addEvidences(candidature_view.id, req.id, index)
                    }
                  >
                    Submit evidence
                  </Button>
                </>
              )}
              <Button onClick={() => updateTextFieldState(index, true)}>
                Add evidences
              </Button>
              <div>
                {showEvidences &&
                  showEvidences
                    .filter((evidence) => evidence.reqId === req.id)
                    .map((evidence, index) => (
                      <React.Fragment key={evidence.id}>
                        <p>
                          reqId: {evidence.reqId} - Description:{" "}
                          {evidence.description}
                        </p>
                        <Button onClick={() => handleEvidenceEdit(index, true)}>
                          Edit
                        </Button>
                        <Button
                          onClick={() =>
                            handleEvidenceDelete(
                              evidence.id,
                              candidature_view.id
                            )
                          }
                        >
                          Delete
                        </Button>
                        {showEditField[index] && (
                          <>
                            <TextField
                              id={`outlined-basic-${evidence.id}`}
                              label="Evidence Description"
                              variant="outlined"
                              // value={evidenceEdit[evidence.id].description}
                              onChange={(event) =>
                                handleEvidenceEditChange(
                                  event,
                                  evidence.id,
                                  req.id
                                )
                              }
                            />
                            <Button
                              onClick={() =>
                                finishEditEvidences(
                                  evidence.id,
                                  candidature_view.id
                                )
                              }
                            >
                              Edit evidence
                            </Button>
                          </>
                        )}
                      </React.Fragment>
                    ))}
              </div>
            </React.Fragment>
          );
        });
      })}

      {/* <button onClick={handleClick}>get candidatures</button> */}
    </BasicPage>
  );
};

export default Requirements;
