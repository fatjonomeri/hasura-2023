import React, { useEffect, useState } from "react";
import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useForm, Controller } from "react-hook-form";
import { GET_EVIDENCES } from "../../state/GraphQL/Queries/Queries";
import {
  APPEND_EVIDENCE,
  SET_EVIDENCE,
  ISSUE_REQUEST
} from "../../state/GraphQL/Mutations/Mutations";
import RequirementsView from "../../views/engineer/RequirementsView";

const RequirementsContainer = () => {
  const { requestID } = useParams();
  const [showEvidences, setShowEvidences] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const client = useApolloClient();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [errorSnackbar, setErrorSnackbar] = useState(false);

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

  const handleEvidenceDelete = (evidenceID) => {
    console.log("evid delete", evidenceID);
    const evidencesAfterDelete = showEvidences.filter(
      (evidence) => evidence.id !== evidenceID
    );
    setShowEvidences(evidencesAfterDelete);
    settingEvidence({
      variables: {
        candidature_evidences: evidencesAfterDelete,
        id: parseInt(requestID)
      }
    });
  };

  const handleIssueRequest = () => {
    console.log("show evidence issue", showEvidences);
    if (showEvidences != null && showEvidences.length > 0) {
      issueRequest({ variables: { id: parseInt(requestID) } }).then(() =>
        navigate(`/engineer/issuing-request`, { state: { snack } })
      );
      const snack = {
        snack: true
      };
    } else {
      setErrorSnackbar(true);
      console.log("err snack", errorSnackbar);
    }
  };

  return (
    <RequirementsView
      forms={forms}
      showEvidences={showEvidences}
      editIndex={editIndex}
      showSkeleton={showSkeleton}
      errors_ev={errors_ev}
      handleSubmit_ev={handleSubmit_ev}
      onSubmit_ev={onSubmit_ev}
      handleEvidenceEdit={handleEvidenceEdit}
      handleEvidenceDelete={handleEvidenceDelete}
      handleIssueRequest={handleIssueRequest}
      register={register}
      setEditIndex={setEditIndex}
      errorSnackbar={errorSnackbar}
      setErrorSnackbar={setErrorSnackbar}
    />
  );
};

export default RequirementsContainer;
