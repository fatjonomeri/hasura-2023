import { useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_REQUEST_ID,
  GET_ACQUIRED_BADGES
} from "../../state/GraphQL/Queries/Queries";
import { AuthContext } from "../../state/with-auth";
import CenteredLayout from "../../layouts/CenteredLayout";
import LoadableCurtain from "../../components/LoadableCurtain";
import AcquiredBadgesView from "../../views/engineer/AcquiredBadgesView";

const AcquiredBadgesContainer = () => {
  const { user_id } = useContext(AuthContext);
  const [requestId, setRequestId] = useState([]);

  const { loading, error, data, refetch } = useQuery(GET_REQUEST_ID);

  useEffect(() => {
    const arr = [];
    if (data) {
      data?.issuing_requests.map((d) => {
        arr.push(d.request_id);
      });
    }
    setRequestId(arr);
  }, [data]);

  const { data: acquiredBadgesData, refetch: refetchAcquiredBadges } = useQuery(
    GET_ACQUIRED_BADGES,
    {
      variables: {
        engineerId: user_id,
        id: requestId
      }
    }
  );

  useEffect(() => {
    refetch();
    refetchAcquiredBadges();
  }, [acquiredBadgesData]);

  console.log("acquiredBadges", acquiredBadgesData);

  if (loading)
    return (
      <CenteredLayout>
        <LoadableCurtain text="Your Badges" />
      </CenteredLayout>
    );
  if (error) return `Error! ${error.message}`;
  console.log("data", data?.issuing_requests);

  return <AcquiredBadgesView acquiredBadgesData={acquiredBadgesData} />;
};

export default AcquiredBadgesContainer;
