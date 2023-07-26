import { Grid, Typography } from "@mui/material";
import BasicPage from "../../layouts/BasicPage/BasicPage";
import { AuthContext } from "../../state/with-auth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import CustomDialog from "../../components/ComponentsEngineer/DialogComponent";
import BadgeCard from "../../components/ComponentsEngineer/BadgeCard";
import BadgeApplicationDialog from "../../components/ComponentsEngineer/BadgeApplicationComponent";
import InfoAlert from "../../components/ComponentsEngineer/Alert";
import CenteredLayout from "../../layouts/CenteredLayout";
import LoadableCurtain from "../../components/LoadableCurtain";

const AvailableBadgesView = ({
  isManagerListEmpty,
  badgesVersion,
  options,
  selectedManager,
  setSelectedManager,
  handleSubmit,
  register,
  errors,
  control,
  openModal,
  handleOpenModal,
  handleCloseModal,
  isApplicationSubmitted,
  setIsApplicationSubmitted,
  showMessage,
  setShowMessage,
  onSubmit,
  navigate
}) => {
  return (
    <BasicPage fullpage title="Available Badges">
      <Typography variant="body1" gutterBottom sx={{ marginTop: "10px" }}>
        Please find below the most recent versions of badges available for
        application. You may review the details of each badge and apply for the
        ones that align with your interests and qualifications. We encourage you
        to carefully consider each application, and the managers will promptly
        review your submissions.{" "}
      </Typography>
      {isManagerListEmpty && (
        <InfoAlert
          message={`You can't apply for a badge because you don't have a manager!`}
        />
      )}
      <Grid container spacing={2}>
        {badgesVersion.badges_versions_last.map((badge, index) => (
          <Grid item xs={12} sm={6} md={4} key={badge.id}>
            <BadgeCard
              badge={badge}
              title={badge.title}
              description={badge.description}
              onClick={() => {
                handleOpenModal({ ...badge, index });
              }}
              message="Apply"
              variant="contained"
              disabled={isManagerListEmpty}
            />
          </Grid>
        ))}
      </Grid>
      <BadgeApplicationDialog
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit(onSubmit)}
        options={options}
        errors={errors}
        control={control}
        register={register}
        isManagerListEmpty={isManagerListEmpty}
        selectedManager={selectedManager}
        setSelectedManager={setSelectedManager}
      />
      {/* Application confirmation dialog */}
      <CustomDialog
        open={isApplicationSubmitted}
        onClose={() => setIsApplicationSubmitted(false)}
        title="Application Submitted"
        contentText="You have successfully applied for the badge. Thank you for your submission!"
        closeButton="Close"
      />
      {/* Pending badge message dialog */}
      <CustomDialog
        open={showMessage.pendingBadge}
        onClose={() =>
          setShowMessage((prev) => ({ ...prev, pendingBadge: false }))
        }
        title="Badge is Pending"
        contentText="You have already applied for this badge, and it is pending approval. You can't apply again until the pending request is processed."
        closeButton="Close"
      />
      {/*Manager already proposed for this badge dialog */}
      <CustomDialog
        open={showMessage.managerProposal}
        onClose={() =>
          setShowMessage((prev) => ({ ...prev, managerProposal: false }))
        }
        title="Manager's Proposal Pending"
        contentText="Your manager has already proposed this badge for you. You can't apply again until your manager's proposal is processed."
        closeButton="Close"
        viewProposalButton="View Proposal"
        viewProposalClick={() => navigate("/engineer/candidatures")}
      />
      {/*Won badge dialog */}
      <CustomDialog
        open={showMessage.approvedBadge}
        onClose={() =>
          setShowMessage((prev) => ({ ...prev, approvedBadge: false }))
        }
        title="You Cannot Apply Again"
        contentText="You have already been approved for this badge. You cannot apply again for the same badge."
        closeButton="Close"
      />
      {/*Approved request dialog */}
      <CustomDialog
        open={showMessage.approvedRequest}
        onClose={() =>
          setShowMessage((prev) => ({ ...prev, approvedRequest: false }))
        }
        title="Manager's Approval Response Pending"
        contentText="Your manager has approved you request. You should submit an issue request."
        closeButton="Close"
        viewProposalButton="Issue a request"
        viewProposalClick={() => navigate("/engineer/issuing-request")}
      />
      {/*Not answered issue request dialog */}
      <CustomDialog
        open={showMessage.notAnsweredRequest}
        onClose={() =>
          setShowMessage((prev) => ({ ...prev, notAnsweredRequest: false }))
        }
        title="Issued Request"
        contentText="You have already submitted an issue request for this badge. Please wait until your manager responds!"
        closeButton="Close"
      />

      <hr />
    </BasicPage>
  );
};

export default AvailableBadgesView;
