import { gql, useQuery, useMutation } from "@apollo/client";
import { TextField, FormGroup, Button } from "@mui/material";
import BasicPage from "../../layouts/BasicPage/BasicPage";

const GET_BADGES_VERSIONS = gql`
  query MyQuery {
    badges_versions_last {
      id
      title
      description
      requirements
    }
  }
`;

const ADD_REQUEST = gql`
  mutation MyMutation(
    $badge_id: Int!
    $manager: Int!
    $proposal_description: String!
    $badge_version: timestamp
  ) {
    insert_engineer_to_manager_badge_candidature_proposals_one(
      object: {
        badge_id: $badge_id
        manager: $manager
        proposal_description: $proposal_description
        badge_version: $badge_version
      }
    ) {
      id
    }
  }
`;
const Engineer = () => {
  const r3 = useQuery(GET_BADGES_VERSIONS);
  const [addRequest, r4] = useMutation(ADD_REQUEST);
  console.log("data:", r3);

  const dothis = () => {
    addRequest({
      variables: {
        badge_id: 1,
        manager: 1,
        proposal_description: "abc",
        badge_version: "2023-07-11 13:44:28.664001"
      }
    });
  };
  console.log("aa");

  return (
    <BasicPage fullpage title="New Connection" subtitle="Engineer">
      <div>
        <h4>Badges Versionsssss</h4>
        {r3.data?.badges_versions_last.map((badge) => (
          <div key={badge.id}>
            <h5>{badge.title}</h5>
            <p>{badge.description}</p>
            <form>
              <FormGroup>
                <TextField
                  id="outlined-basic"
                  label="Motivation Description"
                  variant="outlined"
                />
              </FormGroup>
            </form>
            <Button variant="contained" onClick={dothis}>
              Apply
            </Button>
          </div>
        ))}
      </div>
      <hr />
    </BasicPage>
  );
};

export default Engineer;
