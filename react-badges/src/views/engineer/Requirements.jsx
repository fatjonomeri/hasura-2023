import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormHelperText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useForm, Controller } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { Skeleton } from "@mui/material";
import { GET_EVIDENCES } from "../../state/GraphQL/Queries/Queries";
import {
  APPEND_EVIDENCE,
  SET_EVIDENCE,
  ISSUE_REQUEST
} from "../../state/GraphQL/Mutations/Mutations";

const EvidenceSkeleton = () => {
  return (
    <Skeleton variant="rectangular" width="100%" height={40} animation="wave" />
  );
};

const Requirements = () => {
  const { requestID } = useParams();
  const [showEvidences, setShowEvidences] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const client = useApolloClient();
  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    register,
    control: control_ev,
    formState: { errors: errors_ev },
    handleSubmit: handleSubmit_ev
  } = useForm({
    mode: "onChange"
  });

  const forms = state.map((req) => {
    const {
      control,
      handleSubmit,
      formState: { errors },
      reset
    } = useForm();

    const onSubmit = async (data, reqID) => {
      setShowSkeleton(true);
      const { data: evidences } = await client.query({
        query: GET_EVIDENCES,
        variables: { id: parseInt(requestID) },
        fetchPolicy: "network-only"
      });
      setShowEvidences(
        evidences.badge_candidature_request[0].candidature_evidences
      );
      if (
        evidences.badge_candidature_request[0].candidature_evidences !== null
      ) {
        appendingEvidence({
          variables: {
            candidature_evidences: {
              id: uuidv4(),
              reqId: reqID,
              description: data[`evidenceDescription_${reqID}`]
            },
            id: parseInt(requestID)
          }
        }).then((result) => {
          setShowEvidences(
            result.data.update_badge_candidature_request.candidature_evidences
          );
          refetchEvidences();
        });
      } else {
        settingEvidence({
          variables: {
            candidature_evidences: [
              {
                id: uuidv4(),
                reqId: reqID,
                description: data[`evidenceDescription_${reqID}`]
              }
            ],
            id: parseInt(requestID)
          }
        }).then((result) => {
          setShowEvidences(
            result.data.update_badge_candidature_request.candidature_evidences
          );
          refetchEvidences();
        });
      }
      reset({ [`evidenceDescription_${reqID}`]: "" });
    };

    return {
      req,
      control,
      handleSubmit,
      errors,
      onSubmit
    };
  });

  const [appendingEvidence] = useMutation(APPEND_EVIDENCE);
  const [settingEvidence] = useMutation(SET_EVIDENCE);
  const [issueRequest] = useMutation(ISSUE_REQUEST);

  const {
    data: evidences,
    loading,
    refetch: refetchEvidences
  } = useQuery(GET_EVIDENCES, {
    variables: { id: parseInt(requestID) },
    fetchPolicy: "network-only"
  });

  useEffect(() => {
    if (evidences) {
      setShowEvidences(
        evidences.badge_candidature_request[0].candidature_evidences
      );
      setShowSkeleton(false);
    }
  }, [evidences]);

  const handleEvidenceEdit = (evidenceId) => {
    setEditIndex(evidenceId);
  };

  const onSubmit_ev = (data, evidenceID) => {
    console.log("data_ev", data);

    const updatedEvidences = showEvidences.map((evidence, index) => {
      if (evidence.id === evidenceID) {
        const newEv = {
          id: evidenceID,
          reqId: evidence.reqId,
          description: data[evidenceID]
        };
        return newEv;
      }
      return evidence;
    });
    settingEvidence({
      variables: {
        candidature_evidences: updatedEvidences,
        id: parseInt(requestID)
      }
    }).then(() => {
      setEditIndex(null);
      refetchEvidences();
    });
  };

  const handleEvidenceDelete = (evidenceID, id) => {
    const evidencesAfterDelete = showEvidences.filter(
      (ev) => ev.id !== evidenceID
    );
    setShowEvidences(evidencesAfterDelete);
    settingEvidence({
      variables: {
        candidature_evidences: evidencesAfterDelete,
        id: id
      }
    });
  };

  const handleIssueRequest = () => {
    issueRequest({ variables: { id: parseInt(requestID) } }).then(() =>
      navigate(`/engineer/issuing-request`, { state: { snack } })
    );
    const snack = {
      snack: true
    };
  };

  return (
    <BasicPage fullpage title="Requirements">
      {forms.map(({ req, control, handleSubmit, errors, onSubmit }, index) => (
        <React.Fragment key={req.id}>
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
                  <form
                    onSubmit={handleSubmit((data) => onSubmit(data, req.id))}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Controller
                      name={`evidenceDescription_${req.id}`}
                      control={control}
                      rules={{ required: `Evidence is required` }}
                      render={({ field }) => (
                        <>
                          <TextField
                            {...field}
                            id={`evidence_${req.id}`}
                            label="Evidence Description"
                            variant="standard"
                            style={{ marginBottom: "10px" }}
                            helperText={
                              errors?.[`evidenceDescription_${req.id}`]
                                ?.message || ""
                            }
                            error={Boolean(
                              errors?.[`evidenceDescription_${req.id}`]
                            )}
                          />
                        </>
                      )}
                    />

                    <Button type="submit">Add</Button>
                  </form>
                  <DevTool control={control} />
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
                    {showSkeleton ? (
                      // Display skeleton while loading
                      <TableRow key={index}>
                        <TableCell>
                          <EvidenceSkeleton />
                        </TableCell>
                        <TableCell>
                          <EvidenceSkeleton />
                        </TableCell>
                        <TableCell>
                          <EvidenceSkeleton />
                        </TableCell>
                      </TableRow>
                    ) : (
                      showEvidences &&
                      showEvidences
                        .filter((evidence) => evidence.reqId === req.id)
                        .map((evidence, index) => (
                          <TableRow key={evidence.id}>
                            {editIndex === evidence.id ? (
                              <TableCell>
                                <form
                                  id="evidence_form"
                                  onSubmit={handleSubmit_ev((data) =>
                                    onSubmit_ev(data, evidence.id)
                                  )}
                                >
                                  <TextField
                                    {...register(`[${evidence.id}]`, {
                                      required: true
                                    })}
                                    id={`evidence-description-${index}`}
                                    variant="standard"
                                    defaultValue={evidence.description}
                                    error={!!errors_ev[evidence.id]}
                                  />
                                </form>
                                <DevTool control={control_ev} />
                                {errors_ev[evidence.id] && (
                                  <FormHelperText error>
                                    This field is required
                                  </FormHelperText>
                                )}
                              </TableCell>
                            ) : (
                              <TableCell>{evidence.description}</TableCell>
                            )}
                            <TableCell>
                              {editIndex === evidence.id ? (
                                <>
                                  <Button
                                    type="submit"
                                    form="evidence_form"
                                    variant="outlined"
                                    size="small"
                                    color="success"
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    onClick={() => setEditIndex(null)}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                      marginLeft: "10px"
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  type="button"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    handleEvidenceEdit(evidence.id);
                                  }}
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
                                    parseInt(requestID)
                                  )
                                }
                                variant="outlined"
                                size="small"
                                color="error"
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </AccordionDetails>
          </Accordion>
        </React.Fragment>
      ))}
      <Button
        variant="contained"
        size="small"
        onClick={handleIssueRequest}
        style={{ margin: "20px auto 0", display: "block" }}
      >
        Issue Request
      </Button>
    </BasicPage>
  );
};

export default Requirements;
