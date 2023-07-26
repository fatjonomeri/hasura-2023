import { useState } from "react";
import { useApolloClient, useMutation } from "@apollo/client";
import { SET_EVIDENCE } from "./GraphQL/Mutations/Mutations";

const useEvidenceEdit = () => {
  const [editIndex, setEditIndex] = useState(null);
  const client = useApolloClient();

  const [settingEvidence] = useMutation(SET_EVIDENCE);

  const onSubmitEvidenceEdit = (
    data,
    evidenceID,
    requestID,
    showEvidences,
    refetchEvidences
  ) => {
    const updatedEvidences = showEvidences.map((evidence) => {
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

  return { editIndex, onSubmitEvidenceEdit, setEditIndex };
};

export default useEvidenceEdit;
