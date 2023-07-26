import BasicPage from "../../layouts/BasicPage/BasicPage";
import InfoAlert from "../../components/ComponentsEngineer/Alert";
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const AcquiredBadgesView = ({ acquiredBadgesData }) => {
  return (
    <BasicPage fullpage title="Your Badges">
      <>
        <Typography variant="body1" gutterBottom sx={{ marginTop: "10px" }}>
          These are the list of all the badges you have successfully acquired so
          far. Each badge represents a significant milestone in your
          professional journey, reflecting your dedication, expertise, and
          continuous pursuit of excellence.
        </Typography>
        {acquiredBadgesData?.badge_candidature_view?.length === 0 ? (
          <InfoAlert message={` You don't have any badge!`} />
        ) : (
          acquiredBadgesData?.badge_candidature_view?.map((badge) => (
            <Accordion
              key={badge.id}
              sx={{ marginTop: "12px", marginBottom: "12px" }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h4">{badge.badge_title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body3">
                  {badge.badge_description}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </>
    </BasicPage>
  );
};

export default AcquiredBadgesView;
