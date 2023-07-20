import React, { useContext, useEffect, useState } from "react";
import {
  gql,
  useQuery,
  useMutation,
  useApolloClient,
  useLazyQuery
} from "@apollo/client";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import { AuthContext } from "../../state/with-auth";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useParams } from "react-router-dom";
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

const ISSUE_REQUEST = gql`
  mutation MyMutation($id: Int!) {
    update_badge_candidature_request_by_pk(
      pk_columns: { id: $id }
      _set: { is_issued: true }
    ) {
      id
    }
  }
`;

const Requirements = () => {
  const { user_id } = useContext(AuthContext);
  const { requestID } = useParams();
  const [name, setName] = useState("");
  const [evidenceDescription, setEvidenceDescription] = useState([]);
  const [showEvidences, setShowEvidences] = useState([]);
  const [evidenceEdit, setEvidenceEdit] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const client = useApolloClient();
  const navigate = useNavigate();

  console.log("reqqqqid", requestID);

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

  //console.log("candidatures", candidatures);

  const [appendEvidence] = useMutation(APPEND_EVIDENCE);
  const [setEvidence] = useMutation(SET_EVIDENCE);
  const [issueRequest] = useMutation(ISSUE_REQUEST);

  const { data: evidences, refetch: refetchEvidences } = useQuery(
    GET_EVIDENCES,
    {
      variables: { id: parseInt(requestID) },
      fetchPolicy: "network-only"
    }
  );

  useEffect(() => {
    if (evidences) {
      setShowEvidences(
        evidences.badge_candidature_request[0].candidature_evidences
      );
    }
    console.log("evidences:", evidences);
  }, [evidences]);

  const addEvidences = async (id, reqId, index) => {
    const { data: evidences } = await client.query({
      query: GET_EVIDENCES,
      variables: { id: id },
      fetchPolicy: "network-only"
    });

    setShowEvidences(
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
    //updateTextFieldState(index, false);
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
    // const newEdit = {
    //   id: evidenceID,
    //   reqId: reqID,
    //   description: event.target.value
    // };
    // const updatedEdits = [...showEvidences, newEdit];
    // const updatedEdits1 = updatedEdits.filter((obj) => obj.id !== evidenceID);
    // updatedEdits1.push(newEdit);
    // setEvidenceEdit(updatedEdits1);

    const updatedEdits = showEvidences.map((evidence) => {
      if (evidence.id === evidenceID) {
        return {
          id: evidenceID,
          reqId: reqID,
          description: event.target.value
        };
      }
      return evidence;
    });

    const n = showEvidences.map((evidence) => {
      if (evidence.id === evidenceID) {
        return {
          id: evidenceID,
          reqId: reqID,
          description: event.target.value
        };
      }
      return evidence;
    });
    setShowEvidences(n);
    setEvidenceEdit(updatedEdits);
    console.log("evi edit", evidenceEdit);
    console.log("showEvidences", showEvidences);
  };

  const handleEvidenceEdit = (index) => {
    setEditIndex(index);
  };

  const finishEditEvidences = (id, candidature_viewID) => {
    console.log("evidenceEdit", evidenceEdit);
    // let i = 0;
    const updatedEvidences = showEvidences.map((evidence, index) => {
      if (evidence.id === id) {
        const _ = evidenceEdit.filter((ev) => ev.id === evidence.id);
        console.log("_", _);
        return _[0];
      }
      return evidence;
    });

    console.log("updatedEvidences", updatedEvidences);

    setEvidence({
      variables: {
        candidature_evidences: updatedEvidences,
        id: candidature_viewID
      }
    })
      .then(() => {
        handleEvidenceEdit(id, false);
        setEditIndex(null);
        refetchEvidences();
        console.log("edited evidence");
      })
      .catch((error) => {
        console.error("Error updating evidences:", error);
      });
  };

  const handleEvidenceDelete = (evidenceID, id) => {
    const evidencesAfterDelete = showEvidences.filter(
      (ev) => ev.id !== evidenceID
    );
    console.log("evidencesAfterDelete", evidencesAfterDelete);
    setShowEvidences(evidencesAfterDelete);
    setEvidence({
      variables: {
        candidature_evidences: evidencesAfterDelete,
        id: id
      }
    });
    // refetchEvidences();
  };

  const handleIssueRequest = () => {
    console.log("reqid", requestID);
    issueRequest({ variables: { id: parseInt(requestID) } });
    navigate(-1);
  };

  if (candidatures.loading) return "loading...";
  if (candidatures.error) throw candidatures.error;

  return (
    <BasicPage fullpage title="Requirements" subtitle="Engineer">
      {candidatures.data.badge_candidature_view.map((candidature_view) => {
        return candidature_view.badge_requirements.map((req, index) => {
          return (
            <React.Fragment key={index}>
              <Accordion sx={{ mt: "12px" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{req.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="grey"
                      marginBottom="10px"
                      style={{ marginTop: "5px" }}
                    >
                      {req.description}
                    </Typography>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                    >
                      <TextField
                        id={`outlined-basic-${req.id}`}
                        label="Evidence Description"
                        variant="outlined"
                        value={evidenceDescription[index] || ""}
                        onChange={(event) => handleEvidenceChange(event, index)}
                        style={{ marginBottom: "10px" }}
                      />
                      <Button
                        onClick={() =>
                          addEvidences(candidature_view.id, req.id, index)
                        }
                        style={{ marginBottom: "10px" }}
                      >
                        Submit Evidence
                      </Button>
                    </div>

                    <Table>
                      {showEvidences &&
                        showEvidences.filter(
                          (evidence) => evidence.reqId === req.id
                        ).length > 0 && (
                          <TableHead>
                            <TableRow>
                              <TableCell>Evidence</TableCell>
                              <TableCell>Edit</TableCell>
                              <TableCell>Delete</TableCell>
                            </TableRow>
                          </TableHead>
                        )}
                      <TableBody>
                        {showEvidences &&
                          showEvidences
                            .filter((evidence) => evidence.reqId === req.id)
                            .map((evidence, index) => (
                              <TableRow key={index}>
                                {editIndex === index ? (
                                  <TableCell>
                                    <TextField
                                      id={`evidence-description-${index}`}
                                      variant="standard"
                                      value={
                                        evidenceEdit.find(
                                          (edit) =>
                                            edit.id === evidence.id &&
                                            edit.reqId === req.id
                                        )?.description ||
                                        "" ||
                                        evidence.description
                                      }
                                      onChange={(event) =>
                                        handleEvidenceEditChange(
                                          event,
                                          evidence.id,
                                          req.id
                                        )
                                      }
                                    />
                                  </TableCell>
                                ) : (
                                  <TableCell>{evidence.description}</TableCell>
                                )}
                                <TableCell>
                                  {editIndex === index ? (
                                    <Button
                                      onClick={() =>
                                        finishEditEvidences(
                                          evidence.id,
                                          candidature_view.id
                                        )
                                      }
                                      variant="outlined"
                                      size="small"
                                    >
                                      Save
                                    </Button>
                                  ) : (
                                    <Button
                                      onClick={() => handleEvidenceEdit(index)}
                                      variant="outlined"
                                      size="small"
                                    >
                                      Edit
                                    </Button>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    onClick={() =>
                                      handleEvidenceDelete(
                                        evidence.id,
                                        candidature_view.id
                                      )
                                    }
                                    variant="outlined"
                                    size="small"
                                  >
                                    Delete
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionDetails>
              </Accordion>
            </React.Fragment>
          );
        });
      })}
      <Button variant="contained" onClick={handleIssueRequest}>
        Issue Request
      </Button>
    </BasicPage>
  );
};

export default Requirements;
