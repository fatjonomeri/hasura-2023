//prove 2
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useParams } from "react-router-dom";

// const GET_CANDIDATURES = gql`
//   query MyQuery($engineerId: Int!) {
//     badge_candidature_view(where: { engineer_id: { _eq: $engineerId } }) {
//       badge_title
//       badge_requirements
//       id
//       engineer_name
//       badge_title
//       badge_description
//     }
//   }
// `;

const GET_CANDIDATURES = gql`
  query MyQuery($engineerId: Int!, $badgeId: Int!) {
    badge_candidature_view(
      where: { engineer_id: { _eq: $engineerId }, badge_id: { _eq: $badgeId } }
    ) {
      badge_title
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
  const { badgeId } = useParams();
  const [evidenceDescription, setEvidenceDescription] = useState([]);
  const [showTextField, setShowTextField] = useState([]);
  const [showEvidences, setShowEvidences] = useState([]);
  const client = useApolloClient();

  // const candidatures = useQuery(GET_CANDIDATURES, {
  //   variables: { engineerId: user_id }
  // });
  const candidatures = useQuery(GET_CANDIDATURES, {
    variables: { engineerId: user_id, badgeId: badgeId }
  });

  console.log("candidatures", candidatures);

  const [appendEvidence] = useMutation(APPEND_EVIDENCE);
  const [setEvidence] = useMutation(SET_EVIDENCE);

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

  const handleEvidenceChange = (event, index) => {
    const updatedDescriptions = [...evidenceDescription];
    updatedDescriptions[index] = event.target.value;
    setEvidenceDescription(updatedDescriptions);
  };

  // const updateEvidenceShow = async (id) => {
  //   const { data: evidences } = await client.query({
  //     query: GET_EVIDENCES,
  //     variables: { id: id },
  //     fetchPolicy: "network-only"
  //   });

  //   setShowEvidences(
  //     evidences.badge_candidature_request[0].candidature_evidences
  //   );
  // };

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
    const updatedDescriptions = [...evidenceDescription];
    updatedDescriptions[index] = "";
    setEvidenceDescription(updatedDescriptions);
  };

  const handleEvidenceDelete = () => {
    console.log("delete evidences", showEvidences);
  };

  // const handleEvidenceEdit = () => {
  //   console.log("delete evidences", showEvidences);
  // };

  const [editIndex, setEditIndex] = useState(null);
  const handleEvidenceEdit = (index) => {
    setEditIndex(index);
  };

  return (
    <BasicPage fullpage title="Requirements" subtitle="Engineer">
      {candidatures?.data?.badge_candidature_view?.map((candidature_view) => {
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
                      <TableHead>
                        <TableRow>
                          <TableCell>Evidence</TableCell>
                          <TableCell>Edit</TableCell>
                          <TableCell>Delete</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {showEvidences &&
                          showEvidences
                            .filter((evidence) => evidence.reqId === req.id)
                            .map((evidence, index) => (
                              <TableRow key={index}>
                                {/* <TableCell>{evidence.description}</TableCell>
                                <TableCell>
                                  <Button
                                    onClick={handleEvidenceEdit}
                                    variant="outlined"
                                    size="small"
                                  >
                                    Edit
                                  </Button>
                                </TableCell> */}
                                {editIndex === index ? (
                                  <TableCell>
                                    <TextField
                                      id={`evidence-description-${index}`}
                                      variant="standard"
                                      value={evidence.description}
                                      onChange={(event) =>
                                        handleEvidenceChange(event, index)
                                      }
                                    />
                                  </TableCell>
                                ) : (
                                  <TableCell>{evidence.description}</TableCell>
                                )}
                                <TableCell>
                                  {editIndex === index ? (
                                    <Button
                                      onClick={() => handleEvidenceEdit(null)}
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
                                    onClick={() => handleEvidenceDelete(index)}
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
    </BasicPage>
  );
};

export default Requirements;
